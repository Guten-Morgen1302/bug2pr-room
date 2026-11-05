# Demo video

Motion graphics in [Remotion](https://www.remotion.dev) around two real, unedited recordings: the screen recording of one full run (Switch Console, Discord, GitHub) and a 30 s phone clip of GitHub's inbox. 1920x1080, 30 fps, about 2:50, English voice-over.

Everything that is not footage is labelled "illustration" on screen. Every recording is labelled "screen recording, unedited" with its speed-up. The footage is only cropped (browser chrome and other servers' icons are removed), sped up, zoomed, and blurred where private (the machine name in one Console list). The stretches where I switched to VS Code to talk to Claude, and the notification shade on the phone (it showed my email and Wi-Fi name), are never used.

```bash
cd video
npm install
# raw recordings go in video/raw/ (not in git): pc-screen.mkv, phone-github.mp4
bash cut_clips.sh                       # ffmpeg cuts + speed-ups + blur -> public/clips, src/clips.json
npx remotion studio src/index.ts        # preview and scrub in the browser
python make_vo.py                       # Gemini TTS (voice Fenrir) -> out/vo/, then a Gemini transcription check
bash make_music.sh 170.4                # synthesized beat -> out/music.wav (match the video length)
npx remotion render src/index.ts Main out/silent.mp4 --codec=h264 --crf=18
python mix_audio.py                     # voice + music ducked under it -> out/bug2pr-room-demo.mp4
npx remotion still src/index.ts Thumbnail out/thumbnail.png
```

`GEMINI_API_KEY` (and optionally `VO_MODEL`, `VO_VOICE`, `GEMINI_MODEL`) are read from `../.env`, which is git-ignored.

## Scenes

| # | Scene | Source |
|---|---|---|
| 1 | Cold open | animation |
| 2 | Logo | animation |
| 3 | Problem | animation |
| 4 | The bug on GitHub | recording 0:04-0:10 |
| 5 | One template, a whole team | recording 0:29-0:44, 0:58-1:02 |
| 6 | Agents join the channel | recording 2:26-2:50 |
| 7 | Report, triage, repro | recording 3:26-3:40, 4:38-5:20 |
| 8 | The human adds a rule | recording 5:46-5:56 |
| 9 | The obvious fix | recording 10:52-11:28 |
| 10 | Rejected | recording 12:09-12:23 (zoom) |
| 11 | Fixed again, plus the 422 | recording 13:38-13:58, 14:09-14:21 |
| 12 | Accepted | recording 17:40-17:52 |
| 13 | The gate | recording 18:54-19:12, 20:00-20:09 |
| 14 | Human merges | recording 20:22-20:52 |
| 15 | Room closes | recording 23:14-23:34 |
| 16 | GitHub on the phone | phone 0:00-0:10, 0:16-0:21 |
| 17 | How it works | animation |
| 18 | Numbers and honest limits | animation |
| 19 | Open source | recording 23:51-24:00 |
| 20 | End card | animation |

Scene lengths come from the clip lengths (`src/scenes.json` + `src/clips.json`), and the voice-over start times are derived from the same files, so changing a cut never desyncs the narration.
