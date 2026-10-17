import { motion, useTransform, MotionValue } from "motion/react";

/**
 * A black hole drawn in CSS: event horizon, bright photon ring, a tilted accretion disk
 * that spins (back half behind the horizon, front half across it), and a lensed arc of
 * the far side of the disk bent over the top.
 */
const DISK_BG =
  "conic-gradient(from 0deg, rgba(255,236,200,0.98), rgba(255,150,64,0.75) 16%, rgba(130,44,22,0.22) 36%, rgba(255,205,150,0.85) 54%, rgba(255,120,48,0.65) 74%, rgba(255,236,200,0.98))";
const DISK_MASK =
  "radial-gradient(circle closest-side, transparent 21%, #000 25%, #000 52%, transparent 99%)";

function Disk({ front }: { front?: boolean }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        style={{
          width: 600,
          height: 600,
          transform: "rotate(-16deg) scaleY(0.24)",
          clipPath: front ? "inset(50% 0 0 0)" : "inset(0 0 50% 0)",
          filter: "blur(0.6px)",
        }}
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            background: DISK_BG,
            WebkitMaskImage: DISK_MASK,
            maskImage: DISK_MASK,
            animation: "bh-spin 6s linear infinite",
          }}
        />
      </div>
    </div>
  );
}

export default function BlackHole({
  x,
  y,
  scale,
  opacity,
}: {
  x: number;
  y: number;
  scale: MotionValue<number>;
  opacity: MotionValue<number>;
}) {
  const transform = useTransform(scale, (s) => `translate(-50%, -50%) scale(${s.toFixed(4)})`);
  return (
    <motion.div
      aria-hidden="true"
      className="absolute pointer-events-none will-change-transform"
      style={{ left: `${x}%`, top: `${y}%`, width: 640, height: 640, transform, opacity }}
    >
      {/* gravitational glow around everything */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle closest-side, rgba(255,170,90,0) 24%, rgba(255,140,64,0.22) 36%, rgba(255,110,50,0.07) 58%, transparent 78%)",
        }}
      />
      {/* far half of the disk, behind the horizon */}
      <Disk />
      {/* lensed arc: the back of the disk bent over the top of the hole */}
      <div
        className="absolute rounded-full"
        style={{
          left: "50%",
          top: "50%",
          width: 188,
          height: 188,
          margin: -94,
          border: "6px solid transparent",
          borderTopColor: "rgba(255,226,190,0.95)",
          borderLeftColor: "rgba(255,150,70,0.5)",
          borderRightColor: "rgba(255,150,70,0.5)",
          filter: "blur(2.2px)",
          transform: "rotate(-16deg)",
        }}
      />
      {/* event horizon + photon ring */}
      <div
        className="absolute rounded-full"
        style={{
          left: "50%",
          top: "50%",
          width: 132,
          height: 132,
          margin: -66,
          background: "#000",
          boxShadow:
            "0 0 0 2px rgba(255,238,216,0.95), 0 0 18px 5px rgba(255,176,96,0.8), 0 0 70px 20px rgba(255,120,50,0.35)",
        }}
      />
      {/* near half of the disk, passing in front of the horizon */}
      <Disk front />
    </motion.div>
  );
}
