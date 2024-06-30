import { Vec2 } from "kaplay"
import { waver } from "../plugins/wave";
import { playSfx } from "../sound";

/*
types of powerups
	clicks: makes clicks more powerful
	cursors: makes cursors more powerful
	time: makes cursors click every 0.5 seconds / gives you the score you would have gotten in 10 minutes
	awesome: increases production by a lot
	store: makes everything cheaper
	bad: could have the opposite of the effects before, or could increase them by A LOT
*/

export let powerups = {
	"clicks": { sprite: "cursors.cursor", multiplier: 1, removalTime: null, color: [199, 228, 255] },
	"cursors": { sprite: "cursors.point", multiplier: 1, removalTime: null, color: [199, 252, 197] },
	"time": { sprite: "cursors.wait", multiplier: 1, removalTime: null, color: [247, 242, 193] },
	"awesome": { sprite: "cursors.check", multiplier: 1, removalTime: null, color: [227, 190, 247]} ,
	"store": { sprite: "icon_store", multiplier: 1, removalTime: null, color: [195, 250, 162] },
	"bad": { sprite: "icon_about", multiplier: 1, removalTime: null, color: [250, 178, 162] },
}

type powerupOpt = {
	type: string;
	pos: Vec2,
	multiplier?: number,
	time?: number,
}

export function spawnPowerup(opts:powerupOpt) {
	let spriteName = powerups[opts.type].sprite
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
			addTimer() {
				let thisPowerup = this
				let timer = add([
					text(""),
					pos(this.pos),
					anchor("center"),
					"poweruptimer",
					`${this.type}_putimer`,
					{
						update() {
							if (powerups[thisPowerup.type].removalTime != null) {
								this.text = `${thisPowerup.type}:` + powerups[thisPowerup.type].removalTime.toFixed(1)
							}
						}
					}
				])
			},
			click() {
				this.dieAnim()
				playSfx("powerup")
			
				// # multipliers
				let multiplier = 0
				if (!opts.multiplier) {
					if (this.type == "clicks" || this.type == "cursors") multiplier = randi(2, 7)
					else if (this.type == "awesome") multiplier = randi(15, 20)
					else if (this.type == "bad") multiplier = rand(0.15, 0.5)
					else if (this.type == "store") multiplier = rand(0.15, 0.5)
					else if (this.type == "time") multiplier = rand(1, 1)
				}
				else {
					multiplier = 10
				}

				powerups[this.type].multiplier = multiplier

				// # time
				powerups[this.type].removalTime = opts.time || 10
				// if there's already a timer don't add a new one!
				if (get(`${this.type}_putimer`).length == 0) this.addTimer() 
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

export function powerupManagement() {
	for (let powerup in powerups) {
		if (powerups[powerup].removalTime != null) {
			powerups[powerup].removalTime -= dt()
		
			if (powerups[powerup].removalTime < 0) {
				powerups[powerup].removalTime = null
				get(`${powerup}_putimer`)?.forEach(timer => timer.destroy())
				powerups[powerup].multiplier = 1
			}
		}
	}
}