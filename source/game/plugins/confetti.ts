// # found in kaplay examples

import { Color, Vec2 } from "kaplay"

const DEF_COUNT = 80
const DEF_GRAVITY = 800
const DEF_AIR_DRAG = 0.9
const DEF_VELOCITY = [1000, 4000]
const DEF_ANGULAR_VELOCITY = [-200, 200]
const DEF_FADE = 0.3
const DEF_SPREAD = 60
const DEF_SPIN = [2, 8]
const DEF_SATURATION = 0.7
const DEF_LIGHTNESS = 0.6

type confettiOpt = {
	count?: number
	gravity?: number
	pos: Vec2
	airDrag?: number
	velocity?: number,
	angularVelocity?: number,
	color?: Color
	heading?: number
	spread?: number
	fade?: number
	spin?: number
	saturation?: number
	lightness?: number
}

export function addConfetti(opt:confettiOpt) {
	const sample = (s) => typeof s === "function" ? s() : s
	for (let i = 0; i < (opt.count ?? DEF_COUNT); i++) {
		const p = add([
			pos(sample(opt.pos ?? vec2(0, 0))),
			choose([
				rect(rand(5, 20), rand(5, 20)),
				circle(rand(3, 10)),
			]),
			color(sample(opt.color ?? hsl2rgb(rand(0, 1), DEF_SATURATION, DEF_LIGHTNESS))),
			opacity(1),
			lifespan(4),
			scale(1),
			anchor("center"),
			rotate(rand(0, 360)),
		])
		const spin = rand(DEF_SPIN[0], DEF_SPIN[1])
		const gravity = opt.gravity ?? DEF_GRAVITY
		const airDrag = opt.airDrag ?? DEF_AIR_DRAG
		const heading = sample(opt.heading ?? 0) - 90
		const spread = opt.spread ?? DEF_SPREAD
		const head = heading + rand(-spread / 2, spread / 2)
		const fade = opt.fade ?? DEF_FADE
		const vel = sample(opt.velocity ?? rand(DEF_VELOCITY[0], DEF_VELOCITY[1]))
		let velX = Math.cos(deg2rad(head)) * vel
		let velY = Math.sin(deg2rad(head)) * vel
		const velA = sample(opt.angularVelocity ?? rand(DEF_ANGULAR_VELOCITY[0], DEF_ANGULAR_VELOCITY[1]))
		p.onUpdate(() => {
			velY += gravity * dt()
			p.pos.x += velX * dt()
			p.pos.y += velY * dt()
			p.angle += velA * dt()
			p.opacity -= fade * dt()
			velX *= airDrag
			velY *= airDrag
			p.scale.x = wave(-1, 1, time() * spin)
		})
	}
}

type extraOpts = {
	sprite: string,
	layer: string,
	z: number,
}

export function makeSmallParticles(opts:confettiOpt & extraOpts) {
	opts = opts || {} as confettiOpt & extraOpts

	opts.count = opts.count ?? 30
	opts.pos = opts.pos ?? vec2(0, 0)
	opts.color = opts.color ?? WHITE
	opts.sprite = opts.sprite ?? "part_star"
	opts.layer = opts.layer ?? "background"
	opts.z = opts.z ?? 1
	
	for (let i = 0; i < (opts.count ?? DEF_COUNT); i++) {
		const p = add([
			sprite(opts.sprite),
			pos(opts.pos),
			color(opts.color),
			opacity(1),
			lifespan(4),
			scale(1),
			z(opts.z),
			layer(opts.layer),
			anchor("center"),
			rotate(rand(0, 360)),
		])
		const spin = rand(DEF_SPIN[0], DEF_SPIN[1])
		const gravity = opts.gravity ?? DEF_GRAVITY
		const airDrag = opts.airDrag ?? DEF_AIR_DRAG
		const heading = opts.heading ?? -90
		const spread = opts.spread ?? DEF_SPREAD
		const head = heading + rand(-spread / 2, spread / 2)
		const fade = opts.fade ?? DEF_FADE
		const vel = opts.velocity
		let velX = Math.cos(deg2rad(head)) * vel
		let velY = Math.sin(deg2rad(head)) * vel
		const velA = opts.angularVelocity
		p.onUpdate(() => {
			velY += gravity * dt()
			p.pos.x += velX * dt()
			p.pos.y += velY * dt()
			p.angle += velA * dt()
			p.opacity -= fade * dt()
			velX *= airDrag
			velY *= airDrag
			p.scale.x = wave(-1, 1, time() * spin)
		})
	}
}