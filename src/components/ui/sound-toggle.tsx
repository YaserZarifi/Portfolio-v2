"use client";

import { useEffect, useState } from "react";
import { initSoundPref, isSoundEnabled, setSoundEnabled } from "@/lib/sound";

/**
 * Sound on/off — CAD status-bar control. Renders in the drafting metaphor
 * (SND ◉ / ○). Off by default; the click that turns it on is the user
 * gesture that unlocks the AudioContext.
 */
export function SoundToggle() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    initSoundPref();
    setOn(isSoundEnabled());
  }, []);

  return (
    <button
      type="button"
      onClick={() => {
        const next = !on;
        setSoundEnabled(next);
        setOn(next);
      }}
      aria-pressed={on}
      aria-label={`SND — interface sound ${on ? "on" : "off"}`}
      className="cursor-pointer transition-colors hover:text-fg"
    >
      SND {on ? "◉" : "○"}
    </button>
  );
}
