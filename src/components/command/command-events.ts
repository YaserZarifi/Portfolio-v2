export const COMMAND_EVENT = "portfolio:command";

export function openCommandPalette() {
  window.dispatchEvent(new CustomEvent(COMMAND_EVENT));
}
