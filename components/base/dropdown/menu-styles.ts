/**
 * Shared visual recipe for BoardUI menu surfaces.
 * Consistent monochrome styling with full dark/light mode support.
 */
export const MENU_POPOVER_SURFACE = [
  "z-110 max-w-[calc(100vw-32px)] overflow-y-auto",
  "rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-1 shadow-lg",
  "transition duration-150 ease-out",
  "data-[entering]:opacity-0 data-[entering]:scale-95 data-[entering]:blur-[2px]",
  "data-[exiting]:opacity-0 data-[exiting]:scale-95 data-[exiting]:blur-[2px]",
  "data-[placement=bottom]:origin-top data-[placement=top]:origin-bottom",
  "data-[placement=left]:origin-right data-[placement=right]:origin-left",
].join(" ");

export const MENU_POPOVER_WIDTH = "w-[120px]";

export const MENU_ITEMS_CONTAINER = "flex w-full flex-col gap-0.5 outline-none";

export const MENU_ITEM = [
  "flex w-full cursor-pointer items-center justify-between gap-2 rounded px-2.5 py-1.5 text-start font-mono text-xs",
  "text-zinc-600 dark:text-zinc-400 outline-none transition-colors",
].join(" ");

export const MENU_ITEM_ACTIVE = "bg-zinc-100 dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50 font-medium";

export const MENU_ITEM_INTERACTIVE =
  "hover:bg-zinc-100 dark:hover:bg-zinc-900 focus-visible:bg-zinc-100 dark:focus-visible:bg-zinc-900";
