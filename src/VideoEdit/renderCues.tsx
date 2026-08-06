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
} from "./kit/kit";
import type { BrollBeat, ComponentBeat } from "./types";

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
} as const;

export const ComponentBeatView: React.FC<{ beat: ComponentBeat }> = ({
  beat,
}) => {
  const Comp = MAP[beat.comp] as React.FC<Record<string, unknown>>;
  if (!Comp) return null;
  // FramedPhoto recibe src relativo a public/ → resolver con staticFile.
  const props =
    beat.comp === "FramedPhoto" && typeof beat.props.src === "string"
      ? { ...beat.props, src: staticFile(beat.props.src as string) }
      : beat.props;
  return <Comp durationInFrames={beat.dur} {...props} />;
};
