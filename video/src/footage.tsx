import React from "react";
import { AbsoluteFill, interpolate, Series, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Bg, Callout, CalloutBox, Chip, ClipWindow, H, Kicker, P, PhoneFrame, Pop, STATES, Tracker, Zoom } from "./ui";
import { C, mono, s } from "./theme";
import { Scene } from "./timeline";

type St = { t: number; i: number; rejected?: boolean };
type Cfg = {
  title: React.ReactNode;
  sub: string;
  winTitle: string;
  mode?: "browser" | "console" | "phone";
  states?: St[]; // tracker state over scene time
  callouts?: Callout[];
  zoom?: Zoom[];
  chips?: string[];
};

// Speeds used by cut_clips.sh, shown on screen next to every real recording.
const SPEED: Record<string, string> = {
  c01_repo: "1.1×", c02a_tpl: "1.1×", c02u_use: "1.4×", c02b_create: "1.2×", c03_join: "4×", c04a_bug: "2×", c04b_repro: "6×", c05_rule: "1.6×", c06_patch: "4×",
  c07_reject: "1.2×", c08a_fix: "4×", c08b_422: "2.4×", c09_accept: "1.7×", c10a_softy: "2.5×", c10b_creator: "1.5×", c11_merge: "3×", c12_closed: "3×",
  c13_readme: "1×", p1_profile: "1.6×", p2_email: "2.5×",
};

const W = 1528, H_ = 750; // cropped browser footage
const CW = 1330, CH = 748; // console footage

export const STORY: Record<string, Cfg> = {
  repo: {
    title: <>The bug</>,
    sub: "slugify(\"日本語\") returns an empty string on main.",
    winTitle: "github.com / bug2pr-demo / src / slugify.js",
    zoom: [{ t: 0, s: 1, x: 0.0, y: 0.42 }, { t: 0.9, s: 2.6, x: 0.0, y: 0.42 }],
    callouts: [{ at: 1.6, until: 3.6, x: 14, y: 288, w: 300, h: 44, label: "Strips everything that isn't a–z", color: C.red, side: "bottom" }],
  },
  console: {
    title: <>One template, a whole team</>,
    sub: "Four Claude Code agents and a Discord room, created from a single Switch template.",
    winTitle: "Switch Console · Templates",
    mode: "console",
  },
  join: {
    title: <>They join the channel</>,
    sub: "Triager · Repro · Fixer · Reviewer. Each posts under its own name, with its own workspace.",
    winTitle: "Discord · #bug8-bug-to-pr",
  },
  bug: {
    title: <>Report → triage → repro</>,
    sub: "The triager hands off by @-mention. Repro writes a failing script and runs it for real.",
    winTitle: "Discord · #bug8-bug-to-pr",
    states: [{ t: 0, i: 0 }, { t: 7, i: 1 }],
  },
  rule: {
    title: <>The human adds a rule</>,
    sub: "“Existing slugs must stay exactly the same.” Said once, in the thread.",
    winTitle: "Discord · #bug8-bug-to-pr",
    states: [{ t: 0, i: 1 }],
    callouts: [{ at: 0.6, x: 230, y: 650, w: 900, h: 60, label: "A human message", side: "top" }],
  },
  patch: {
    title: <>The obvious fix</>,
    sub: "A script opens the pull request, so the agents never handle the GitHub token.",
    winTitle: "Discord · #bug8-bug-to-pr",
    states: [{ t: 0, i: 2 }, { t: 5.5, i: 3 }],
  },
  reject: {
    title: <>Rejected.</>,
    sub: "The reviewer cites the human's rule and shows the two titles the patch just broke.",
    winTitle: "Discord · #bug8-bug-to-pr",
    states: [{ t: 0, i: 3, rejected: true }],
    zoom: [{ t: 0, s: 1, x: 0.4, y: 0.4 }, { t: 1.4, s: 1.38, x: 0.34, y: 0.4 }],
    callouts: [
      { at: 1.8, until: 4.0, x: 390, y: 305, w: 430, h: 56, label: "Breaks 2 existing slugs", color: C.red, lx: 450, ly: 0 },
      { at: 4.2, x: 372, y: 372, w: 640, h: 66, label: "Cites the human's rule", color: C.accent, lx: 10, ly: 80 },
    ],
  },
  fix: {
    title: <>Fix it again</>,
    sub: "A real hiccup: my push script hit a 422. The reviewer noticed and said so.",
    winTitle: "Discord · #bug8-bug-to-pr",
    states: [{ t: 0, i: 2 }],
  },
  accept: {
    title: <>Accepted</>,
    sub: "Tests pass · edge script passes · the rule holds.",
    winTitle: "Discord · #bug8-bug-to-pr",
    states: [{ t: 0, i: 4 }],
  },
  gate: {
    title: <>Only the creator can approve</>,
    sub: "Someone else types approve: ignored. The room's creator types it: accepted.",
    winTitle: "Discord · #bug8-bug-to-pr",
    states: [{ t: 0, i: 4 }, { t: 7.2, i: 5 }],
    callouts: [{ at: 2.0, until: 7.0, x: 1060, y: 420, w: 440, h: 150, label: "Not the creator → ignored", color: C.red, side: "top" }],
  },
  merge: {
    title: <>Agents never merge</>,
    sub: "The human reviews the diff and clicks Merge.",
    winTitle: "github.com / bug2pr-demo / pull / 7",
    states: [{ t: 0, i: 5 }, { t: 7, i: 6 }],
  },
  closed: {
    title: <>The room closes itself</>,
    sub: "Final SHA and rejection count recorded.",
    winTitle: "Discord · #bug8-bug-to-pr",
    states: [{ t: 0, i: 6 }],
  },
  phone: {
    title: <>…and on my phone</>,
    sub: "GitHub's inbox: the pull requests the agents opened and the merges I made.",
    winTitle: "GitHub mobile",
    mode: "phone",
    chips: ["Agents open PRs", "Human merges", "GitHub notifies"],
  },
  repoend: {
    title: <>Open source</>,
    sub: "The recorded run and the honest tradeoffs are in the README.",
    winTitle: "github.com / Guten-Morgen1302 / bug2pr-room",
  },
};

const RecTag: React.FC<{ speed: string }> = ({ speed }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: mono, fontSize: 18, letterSpacing: "0.1em", color: C.text, background: "#ffffff0d", border: `1px solid ${C.line}`, padding: "8px 14px", borderRadius: 10 }}>
    <span style={{ width: 11, height: 11, borderRadius: 6, background: C.red, boxShadow: `0 0 12px ${C.red}` }} />
    SCREEN RECORDING · UNEDITED · {speed}
  </div>
);

const Caption: React.FC<{ cfg: Cfg; speed: string }> = ({ cfg, speed }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 16 } });
  return (
    <div style={{ position: "absolute", left: 196, right: 196, bottom: 34, display: "flex", justifyContent: "space-between", alignItems: "flex-end", opacity: p, transform: `translateY(${(1 - p) * 24}px)` }}>
      <div style={{ maxWidth: 1250 }}>
        <H size={58}>{cfg.title}</H>
        <P size={27} style={{ marginTop: 8 }}>
          {cfg.sub}
        </P>
      </div>
      <RecTag speed={speed} />
    </div>
  );
};

/** Plays the scene's clips back to back; the last one is trimmed if the scene has a cap. */
export const FootageScene: React.FC<{ scene: Scene }> = ({ scene }) => {
  const cfg = STORY[scene.id];
  const frame = useCurrentFrame();
  const mode = cfg.mode ?? "browser";
  const st = [...(cfg.states ?? [])].reverse().find((x) => frame >= s(x.t));
  let acc = 0;
  const parts = scene.clips.map((c) => {
    const start = acc;
    const d = Math.max(0, Math.min(c.dur, scene.dur - start));
    acc += c.dur;
    return { ...c, start, d };
  });
  const cur = parts.find((p) => frame >= s(p.start) && frame < s(p.start + p.d)) ?? parts[parts.length - 1];
  const speed = SPEED[cur.name] ?? "1×";
  const w = mode === "console" ? CW : W;
  const h = mode === "console" ? CH : H_;

  return (
    <AbsoluteFill>
      <Bg />
      {st ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 24, display: "flex", justifyContent: "center" }}>
          <Tracker active={st.i} rejected={st.rejected} />
        </div>
      ) : (
        <div style={{ position: "absolute", left: 0, right: 0, top: 30, display: "flex", justifyContent: "center", fontFamily: mono, fontSize: 15, letterSpacing: "0.12em", color: C.muted }}>
          {STATES.length} STATES · BUG-TO-PR ROOM
        </div>
      )}
      {mode === "phone" ? (
        <>
          <div style={{ position: "absolute", left: 250, top: 62, width: 431, height: 928 }}>
            <Series>
              {parts.map((p) => (
                <Series.Sequence key={p.name} durationInFrames={Math.max(1, s(p.d))}>
                  <PhoneFrame clip={p.name} height={900} />
                </Series.Sequence>
              ))}
            </Series>
          </div>
          <div style={{ position: "absolute", left: 800, top: 230, right: 160 }}>
            <Pop at={0.2}>
              <Kicker>GitHub · mobile</Kicker>
            </Pop>
            <Pop at={0.4}>
              <H size={92} style={{ marginTop: 20 }}>
                {cfg.title}
              </H>
            </Pop>
            <Pop at={0.7}>
              <P size={34} style={{ marginTop: 22 }}>
                {cfg.sub}
              </P>
            </Pop>
            <div style={{ marginTop: 46, display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
              {(cfg.chips ?? []).map((c, i) => (
                <Pop key={c} at={1.4 + i * 0.5} from="left">
                  <Chip size={32}>{c}</Chip>
                </Pop>
              ))}
            </div>
            <div style={{ marginTop: 50 }}>
              <RecTag speed={speed} />
            </div>
          </div>
        </>
      ) : (
        <>
          <div style={{ position: "absolute", left: (1920 - w) / 2, top: mode === "console" ? 82 : 78, width: w, height: h + 38 }}>
            <Series>
              {parts.map((p) => (
                <Series.Sequence key={p.name} durationInFrames={Math.max(1, s(p.d))}>
                  <ClipWindow clip={p.name} w={w} h={h} title={cfg.winTitle} callouts={cfg.callouts} zoom={cfg.zoom} offset={p.start} />
                </Series.Sequence>
              ))}
            </Series>
          </div>
          <Caption cfg={cfg} speed={speed} />
        </>
      )}
    </AbsoluteFill>
  );
};
