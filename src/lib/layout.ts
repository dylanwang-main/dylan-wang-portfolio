/**
 * Horizontal page frame shared by every cream page: clears the fixed left nav rail on desktop.
 * Kept as full literal class strings so Tailwind can see them.
 */
export const PAGE_X = "px-6 sm:px-10 md:pl-[170px] lg:pl-[190px] xl:pl-[210px] md:pr-10 lg:pr-14";

/** Page frame plus the max content width. */
export const PAGE_COLUMN = `${PAGE_X} max-w-[1400px] w-full`;
