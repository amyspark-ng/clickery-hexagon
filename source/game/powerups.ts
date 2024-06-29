import { Vec2 } from "kaplay"
import { waver } from "../plugins/wave";
import { playSfx } from "../sound";
import { scoreVars } from "./hexagon";

/*
types of powerups
	clicks: makes clicks more powerful
	cursors: makes cursors more powerful
	time: makes cursors click every 0.5 seconds / gives you the score you would have gotten in 10 minutes
	awesome: increases production by a lot
	store: makes everything cheaper
	bad: could have the opposite of the effects before, or could increase them by A LOT
*/

function exPU_Clicks(multiplier: number) {
	scoreVars.pu_ClicksMultiplier = multiplier
}

function edPu_Clicks() {
	scoreVars.pu_ClicksMultiplier = 1
}

function exPU_Cursors() {
}

function exPU_Time() {
}

function exPU_Awesome() {
}

function exPU_Store() {
}

function exPU_Bad() {
}

export let powerupTypes = {
	"clicks": { sprite: "cursors.cursor", execution: exPU_Clicks, reset: edPu_Clicks },
	"cursors": { sprite: "cursors.point", execution: exPU_Cursors, },
	"time": { sprite: "cursors.wait", execution: exPU_Time, },
	"awesome": { sprite: "cursors.check", execution: exPU_Awesome, },
	"store": { sprite: "icon_store", execution: exPU_Store, },
	"bad": { sprite: "icon_about", execution: exPU_Bad, },
}

type powerupOpt = {
	pos: Vec2,
	type: string,
	time: number,
	multiplier: number,
}

export function spawnPowerup(opts:powerupOpt) {
	let spriteName = powerupTypes[opts.type].sprite
	spriteName = spriteName.includes(".") ? spriteName.split(".") : spriteName;

	let powerup = add([
		sprite(typeof spriteName == "string" ? spriteName : spriteName[0]),
		pos(opts.pos),
		scale(3),
		area(),
		anchor("center"),
		opacity(),
		layer("powerups"),
		color(WHITE),
		rotate(0),
		z(0),
		waver({ wave_speed: 1.25, maxAmplitude: 5, minAmplitude: 0 }),
		area(),
		{
			whiteness: 0,
			type: opts.type,
			maxScale: 3,
			update() {
				this.angle = wave(-1, 1, time() * 3)
			},
			startHover() {
				tween(this.scale, vec2(this.maxScale).add(0.2), 0.15, (p) => this.scale = p, easings.easeOutBack)
			},
			endHover() {
				tween(this.scale, vec2(this.maxScale).sub(0.2), 0.15, (p) => this.scale = p, easings.easeOutBack)
			},
			dieAnim() {
				tween(this.scale, vec2(this.maxScale).add(0.4), 0.15, (p) => this.scale = p, easings.easeOutBack)
				tween(this.opacity, 0, 0.15, (p) => this.opacity = p, easings.easeOutBack).onEnd(() => {
					destroy(this)
				})
				
				// little blink shadow
				let blink = add([
					sprite(typeof spriteName == "string" ? spriteName : spriteName[0]),
					pos(this.pos),
					scale(this.scale),
					anchor(this.anchor),
					opacity(0.5),
					layer("powerups"),
					z(this.z - 1),
					timer(),
					{
						maxOpacity: 0.5,
						update() {
							this.pos.y -= 0.5
						}
					}
				])

				if (spriteName[1] && typeof spriteName != "string") blink.play(spriteName[1]);

				let timeToLeave = 0.75
				blink.loop(timeToLeave / 12, () => {
					blink.opacity == blink.maxOpacity ? blink.opacity = 0 : blink.opacity = blink.maxOpacity
				})
				// tween(0.5, 0, timeToLeave, (p) => blink.maxOpacity = p, easings.easeOutBack)
				blink.wait(timeToLeave, () => {
					destroy(blink)
				})
			},
			click() {
				this.dieAnim()
				powerupTypes[this.type].execution(opts.multiplier)
				playSfx("powerup")
			
				wait(opts.time, () => {
					debug.log("powerup ended")
					
					if (powerupTypes[this.type].reset) {
						powerupTypes[this.type].reset()
					}
				})
			}
		}
	])

	// other stuff
	if (spriteName[1] && typeof spriteName != "string") powerup.play(spriteName[1]);
	powerup.startWave()

	// spawn anim
	tween(vec2(powerup.maxScale).sub(0.4), vec2(powerup.maxScale), 0.25, (p) => powerup.scale = p, easings.easeOutBack)
	tween(0, 1, 0.2, (p) => powerup.opacity = p, easings.easeOutBack)

	// events
	powerup.onHover(() => {
		powerup.startHover()
	})

	powerup.onHoverEnd(() => {
		powerup.endHover()
	})

	powerup.onClick(() => {
		powerup.click()
	})
}