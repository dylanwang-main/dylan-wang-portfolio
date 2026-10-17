import { motion } from "motion/react";
import { ABOUT_PROFILE } from "../data/portfolio";
import PlaceholderImage from "./PlaceholderImage";
import CompactRow from "./CompactRow";

export default function AboutSection() {
  return (
    <section className="py-[clamp(8rem,16vw,16rem)] px-6 sm:px-10 md:pl-[170px] lg:pl-[190px] xl:pl-[210px] md:pr-10 lg:pr-14 max-w-[1400px] w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
        {/* Left Column: Portrait Frame Slot */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5"
        >
          <div className="sticky top-28">
            <PlaceholderImage
              label={ABOUT_PROFILE.photoPlaceholder.label}
              recommendedSize={ABOUT_PROFILE.photoPlaceholder.dimensions}
              aspectRatio="3/4"
            />
            <div className="mt-4 text-center">
              <span className="font-editorial-serif text-xl text-[var(--text-ink)]">
                Dylan Wang
              </span>
              <span className="block text-xs uppercase tracking-widest text-[var(--taupe-subtle)] mt-0.5">
                UC San Diego · Data Science
              </span>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Bio Narrative, CompactRow Slots, and Facts */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 flex flex-col space-y-[var(--space-lg)]"
        >
          {/* Section Kicker & Summary */}
          <div className="space-y-[var(--space-sm)]">
            <span className="text-xs uppercase tracking-widest text-[var(--taupe-subtle)] font-medium">
              About
            </span>
            <h3 className="statement-title font-editorial-serif italic text-[clamp(3rem,7vw,7rem)] tracking-[-0.02em] text-[var(--text-ink)] leading-[1]">
              Dylan Wang
            </h3>
            <p className="font-editorial-sans text-[18px] md:text-[20px] text-[var(--text-ink)] leading-relaxed font-normal">
              Incoming data science student at UC San Diego. Also a content creator.
            </p>
          </div>

          {/* Audiences Addressed */}
          <div className="border-t border-b border-[var(--border-hairline)] py-[var(--space-md)]">
            <span className="block text-[11px] uppercase tracking-widest text-[var(--taupe-subtle)] mb-3 font-semibold">
              Audiences & Collaborative Focus
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[var(--text-ink)]">
              {ABOUT_PROFILE.audiences.map((audience) => (
                <div key={audience} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-oxblood)] shrink-0" />
                  <span className="font-medium">{audience}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Labeled Bio Slots: CompactRow (No bordered boxes) */}
          <div className="space-y-1">
            <span className="block text-[10px] uppercase tracking-widest text-[var(--taupe-subtle)] font-semibold mb-2">
              Editorial Slots
            </span>
            <div className="border-t border-[var(--border-hairline)]">
              {ABOUT_PROFILE.slots.map((slot) => (
                <CompactRow
                  key={slot.title}
                  label={slot.title}
                  prompt={slot.placeholder}
                />
              ))}
            </div>
          </div>

          {/* Academic & Creative Coordinates: CompactRow (No bordered boxes) */}
          <div className="space-y-1">
            <span className="block text-[10px] uppercase tracking-widest text-[var(--taupe-subtle)] font-semibold mb-2">
              Academic & Creative Coordinates
            </span>
            <div className="border-t border-[var(--border-hairline)]">
              <CompactRow label="Institution" value="UC San Diego" />
              <CompactRow label="Discipline" value="Data Science" />
              <CompactRow label="Creative Focus" value="Short-form Content" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
