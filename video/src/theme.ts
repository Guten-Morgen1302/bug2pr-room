import { loadFont as loadDisplay } from "@remotion/google-fonts/BricolageGrotesque";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

export const display = loadDisplay("normal", { weights: ["400", "600", "800"], subsets: ["latin"] }).fontFamily;
export const mono = loadMono("normal", { weights: ["400", "700"], subsets: ["latin"] }).fontFamily;

export const C = {
  bg: "#0a0b11",
  bg2: "#12131d",
  panel: "#171926",
  line: "#2a2d40",
  text: "#f2f3f8",
  muted: "#9a9eb5",
  accent: "#8b7bff", // the one brand accent
  accentSoft: "#b6acff",
  green: "#3ddc84", // pass / approve
  red: "#ff5c61", // reject / recording
};

export const FPS = 30;
export const s = (seconds: number) => Math.round(seconds * FPS);
