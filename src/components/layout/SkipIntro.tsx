import { useEffect, useState } from "react";
import { INTRO_VH } from "../../lib/timeline";
import { scrollToId } from "../../lib/scroll";

/** Small "Skip intro" link, bottom right, shown only while the pinned intro is on screen. */
export default function SkipIntro() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const update = () => setShow(window.scrollY < window.innerHeight * INTRO_VH * 0.85);
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  if (!show) return null;

  return (
    <button
      type="button"
      onClick={() => scrollToId("work")}
      className="pop-host fixed bottom-3 right-3 sm:right-5 p-3 z-[60] cursor-pointer text-[13px] font-medium tracking-wide text-[#F4EFE6]/80 hover:text-[#F4EFE6] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#E88080]"
    >
      <span className="pop-line" data-on="dark">Skip intro</span>{" "}
      <span aria-hidden="true" className="pop-arrow">↓</span>
    </button>
  );
}
