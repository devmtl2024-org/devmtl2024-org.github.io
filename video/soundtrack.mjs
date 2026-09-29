// Procedural soundtrack for the reel: 128 BPM, every hit lands on the edit's events.
// Usage: node video/soundtrack.mjs <out.wav>
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CONFIG } from "./config.mjs";
import { buildReelData, warpBeat } from "./data.mjs";

const REEL = buildReelData({
  siteRoot: path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."),
  config: CONFIG,
});
const TL = REEL.timeline;
const SR = 48000,
  DUR = TL.dur,
  N = Math.round(SR * DUR),
  B = 60 / TL.bpm;
// Sections on the music grid: sponsors (if any) then the 16-beat finale.
// The drop into the speakers, after the build-up over the community wall.
const D = TL.dropAt;
const SP = TL.sponsorsAt,
  F = TL.finaleAt,
  HAS_SPONSORS = SP < F;
// b: the music grid. ob: a beat of the original 32-beat edit, mapped to where it lands now.
const b = (n) => n * B;
const ob = (n) => warpBeat(TL.warp, n) * B;
const bus = () => [new Float32Array(N), new Float32Array(N)];
const DRUMS = bus(),
  MUSIC = bus(),
  SFX = bus(),
  VERB = bus(),
  DELAY = bus();

function rng(seed) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const R = rng(1234);
const noise = () => R() * 2 - 1;
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
const clamp = (x, a = 0, c = 1) => (x < a ? a : x > c ? c : x);

class Biquad {
  constructor() {
    this.x1 = this.x2 = this.y1 = this.y2 = 0;
    this.set("lp", 1000, 0.707);
  }
  set(type, f, q) {
    f = clamp(f, 10, SR * 0.45);
    const w = (2 * Math.PI * f) / SR,
      c = Math.cos(w),
      s = Math.sin(w),
      a = s / (2 * q);
    let b0, b1, b2;
    if (type === "lp") {
      b0 = (1 - c) / 2;
      b1 = 1 - c;
      b2 = b0;
    } else if (type === "hp") {
      b0 = (1 + c) / 2;
      b1 = -(1 + c);
      b2 = b0;
    } else {
      b0 = a;
      b1 = 0;
      b2 = -a;
    }
    const a0 = 1 + a;
    this.b0 = b0 / a0;
    this.b1 = b1 / a0;
    this.b2 = b2 / a0;
    this.a1 = (-2 * c) / a0;
    this.a2 = (1 - a) / a0;
  }
  run(x) {
    const y =
      this.b0 * x +
      this.b1 * this.x1 +
      this.b2 * this.x2 -
      this.a1 * this.y1 -
      this.a2 * this.y2;
    this.x2 = this.x1;
    this.x1 = x;
    this.y2 = this.y1;
    this.y1 = y;
    return y;
  }
}
const blep = (p, dt) =>
  p < dt
    ? ((p /= dt), p + p - p * p - 1)
    : p > 1 - dt
      ? ((p = (p - 1) / dt), p * p + p + p + 1)
      : 0;
class Saw {
  constructor(ph = R()) {
    this.p = ph;
  }
  run(f) {
    const dt = f / SR;
    this.p += dt;
    if (this.p >= 1) {
      this.p -= 1;
    }
    return 2 * this.p - 1 - blep(this.p, dt);
  }
}

// Render a voice: fn(t, i) → [l, r] (or a number for mono), written from t0 for dur seconds.
function voice(dst, t0, dur, fn, send = 0, sendBus = VERB) {
  const i0 = Math.max(0, Math.round(t0 * SR)),
    i1 = Math.min(N, Math.round((t0 + dur) * SR));
  for (let i = i0; i < i1; i++) {
    const t = (i - Math.round(t0 * SR)) / SR;
    let v = fn(t, i);
    const l = typeof v === "number" ? v : v[0],
      r = typeof v === "number" ? v : v[1];
    dst[0][i] += l;
    dst[1][i] += r;
    if (send) {
      sendBus[0][i] += l * send;
      sendBus[1][i] += r * send;
    }
  }
}

// ---------------- drums ----------------
function kick(t0, g = 1) {
  let ph = 0;
  const hp = new Biquad();
  hp.set("hp", 1200, 0.7);
  voice(DRUMS, t0, 0.5, (t) => {
    const f = 46 + 130 * Math.exp(-t * 32) + 30 * Math.exp(-t * 9);
    ph += f / SR;
    const body =
      Math.sin(2 * Math.PI * ph) * Math.exp(-t * 6.5) * Math.min(1, t * 900);
    const click = hp.run(noise()) * Math.exp(-t * 260) * 0.5;
    return Math.tanh((body * 1.1 + click) * 1.6) * 0.8 * g;
  });
}
function boom(t0, g = 1, len = 1.8) {
  let ph = 0;
  voice(DRUMS, t0, len, (t) => {
    ph += (30 + 50 * Math.exp(-t * 2.2)) / SR;
    return (
      Math.sin(2 * Math.PI * ph) *
      Math.exp(-t * 2.4) *
      Math.min(1, t * 400) *
      0.8 *
      g
    );
  });
}
function clap(t0, g = 1) {
  const bpL = new Biquad(),
    bpR = new Biquad();
  bpL.set("bp", 1400, 1.1);
  bpR.set("bp", 1550, 1.1);
  voice(
    DRUMS,
    t0,
    0.4,
    (t) => {
      const env =
        [0, 0.011, 0.023].reduce(
          (a, o) => a + (t >= o ? Math.exp(-(t - o) * 160) : 0),
          0,
        ) *
          0.6 +
        (t > 0.03 ? Math.exp(-(t - 0.03) * 16) : 0);
      return [
        bpL.run(noise()) * env * 1.4 * g,
        bpR.run(noise()) * env * 1.4 * g,
      ];
    },
    0.22,
  );
}
function hat(t0, g = 1, open = false) {
  const hp = new Biquad();
  hp.set("hp", 8200, 0.8);
  const pan = open ? 0.15 : -0.2;
  voice(
    DRUMS,
    t0,
    open ? 0.3 : 0.08,
    (t) => {
      const v = hp.run(noise()) * Math.exp(-t * (open ? 16 : 70)) * 0.45 * g;
      return [v * (1 - pan), v * (1 + pan)];
    },
    open ? 0.08 : 0,
  );
}
function snare(t0, g = 1, pitch = 1) {
  const bp = new Biquad();
  bp.set("bp", 3200, 0.9);
  let ph = 0;
  voice(
    DRUMS,
    t0,
    0.25,
    (t) => {
      ph += (190 * pitch) / SR;
      return (
        (Math.sin(2 * Math.PI * ph) * Math.exp(-t * 28) * 0.6 +
          bp.run(noise()) * Math.exp(-t * 20) * 0.9) *
        0.5 *
        g
      );
    },
    0.15,
  );
}
function crash(t0, g = 1, len = 2.2) {
  const hL = new Biquad(),
    hR = new Biquad();
  hL.set("hp", 3800, 0.6);
  hR.set("hp", 4200, 0.6);
  voice(
    DRUMS,
    t0,
    len,
    (t) => {
      const e = Math.exp(-t * 2.1) * Math.min(1, t * 2000) * 0.42 * g;
      return [hL.run(noise()) * e, hR.run(noise()) * e];
    },
    0.3,
  );
}
function revCymbal(tEnd, len, g = 1) {
  const hL = new Biquad(),
    hR = new Biquad();
  hL.set("hp", 3000, 0.6);
  hR.set("hp", 3300, 0.6);
  voice(
    SFX,
    tEnd - len,
    len,
    (t) => {
      const e = Math.pow(t / len, 3.2) * 0.5 * g;
      return [hL.run(noise()) * e, hR.run(noise()) * e];
    },
    0.2,
  );
}

// ---------------- music ----------------
const FM = [53, 56, 60, 63, 67],
  DB = [53, 56, 60, 61, 65],
  AB = [51, 56, 60, 63, 67],
  EB = [55, 58, 63, 65, 70],
  FM_END = [53, 56, 60, 65, 68, 72];
const CHORDS = [
  [0, 12, FM, 41],
  [12, 16, DB, 37],
  [16, 20, AB, 44],
  [20, 24, EB, 39],
  [24, D - 4, DB, 37],
  [D - 4, D, EB, 39],
  // speakers: one Fm-Db-Ab-Eb turn every four bars
  ...[...Array((SP - D) / 4)].map((_, i) => [
    D + 4 * i,
    D + 4 + 4 * i,
    ...[
      [FM, 41],
      [DB, 37],
      [AB, 44],
      [EB, 39],
    ][i % 4],
  ]),
  ...(HAS_SPONSORS
    ? [
        [SP, SP + 4, DB, 37],
        [SP + 4, F, EB, 39],
      ]
    : []),
  [F, F + 4, FM, 41],
  [F + 4, F + 8, DB, 37],
  [F + 8, F + 10, AB, 44],
  [F + 10, F + 12, EB, 39],
  [F + 12, TL.beats, FM_END, 41],
].map(([a, c, notes, root]) => [
  b(a),
  c === TL.beats ? DUR : b(c),
  notes,
  root,
]);
const chordAt = (t) =>
  CHORDS.find((c) => t >= c[0] && t < c[1]) || CHORDS[CHORDS.length - 1];
const KICKS = [...Array(F + 12 - 8 + 1)].map((_, i) => b(8 + i));
function duck(t) {
  let d = 1;
  for (const k of KICKS) {
    const dt = t - k;
    if (dt >= 0 && dt < 0.45) {
      d = Math.min(d, 1 - 0.72 * Math.exp(-dt * 9));
    }
  }
  return d;
}
function padLevel(t) {
  if (t < b(8)) {
    return 0.25 + 0.45 * (t / b(8));
  }
  if (t >= b(D - 0.5) && t < b(D)) {
    return 0.35;
  }
  if (t >= b(F + 12)) {
    return 1.1;
  }
  return 0.7;
}
function pad() {
  CHORDS.forEach(([t0, t1, notes], ci) => {
    const oscs = notes.map(() => [new Saw(), new Saw(), new Saw(), new Saw()]);
    const fL = new Biquad(),
      fR = new Biquad();
    const len = t1 - t0 + (ci === CHORDS.length - 1 ? 0 : 0.35);
    voice(
      MUSIC,
      t0,
      len,
      (t, i) => {
        const T = t0 + t;
        const cut =
          T < b(8)
            ? 350 + 1400 * (T / b(8)) ** 2
            : T >= b(D - 4) && T < b(D)
              ? 900 + 3500 * ((T - b(D - 4)) / b(4)) ** 2
              : T >= b(F + 12)
                ? 2600 * Math.exp(-(T - b(F + 12)) * 0.9) + 500
                : 2200;
        if (i % 32 === 0) {
          fL.set("lp", cut, 0.9);
          fR.set("lp", cut * 1.04, 0.9);
        }
        let l = 0,
          r = 0;
        notes.forEach((m, k) => {
          const f = mtof(m),
            o = oscs[k];
          l += o[0].run(f * 1.0041) + o[1].run(f * 0.9968);
          r += o[2].run(f * 0.9959) + o[3].run(f * 1.0032);
        });
        const env =
          Math.min(1, t / 0.06) *
          (t > t1 - t0 ? Math.exp(-(t - (t1 - t0)) * 14) : 1);
        const g = env * 0.05 * padLevel(T) * (T < b(8) ? 1 : duck(T));
        return [fL.run(l) * g, fR.run(r) * g];
      },
      0.35,
    );
  });
}
function bassNote(t0, len, m, g = 1) {
  const s1 = new Saw(0),
    s2 = new Saw(0.5),
    lp = new Biquad();
  let ph = 0;
  voice(MUSIC, t0, len + 0.02, (t, i) => {
    const f = mtof(m);
    if (i % 16 === 0) {
      lp.set("lp", 180 + 1500 * Math.exp(-t * 22), 1.4);
    }
    ph += f / 2 / SR;
    const env =
      Math.min(1, t * 400) *
      (t > len ? Math.exp(-(t - len) * 200) : 1) *
      Math.exp(-t * 2.5);
    const v =
      (lp.run((s1.run(f) + s2.run(f * 1.006)) * 0.5) * 0.8 +
        Math.sin(2 * Math.PI * ph) * 0.4) *
      env *
      0.34 *
      g *
      duck(t0 + t);
    return v;
  });
}
function bass() {
  // bar 2: offbeat 8ths; from the drop: rolling 16ths that skip the kick
  for (let x = 8; x < D - 0.5; x += 0.5) {
    if (x % 1 === 0.5) {
      bassNote(b(x), b(0.45), chordAt(b(x))[3]);
    }
  }
  for (let x = D; x < F + 12; x += 0.25) {
    if (x % 1 === 0) {
      continue;
    }
    const root = chordAt(b(x))[3];
    bassNote(b(x), b(0.22), root + ((x * 4) % 4 === 2 ? 12 : 0), 0.9);
  }
  bassNote(b(F + 12), 0.9, 29, 1.2);
}
function pluck(t0, m, g = 1, pan = 0) {
  const s = new Saw(0),
    s2 = new Saw(0.3),
    lp = new Biquad();
  voice(
    MUSIC,
    t0,
    0.35,
    (t, i) => {
      if (i % 16 === 0) {
        lp.set("lp", 500 + 5200 * Math.exp(-t * 16), 2);
      }
      const f = mtof(m);
      const v =
        lp.run(s.run(f) + s2.run(f * 1.003)) *
        Math.exp(-t * 11) *
        Math.min(1, t * 800) *
        0.1 *
        g;
      return [v * (1 - pan), v * (1 + pan)];
    },
    0.15,
    DELAY,
  );
}
function arp() {
  const pattern = [0, 2, 1, 3, 2, 4, 3, 1];
  for (let x = D, k = 0; x < F + 12; x += 0.25, k++) {
    const notes = chordAt(b(x))[2];
    const m = notes[pattern[k % 8] % notes.length] + 12;
    pluck(b(x), m, x < F ? 0.85 : 1, Math.sin(k * 0.7) * 0.5);
  }
  // sparkle arp over the honeycomb wave
  for (let k = 0; k < 16; k++) {
    const t = ob(6) + k * b(0.125);
    pluck(t, chordAt(t)[2][k % 5] + 24, 0.4 * (1 - k / 16), Math.sin(k) * 0.6);
  }
}
function stab(t0, notes, g = 1, len = 0.22) {
  const oscs = notes.map(() => [new Saw(), new Saw()]),
    lp = new Biquad();
  voice(
    MUSIC,
    t0,
    len + 1.2,
    (t, i) => {
      if (i % 16 === 0) {
        lp.set("lp", 900 + 5000 * Math.exp(-t * 8), 1.2);
      }
      let l = 0,
        r = 0;
      notes.forEach((m, k) => {
        const f = mtof(m + 12);
        l += oscs[k][0].run(f * 1.003);
        r += oscs[k][1].run(f * 0.997);
      });
      const env =
        Math.min(1, t * 600) *
        (t < len ? 1 : Math.exp(-(t - len) * 9)) *
        0.06 *
        g;
      const v = lp.run((l + r) * 0.5) * env;
      return [v * 1.1, v * 0.9];
    },
    0.45,
  );
}

// ---------------- sfx ----------------
function whoosh(
  t0,
  t1,
  g = 1,
  {
    f0 = 250,
    f1 = 5000,
    peak = 0.8,
    panFrom = -0.7,
    panTo = 0.7,
    q = 1.6,
  } = {},
) {
  const bp = new Biquad(),
    bp2 = new Biquad();
  const len = t1 - t0;
  voice(
    SFX,
    t0,
    len + 0.12,
    (t, i) => {
      const p = clamp(t / len);
      if (i % 16 === 0) {
        const f = f0 * Math.pow(f1 / f0, p);
        bp.set("bp", f, q);
        bp2.set("bp", f * 1.5, q);
      }
      const e =
        (p < peak
          ? Math.pow(p / peak, 2)
          : Math.pow(1 - (p - peak) / (1 - peak), 1.5)) *
        (t > len ? Math.exp(-(t - len) * 40) : 1);
      const v = (bp.run(noise()) + bp2.run(noise()) * 0.6) * e * 0.9 * g;
      const pan = panFrom + (panTo - panFrom) * p;
      return [v * (1 - pan), v * (1 + pan)];
    },
    0.25,
  );
}
function riser(t0, t1, g = 1) {
  const s = new Saw(),
    s2 = new Saw(),
    bp = new Biquad();
  const len = t1 - t0;
  voice(
    SFX,
    t0,
    len,
    (t, i) => {
      const p = t / len;
      if (i % 16 === 0) {
        bp.set("bp", 400 * Math.pow(22, p), 2.5);
      }
      const f = 110 * Math.pow(8, p * p);
      const e = Math.pow(p, 2.2) * 0.55 * g;
      return [
        (bp.run(noise()) * 0.8 + s.run(f) * 0.12) * e,
        (bp.run(noise()) * 0.8 + s2.run(f * 1.01) * 0.12) * e,
      ];
    },
    0.3,
  );
}
function click(t0, g = 1, tone = 3200, pan = 0) {
  const hp = new Biquad();
  hp.set("hp", 2000, 0.7);
  voice(SFX, t0, 0.05, (t) => {
    const v =
      (hp.run(noise()) * Math.exp(-t * 900) * 0.6 +
        Math.sin(2 * Math.PI * tone * t) * Math.exp(-t * 700) * 0.35) *
      0.5 *
      g;
    return [v * (1 - pan), v * (1 + pan)];
  });
}
function key(t0, g = 1) {
  const lp = new Biquad();
  lp.set("lp", 900, 0.7);
  click(t0, 0.9 * g, 2600 + R() * 1400, (R() - 0.5) * 0.3);
  voice(
    SFX,
    t0,
    0.07,
    (t) =>
      (Math.sin(2 * Math.PI * 170 * t) * Math.exp(-t * 90) * 0.5 +
        lp.run(noise()) * Math.exp(-t * 110) * 0.7) *
      0.35 *
      g,
    0.06,
  );
}
function blip(t0, f, g = 1, pan = 0, len = 0.16) {
  voice(
    SFX,
    t0,
    len,
    (t) => {
      const v =
        (Math.sin(2 * Math.PI * f * t) + 0.25 * Math.sin(4 * Math.PI * f * t)) *
        Math.exp(-t * 20) *
        Math.min(1, t * 2000) *
        0.16 *
        g;
      return [v * (1 - pan), v * (1 + pan)];
    },
    0.3,
  );
}
function glitch(t0, len, g = 1) {
  let hold = 0,
    v = 0,
    f = 800,
    ph = 0;
  voice(
    SFX,
    t0,
    len,
    (t, i) => {
      if (hold-- <= 0) {
        hold = 20 + Math.floor(R() * 260);
        v = noise();
        f = 200 + R() * 3000;
      }
      ph += f / SR;
      const gate = Math.sin(2 * Math.PI * 34 * t) > -0.2 ? 1 : 0.15;
      const e = (1 - t / len) * 0.32 * g * gate;
      return [
        (v * 0.7 + Math.sign(Math.sin(2 * Math.PI * ph)) * 0.25) * e,
        (v * 0.5 + Math.sign(Math.sin(2 * Math.PI * ph * 1.01)) * 0.3) * e,
      ];
    },
    0.1,
  );
}
function shing(t0, g = 1) {
  const bp = new Biquad();
  voice(
    SFX,
    t0,
    0.9,
    (t, i) => {
      if (i % 16 === 0) {
        bp.set("bp", 2500 * Math.pow(4, clamp(t / 0.7)), 4);
      }
      const e = Math.sin(Math.PI * clamp(t / 0.9)) ** 2 * 0.5 * g;
      const v =
        bp.run(noise()) * e +
        Math.sin(2 * Math.PI * 4186 * t) * Math.exp(-t * 5) * 0.03 * g;
      return [v * 0.8, v * 1.2];
    },
    0.5,
  );
}
function suck(t0, t1, g = 1) {
  let ph = 0;
  const len = t1 - t0;
  voice(SFX, t0, len, (t) => {
    const p = t / len;
    ph += (60 + 900 * p * p * p) / SR;
    return Math.sin(2 * Math.PI * ph) * Math.pow(p, 3) * 0.22 * g;
  });
  whoosh(t0, t1, 1.1 * g, {
    f0: 6000,
    f1: 300,
    peak: 0.97,
    panFrom: 0.8,
    panTo: 0,
  });
}

// ---------------- arrangement ----------------
// bars 1-2: boot
const TYPE_T = TL.typeJitter.map((j, i) => TL.typeStart + i * TL.typeStep + j);
TYPE_T.forEach((t) => key(t, 0.9));
for (let k = 0; k < 7; k++) {
  const t = b(k);
  if (t < TYPE_T[0] - 0.05 || t > TYPE_T[TYPE_T.length - 1] + 0.12) {
    blip(t + 0.005, 1760, k ? 0.22 : 0.35);
  }
}
key(ob(3), 1.6);
glitch(ob(3), 0.36, 1);
riser(b(4), b(8), 0.8);
revCymbal(b(8), b(2), 0.9);
whoosh(ob(3.2), ob(4), 1.3, {
  f0: 200,
  f1: 7000,
  peak: 0.95,
  panFrom: 0,
  panTo: 0,
});
// bars 3-4: slam → wordmark → tagline → zoom
kick(b(8), 1.3);
boom(b(8), 1.2);
crash(b(8), 1.1);
stab(b(8), FM, 1.2, 0.3);
whoosh(ob(5), ob(5.7), 0.6, { f0: 400, f1: 3000, peak: 0.5 });
for (let k = 0; k < 18; k++) {
  blip(
    ob(5.75) + k * 0.03 + R() * 0.015,
    1200 + R() * 2600,
    0.2,
    (R() - 0.5) * 1.4,
    0.06,
  );
}
for (let k = 0; k < 15; k++) {
  blip(
    ob(6.1) + k * 0.03 + R() * 0.015,
    1500 + R() * 2600,
    0.16,
    (R() - 0.5) * 1.4,
    0.06,
  );
}
riser(ob(7), ob(8), 1.2);
whoosh(ob(7), ob(8), 1, {
  f0: 150,
  f1: 9000,
  peak: 0.98,
  panFrom: 0,
  panTo: 0,
  q: 1,
});
for (let x = 15; x < 16; x += 0.25) {
  snare(b(x), 0.25 + 0.6 * (x - 15), 1 + (x - 15) * 0.4);
}
// bars 5-6: numbers
[8, 9, 10, 11].forEach((x, j) => {
  const T = ob(x);
  stab(T, chordAt(T)[2], j ? 0.9 : 1.1);
  if (j) {
    whoosh(T - 0.18, T + 0.08, 0.55, {
      f0: 600,
      f1: 5000,
      peak: 0.7,
      panFrom: -0.9,
      panTo: 0.9,
    });
  }
  // odometer ticks on the units column, following its outExpo roll
  const st = T - 0.1 + 0.06,
    steps = j ? unitsRollSteps(REEL.stats[j - 1], REEL.stats[j]) : 0;
  for (let k = 1; k < steps; k++) {
    click(st + (-Math.log2(1 - k / steps) / 10) * 0.28, 0.35, 4200, 0.2);
  }
  click(st + 0.2, 0.8, 1800);
});
crash(ob(8), 0.6);
boom(ob(8), 0.6, 1);
function unitsRollSteps(from, to) {
  // the odometer spins one extra full turn whenever a column changes
  const steps = (((to.cols[3] - from.cols[3]) % 11) + 11) % 11;
  return steps ? steps + 11 : 0;
}
// communities: the wall, a flash per name, then the band and the build-up to the drop
whoosh(ob(12) - 0.18, ob(12) + 0.08, 0.7, { f0: 600, f1: 5000, peak: 0.7 });
whoosh(ob(12) - 0.05, ob(12) + 0.5, 0.9, {
  f0: 3000,
  f1: 300,
  peak: 0.15,
  panFrom: 0.8,
  panTo: -0.8,
});
whoosh(ob(13.75) - 0.05, ob(14.25), 0.6, {
  f0: 500,
  f1: 4000,
  peak: 0.7,
  panFrom: -0.9,
  panTo: 0.9,
});
stab(ob(14), chordAt(ob(14))[2], 1);
stab(ob(15), chordAt(ob(15))[2], 1.1);
const spotStart = ob(12) + 0.15,
  spotStep = Math.min(B / 2, (ob(13.75) - spotStart) / REEL.communities.length);
REEL.communities.forEach((_, i) =>
  blip(
    spotStart + i * spotStep,
    mtof(84 + [0, 3, 5, 7, 10][i % 5]),
    0.12,
    Math.sin(i) * 0.6,
    0.12,
  ),
);
for (let x = D - 3; x < D - 0.5; x += x < D - 1.5 ? 0.5 : 0.25) {
  snare(b(x), 0.3 + (0.5 * (x - D + 3)) / 2.5, 1 + (x - D + 3) * 0.2);
}
riser(b(D - 4), b(D - 0.05), 1);
revCymbal(b(D), b(1.5), 1);
whoosh(ob(15.72), ob(16.1), 1.2, {
  f0: 300,
  f1: 8000,
  peak: 0.9,
  panFrom: 0,
  panTo: 0,
  q: 1,
});
// bars 9-12: drop, speakers
kick(b(D), 1.3);
boom(b(D), 1.1);
crash(b(D), 1);
for (let k = 0; k < 22; k++) {
  blip(
    ob(15.85) + R() * 0.45,
    mtof([65, 68, 72, 75, 77, 80][Math.floor(R() * 6)]),
    0.45,
    (R() - 0.5) * 1.6,
    0.1,
  );
}
// speaker close-ups: zoom into the first, whip to each next one on the downbeat, pull back to the wall
TL.focusAt.forEach((x, k) => {
  const side = k % 2 ? 1 : -1;
  if (k === 0) {
    whoosh(b(x) - 0.28, b(x), 0.9, { f0: 300, f1: 4000, peak: 0.75 });
  } else {
    whoosh(b(x) - 0.23, b(x), 1.1, {
      f0: 200,
      f1: 6000,
      peak: 0.8,
      panFrom: -0.9 * side,
      panTo: 0.9 * side,
    });
  }
  for (let c = 0; c < REEL.featured[k].title.length; c += 2) {
    click(b(x) - 0.12 + 0.1 + c * 0.0045, 0.3, 3600, 0.3 * side);
  }
});
const midSpeakers = D + 4 * Math.floor((SP - D) / 8);
if (midSpeakers > D) {
  crash(b(midSpeakers), 0.45);
}
whoosh(b(TL.pullback), b(TL.pullback) + 0.45, 0.9, {
  f0: 4000,
  f1: 400,
  peak: 0.2,
  panFrom: 0,
  panTo: 0,
});
for (let x = TL.pullback - 0.5; x < TL.pullback + 0.5; x += 0.25) {
  snare(
    b(x),
    0.2 + 0.35 * (x - TL.pullback + 0.5),
    1 + (x - TL.pullback + 0.5) * 0.3,
  );
}
suck(b(SP - 0.9), b(SP), 1.2);
revCymbal(b(SP), b(2), 1.1);
// sponsors: burst out of the hexagon, gold then silver then bronze, then collapse into the finale
if (HAS_SPONSORS) {
  kick(b(SP), 1.3);
  boom(b(SP), 1.1);
  crash(b(SP), 1);
  stab(b(SP), DB, 1.1, 0.3);
  REEL.sponsorTiers.forEach((tier, k) =>
    tier.sponsors.forEach((_, n) => {
      blip(
        b(SP + k) + n * 0.05,
        mtof(79 - 5 * k + 2 * n),
        0.5,
        (n - (tier.sponsors.length - 1) / 2) * 0.5,
        0.18,
      );
      pluck(b(SP + k) + n * 0.05, 67 - 5 * k + 2 * n, 1.2);
    }),
  );
  suck(b(F - 0.9), b(F), 1.2);
  revCymbal(b(F), b(2), 1.1);
}
// finale
kick(b(F), 1.4);
boom(b(F), 1.3);
crash(b(F), 1.1);
stab(b(F), FM, 1.2, 0.3);
whoosh(ob(25), ob(25.75), 0.5, { f0: 400, f1: 2500, peak: 0.5 });
for (let i = 0; i < 10; i++) {
  const ts = ob(26) - 0.05 + i * 0.03,
    tl = ts + 0.22 + i * 0.018;
  for (let tt = ts; tt < tl; tt += 0.024) {
    click(tt, 0.16, 2600 + R() * 800, (i - 5) / 8);
  }
  click(tl, 0.75, 1500, (i - 5) / 8);
}
for (let k = 0; k < 12; k++) {
  blip(
    ob(27) + k * 0.05,
    mtof(84 + [0, 3, 7, 10, 12][k % 5]),
    0.18,
    Math.sin(k) * 0.7,
    0.2,
  );
}
voice(
  SFX,
  ob(28),
  0.2,
  (t) =>
    Math.sin(2 * Math.PI * (320 + 1600 * t) * t) * Math.exp(-t * 18) * 0.25,
);
for (let k = 1; k <= 10; k++) {
  key(ob(28) + 0.2 + k * 0.035, 0.45);
}
shing(ob(29), 0.9);
kick(b(F + 12), 1.3);
boom(b(F + 12), 1.1, 1);
crash(b(F + 12), 1.1, 1);
stab(b(F + 12), FM_END, 1.4, 0.35);
[F + 13, F + 14, F + 15].forEach((x, k) => blip(b(x), 1760, 0.3 - k * 0.08));
// groove
const SPECIAL = [8, D, ...(HAS_SPONSORS ? [SP] : []), F, F + 12].map(b);
KICKS.filter((t) => !SPECIAL.includes(t)).forEach((t) => kick(t, 1));
for (let x = 9; x < F + 12; x += 2) {
  if (![15, D - 3, D - 1].includes(x)) {
    clap(b(x), 1);
  }
}
for (let x = 8.5; x < F + 12; x += 1) {
  if (x !== D - 0.5) {
    hat(b(x), 0.9, true);
  }
}
for (let x = D; x < F + 12; x += 0.25) {
  if (x % 1 !== 0.5) {
    hat(b(x), (x * 4) % 2 ? 0.45 : 0.7);
  }
}
pad();
bass();
arp();

// ---------------- fx + master ----------------
function reverb([inL, inR], [oL, oR], size = 0.84, damp = 0.3, wet = 1) {
  const combs = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617],
    aps = [556, 441, 341, 225];
  [
    [inL, oL, 0],
    [inR, oR, 23],
  ].forEach(([inp, o, sp]) => {
    const cb = combs.map((d) => ({
      buf: new Float32Array(d + sp),
      i: 0,
      f: 0,
    }));
    const ab = aps.map((d) => ({ buf: new Float32Array(d + sp), i: 0 }));
    for (let n = 0; n < N; n++) {
      const x = inp[n] * 0.015;
      let y = 0;
      for (const c of cb) {
        const out = c.buf[c.i];
        c.f = out * (1 - damp) + c.f * damp;
        c.buf[c.i] = x + c.f * size;
        c.i = (c.i + 1) % c.buf.length;
        y += out;
      }
      for (const a of ab) {
        const bo = a.buf[a.i];
        const v = -y + bo;
        a.buf[a.i] = y + bo * 0.5;
        a.i = (a.i + 1) % a.buf.length;
        y = v;
      }
      o[n] += y * wet;
    }
  });
}
function pingpong([inL, inR], [oL, oR], time, fb) {
  const d = Math.round(time * SR),
    bl = new Float32Array(d),
    br = new Float32Array(d);
  let i = 0;
  for (let n = 0; n < N; n++) {
    const l = bl[i],
      r = br[i];
    bl[i] = inL[n] + r * fb;
    br[i] = inR[n] * 0.3 + l * fb;
    i = (i + 1) % d;
    oL[n] += l * 0.5;
    oR[n] += r * 0.5;
  }
}
const MIX = bus(),
  WETD = bus(),
  WETR = bus();
pingpong(DELAY, WETD, b(0.75), 0.42);
reverb(VERB, WETR, 0.86, 0.35, 1.4);
// Bus balance was set from measured peak/RMS per bus (kick-led, -14 LUFS master), not by ear.
const GAIN = { drums: 0.42, music: 1.05, sfx: 1.15, delay: 9, reverb: 3.2 };
for (let n = 0; n < N; n++) {
  for (let c = 0; c < 2; c++) {
    MIX[c][n] = WETD[c][n] * GAIN.delay + WETR[c][n] * GAIN.reverb;
  }
}
for (let n = 0; n < N; n++) {
  MIX[0][n] +=
    DRUMS[0][n] * GAIN.drums + MUSIC[0][n] * GAIN.music + SFX[0][n] * GAIN.sfx;
  MIX[1][n] +=
    DRUMS[1][n] * GAIN.drums + MUSIC[1][n] * GAIN.music + SFX[1][n] * GAIN.sfx;
}
for (const c of MIX) {
  const hp = new Biquad();
  hp.set("hp", 30, 0.7);
  for (let n = 0; n < N; n++) {
    c[n] = hp.run(c[n]);
  }
}
let peak = 0;
for (let n = 0; n < N; n++) {
  for (const c of MIX) {
    c[n] = Math.tanh(c[n] * 1.1);
    peak = Math.max(peak, Math.abs(c[n]));
  }
}
const norm = 0.75 / peak;
const out = Buffer.alloc(44 + N * 4);
out.write("RIFF", 0);
out.writeUInt32LE(36 + N * 4, 4);
out.write("WAVE", 8);
out.write("fmt ", 12);
out.writeUInt32LE(16, 16);
out.writeUInt16LE(1, 20);
out.writeUInt16LE(2, 22);
out.writeUInt32LE(SR, 24);
out.writeUInt32LE(SR * 4, 28);
out.writeUInt16LE(4, 32);
out.writeUInt16LE(16, 34);
out.write("data", 36);
out.writeUInt32LE(N * 4, 40);
let rms = 0;
for (let n = 0; n < N; n++) {
  const t = n / SR,
    fade =
      t > DUR - 0.45
        ? Math.pow((DUR - t) / 0.45, 1.5)
        : t < 0.005
          ? t / 0.005
          : 1;
  for (let c = 0; c < 2; c++) {
    const v = MIX[c][n] * norm * fade;
    rms += v * v;
    out.writeInt16LE(
      Math.round(clamp(v + (R() - R()) / 32768, -1, 1) * 32767),
      44 + n * 4 + c * 2,
    );
  }
}
fs.writeFileSync(process.argv[2], out);
console.log(
  `peak(pre-norm) ${peak.toFixed(3)}  rms ${(20 * Math.log10(Math.sqrt(rms / (N * 2)))).toFixed(1)} dBFS`,
);
