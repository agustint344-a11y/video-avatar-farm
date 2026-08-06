// Formato de cues que genera build_<slug>.mjs y consume VideoMain.
// Todo anclado a frames (30fps). src relativo a public/ (broll/…, img/…, real/…).

export type BrollBeat = {
  from: number;
  dur: number;
  kind: "video" | "image";
  src: string; // relativo a public/, ej "broll/chia_s_01.mp4" | "img/foo.png"
};

export type ComponentBeat = {
  from: number;
  dur: number;
  comp:
    | "BigStat"
    | "MythVsTruth"
    | "Compare"
    | "Checklist"
    | "Steps"
    | "PullQuote"
    | "Highlight"
    | "FramedPhoto"
    | "CTACard"
    | "CornerLabel";
  props: Record<string, unknown>;
};

// Overlays: fondo transparente, van ENCIMA del avatar/b-roll (no tapan).
export type OverlayBeat = {
  from: number;
  dur: number;
  comp: "LowerThird" | "KeywordPop" | "StatChip" | "IconRow" | "StatBar" | "SectionTitle";
  props: Record<string, unknown>;
};

export type Cues = {
  slug: string;
  fps: number;
  width: number;
  height: number;
  durationInFrames: number;
  broll: BrollBeat[];
  overlays: OverlayBeat[];
  components: ComponentBeat[];
};
