import { motion } from "motion/react";
import { ProjectData } from "../data/portfolio";
import PlaceholderImage from "./PlaceholderImage";
import CompactRow from "./CompactRow";

interface FeatureBlockProps {
  project: ProjectData;
  index: number;
  reverse?: boolean;
}

export default function FeatureBlock({
  project,
  index,
  reverse = false,
}: FeatureBlockProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="py-[var(--space-xl)] border-b border-[var(--border-hairline)] last:border-b-0"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
        {/* Text and Tools Column (about 40% width on large screens) */}
        <div
          className={`lg:col-span-5 flex flex-col space-y-[var(--space-md)] ${
            reverse ? "lg:order-2" : "lg:order-1"
          }`}
        >
          {/* Unboxed Metadata */}
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--taupe-subtle)]">
            <span>0{index + 1}</span>
            <span aria-hidden="true">·</span>
            <span>{project.category}</span>
          </div>

          {/* Project Title with Refined Editorial Scale */}
          <h3 className="font-editorial-serif text-[clamp(2rem,3.4vw,3.25rem)] font-medium tracking-tight text-[var(--text-ink)] leading-[1.08]">
            {project.title}
          </h3>

          {/* Exact Description (18 to 20px) */}
          <p className="font-editorial-sans text-[18px] md:text-[20px] text-[var(--text-ink)] leading-relaxed font-normal">
            {project.description}
          </p>

          {/* Tools List: Unboxed Typography with Dot Separators */}
          <div className="pt-2 pb-4 border-t border-b border-[var(--border-hairline)]">
            <span className="block text-[11px] uppercase tracking-wider text-[var(--taupe-subtle)] mb-2 font-medium">
              Tools & Technologies
            </span>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[16px] md:text-[17px] text-[var(--text-ink)]">
              {project.tools.map((tool, idx) => (
                <span key={tool} className="inline-flex items-center">
                  <span className="font-medium text-[var(--accent-oxblood)]">
                    {tool}
                  </span>
                  {idx < project.tools.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="ml-3 text-[var(--taupe-subtle)]/60"
                    >
                      ·
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Detail Slots rendered with CompactRow (No bordered box) */}
          {project.slots && project.slots.length > 0 && (
            <div className="pt-2">
              <span className="block text-[10px] uppercase tracking-widest text-[var(--taupe-subtle)] font-semibold mb-1">
                Project Detail Slots
              </span>
              <div className="divide-y divide-[var(--border-hairline)] border-t border-[var(--border-hairline)]">
                {project.slots.map((slot) => (
                  <CompactRow
                    key={slot.label}
                    label={slot.label}
                    prompt={slot.prompt}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Large Media Column (about 60% width on large screens) */}
        <div
          className={`lg:col-span-7 ${
            reverse ? "lg:order-1" : "lg:order-2"
          }`}
        >
          <PlaceholderImage
            label={project.imagePlaceholder.label}
            recommendedSize={project.imagePlaceholder.recommendedSize}
            aspectRatio={project.imagePlaceholder.aspectRatio}
          />
        </div>
      </div>
    </motion.article>
  );
}
