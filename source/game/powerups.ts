import { TextCompOpt, Vec2 } from "kaplay"
import { waver } from "./plugins/wave";
import { playSfx } from "../sound";
import { GameState, scoreManager } from "../gamestate";
import { bop, formatMusicTime, formatNumber, getPosInGrid, parseAnimation, randomPos, randomPowerup } from "./utils";
import { positionSetter } from "./plugins/positionSetter";
import { checkForUnlockable } from "./unlockables/achievements";
import { ascension } from "./ascension/ascension";

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

export type powerup = keyof typeof powerupTypes

type powerupOpt = {
	type: powerup;
	pos: Vec2,
	multiplier?: number,
	time?: number,
}

let timerSpacing = 65
function getTimerPos(index:number) {
	let initialPos = vec2(width() + timerSpacing / 2)
	return getPosInGrid(initialPos, 0, -index - 1, vec2(timerSpacing, 0))
}

function addTimer(opts:{ sprite: string, type: string }) {
	let timerObj = add([
		rect(60, 60),
		color(WHITE),
		outline(3, BLACK),
		pos(0, 40),
		anchor("center"),
		opacity(1),
		scale(),
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

	timerObj.pos = getTimerPos(timerObj.index)

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
					textInText = `+${formatNumber(scoreManager.autoScorePerSecond() * powerupTime)}, the score you would have gained in ${powerupTime} secs`
				}
				else if (powerupType == "awesome") textInText = `Score production increased by x${powerupMultiplier} for ${powerupTime}, AWESOME!!`
				else if (powerupType == "store") textInText = `Store prices have a discount of ${Math.round(powerupMultiplier * 100)}% for ${powerupTime} secs, get em' now!`
				else throw new Error("powerup type doesn't exist");

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

export function spawnPowerup(opts?:powerupOpt) {
	if (ascension.ascending == true) return
	if (opts == undefined) opts = {} as powerupOpt 

	opts.type = opts.type || randomPowerup()
	opts.pos = opts.pos || randomPos()

	if (opts.type == "time") {
		opts.time = opts.time || 60
	}

	else opts.time = opts.time || 10

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
				loop(0.1, () => {
					if (blink.opacity == blink.maxOpacity) blink.opacity = 0
					else blink.opacity = blink.maxOpacity 
				})
				tween(0.5, 0, timeToLeave, (p) => blink.maxOpacity = p, easings.easeOutBack)
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
				let time = 0

				const power = GameState.powerupPower

				if (opts.multiplier == null) {
					if (opts.type == "clicks" || opts.type == "cursors") {
						multiplier = randi(2, 7) * power
					}
					
					else if (opts.type == "awesome") {
						multiplier = randi(15, 20) * power
					}

					else if (opts.type == "time") {
						multiplier = 1
						time = opts.time ?? 60 * power
						scoreManager.addTweenScore(scoreManager.scorePerSecond() * opts.time)
					}

					else if (opts.type == "store") {
						multiplier = rand(0.15, 0.5) / power * 0.75
						// multiplied by 0.75 so it's not too op
					}
				}

				if (opts.type != "time") {
					// if there's already a timer don't add a new one!
					let checkTimer = get(`${opts.type}_putimer`)[0] 
					if (checkTimer) checkTimer.updateTime()
					else addTimer({ sprite: powerupTypes[powerupObj.type].sprite, type: opts.type}) 
				}

				powerupTypes[opts.type].multiplier = multiplier
				powerupTypes[opts.type].removalTime = opts.time
				
				addPowerupLog(opts.type)
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
	})

	// particles
	// let shimmer = add([
	// 	anchor("center"),
	// 	pos(powerupObj.pos),
	// 	particles({
	// 		max: 20,
	// 		speed: [50, 100],
	// 		angle: [0, 360],
	// 		angularVelocity: [45, 90],
	// 		lifeTime: [1.0, 1.5],
	// 		colors: [WHITE],
	// 		opacities: [0.1, 1.0, 0.0],
	// 		texture: getSprite("hexagon").data.tex,
	// 		quads: [getSprite("hexagon").data.frames[0]],
	// 	}, {
	// 		lifetime: 1.5,
	// 		rate: 1,
	// 		direction: 90,
	// 		spread: 10,
	// 	}),
	// ])

	// // let shimmerLoop = loop(0.5, () => {
	// 	shimmer.emit(randi(5, 10))
	// // })

	// shimmer.onDestroy(() => {
	// 	// shimmerLoop.cancel()
	// })

}

export function powerupManagement() {
	for (let powerup in powerupTypes) {
		if (powerupTypes[powerup].removalTime != null) {
			if (powerup != "time") powerupTypes[powerup].removalTime -= dt()
			
			if (powerupTypes[powerup].removalTime < 0) {
				powerupTypes[powerup].removalTime = null
				get(`${powerup}_putimer`)?.forEach(timer => timer.end())
				powerupTypes[powerup].multiplier = 1
			}
		}
	}
}