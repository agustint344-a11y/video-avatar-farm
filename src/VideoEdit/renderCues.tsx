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
  const scale = 1.06 + p * 0.08; // zoom lento
  const x = p * -22; // paneo leve
  const src = staticFile(beat.src);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      {beat.kind === "video" ? (
        <Video
          src={src}
          muted
          objectFit="cover"
          style={{
            width: "100%",
            height: "100%",
            transform: `scale(${scale}) translateX(${x}px)`,
          }}
        />
      ) : (
        <Img
          src={src}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${scale}) translateX(${x}px)`,
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
