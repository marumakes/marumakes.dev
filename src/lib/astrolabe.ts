/**
 * The hero instrument.
 *
 * A working astrolabe drawn to its real parts: a graduated limb, a tympan
 * of almucantar arcs, a rete carrying the ecliptic and its star pointers,
 * and a sighting alidade. The rete and alidade turn; everything else is
 * fixed, as on the object itself.
 *
 * This drawing is signed off as finished - see design/DESIGN.md §5.
 */

import { el, polar, stroked, text } from "./mechanism";

/** Running, or stopped where it stood. Only the rete and the alidade know the
    difference; the plate beneath them never moved in the first place. */
export type Motion = "running" | "stopped";

const CX = 210;
const CY = 210;
const LIMB = 186;

/** Degrees between graduations on the limb, and between numbered ones. */
const TICK_STEP = 6;
const NUMBERED_STEP = 30;

const RETE_PERIOD_S = 240;
const ALIDADE_PERIOD_S = 96;

/**
 * Where the two moving parts are left standing once it has stopped.
 *
 * Both are half a division short of a mark, so nothing on the instrument lines
 * up with anything else: the alidade sits three degrees from either graduation
 * on a limb ticked every 6°, the rete fifteen from either boundary of an
 * ecliptic divided every 30°. Parked square, a stopped instrument reads as one
 * set deliberately; parked between marks it reads as one that stopped.
 *
 * The rete then strains against whatever is holding it and drops back - see
 * `.jammed` in `components/Instrument.astro`. It is given the angle to rest at
 * rather than a transform, because the straining is the stylesheet's business
 * and the angle is this file's.
 */
const ALIDADE_STOPPED_DEG = 5 * TICK_STEP + TICK_STEP / 2;
const RETE_STOPPED_DEG = NUMBERED_STEP + NUMBERED_STEP / 2;

export function astrolabe(motion: Motion = "running"): string {
  return [
    suspension(),
    limb(),
    tympan(),
    rete(motion),
    alidade(motion),
    centrePin(),
  ].join("");
}

/** Shackle and throne, so the instrument reads as an object that hangs. */
function suspension(): string {
  return [
    stroked("circle", { cx: CX, cy: 12, r: 7 }, "rule-gold"),
    el("rect", { class: "fitting", x: CX - 5, y: 18, width: 10, height: 9 }),
  ].join("");
}

/** A graduated band, ticked every 6° and numbered every 30°. */
function limb(): string {
  const parts = [
    stroked("circle", { cx: CX, cy: CY, r: LIMB }, "rule-gold-strong"),
    stroked("circle", { cx: CX, cy: CY, r: LIMB - 15 }, "rule-gold"),
  ];

  for (let angle = 0; angle < 360; angle += TICK_STEP) {
    const major = angle % NUMBERED_STEP === 0;
    const [x1, y1] = polar(CX, CY, LIMB, angle);
    const [x2, y2] = polar(CX, CY, LIMB - (major ? 15 : 7), angle);
    parts.push(
      stroked(
        "line",
        { x1, y1, x2, y2 },
        major ? "rule-gold-strong" : "rule-gold",
      ),
    );
  }

  for (let angle = 0; angle < 360; angle += NUMBERED_STEP) {
    const [x, y] = polar(CX, CY, LIMB - 24, angle);
    parts.push(text({ x: x - 6.5, y: y + 2.4 }, `${angle}°`));
  }

  return parts.join("");
}

/** The fixed plate: horizon, tropics, and a family of almucantar arcs,
    clipped so nothing spills past the limb. */
function tympan(): string {
  const parts = [
    '<clipPath id="tympan-edge">',
    el("circle", { cx: CX, cy: CY, r: LIMB - 18 }),
    "</clipPath>",
    '<g clip-path="url(#tympan-edge)">',
  ];

  [LIMB - 24, 112, 58].forEach((r) => {
    parts.push(stroked("circle", { cx: CX, cy: CY, r }, "hair"));
  });

  for (let i = 1; i <= 6; i += 1) {
    parts.push(
      stroked("circle", { cx: CX, cy: CY - i * 14, r: 26 + i * 21 }, "hair"),
    );
  }

  parts.push(
    stroked("line", { x1: CX, y1: CY - LIMB, x2: CX, y2: CY + LIMB }, "hair"),
    stroked("line", { x1: CX - LIMB, y1: CY, x2: CX + LIMB, y2: CY }, "ink"),
    "</g>",
  );

  return parts.join("");
}

/** Seven star pointers, each at its own bearing and reach. */
const POINTERS = [
  { angle: 22, reach: 0.78 },
  { angle: 74, reach: 0.62 },
  { angle: 128, reach: 0.84 },
  { angle: 186, reach: 0.66 },
  { angle: 242, reach: 0.8 },
  { angle: 302, reach: 0.6 },
  { angle: 340, reach: 0.72 },
];

/** Exported so a caption can read the count off the drawing rather than
    restate it and risk saying something the drawing does not. */
export const POINTER_COUNT = POINTERS.length;

/** The turning frame: the ecliptic divided into its twelve signs, with a
    pointer reaching to each named star. */
function rete(motion: Motion): string {
  const ex = CX;
  const ey = CY - 40;
  const er = 104;

  // Stopped, the ecliptic is simply there. `trace-in` strikes it on as the
  // page loads, which is movement, and this instrument has none.
  const frame =
    motion === "running"
      ? `<g class="rete turning" style="--spin:${RETE_PERIOD_S}s">`
      : `<g class="rete jammed" style="--rest:${RETE_STOPPED_DEG}deg">`;

  const parts = [
    frame,
    stroked(
      "circle",
      { cx: ex, cy: ey, r: er, pathLength: 1 },
      motion === "running" ? "ecliptic trace-in" : "ecliptic",
    ),
    stroked("circle", { cx: ex, cy: ey, r: er - 9 }, "pointer"),
  ];

  for (let i = 0; i < 12; i += 1) {
    const [x1, y1] = polar(ex, ey, er, i * NUMBERED_STEP);
    const [x2, y2] = polar(ex, ey, er - 9, i * NUMBERED_STEP);
    parts.push(stroked("line", { x1, y1, x2, y2 }, "pointer"));
  }

  POINTERS.forEach((pointer) => {
    const radius = LIMB * pointer.reach;
    const [tipX, tipY] = polar(CX, CY, radius, pointer.angle);
    const [leftX, leftY] = polar(CX, CY, radius - 30, pointer.angle - 4.5);
    const [rightX, rightY] = polar(CX, CY, radius - 30, pointer.angle + 4.5);
    const points = [
      `${leftX.toFixed(2)},${leftY.toFixed(2)}`,
      `${tipX.toFixed(2)},${tipY.toFixed(2)}`,
      `${rightX.toFixed(2)},${rightY.toFixed(2)}`,
    ].join(" ");

    parts.push(
      stroked("polyline", { points }, "pointer"),
      el("circle", {
        class: "star",
        cx: tipX.toFixed(2),
        cy: tipY.toFixed(2),
        r: 2.2,
      }),
    );
  });

  parts.push("</g>");
  return parts.join("");
}

/** A sighting rule with two open vanes, turning the other way. */
function alidade(motion: Motion): string {
  // Stopped, this one simply stands where it was left. It is sighted by hand,
  // so nothing would be straining against it - only the rete does that.
  const frame =
    motion === "running"
      ? `<g class="turning widdershins" style="--spin:${ALIDADE_PERIOD_S}s">`
      : `<g transform="rotate(${ALIDADE_STOPPED_DEG} ${CX} ${CY})">`;

  return [
    frame,
    stroked(
      "line",
      { x1: CX, y1: CY - LIMB + 8, x2: CX, y2: CY + LIMB - 8 },
      "rule-gold-strong",
    ),
    el("rect", {
      class: "fitting",
      x: CX - 4.5,
      y: CY - LIMB + 24,
      width: 9,
      height: 13,
    }),
    el("rect", {
      class: "fitting",
      x: CX - 4.5,
      y: CY + LIMB - 37,
      width: 9,
      height: 13,
    }),
    "</g>",
  ].join("");
}

function centrePin(): string {
  return [
    el("circle", { class: "fitting", cx: CX, cy: CY, r: 6 }),
    el("circle", { class: "hub", cx: CX, cy: CY, r: 2 }),
  ].join("");
}
