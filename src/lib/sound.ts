/**
 * Synthesised UI sound — pen ticks, presses, and a servo whoosh, generated
 * with the Web Audio API so there are no audio files to ship. Off by default
 * (never autoplay); the AudioContext is created on the first user gesture
 * that enables it, satisfying browser autoplay policy.
 *
 * A tiny singleton: components call sound.tick() etc. and it no-ops silently
 * whenever sound is disabled.
 */

let ctx: AudioContext | null = null;
let enabled = false;

function ensureCtx() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function blip(freq: number, dur: number, type: OscillatorType, peak: number) {
  if (!enabled) return;
  const ac = ensureCtx();
  if (!ac) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const t = ac.currentTime;
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(peak, t + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain).connect(ac.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

export function initSoundPref() {
  if (typeof window === "undefined") return;
  enabled = localStorage.getItem("cad-sound") === "1";
}

export function isSoundEnabled() {
  return enabled;
}

export function setSoundEnabled(value: boolean) {
  enabled = value;
  if (typeof window !== "undefined") {
    localStorage.setItem("cad-sound", value ? "1" : "0");
  }
  if (value) {
    ensureCtx();
    sound.tick(); // audible confirmation on enable
  }
}

export const sound = {
  /** Snap onto an interactive target — a dry pen tick. */
  tick: () => blip(2100, 0.03, "square", 0.025),
  /** Pointer press — a low pen stab. */
  press: () => blip(300, 0.06, "sine", 0.05),
  /** Page/sheet change — a short downward servo sweep. */
  whoosh: () => {
    if (!enabled) return;
    const ac = ensureCtx();
    if (!ac) return;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = "sawtooth";
    const t = ac.currentTime;
    osc.frequency.setValueAtTime(680, t);
    osc.frequency.exponentialRampToValueAtTime(180, t + 0.28);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(0.04, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
    osc.connect(gain).connect(ac.destination);
    osc.start(t);
    osc.stop(t + 0.32);
  },
};
