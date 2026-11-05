import React from "react";
import { AbsoluteFill, Composition, interpolate, Series, useCurrentFrame } from "remotion";
import { FootageScene, STORY } from "./footage";
import { ColdOpen, Logo, Problem } from "./intro";
import { End, Engine, Stats } from "./outro";
import { C, FPS, s } from "./theme";
import { SCENES, TOTAL } from "./timeline";
import { Thumbnail } from "./thumbnail";

const ANIM: Record<string, React.FC> = { cold: ColdOpen, logo: Logo, problem: Problem, engine: Engine, stats: Stats, end: End };

/** Short fade in/out around every scene so cuts feel intentional. */
const Shell: React.FC<{ d: number; children: React.ReactNode }> = ({ d, children }) => {
  const f = useCurrentFrame();
  const o = Math.min(interpolate(f, [0, 6], [0, 1], { extrapolateRight: "clamp" }), interpolate(f, [d - 6, d], [1, 0], { extrapolateLeft: "clamp" }));
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

const Main: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Series>
      {SCENES.map((sc) => {
        const d = s(sc.dur);
        const A = ANIM[sc.id];
        return (
          <Series.Sequence key={sc.id} durationInFrames={d}>
            <Shell d={d}>{A ? <A /> : STORY[sc.id] ? <FootageScene scene={sc} /> : null}</Shell>
          </Series.Sequence>
        );
      })}
    </Series>
  </AbsoluteFill>
);

export const Root: React.FC = () => (
  <>
    <Composition id="Main" component={Main} durationInFrames={TOTAL} fps={FPS} width={1920} height={1080} />
    <Composition id="Thumbnail" component={Thumbnail} durationInFrames={1} fps={FPS} width={1280} height={720} />
  </>
);
