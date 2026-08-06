// Formato de cues que genera build_<slug>.mjs y consume VideoMain.
// Todo anclado a frames (30fps). src relativo a public/ (broll/…, img/…, real/…).

export type BrollBeat = {
  from: number;
  dur: number;
  kind: "video" | "image";
  src: string; // relativo a public/, ej "broll/chia_s_01.mp4" | "img/foo.png"
  pip?: boolean; // default true: muestra el avatar en PiP sobre este b-roll. false = b-roll full sin avatar.
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
    | "CornerLabel"
    | "Testimonial"
    | "AnnotatedImage"
    | "BigNumberCard";
  props: Record<string, unknown>;
};

// Overlays: fondo transparente, van ENCIMA del avatar/b-roll (no tapan).
export type OverlayBeat = {
  from: number;
  dur: number;
  comp: "LowerThird" | "KeywordPop" | "StatChip" | "IconRow" | "StatBar" | "SectionTitle" | "Callout" | "SplitInfo";
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
