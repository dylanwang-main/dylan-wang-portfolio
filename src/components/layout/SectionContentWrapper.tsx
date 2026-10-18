import { forwardRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import PaperEdge from "./PaperEdge";
import PaperDecor from "./PaperDecor";
import { prefersReducedMotion } from "../../lib/useReducedMotion";

interface SectionContentWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  seed?: number;
}

/**
 * Page B. Normal flow, directly under the sticky scene (Page A).
 * The torn edge is an absolutely positioned sibling of the cream block's top,
 * so it sits ABOVE the block (transparent over the scene, cream under the tear)
 * and never collapses margins or paints cream on cream.
 */
const SectionContentWrapper = forwardRef<
  HTMLDivElement,
  SectionContentWrapperProps
>(function SectionContentWrapper(
  { children, className = "", id, seed = 101 },
  ref
) {
  const { scrollYProgress: p } = useScroll({
    target: ref as React.RefObject<HTMLDivElement>,
    offset: ["start end", "start start"],
  });

  const reduced = prefersReducedMotion();

  // Content rides in slightly slower than the page itself (depth), then settles.
  const contentY = useTransform(p, [0, 1], ["10vh", "0vh"]);

  return (
    <div
      ref={ref}
      id={id}
      data-nav-theme="light"
      className={`relative z-20 w-full overflow-x-clip bg-[var(--bg-cream)] ${className}`}
    >
      <PaperEdge
        seed={seed}
        paper="light"
        fill="#F4EFE6"
        rim="255,255,255"
        shadow="rgba(0,0,0,0.5)"
      />

      <PaperDecor />

      <motion.div
        style={reduced ? undefined : { y: contentY }}
        className="relative z-10 w-full will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
});

export default SectionContentWrapper;
