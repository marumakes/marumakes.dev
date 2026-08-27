/**
 * The drawing layer.
 *
 * Everything the site engraves — gear trains, number wheels, the great
 * wheel, the maker's mark — is generated here as SVG markup and rendered
 * at build time. Components ask for a drawing by name; they never touch
 * angles or tooth geometry themselves.
 */

/** Wheels are cut to one module so trains of mixed tooth counts still mesh. */
const TRAIN_MODULE = 2.3;
const SEAL_MODULE = 1.9;

/** Base period of a train's first wheel; the rest follow from tooth ratio. */
const TRAIN_PERIOD_S = 52;

export type Attrs = Record<string, string | number>;

/** One SVG element as markup. Void elements only — nothing here nests. */
export function el(name: string, attrs: Attrs): string {
	const pairs = Object.entries(attrs)
		.map(([key, value]) => `${key}="${escapeAttr(String(value))}"`)
		.join(' ');

	return `<${name} ${pairs} />`;
}

/** Stroke-only shapes must say so: SVG's default fill is black, which on
    parchment renders a solid disc rather than nothing at all. */
export function stroked(name: string, attrs: Attrs, className: string): string {
	return el(name, { class: className, fill: 'none', ...attrs });
}

export function text(attrs: Attrs, content: string): string {
	const pairs = Object.entries(attrs)
		.map(([key, value]) => `${key}="${escapeAttr(String(value))}"`)
		.join(' ');

	return `<text ${pairs}>${escapeText(content)}</text>`;
}

/** Degrees clockwise from twelve o'clock, which is how a dial is read. */
export function polar(cx: number, cy: number, radius: number, degrees: number): [number, number] {
	const radians = ((degrees - 90) * Math.PI) / 180;
	return [cx + radius * Math.cos(radians), cy + radius * Math.sin(radians)];
}

/** Two wheels of the same module mesh when their centres sit the sum of
    their pitch radii apart. Both trains below rely on it. */
export function pitchRadius(teeth: number, module: number): number {
	return (module * teeth) / 2;
}

/** A tooth profile close enough to involute to read as a cut gear. */
export function gearProfile(
	cx: number,
	cy: number,
	teeth: number,
	module: number,
	phase: number,
): string {
	const pitch = pitchRadius(teeth, module);
	const tip = pitch + module * 0.55;
	const root = pitch - module * 0.8;
	const step = 360 / teeth;
	const points: string[] = [];

	for (let i = 0; i < teeth; i += 1) {
		const centre = i * step + phase;
		const corners: [number, number][] = [
			[root, centre - step * 0.3],
			[tip, centre - step * 0.17],
			[tip, centre + step * 0.17],
			[root, centre + step * 0.3],
		];

		corners.forEach(([radius, angle]) => {
			const [x, y] = polar(cx, cy, radius, angle);
			points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
		});
	}

	return points.join(' ');
}

/** Alternate wheels in a train turn against each other, so every other
    one is phase-shifted by half a tooth and spun the other way. */
function meshes(index: number): boolean {
	return index % 2 === 0;
}

/**
 * A run of meshed wheels along one axis, used for the section dividers.
 * Each wheel's period is its tooth count against the first wheel's —
 * a bigger wheel genuinely turns slower.
 */
export function gearTrain(teeth: number[], cy: number, startX: number): string {
	let x = startX + pitchRadius(teeth[0], TRAIN_MODULE);
	const parts: string[] = [];

	teeth.forEach((count, index) => {
		const period = (TRAIN_PERIOD_S * count) / teeth[0];
		const spin = `--spin:${period.toFixed(1)}s`;
		const sense = meshes(index) ? 'turning' : 'turning widdershins';

		parts.push(
			`<g class="${sense}" style="${spin}">`,
			stroked(
				'polygon',
				{ points: gearProfile(x, cy, count, TRAIN_MODULE, meshes(index) ? 0 : 180 / count) },
				index === 0 ? 'tooth lead' : 'tooth',
			),
			stroked('circle', { cx: x, cy, r: pitchRadius(count, TRAIN_MODULE) * 0.4 }, 'boss'),
			el('circle', { class: 'arbor', cx: x, cy, r: 1.4 }),
			'</g>',
		);

		if (index < teeth.length - 1) {
			x += pitchRadius(count, TRAIN_MODULE) + pitchRadius(teeth[index + 1], TRAIN_MODULE);
		}
	});

	return parts.join('');
}

/** Three tooth orders, cycled so consecutive dividers don't read as copies. */
const TRAIN_ORDERS = [
	[18, 12, 15, 10],
	[15, 10, 18, 12],
	[12, 18, 10, 15],
];

export function dividerTrain(index: number): string {
	return gearTrain(TRAIN_ORDERS[index % TRAIN_ORDERS.length], 24, 6);
}

/** Each register entry rides on its own slowly turning wheel, with the
    plate numeral sitting in the boss. */
export function numberWheel(index: number): string {
	const period = 180 + index * 40;
	const sense = index % 2 === 0 ? 'turning' : 'turning widdershins';

	return [
		`<g class="${sense}" style="--spin:${period}s">`,
		stroked('polygon', { points: gearProfile(34, 34, 20, 3, 0) }, 'tooth'),
		'</g>',
		stroked('circle', { cx: 34, cy: 34, r: 22 }, 'boss'),
	].join('');
}

/** A great wheel ghosted behind the register, as on a shop drawing. */
export function ghostWheel(): string {
	const cx = 280;
	const cy = 280;
	const parts = [
		stroked('polygon', { points: gearProfile(cx, cy, 48, 11, 0) }, 'ring'),
		stroked('circle', { cx, cy, r: 232 }, 'ring'),
		stroked('circle', { cx, cy, r: 74 }, 'ring'),
		stroked('circle', { cx, cy, r: 30 }, 'ring'),
	];

	// Six spokes, struck from hub to rim.
	for (let i = 0; i < 6; i += 1) {
		const [x1, y1] = polar(cx, cy, 30, i * 60);
		const [x2, y2] = polar(cx, cy, 232, i * 60);
		parts.push(stroked('line', { x1, y1, x2, y2 }, 'ring'));
	}

	return parts.join('');
}

/** The maker's mark: two wheels in mesh, turning against each other. */
export function makersMark(): string {
	const bigTeeth = 13;
	const smallTeeth = 9;
	const bigX = 15;
	const smallX = bigX + pitchRadius(bigTeeth, SEAL_MODULE) + pitchRadius(smallTeeth, SEAL_MODULE);
	const cy = 17;

	return [
		'<g class="turning" style="--spin:90s">',
		stroked('polygon', { points: gearProfile(bigX, cy, bigTeeth, SEAL_MODULE, 0) }, 'tooth'),
		stroked('circle', { cx: bigX, cy, r: 4 }, 'ring'),
		el('circle', { class: 'mark', cx: bigX, cy, r: 1.6 }),
		'</g>',
		'<g class="turning widdershins" style="--spin:60s">',
		stroked(
			'polygon',
			{ points: gearProfile(smallX, cy, smallTeeth, SEAL_MODULE, 180 / smallTeeth) },
			'tooth',
		),
		stroked('circle', { cx: smallX, cy, r: 3 }, 'ring'),
		'</g>',
	].join('');
}

function escapeAttr(value: string): string {
	return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function escapeText(value: string): string {
	return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * A single ghosted wheel for the margin of a reading page.
 *
 * Same drawing as the register's great wheel, cut smaller. Reading pages get
 * one or two of these out in the gutters — never behind the text, which would
 * cost contrast, and never inside the content itself.
 */
export function marginalWheel(teeth: number, spokes: number): string {
	const centre = 200;
	const module = 380 / teeth;
	const rim = pitchRadius(teeth, module) - module;
	const hub = rim * 0.13;

	const parts = [
		stroked('polygon', { points: gearProfile(centre, centre, teeth, module, 0) }, 'ring'),
		stroked('circle', { cx: centre, cy: centre, r: rim }, 'ring'),
		stroked('circle', { cx: centre, cy: centre, r: rim * 0.32 }, 'ring'),
		stroked('circle', { cx: centre, cy: centre, r: hub }, 'ring'),
	];

	for (let i = 0; i < spokes; i += 1) {
		const [x1, y1] = polar(centre, centre, hub, (i * 360) / spokes);
		const [x2, y2] = polar(centre, centre, rim * 0.32, (i * 360) / spokes);
		parts.push(stroked('line', { x1, y1, x2, y2 }, 'ring'));
	}

	return parts.join('');
}

/** A stable number from a slug, so a page's furniture is the same on every
    build but differs from its neighbours'. */
export function seedFrom(text: string): number {
	let hash = 0;

	for (let i = 0; i < text.length; i += 1) {
		hash = (hash * 31 + text.charCodeAt(i)) % 100000;
	}

	return hash;
}

/**
 * A reading page's margin furniture.
 *
 * One sequence decides the whole page — both margins, every wheel — so no two
 * drawings come out alike and the sides can't be laid out independently and
 * end up mirroring each other. It is seeded from the slug, so a page looks the
 * same on every build and different from its neighbours.
 */

export type Side = 'left' | 'right';

export interface MarginalDrawing {
	side: Side;
	teeth: number;
	spokes: number;
	/** Drawn size in rem. Larger than its track is allowed — see below. */
	size: number;
	/** Clearance in rem from the inner edge of the margin, so wheels don't
	    share an edge and none of them crowds the gauge or the card. */
	inset: number;
	/** Percentage down the text column. */
	top: number;
	opacity: number;
}

const TOOTH_COUNTS = [34, 42, 26, 48];
const SPOKE_COUNTS = [5, 6, 8];

/**
 * Size is absolute, not a fraction of the margin it sits in.
 *
 * As a fraction it tracked the width of its own track, and the two tracks are
 * nothing like each other — the card takes most of the right gutter, so the
 * right-hand track is around a third of the left's. Identical fractions there
 * drew wheels a third the size, faint enough to miss. In rem the two sides draw
 * from one range, so a wheel's size reads as unrelated to which margin it
 * landed in.
 *
 * These deliberately run wider than the margins do. A wheel that overruns is
 * cut off by the edge of the window, which is the point: a drawing that runs
 * off the sheet looks like a sheet that was drawn on, and a page of wheels that
 * all sit comfortably inside their column looks placed. Overrun is only ever
 * outward — see `inset`.
 */
const SIZE_MIN_REM = 12;
const SIZE_MAX_REM = 22;

/** Clearance from the gauge on the left and the index card on the right. The
    wheel grows away from it, so a larger inset means more of the wheel ends up
    off the page. */
const INSET_MIN_REM = 1;
const INSET_MAX_REM = 5;

/** Ghosted linework is decorative, so it is exempt from the contrast floor.
    Varying it is what stops the margins reading as a stamped pattern. */
const OPACITY_MIN = 0.52;
const OPACITY_MAX = 0.8;

/** The band of the text column a wheel may sit in. It runs nearly the whole
    length: stopping at three-quarters left the last screen or so of a long
    article with nothing beside it at all. It still stops short of the very
    bottom, so a wheel is never cut off at the end — a cropped cog reads as a
    rendering fault rather than as a drawing. */
const TOP_MIN = 4;
const TOP_MAX = 92;

/** How far a wheel may wander from its anchor, as a fraction of the space
    between anchors. At 0.4 it moves by a fifth of that gap either way, which
    is enough to look unplanned and still leaves the closest pair three fifths
    of a gap apart. */
const JITTER_SPAN = 0.4;

/** Below this a piece is too short to hang anything beside: the wheels would
    end up level with the colophon rather than with the text. */
const MIN_WORDS = 400;

/** Roughly how much writing earns another wheel. The margins are meant to read
    as sparse, so this is deliberately a long way apart — a 1,400-word article
    carries two or three, not a column of them. */
const WORDS_PER_WHEEL = 600;

const MIN_COUNT = 2;
const MAX_COUNT = 6;

/** Mulberry32. Small, fast, and repeatable from a seed, which is the only
    property that matters here — the arrangement must survive a rebuild. */
function generator(seed: number): () => number {
	let state = seed;

	return () => {
		state = (state + 0x6d2b79f5) | 0;
		let t = Math.imul(state ^ (state >>> 15), 1 | state);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;

		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

function pick<T>(items: T[], random: () => number): T {
	return items[Math.floor(random() * items.length)];
}

function between(min: number, max: number, random: () => number): number {
	return Number((min + random() * (max - min)).toFixed(3));
}

function opposite(side: Side): Side {
	return side === 'left' ? 'right' : 'left';
}

/**
 * Wheels are spread from the top of the band to the bottom, one anchor each,
 * and wander a little around it. The first and last anchors sit at the ends of
 * the band, so however few wheels a page carries, one of them is always down
 * near the end of the read — sparse is not the same as top-heavy, and an
 * earlier version left the last screen of every article bare.
 *
 * The anchors are shared across both margins rather than counted per side: two
 * wheels facing each other at the same height read as a deliberate pair, which
 * is the one arrangement this is trying not to produce.
 */
function wander(index: number, count: number, span: number, random: () => number): number {
	// One-sided at the ends of the band, so a wheel never has to be clamped back
	// onto the bound. Clamping put the first wheel of every page on exactly the
	// same line as the next page's, which is the opposite of the point.
	if (index === 0) {
		return random() * span;
	}

	if (index === count - 1) {
		return -random() * span;
	}

	return (random() - 0.5) * span;
}

function bandTop(index: number, count: number, random: () => number): number {
	const gap = (TOP_MAX - TOP_MIN) / Math.max(count - 1, 1);
	const top = TOP_MIN + index * gap + wander(index, count, gap * JITTER_SPAN, random);

	return Number(top.toFixed(2));
}

export function marginalArrangement(seed: string, words: number): MarginalDrawing[] {
	if (words < MIN_WORDS) {
		return [];
	}

	const random = generator(seedFrom(seed));

	// Length sets the count, and the seed decides whether a page of a given
	// length gets the extra one — so two articles of much the same size don't
	// come out matching.
	const earned = Math.floor(words / WORDS_PER_WHEEL) + Math.floor(random() * 2);
	const total = Math.min(Math.max(earned, MIN_COUNT), MAX_COUNT);

	// Sides alternate from a seeded start, so both margins always carry
	// something and neither collects every wheel. With the tops slotted down
	// the page, alternating reads as a zigzag rather than as a column.
	const first: Side = random() < 0.5 ? 'left' : 'right';

	return Array.from({ length: total }, (_unused, index) => ({
		side: index % 2 === 0 ? first : opposite(first),
		teeth: pick(TOOTH_COUNTS, random),
		spokes: pick(SPOKE_COUNTS, random),
		size: between(SIZE_MIN_REM, SIZE_MAX_REM, random),
		inset: between(INSET_MIN_REM, INSET_MAX_REM, random),
		top: bandTop(index, total, random),
		opacity: between(OPACITY_MIN, OPACITY_MAX, random),
	}));
}
