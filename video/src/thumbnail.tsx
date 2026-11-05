import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Bg } from "./ui";
import { C, display, mono } from "./theme";

export const Thumbnail: React.FC = () => (
  <AbsoluteFill>
    <Bg />
    <div style={{ position: "absolute", left: 60, top: 70, width: 600 }}>
      <div style={{ fontFamily: mono, fontSize: 24, letterSpacing: "0.14em", color: C.accent, fontWeight: 700 }}>SWITCH × CLAUDE CODE</div>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 150, lineHeight: 0.92, letterSpacing: "-0.04em", color: C.text, marginTop: 14 }}>
        4 agents.
        <br />
        <span style={{ color: C.accent }}>1 gate.</span>
      </div>
      <div style={{ marginTop: 26, display: "inline-block", fontFamily: display, fontWeight: 800, fontSize: 38, color: C.bg, background: C.red, padding: "8px 22px", borderRadius: 12 }}>
        REVIEW: REJECT
      </div>
    </div>
    <Img src={staticFile("thumb/reject.png")} style={{ position: "absolute", right: -40, top: 60, width: 720, borderRadius: 16, border: `3px solid ${C.line}`, transform: "rotate(5deg)", boxShadow: "0 30px 80px rgba(0,0,0,.6)" }} />
    <Img src={staticFile("thumb/merge.png")} style={{ position: "absolute", right: 120, bottom: 20, width: 640, borderRadius: 16, border: `3px solid ${C.green}`, transform: "rotate(-4deg)", boxShadow: "0 30px 80px rgba(0,0,0,.6)" }} />
  </AbsoluteFill>
);
