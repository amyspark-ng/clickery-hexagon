import { TextCompOpt, Vec2 } from "kaplay"
import { waver } from "../plugins/wave";
import { playSfx } from "../sound";
import { GameState } from "../gamestate";
import { bop, formatNumber, parseAnimation } from "./utils";
import { scoreVars } from "./hexagon";
import { positionSetter } from "../plugins/positionSetter";
import { checkForUnlockable } from "./unlockables";

/*
types of powerups
	clicks: makes clicks more powerful
	cursors: makes cursors more powerful
	time: gives you the score you would have gotten in 1 minutes
	awesome: increases production by a lot
	store: makes everything cheaper
	bad: could have the opposite of the effects before, or could increase them by A LOT
*/

export let powerupTypes = {
	"clicks": { sprite: "cursors.cursor", multiplier: 1, removalTime: null, color: [199, 228, 255] },
	"cursors": { sprite: "cursors.point", multiplier: 1, removalTime: null, color: [199, 252, 197] },
	"time": { sprite: "cursors.wait", multiplier: 1, removalTime: null, color: [247, 242, 193] },
	"awesome": { sprite: "cursors.check", multiplier: 1, removalTime: null, color: [227, 190, 247]} ,
	"store": { sprite: "icon_store", multiplier: 1, removalTime: null, color: [195, 250, 162] },
}

type powerupOpt = {
	type: string;
	pos: Vec2,
	multiplier?: number,
	time?: number,
}

// isn't spaceBetweenTimers same as timerSpacing????????????
let spaceBetweenTimers = 65
function getTimerPos(index:number) {
	return (width() + spaceBetweenTimers / 2) - spaceBetweenTimers * (index) - spaceBetweenTimers;
}

function addTimer(opts:{ sprite: string, type: string }) {
	let timerObj = add([
		rect(60, 60),
		color(WHITE),
		outline(3, BLACK),
		pos(0, 40),
		anchor("center"),
		opacity(1),
		rotate(0),
		layer("ui"),
		area(),
		"putimer",
		`${opts.type}_putimer`,
		{
			index: get("putimer").length,
			updateTime() {
				tween(vec2(1), vec2(1.1), 0.32, (p) => this.scale = p, easings.easeOutQuint).onEnd(() => {
					tween(this.scale, vec2(1), 0.32, (p) => this.scale = p, easings.easeOutElastic)
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
					tween(element.pos.x, getTimerPos(element.index), 0.32, (p) => element.pos.x = p, easings.easeOutQuint)
				});
				// # holy shit im a genius
			},
		}
	])

	tween(30, 40, 0.32, (p) => timerObj.pos.y = p, easings.easeOutQuint)
	tween(90, 0, 0.32, (p) => timerObj.angle = p, easings.easeOutQuint)

	timerObj.pos.x = getTimerPos(timerObj.index)

	// add the text object
	timerObj.add([
		text("", { font: "lambdao", size: timerObj.height / 2 }),
		pos(0, timerObj.height / 2 + 15),
		anchor("center"),
		opacity(),
		z(3),
		{
			update() {
				this.opacity = timerObj.opacity
				
				if (powerupTypes[opts.type].removalTime == null) return
				this.text = `${powerupTypes[opts.type].removalTime.toFixed(0)}s\n`
			}
		}
	])

	timerObj.onClick(() => {
		if (get(`poweruplog_${opts.type}`).length == 0) {
			bop(timerObj)
			addPowerupLog(opts.type)
		}
	})

	let icon = timerObj.add([
		sprite("white_noise"),
		anchor("center"),
		z(1),
		{
			update() {
				this.opacity = timerObj.opacity
			}
		}
	])

	parseAnimation(icon, opts.sprite)

	icon.width = 50
	icon.height = 50

	let maxTime = powerupTypes[opts.type].removalTime

	let round = timerObj.add([
		z(2),
		{
			draw() {
				drawRect({
					width: timerObj.width - timerObj.outline.width,
					height: map(powerupTypes[opts.type].removalTime, 0, maxTime, 0, timerObj.height - timerObj.outline.width),
					color: YELLOW,
					anchor: "bot",
					pos: vec2(0, timerObj.height / 2),
					opacity: 0.25,
				})
			}
		}
	])
}

export function addPowerupLog(powerupType) {
	let powerupTime = powerupTypes[powerupType].removalTime
	let textInText = ""

	let bgOpacity = 0.95
	let bg = add([
		rect(300, 100, { radius: 5 }),
		pos(center().x, height() - 100),
		color(BLACK.lighten(2)),
		positionSetter(),
		anchor("center"),
		layer("powerups"),
		opacity(bgOpacity),
		z(1),
		`poweruplog_${powerupType}`,
		{
			draw() {
				// drawSprite({
				// 	sprite: "hexagon",
				// 	scale: vec2(0.5),
				// 	pos: vec2(-bg.width, -bg.height),
				// 	color: Color.fromArray(powerups[powerupType].color),
				// })
			}
		}
	])

	let textInBgOpts = { size: 25, align: "center", width: 300 } 
	let textInBg = bg.add([
		text("", textInBgOpts as TextCompOpt),
		pos(0, 0),
		anchor("center"),
		area(),
		opacity(),
		{
			update() {
				if (powerupTypes[powerupType].removalTime == null) {powerupTime = 0; return}
				powerupTime = Math.round(powerupTypes[powerupType].removalTime)
				let powerupMultiplier = powerupTypes[powerupType].multiplier

				if (powerupType == "clicks") textInText = `Click production increased x${powerupMultiplier} for ${powerupTime} secs`
				else if (powerupType == "cursors") textInText = `Cursors production increased x${powerupMultiplier} for ${powerupTime} secs`
				else if (powerupType == "time") {
					textInText = `+${formatNumber(scoreVars.autoScorePerSecond * 60)}, the score you would have gained in 1 minute`
				}
				else if (powerupType == "awesome") textInText = `Score production increased by x${powerupMultiplier} for ${powerupTime}, AWESOME!!`
				else if (powerupType == "store") textInText = `Store prices have a discount of ${Math.round(powerupMultiplier * 100)}% for ${powerupTime} secs, get em' now!`
				else textInText = "errm what the sigma"

				this.text = textInText
			}
		}
	])

	bg.onUpdate(() => {
		bg.width = 315
		bg.height = formatText({ text: textInText, ...textInBgOpts as TextCompOpt }).height + 15
	})

	tween(0, bgOpacity, 0.5, (p) => bg.opacity = p, easings.easeOutQuad)
	tween(height() + bg.height, height() - bg.height, 0.5, (p) => bg.pos.y = p, easings.easeOutQuad)

	wait(2.5, () => {
		tween(bg.pos.y, bg.pos.y - bg.height, 0.5, (p) => bg.pos.y = p, easings.easeOutQuad)
		bg.fadeOut(0.5).onEnd(() => destroy(bg))
		tween(textInBg.opacity, 0, 0.5, (p) => textInBg.opacity = p, easings.easeOutQuad)
	})
}

export function spawnPowerup(opts:powerupOpt) {
	let powerupObj = add([
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

				parseAnimation(blink, powerupTypes[opts.type].sprite)

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
				checkForUnlockable()
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

				powerupTypes[this.type].multiplier = multiplier

				// # time
				powerupTypes[this.type].removalTime = opts.time || 10
				
				// if there's already a timer don't add a new one!
				let checkTimer = get(`${this.type}_putimer`)[0] 
				if (checkTimer) checkTimer.updateTime()
				else addTimer({ sprite: powerupTypes[powerupObj.type].sprite, type: this.type}) 
			}
		}
	])

	// other stuff
	parseAnimation(powerupObj, powerupTypes[opts.type].sprite)
	powerupObj.startWave()

	// spawn anim
	tween(vec2(powerupObj.maxScale).sub(0.4), vec2(powerupObj.maxScale), 0.25, (p) => powerupObj.scale = p, easings.easeOutBack)
	tween(0, 1, 0.2, (p) => powerupObj.opacity = p, easings.easeOutBack)

	// events
	powerupObj.onHover(() => {
		powerupObj.startHover()
	})

	powerupObj.onHoverEnd(() => {
		powerupObj.endHover()
	})

	powerupObj.onClick(() => {
		powerupObj.click()
		addPowerupLog(powerupObj.type)
	})
}

export function powerupManagement() {
	for (let powerup in powerupTypes) {
		if (powerupTypes[powerup].removalTime != null) {
			powerupTypes[powerup].removalTime -= dt()
		
			if (powerupTypes[powerup].removalTime < 0) {
				powerupTypes[powerup].removalTime = null
				get(`${powerup}_putimer`)?.forEach(timer => timer.end())
				powerupTypes[powerup].multiplier = 1
			}
		}
	}
}