import { Video } from "@remotion/media";
import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {
  BigStat,
  Checklist,
  Compare,
  CornerLabel,
  CTACard,
  FramedPhoto,
  Highlight,
  MythVsTruth,
  PullQuote,
  Steps,
  THEME_CLINIC,
  THEME_EARTH,
  THEME_NIGHT,
} from "./kit/kit";

// Permite elegir el look por beat con un string en props.theme ("clinic" | "night" | "earth").
const THEMES: Record<string, unknown> = { earth: THEME_EARTH, night: THEME_NIGHT, clinic: THEME_CLINIC };
const withTheme = (props: Record<string, unknown>) =>
  typeof props.theme === "string" && THEMES[props.theme]
    ? { ...props, theme: THEMES[props.theme] }
    : props;
import {
  Callout,
  IconRow,
  KeywordPop,
  LowerThird,
  SectionTitle,
  StatBar,
  StatChip,
} from "./kit/kit2";
import {
  AnnotatedImage,
  BigNumberCard,
  SplitInfo,
  Testimonial,
} from "./kit/kit3";
import { AntesDespues, Medidor, QRTag, Timeline, Top5Reveal } from "./kit/kit4";
import type { BrollBeat, ComponentBeat, OverlayBeat } from "./types";

/* ─────────────────────────  b-roll a pantalla completa (Ken Burns)  ───────────────────────── */
// Nota: b-roll y avatar NO deben confundirse. El b-roll tapa al avatar mientras dura.
export const BrollBeatView: React.FC<{ beat: BrollBeat }> = ({ beat }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, beat.dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Ken Burns variado por beat (kb 0-5); sin kb = el movimiento clásico.
  const kb = beat.kb ?? -1;
  const KB = [ // sutil: casi quieto (el movimiento marcado se siente IA)
    { s0: 1.0, s1: 1.035, x0: 0, x1: -8, y0: 0, y1: 0 },
    { s0: 1.035, s1: 1.0, x0: -6, x1: 4, y0: 0, y1: 0 },
    { s0: 1.01, s1: 1.04, x0: 6, x1: -4, y0: 3, y1: -4 },
    { s0: 1.04, s1: 1.01, x0: 0, x1: 0, y0: -5, y1: 4 },
    { s0: 1.0, s1: 1.03, x0: -6, x1: 6, y0: 0, y1: 0 },
    { s0: 1.02, s1: 1.05, x0: 0, x1: 0, y0: 4, y1: -3 },
  ];
  const m = kb >= 0 ? KB[kb % KB.length] : { s0: 1.06, s1: 1.14, x0: 0, x1: -22, y0: 0, y1: 0 };
  const scale = m.s0 + p * (m.s1 - m.s0);
  const x = m.x0 + p * (m.x1 - m.x0);
  const y = m.y0 + p * (m.y1 - m.y0);
  const src = staticFile(beat.src);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      {beat.kind === "video" ? (
        <Video
          src={src}
          muted
          objectFit="cover"
          // clips de video: SIN Ken Burns (plano fijo, pedido del usuario: el movimiento se siente IA)
          style={{ width: "100%", height: "100%" }}
        />
      ) : (
        <Img
          src={src}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${scale}) translate(${x}px, ${y}px)`,
          }}
        />
      )}
    </AbsoluteFill>
  );
};

/* ─────────────────────────  componentes del kit  ───────────────────────── */
const MAP = {
  BigStat,
  MythVsTruth,
  Compare,
  Checklist,
  Steps,
  PullQuote,
  Highlight,
  FramedPhoto,
  CTACard,
  CornerLabel,
  Testimonial,
  AnnotatedImage,
  BigNumberCard,
  Top5Reveal,
  AntesDespues,
  Medidor,
  Timeline,
} as const;

export const ComponentBeatView: React.FC<{ beat: ComponentBeat }> = ({
  beat,
}) => {
  const Comp = MAP[beat.comp] as React.FC<Record<string, unknown>>;
  if (!Comp) return null;
  // FramedPhoto recibe src relativo a public/ → resolver con staticFile.
  const base =
    beat.comp === "FramedPhoto" && typeof beat.props.src === "string"
      ? { ...beat.props, src: staticFile(beat.props.src as string) }
      : beat.props;
  return <Comp durationInFrames={beat.dur} {...withTheme(base)} />;
};

/* ─────────────────────────  overlays (transparentes, sobre avatar/b-roll)  ───────────────────────── */
const OMAP = {
  LowerThird,
  KeywordPop,
  StatChip,
  IconRow,
  StatBar,
  SectionTitle,
  Callout,
  SplitInfo,
  QRTag,
} as const;

export const OverlayBeatView: React.FC<{ beat: OverlayBeat }> = ({ beat }) => {
  const Comp = OMAP[beat.comp] as React.FC<Record<string, unknown>>;
  if (!Comp) return null;
  return <Comp durationInFrames={beat.dur} {...withTheme(beat.props)} />;
};
