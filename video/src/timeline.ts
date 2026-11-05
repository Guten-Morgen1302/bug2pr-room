import clips from "./clips.json";
import scenes from "./scenes.json";
import { s } from "./theme";

type Raw = { id: string; dur?: number; clips?: string[]; max?: number };
export type Scene = { id: string; start: number; dur: number; clips: { name: string; dur: number }[] };

/** Scene length = its clips back to back (or a fixed animation length). Start times are in seconds. */
export const SCENES: Scene[] = (() => {
  let t = 0;
  return (scenes as Raw[]).map((r) => {
    const cl = (r.clips ?? []).map((name) => ({ name, dur: (clips as Record<string, number>)[name] }));
    const dur = r.dur ?? Math.min(r.max ?? 1e9, cl.reduce((a, c) => a + c.dur, 0));
    const out = { id: r.id, start: t, dur, clips: cl };
    t += dur;
    return out;
  });
})();

export const TOTAL_SECONDS = SCENES.reduce((a, b) => a + b.dur, 0);
export const TOTAL = s(TOTAL_SECONDS);
