import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Bg, Chip, H, Kicker, P, Pop, Slam, Tag } from "./ui";
import { C, display, mono, s } from "./theme";

const AGENT_COLORS = ["#8b7bff", "#3ddc84", "#ffb454", "#ff7ab6"];

export const ColdOpen: React.FC = () => {
  const frame = useCurrentFrame();
  const typed = (txt: string, at: number) => txt.slice(0, Math.max(0, Math.min(txt.length, Math.floor((frame - s(at)) * 1.6))));
  const call = typed('slugify("日本語")', 0.2);
  const res = frame > s(1.0) ? '""' : "";
  return (
    <AbsoluteFill>
      <Bg />
      <div style={{ position: "absolute", left: 160, top: 150, fontFamily: mono, fontSize: 64, color: C.text }}>
        <span style={{ color: C.muted }}>&gt; </span>
        {call}
        {frame < s(1.0) ? <span style={{ color: C.accent }}>▍</span> : null}
      </div>
      <div style={{ position: "absolute", left: 160, top: 240, fontFamily: mono, fontSize: 64, color: C.red, opacity: frame > s(1.0) ? 1 : 0 }}>
        {"→ "}
        {res}
        <span style={{ color: C.muted, fontSize: 30 }}> {"  // empty. every Japanese title gets the same slug."}</span>
      </div>
      <div style={{ position: "absolute", left: 160, top: 430, display: "flex", flexDirection: "column", gap: 16 }}>
        <Slam at={1.5} size={150}>
          One bug.
        </Slam>
        <Slam at={2.6} size={150} color={C.accentSoft}>
          Four AI agents.
        </Slam>
        <Slam at={3.8} size={150} color={C.green}>
          One human gate.
        </Slam>
      </div>
      <div style={{ position: "absolute", right: 70, bottom: 50 }}>
        <Tag>illustration</Tag>
      </div>
    </AbsoluteFill>
  );
};

export const Logo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 13, stiffness: 120 } });
  const spin = frame * 1.6;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Bg />
      <div style={{ position: "absolute", width: 760, height: 760, borderRadius: 380, border: `2px solid ${C.line}`, transform: `scale(${0.6 + p * 0.4}) rotate(${spin}deg)`, opacity: 0.7 }}>
        {AGENT_COLORS.map((c, i) => {
          const a = (i / 4) * Math.PI * 2;
          return <div key={c} style={{ position: "absolute", left: 380 + Math.cos(a) * 380 - 18, top: 380 + Math.sin(a) * 380 - 18, width: 36, height: 36, borderRadius: 18, background: c, boxShadow: `0 0 40px ${c}` }} />;
        })}
      </div>
      <div style={{ textAlign: "center", transform: `scale(${0.85 + p * 0.15})`, opacity: Math.min(1, p * 1.6) }}>
        <Kicker>WeMakeDevs × Switch · Track 01</Kicker>
        <H size={168} style={{ marginTop: 22 }}>
          Bug-to-PR <span style={{ color: C.accent }}>Room</span>
        </H>
        <P size={36} style={{ marginTop: 26 }}>
          Four Claude Code agents · one Discord room · one human gate
        </P>
      </div>
      <div style={{ position: "absolute", right: 70, bottom: 50 }}>
        <Tag>illustration</Tag>
      </div>
    </AbsoluteFill>
  );
};

export const Problem: React.FC = () => {
  const lines: { t: string; at: number; c?: string }[] = [
    { t: "One agent writes the fix.", at: 0.4 },
    { t: "The same agent says it's fine.", at: 2.4 },
    { t: "Your team? Not in the room.", at: 4.6, c: C.red },
  ];
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Bg />
      <div style={{ position: "absolute", left: 170, top: 190 }}>
        <Pop at={0}>
          <Kicker>the usual setup</Kicker>
        </Pop>
        <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 34 }}>
          {lines.map((l) => (
            <Pop key={l.t} at={l.at} from="left">
              <div style={{ fontFamily: display, fontWeight: 800, fontSize: 108, letterSpacing: "-0.03em", color: l.c ?? C.text, lineHeight: 1 }}>{l.t}</div>
            </Pop>
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", right: 150, top: 230, opacity: interpolate(frame, [s(5.6), s(6.4)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        <Chip size={34} color={C.green} bg={`${C.green}14`}>
          what if the team could say “no”?
        </Chip>
      </div>
      <div style={{ position: "absolute", right: 70, bottom: 50 }}>
        <Tag>illustration</Tag>
      </div>
    </AbsoluteFill>
  );
};
