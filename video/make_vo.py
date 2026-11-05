"""English voice-over via Gemini TTS, one clip per line -> out/vo/NN.wav + timing.json, then a Gemini transcription check.

  python make_vo.py            # all lines, then verify
  python make_vo.py 7 8        # only re-generate lines 7 and 8 (then verify those)

LINES = (scene id, offset into the scene in seconds, max seconds the line may take, text).
Scene start times come from scenes.json + clips.json, so the voice always lines up with the picture.
No style prompt: this model reads it aloud.
"""

from __future__ import annotations

import difflib
import json
import os
import subprocess
import sys
import time
import wave
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types

HERE = Path(__file__).resolve().parent
load_dotenv(HERE.parent / ".env")
OUT = HERE / "out" / "vo"
MODEL = os.getenv("VO_MODEL", "gemini-3.8-flash-tts")
CHECK_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")
VOICE = os.getenv("VO_VOICE", "Fenrir")

LINES: list[tuple[str, float, float, str]] = [
    ("cold", 0.3, 5.4, "One bug. Four AI agents. One human with the last word."),
    ("problem", 0.3, 7.6, "Most coding agents work alone. The one that writes the fix also approves it. Your team never gets a say."),
    ("repo", 0.2, 5.5, "Our demo bug: a slug function returns nothing for Japanese titles."),
    ("console", 0.3, 8.2, "One Switch template creates four Claude Code agents and a Discord room."),
    ("join", 0.2, 5.8, "Triager, repro, fixer, reviewer. Each has its own role."),
    ("bug", 0.4, 13.0, "A human posts the bug. The triager restates it and hands off. Repro writes a failing script, and actually runs it."),
    ("rule", 0.2, 5.9, "Then the human adds a rule: existing slugs must never change."),
    ("patch", 0.3, 8.6, "The fixer ships the obvious fix. A script opens the pull request, so the agents never handle the GitHub token."),
    ("reject", 0.4, 11.4, "And the reviewer rejects it. It cites the human's rule, and names the two titles the patch just broke."),
    ("fix", 0.3, 9.4, "The fixer tries again. My push script hit a bug of its own, and the reviewer noticed and said so."),
    ("accept", 0.2, 6.7, "Second look: tests pass, the edge script passes, the rule holds."),
    ("gate", 0.4, 3.4, "Someone else types approve: nothing happens."),
    ("gate", 7.6, 5.4, "The room's creator types it, and only then does the room move on."),
    ("merge", 0.3, 9.4, "Agents never merge. The human reviews the diff and clicks the button."),
    ("closed", 0.2, 6.3, "The room closes itself, with the final commit recorded."),
    ("phone", 0.3, 8.0, "On my phone, GitHub's inbox: the pull requests the agents opened, and the merges I made."),
    ("engine", 0.6, 11.2, "Under the hood: a small state machine, a rejection counter that escalates on the third strike, and a creator-only gate."),
    ("stats", 0.6, 8.0, "Real numbers from this run. And the honest limits: the gate is enforced by instructions, not code."),
    ("repoend", 0.2, 6.6, "All open source, with the recorded run and honest tradeoffs in the README."),
    ("end", 0.5, 5.8, "Bug-to-PR Room. Four agents, one human gate."),
]


def scene_starts() -> dict[str, float]:
    scenes = json.loads((HERE / "src" / "scenes.json").read_text())
    clips = json.loads((HERE / "src" / "clips.json").read_text())
    t, out = 0.0, {}
    for sc in scenes:
        dur = sc.get("dur") or min(sc.get("max", 1e9), sum(clips[c] for c in sc["clips"]))
        out[sc["id"]] = t
        t += dur
    out["_total"] = t
    return out


def tts(client: genai.Client, text: str) -> bytes:
    cfg = types.GenerateContentConfig(
        response_modalities=["AUDIO"],
        speech_config=types.SpeechConfig(voice_config=types.VoiceConfig(prebuilt_voice_config=types.PrebuiltVoiceConfig(voice_name=VOICE))),
    )
    for attempt in range(4):
        try:
            r = client.models.generate_content(model=MODEL, contents=text, config=cfg)
            return r.candidates[0].content.parts[0].inline_data.data
        except Exception as e:  # noqa: BLE001 (rate limits / transient errors: back off and retry)
            print(f"   retry {attempt + 1}: {type(e).__name__}: {str(e)[:120]}")
            time.sleep(6 * (attempt + 1))
    raise SystemExit(f"TTS failed for: {text[:60]}")


def write_wav(path: Path, pcm: bytes) -> None:
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(24000)
        w.writeframes(pcm)


def trim_and_fit(src: Path, dst: Path, max_s: float) -> float:
    """Trim silence at both ends; speed up (max 1.25x) only if the line would overrun its slot."""
    tmp = dst.with_suffix(".trim.wav")
    trim = "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(src), "-af", trim, str(tmp)], check=True)
    dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(tmp)]))
    tempo = max(1.0, dur / max_s)
    if tempo > 1.25:
        print(f"   WARNING {dst.name}: {dur:.1f}s for a {max_s}s slot, even 1.25x overruns; shorten the text")
        tempo = 1.25
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(tmp), "-af", f"atempo={tempo:.3f}", "-ar", "44100", str(dst)], check=True)
    tmp.unlink()
    return dur / tempo


def transcribe(client: genai.Client, wav: Path) -> str:
    part = types.Part.from_bytes(data=wav.read_bytes(), mime_type="audio/wav")
    r = client.models.generate_content(model=CHECK_MODEL, contents=["Transcribe this audio exactly, words only, no commentary.", part])
    return (r.text or "").strip()


def norm(t: str) -> str:
    return " ".join("".join(ch.lower() if ch.isalnum() else " " for ch in t).split())


def main(only: set[int]) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
    starts = scene_starts()
    timing_path = OUT / "timing.json"
    timing = json.loads(timing_path.read_text()) if timing_path.exists() else {}
    bad = []
    for i, (scene, off, max_s, text) in enumerate(LINES, 1):
        if only and i not in only:
            continue
        raw, final = OUT / f"{i:02d}.raw.wav", OUT / f"{i:02d}.wav"
        print(f"{i:02d} {scene:8s} +{off:4.1f}  {text[:70]}")
        write_wav(raw, tts(client, text))
        dur = trim_and_fit(raw, final, max_s)
        raw.unlink()
        timing[f"{i:02d}"] = {"scene": scene, "start": round(starts[scene] + off, 2), "dur": round(dur, 2), "max": max_s, "text": text}
        heard = transcribe(client, final)
        ratio = difflib.SequenceMatcher(None, norm(text), norm(heard)).ratio()
        flag = "" if ratio > 0.9 else "   <-- CHECK"
        print(f"   {dur:.1f}s (slot {max_s}s) heard: {heard[:80]!r} match={ratio:.2f}{flag}")
        if ratio <= 0.9:
            bad.append(i)
    for i, (scene, off, _m, _t) in enumerate(LINES, 1):  # keep every start in step with the current timeline
        if f"{i:02d}" in timing:
            timing[f"{i:02d}"]["start"] = round(starts[scene] + off, 2)
    timing_path.write_text(json.dumps(timing, indent=1))
    print("lines to regenerate:", bad or "none")


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    main({int(a) for a in sys.argv[1:]})
