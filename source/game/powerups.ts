import { Vec2 } from "kaplay"
import { waver } from "../plugins/wave";
import { playSfx } from "../sound";
import { GameState } from "../gamestate";
import { parseAnimation } from "./utils";

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

let spaceBetweenTimers = 65
function getPosBasedOnIndex(index:number, timerSpacing = 65) {
	return (width() + spaceBetweenTimers / 2) - timerSpacing * (index) - timerSpacing;
}

function addTimer(opts:{ sprite: string, type: string }) {
	let timerObj = add([
		sprite("white_noise"),
		pos(0, 40),
		anchor("center"),
		opacity(1),
		rotate(0),
		layer("ui"),
		"putimer",
		`${opts.type}_putimer`,
		{
			index: get("putimer").length,
			updateTime() {
				tween(vec2(1), vec2(1.1), 0.32, (p) => this.scale = p, easings.easeOutQuint).onEnd(() => {
					tween(this.scale, vec2(1), 0.32, (p) => this.scale = p, easings.easeOutElastic)
					tween(-9, 9, 0.15, (p) => this.angle = p, easings.easeOutElastic).onEnd(() => {
						tween(this.angle, 0, 0.32, (p) => this.angle = p, easings.easeOutQuint)
					})
				})
			},
			end() {
				this.tags.forEach(tag => this.unuse(tag));
				tween(this.pos.y, this.pos.y - 40, 0.32, (p) => this.pos.y = p, easings.easeOutQuint)
				tween(1, 0, 0.32, (p) => this.opacity = p, easings.easeOutQuint).onEnd(() => {
					destroy(this)
				})
				
				// gets all timers that have an index greater than the current one (the ones to the left)
				get("putimer").filter(pt => pt.index > this.index).forEach(element => {
					// decreases the index (moves it to the right)
					element.index--
					// moves them accordingly
					tween(element.pos.x, getPosBasedOnIndex(element.index), 0.32, (p) => element.pos.x = p, easings.easeOutQuint)
				});
				// # holy shit im a genius
			},
		}
	])

	tween(30, 40, 0.32, (p) => timerObj.pos.y = p, easings.easeOutQuint)
	tween(90, 0, 0.32, (p) => timerObj.angle = p, easings.easeOutQuint)

	timerObj.pos.x = getPosBasedOnIndex(timerObj.index)

	parseAnimation(timerObj, opts.sprite)

	timerObj.width = 60
	timerObj.height = 60

	// add the text object
	timerObj.add([
		text("", { font: "lambdao", size: timerObj.height / 2 }),
		pos(0, timerObj.height / 2),
		anchor("center"),
		opacity(),
		{
			update() {
				this.opacity = timerObj.opacity
				
				if (powerups[opts.type].removalTime == null) return
				this.text = `${powerups[opts.type].removalTime.toFixed(0)}s\n`
			}
		}
	])
}

export function spawnPowerup(opts:powerupOpt) {
	let powerup = add([
		sprite("white_noise"),
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
					sprite("white_noise"),
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

				parseAnimation(blink, powerups[opts.type].sprite)

				let timeToLeave = 0.75
				blink.loop(timeToLeave / 12, () => {
					if (blink.opacity == blink.maxOpacity) blink.opacity = 0
					else blink.opacity = blink.maxOpacity 
				})
				// tween(0.5, 0, timeToLeave, (p) => blink.maxOpacity = p, easings.easeOutBack)
				blink.wait(timeToLeave, () => {
					destroy(blink)
				})
			},
			click() {
				this.dieAnim()
				playSfx("powerup")
				GameState.stats.powerupsClicked++

				// # multipliers
				let multiplier = 0
				if (!opts.multiplier) {
					if (this.type == "clicks" || this.type == "cursors") multiplier = randi(2, 7)
					else if (this.type == "awesome") multiplier = randi(15, 20)
					else if (this.type == "bad") multiplier = rand(0.15, 0.5)
					else if (this.type == "store") multiplier = rand(0.15, 0.5)
					else if (this.type == "time") multiplier = randi(1, 1)
				}
				else {
					multiplier = 10
				}

				powerups[this.type].multiplier = multiplier

				// # time
				powerups[this.type].removalTime = opts.time || 10
				
				// if there's already a timer don't add a new one!
				let checkTimer = get(`${this.type}_putimer`)[0] 
				if (checkTimer) checkTimer.updateTime()
				else addTimer({ sprite: powerups[powerup.type].sprite, type: this.type}) 
			}
		}
	])

	// other stuff
	parseAnimation(powerup, powerups[opts.type].sprite)
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
				get(`${powerup}_putimer`)?.forEach(timer => timer.end())
				powerups[powerup].multiplier = 1
			}
		}
	}
}