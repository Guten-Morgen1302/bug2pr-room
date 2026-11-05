import React from "react";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, display, mono, s } from "./theme";

/** Spring-in from `at` seconds (relative to the current Sequence). */
export const useIn = (at: number, damping = 14) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - s(at), fps, config: { damping, stiffness: 140, mass: 0.7 } });
};

export const Pop: React.FC<{ at: number; children: React.ReactNode; from?: "up" | "left" | "scale"; style?: React.CSSProperties }> = ({
  at,
  children,
  from = "up",
  style,
}) => {
  const p = useIn(at);
  const t =
    from === "left"
      ? `translateX(${interpolate(p, [0, 1], [-60, 0])}px)`
      : from === "scale"
        ? `scale(${interpolate(p, [0, 1], [0.6, 1])})`
        : `translateY(${interpolate(p, [0, 1], [40, 0])}px)`;
  return <div style={{ opacity: Math.min(1, p * 1.4), transform: t, ...style }}>{children}</div>;
};

/** Slams in big then settles: for the punchy lines. */
export const Slam: React.FC<{ at: number; children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties }> = ({
  at,
  children,
  size = 120,
  color = C.text,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - s(at), fps, config: { damping: 11, stiffness: 220, mass: 0.6 } });
  return (
    <div
      style={{
        fontFamily: display,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 0.95,
        letterSpacing: "-0.03em",
        color,
        opacity: p > 0.01 ? 1 : 0,
        transform: `scale(${interpolate(p, [0, 1], [2.4, 1])})`,
        filter: `blur(${interpolate(p, [0, 0.6, 1], [14, 2, 0])}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Bg: React.FC = () => {
  const frame = useCurrentFrame();
  const a = interpolate(frame % 600, [0, 600], [0, 360]);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `linear-gradient(${135 + Math.sin((a * Math.PI) / 180) * 8}deg, ${C.bg} 0%, ${C.bg2} 55%, ${C.bg} 100%)` }} />
      <AbsoluteFill
        style={{
          background: `radial-gradient(900px 500px at ${50 + Math.sin(a / 57) * 12}% ${-10 + Math.cos(a / 71) * 6}%, ${C.accent}22, transparent 70%)`,
        }}
      />
    </AbsoluteFill>
  );
};

export const Kicker: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = C.accent }) => (
  <div style={{ fontFamily: mono, fontSize: 22, letterSpacing: "0.14em", textTransform: "uppercase", color, fontWeight: 700 }}>{children}</div>
);

export const H: React.FC<{ children: React.ReactNode; size?: number; style?: React.CSSProperties }> = ({ children, size = 64, style }) => (
  <div style={{ fontFamily: display, fontWeight: 800, fontSize: size, lineHeight: 1.02, letterSpacing: "-0.025em", color: C.text, ...style }}>{children}</div>
);

export const P: React.FC<{ children: React.ReactNode; size?: number; style?: React.CSSProperties }> = ({ children, size = 30, style }) => (
  <div style={{ fontFamily: display, fontWeight: 400, fontSize: size, lineHeight: 1.3, color: C.muted, ...style }}>{children}</div>
);

export const Chip: React.FC<{ children: React.ReactNode; color?: string; bg?: string; size?: number; style?: React.CSSProperties }> = ({
  children,
  color = C.text,
  bg = C.panel,
  size = 28,
  style,
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 12,
      padding: "12px 20px",
      borderRadius: 14,
      background: bg,
      border: `1.5px solid ${C.line}`,
      fontFamily: display,
      fontWeight: 600,
      fontSize: size,
      color,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Small label that says what is not footage. */
export const Tag: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = C.muted }) => (
  <div style={{ fontFamily: mono, fontSize: 16, letterSpacing: "0.12em", textTransform: "uppercase", color, border: `1px solid ${C.line}`, padding: "5px 10px", borderRadius: 8 }}>
    {children}
  </div>
);

export const Code: React.FC<{ lines: { t: string; c?: string }[]; at: number; step?: number; size?: number }> = ({ lines, at, step = 0.35, size = 24 }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        fontFamily: mono,
        fontSize: size,
        lineHeight: 1.55,
        background: "#0d0e16",
        border: `1.5px solid ${C.line}`,
        borderRadius: 18,
        padding: "22px 26px",
        color: C.text,
        whiteSpace: "pre",
      }}
    >
      {lines.map((l, i) => {
        const start = s(at + i * step);
        const n = Math.max(0, Math.min(l.t.length, Math.floor((frame - start) * 2.2)));
        return (
          <div key={i} style={{ color: l.c ?? C.text, minHeight: size * 1.55 }}>
            {l.t.slice(0, n)}
            {n > 0 && n < l.t.length ? <span style={{ color: C.accent }}>▍</span> : null}
          </div>
        );
      })}
    </div>
  );
};

/** The seven stages a bug goes through, with the current one lit. */
export const STATES = ["REPORTED", "REPRODUCED", "FIX_PROPOSED", "REVIEWING", "REVIEW_PASSED", "APPROVED", "MERGED"];

export const Tracker: React.FC<{ active: number; rejected?: boolean }> = ({ active, rejected }) => (
  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
    {STATES.map((name, i) => {
      const on = i === active;
      const done = i < active;
      const bad = on && rejected;
      return (
        <React.Fragment key={name}>
          <div
            style={{
              fontFamily: mono,
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: "0.07em",
              color: bad ? "#fff" : on ? C.bg : done ? C.text : C.muted,
              background: bad ? C.red : on ? C.accent : "transparent",
              border: `1.5px solid ${bad ? C.red : on ? C.accent : done ? C.accentSoft + "66" : C.line}`,
              padding: "6px 11px",
              borderRadius: 9,
              boxShadow: on ? `0 0 28px ${bad ? C.red : C.accent}66` : "none",
            }}
          >
            {bad ? "REJECTED" : name}
          </div>
          {i < STATES.length - 1 ? <div style={{ width: 14, height: 2, background: done ? C.accentSoft + "88" : C.line }} /> : null}
        </React.Fragment>
      );
    })}
  </div>
);

export type Callout = { at: number; until?: number; x: number; y: number; w: number; h: number; label: string; color?: string; side?: "top" | "bottom" | "right"; lx?: number; ly?: number };
export type Zoom = { t: number; s: number; x: number; y: number }; // x, y = focus point, 0..1

const interp = (frame: number, ks: Zoom[], key: "s" | "x" | "y") =>
  interpolate(frame, ks.map((k) => s(k.t)), ks.map((k) => k[key]), { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.45, 0, 0.2, 1) });

export const CalloutBox: React.FC<{ c: Callout; z?: number }> = ({ c, z = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - s(c.at), fps, config: { damping: 15, stiffness: 160 } });
  const out = c.until ? interpolate(frame, [s(c.until) - 6, s(c.until)], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
  const col = c.color ?? C.accent;
  const pulse = 0.5 + 0.5 * Math.sin(frame / 7);
  const side = c.side ?? "top";
  return (
    <div style={{ position: "absolute", left: c.x, top: c.y, width: c.w, height: c.h, opacity: Math.min(1, p * 1.5) * out, pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          inset: -6,
          borderRadius: 12,
          border: `${3 / z}px solid ${col}`,
          boxShadow: `0 0 ${18 + pulse * 18}px ${col}aa, inset 0 0 18px ${col}33`,
          transform: `scale(${interpolate(p, [0, 1], [1.18, 1])})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          ...(c.lx !== undefined ? { left: c.lx, top: c.ly ?? 0 } : side === "top" ? { bottom: c.h + 14, left: 0 } : side === "bottom" ? { top: c.h + 14, left: 0 } : { left: c.w + 18, top: 0 }),
          whiteSpace: "nowrap",
          transform: `scale(${1 / z})`,
          transformOrigin: c.lx !== undefined || side === "bottom" ? "left top" : "left bottom",
          fontFamily: display,
          fontWeight: 700,
          fontSize: 32,
          color: col === C.red ? "#fff" : C.bg,
          background: col,
          padding: "7px 16px",
          borderRadius: 10,
          boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
        }}
      >
        {c.label}
      </div>
    </div>
  );
};

/** A recording inside a window frame. Zoom and callouts live inside the frame so they track the footage. */
export const ClipWindow: React.FC<{
  clip: string;
  w: number;
  h: number;
  title: string;
  callouts?: Callout[];
  zoom?: Zoom[];
  offset?: number; // seconds into the scene where this clip starts (callouts/zoom times are scene-relative)
}> = ({ clip, w, h, title, callouts = [], zoom, offset = 0 }) => {
  const frame = useCurrentFrame() + s(offset);
  const z = zoom ?? [{ t: 0, s: 1, x: 0.5, y: 0.5 }];
  const sc = interp(frame, z, "s");
  const fx = interp(frame, z, "x");
  const fy = interp(frame, z, "y");
  return (
    <div
      style={{
        width: w,
        borderRadius: 18,
        background: "#05060a",
        border: `1.5px solid ${C.line}`,
        boxShadow: `0 40px 100px rgba(0,0,0,0.6), 0 0 80px ${C.accent}18`,
        overflow: "hidden",
      }}
    >
      <div style={{ height: 36, display: "flex", alignItems: "center", gap: 8, padding: "0 16px", background: "#0e0f17", borderBottom: `1px solid ${C.line}` }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <div key={c} style={{ width: 11, height: 11, borderRadius: 6, background: c, opacity: 0.85 }} />
        ))}
        <div style={{ marginLeft: 14, fontFamily: mono, fontSize: 15, color: C.muted, letterSpacing: "0.04em" }}>{title}</div>
      </div>
      <div style={{ width: w, height: h, overflow: "hidden", position: "relative" }}>
        <div style={{ width: w, height: h, position: "relative", transformOrigin: `${fx * 100}% ${fy * 100}%`, transform: `scale(${sc})` }}>
          <OffthreadVideo src={staticFile(`clips/${clip}.mp4`)} muted style={{ width: w, height: h, objectFit: "cover" }} />
          {callouts.map((c, i) => (
            <CalloutBoxShift key={i} c={c} shift={offset} z={sc} />
          ))}
        </div>
      </div>
    </div>
  );
};

/** Callout times are scene-relative; inside a clip the local frame is clip-relative, so shift them. */
const CalloutBoxShift: React.FC<{ c: Callout; shift: number; z: number }> = ({ c, shift, z }) => <CalloutBox z={z} c={{ ...c, at: c.at - shift, until: c.until ? c.until - shift : undefined }} />;

export const PhoneFrame: React.FC<{ clip: string; height?: number; style?: React.CSSProperties }> = ({ clip, height = 900, style }) => {
  const width = (height * 480) / 1072;
  return (
    <div style={{ width: width + 28, height: height + 28, borderRadius: 58, background: "#050507", padding: 14, boxShadow: `0 40px 90px rgba(0,0,0,0.55), 0 0 0 2px #2b2d3c, 0 0 80px ${C.accent}22`, ...style }}>
      <div style={{ width, height, borderRadius: 46, overflow: "hidden", background: "#000" }}>
        <OffthreadVideo src={staticFile(`clips/${clip}.mp4`)} muted style={{ width, height, objectFit: "cover" }} />
      </div>
    </div>
  );
};

export const ease = Easing.bezier(0.16, 1, 0.3, 1);
