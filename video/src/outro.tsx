import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Bg, Chip, H, Kicker, P, Pop, Tag, useIn } from "./ui";
import { C, display, mono, s } from "./theme";

const NODES: { id: string; x: number; y: number; at: number; c?: string }[] = [
  { id: "REPORTED", x: 0, y: 0, at: 0.4 },
  { id: "REPRODUCED", x: 1, y: 0, at: 0.9 },
  { id: "FIX_PROPOSED", x: 2, y: 0, at: 1.4 },
  { id: "REVIEWING", x: 3, y: 0, at: 1.9 },
  { id: "REVIEW_PASSED", x: 3, y: 1, at: 2.4, c: C.green },
  { id: "APPROVED_PENDING_MERGE", x: 2, y: 1, at: 2.9, c: C.green },
  { id: "CLOSED", x: 1, y: 1, at: 3.4 },
  { id: "ESCALATED", x: 3, y: 2, at: 5.2, c: C.red },
];

const NW = 250; // node width
const GX = 290; // column pitch
const GY = 150; // row pitch
const X0 = 10;
const Y0 = 10;

const Node: React.FC<{ n: (typeof NODES)[number] }> = ({ n }) => {
  const p = useIn(n.at);
  const col = n.c ?? C.accent;
  return (
    <div
      style={{
        position: "absolute",
        left: X0 + n.x * GX,
        top: Y0 + n.y * GY,
        width: NW,
        padding: "16px 10px",
        borderRadius: 16,
        textAlign: "center",
        fontFamily: mono,
        fontWeight: 700,
        fontSize: n.id.length > 18 ? 14 : 18,
        letterSpacing: "0.03em",
        color: C.text,
        background: C.panel,
        border: `2px solid ${col}`,
        boxShadow: `0 0 30px ${col}33`,
        opacity: Math.min(1, p * 1.6),
        transform: `scale(${0.7 + p * 0.3})`,
      }}
    >
      {n.id}
    </div>
  );
};

const Arrow: React.FC<{ x1: number; y1: number; x2: number; y2: number; at: number; c?: string }> = ({ x1, y1, x2, y2, at, c = C.line }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [s(at), s(at + 0.4)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, width: 1400, height: 600, overflow: "visible" }}>
      <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * p} y2={y1 + (y2 - y1) * p} stroke={c} strokeWidth={4} strokeLinecap="round" />
    </svg>
  );
};

const Rule: React.FC<{ at: number; kicker: string; text: string; color?: string }> = ({ at, kicker, text, color = C.accent }) => (
  <Pop at={at} from="left">
    <div style={{ background: C.panel, border: `1.5px solid ${C.line}`, borderLeft: `6px solid ${color}`, borderRadius: 16, padding: "18px 24px", width: 500 }}>
      <div style={{ fontFamily: mono, fontSize: 16, letterSpacing: "0.12em", color, fontWeight: 700, textTransform: "uppercase" }}>{kicker}</div>
      <div style={{ fontFamily: display, fontWeight: 600, fontSize: 28, color: C.text, marginTop: 6, lineHeight: 1.2 }}>{text}</div>
    </div>
  </Pop>
);

export const Engine: React.FC = () => {
  const cx = (col: number) => X0 + col * GX + NW / 2;
  const cy = (row: number) => Y0 + row * GY + 30;
  return (
    <AbsoluteFill>
      <Bg />
      <div style={{ position: "absolute", left: 90, top: 56 }}>
        <Pop at={0}>
          <Kicker>how it works</Kicker>
        </Pop>
        <Pop at={0.15}>
          <H size={64} style={{ marginTop: 10 }}>
            A small state machine, with guard rails
          </H>
        </Pop>
      </div>
      <div style={{ position: "absolute", left: 70, top: 300, width: 1300, height: 560 }}>
        <Arrow x1={X0 + NW} y1={cy(0)} x2={X0 + GX} y2={cy(0)} at={0.7} />
        <Arrow x1={X0 + GX + NW} y1={cy(0)} x2={X0 + 2 * GX} y2={cy(0)} at={1.2} />
        <Arrow x1={X0 + 2 * GX + NW} y1={cy(0)} x2={X0 + 3 * GX} y2={cy(0)} at={1.7} />
        <Arrow x1={cx(3)} y1={cy(0) + 32} x2={cx(3)} y2={cy(1) - 32} at={2.2} c={C.green} />
        <Arrow x1={X0 + 3 * GX} y1={cy(1)} x2={X0 + 2 * GX + NW} y2={cy(1)} at={2.7} c={C.green} />
        <Arrow x1={X0 + 2 * GX} y1={cy(1)} x2={X0 + GX + NW} y2={cy(1)} at={3.2} />
        <Arrow x1={cx(3)} y1={cy(1) + 32} x2={cx(3)} y2={cy(2) - 32} at={5.0} c={C.red} />
        {NODES.map((n) => (
          <Node key={n.id} n={n} />
        ))}
        <div style={{ position: "absolute", left: X0, top: 330, display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
          <Pop at={4.4}>
            <Chip size={26} color={C.red} bg={`${C.red}14`}>
              reject 1 and 2 → back to the fixer
            </Chip>
          </Pop>
          <Pop at={5.0}>
            <Chip size={26} color={C.red} bg={`${C.red}14`}>
              3rd rejection → ESCALATED to the human
            </Chip>
          </Pop>
        </div>
      </div>
      <div style={{ position: "absolute", right: 70, top: 280, display: "flex", flexDirection: "column", gap: 22 }}>
        <Rule at={3.6} kicker="human gate" text="Only the room creator named in the kickoff can approve or reject." color={C.green} />
        <Rule at={6.2} kicker="no token for agents" text="A script pushes the branch and opens the PR. Agents never merge." />
        <Rule at={8.0} kicker="private reviewer" text="Its edge-case script lives outside the repo the fixer clones." color="#ffb454" />
      </div>
      <div style={{ position: "absolute", right: 70, bottom: 40 }}>
        <Tag>illustration</Tag>
      </div>
    </AbsoluteFill>
  );
};

const Stat: React.FC<{ at: number; to: number; label: string; prefix?: string; suffix?: string; color?: string; sub: string }> = ({ at, to, label, prefix = "", suffix = "", color = C.text, sub }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - s(at), fps, config: { damping: 20, stiffness: 90 } });
  const v = Math.round(to * Math.min(1, p));
  return (
    <div style={{ opacity: Math.min(1, p * 2), transform: `translateY(${(1 - Math.min(1, p)) * 30}px)` }}>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 150, letterSpacing: "-0.04em", color, lineHeight: 1 }}>
        {prefix}
        {v}
        {suffix}
      </div>
      <div style={{ fontFamily: display, fontWeight: 600, fontSize: 34, color: C.text, marginTop: 6 }}>{label}</div>
      <div style={{ fontFamily: mono, fontSize: 18, color: C.muted, marginTop: 4 }}>{sub}</div>
    </div>
  );
};

export const Stats: React.FC = () => (
  <AbsoluteFill>
    <Bg />
    <div style={{ position: "absolute", left: 120, top: 70 }}>
      <Pop at={0}>
        <Kicker>numbers from this recorded run</Kicker>
      </Pop>
    </div>
    <div style={{ position: "absolute", left: 120, top: 150, display: "grid", gridTemplateColumns: "repeat(3, 520px)", rowGap: 56 }}>
      <Stat at={0.3} to={3} suffix="/3" label="tests pass" sub="on the accepted patch" color={C.green} />
      <Stat at={0.6} to={2} label="existing slugs saved" sub="Café Münster · Über uns" color={C.accent} />
      <Stat at={0.9} to={1} label="rejection" sub="cited the human's rule" color={C.red} />
      <Stat at={1.2} to={0} label="merges by agents" sub="the human clicks Merge" />
      <Stat at={1.5} to={70} prefix="~" suffix=" s" label="Create all → room" sub="measured on a local server" />
      <Stat at={1.8} to={7} label="states, one gate" sub="plus ESCALATED and CLOSED" color={C.accentSoft} />
    </div>
    <div style={{ position: "absolute", left: 120, right: 120, bottom: 52 }}>
      <Pop at={3.6}>
        <div style={{ fontFamily: mono, fontSize: 18, letterSpacing: "0.12em", color: C.muted, textTransform: "uppercase", marginBottom: 14 }}>honest limits</div>
      </Pop>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        {["Gate is enforced by instructions, not code", "3 agents run with permission prompts off", "Rejection is likely, not scripted", "Console shows a false timeout on Create all"].map((t, i) => (
          <Pop key={t} at={4.0 + i * 0.35}>
            <Chip size={24}>{t}</Chip>
          </Pop>
        ))}
      </div>
    </div>
    <div style={{ position: "absolute", right: 70, top: 70 }}>
      <Tag>illustration</Tag>
    </div>
  </AbsoluteFill>
);

export const End: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 14 } });
  const out = interpolate(frame, [s(6.4), s(7)], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: out }}>
      <Bg />
      <div style={{ textAlign: "center", transform: `scale(${0.9 + p * 0.1})`, opacity: Math.min(1, p * 1.5) }}>
        <Kicker>four agents · one human gate</Kicker>
        <H size={150} style={{ marginTop: 18 }}>
          Bug-to-PR <span style={{ color: C.accent }}>Room</span>
        </H>
        <Pop at={0.8}>
          <div style={{ marginTop: 46, display: "inline-block", fontFamily: mono, fontSize: 38, color: C.text, background: C.panel, border: `2px solid ${C.accent}`, borderRadius: 16, padding: "18px 30px", boxShadow: `0 0 50px ${C.accent}44` }}>
            github.com/Guten-Morgen1302/bug2pr-room
          </div>
        </Pop>
        <Pop at={1.4}>
          <P size={32} style={{ marginTop: 40 }}>
            Harsh Patil · built on Switch · WeMakeDevs Hackathon
          </P>
        </Pop>
      </div>
    </AbsoluteFill>
  );
};
