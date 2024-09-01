import { TextCompOpt, Vec2 } from "kaplay"
import { waver } from "./plugins/wave";
import { playSfx } from "../sound";
import { GameState, scoreManager } from "../gamestate";
import { arrToColor, bop, formatNumber, formatTime, getPosInGrid, getPositionOfSide, parseAnimation, randomPos } from "./utils";
import { positionSetter } from "./plugins/positionSetter";
import { checkForUnlockable } from "./unlockables/achievements";
import { outsideWindowHover } from "./hovers/outsideWindowHover";
import { addTooltip } from "./additives";

class Powerup {
	sprite: string;
	/**
	 * Time that its left for it to be removed, if it's null it means it's not active
	 */
	removalTime: null | number;
	/**
	 * Time it's running to check for max time and then chance
	 */
	runningTime: number;
	/**
	 * Time it takes to rethink chance
	 */
	maxTime: number;
	/**
	 * Chance it has of appearing when maxTime is ran (from 0 to 1)
	 */
	chance: number;
	/**
	 * The multiplier the powerup is currently running
	 */
	multiplier: number;
	/**
	 * Just a color
	 */
	color?: [number, number, number];

	// DON'T DELETE SPRITE!!!!!! needed for powerup logs
	constructor(sprite:string, maxTime: number, chance: number, color?: [number, number, number], runningTime?:number, multiplier?:number) {
		this.sprite = sprite;
		this.maxTime = maxTime;
		this.chance = chance;
		this.color = color || [255, 255, 255]
		this.runningTime = runningTime || 0
		this.multiplier = multiplier || 1
	}
}

export const powerupTypes = {
	/**
	 * Makes clicks more powerful
	 */
	"clicks": new Powerup("cursors.cursor", 80, 0.15, [66, 144, 245]),
	/**
	 * Makes cursors more powerful
	 */
	"cursors": new Powerup("cursors.point", 60, 0.2, [35, 232, 64]),
	/**
	 * Gives you the score you would have gotten in X amount of time
	 */
	"time": new Powerup("cursors.wait", 60, 0.45, [232, 199, 35]),
	/**
	 * Increses production
	 */
	"awesome": new Powerup("cursors.check", 120, 0.30, [162, 60, 240]),
	/**
	 * Gives discounts for clickers and cursors
	 */
	"store": new Powerup("icon_store", 90, 0.45, [87, 214, 51]),
	/**
	 * Is just silly, very silly
	 */
	"blab": new Powerup("panderito", 20, 0.15, [214, 154, 51]),
}

const blabPhrases = [
	"Test powerup",
	"Despite a text saying test powerup\nThis was the last powerup implemented",
	"lol!",
	"Hexagoning since march 2024",
	"Also try Cookie Clicker!",
	"Orteil don't sue me",
	"Area of an hexagon:\nA = (p * 2) / 2",
	"Yummers",
	"Enjoying the game so far?",
	"These sometimes explain things things i was lazy enough to code an explanation for",
	"Did you know?\nYou can hold to drag the buttons in your taskbar around!",
	"Did you know?\nYou can hold and drag the buttons in the extra window\nto your taskbar!",
	"Did you know?\nYou can hold your mouse when buying!",
	"Did you know?\nYou can hold shift to bulk-buy 10x things!",
	"Did you know?\nYou can click the big hexagon several times\nto start a combo!",
	"Did you know?\nThe game has support for displaying numbers up until Vigintillions!",
	"Did you know?\nYou can press Shift + R to restart the game's scene",
	"Did you know?\nYou can press Shift + C to save your game",
	"Did you know?\nYou can press F2 to remove all toasts/logs",
]

export type powerupName = keyof typeof powerupTypes | "random";

type powerupOpt = {
	type: powerupName;
	pos?: Vec2,
	multiplier?: number,
	time?: number,
	natural?: boolean,
}

let timerSpacing = 70
function getTimerXPos(index:number) : number {
	let initialPos = vec2(width() + timerSpacing / 2)
	return getPosInGrid(initialPos, 0, -index - 1, vec2(timerSpacing, 0)).x
}

function addTimer(type:powerupName) {
	const powerupColor = arrToColor(powerupTypes[type].color)

	let timerSprite = add([
		sprite(`${type}Powerup`),
		color(WHITE),
		pos(0, 40),
		anchor("center"),
		opacity(1),
		scale(),
		rotate(0),
		layer("ui"),
		color(),
		area(),
		z(0),
		"putimer",
		`${type}_putimer`,
		{
			index: get("putimer").length,
			updateTime() {
				tween(vec2(1), vec2(1.1), 0.32, (p) => this.scale = p, easings.easeOutQuint).onEnd(() => {
					tween(this.scale, vec2(1), 0.32, (p) => this.scale = p, easings.easeOutQuint)
				})
				tween(powerupColor, WHITE, 1, (p) => timerSprite.color = p, easings.easeOutQuint)
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
					tween(element.pos.x, getTimerXPos(element.index), 0.32, (p) => element.pos.x = p, easings.easeOutQuint)
				});
				// # holy shit im a genius
			},
		}
	])

	timerSprite.angle = -10
	timerSprite.width = timerSpacing + 5
	timerSprite.height = timerSpacing + 5
	timerSprite.pos.x = width() + timerSpacing
	
	let tooltip = addTooltip(timerSprite, {
		text: "",
		direction: "down",
		layer: "ui",
		z: timerSprite.z - 1,
	})
	
	tween(timerSprite.pos.x, getTimerXPos(timerSprite.index), 0.32, (p) => timerSprite.pos.x = p, easings.easeOutBack).onEnd(() => {
		tween(timerSprite.angle, 0, 0.32, (p) => timerSprite.angle = p, easings.easeOutQuint)
	})
	tween(powerupColor, WHITE, 1, (p) => timerSprite.color = p, easings.easeOutQuint)
	tween(30, 40, 0.32, (p) => timerSprite.pos.y = p, easings.easeOutQuint)
	tween(90, 0, 0.32, (p) => timerSprite.angle = p, easings.easeOutQuint)

	timerSprite.onUpdate(() => {
		tooltip.changePos(vec2(timerSprite.pos.x, (timerSprite.pos.y + timerSprite.height / 2) + 5))
		tooltip.tooltipBg.opacity = timerSprite.opacity
		tooltip.tooltipText.opacity = timerSprite.opacity
		
		if (powerupTypes[type].removalTime == null) return
		tooltip.tooltipText.text = `${powerupTypes[type].removalTime.toFixed(0)}s` 
	})

	timerSprite.onClick(() => {
		if (get(`poweruplog_${type}`).length == 0) {
			bop(timerSprite)
			addPowerupLog(type)
		}
	})

	let maxTime = powerupTypes[type].removalTime
}

export function addPowerupLog(powerupType:powerupName) {
	function getPosForPowerupLog(index:number) {
		return getPosInGrid(vec2(center().x, height() - 100), -index, 0, vec2(300, 100))
	}
	
	let powerupTime = powerupTypes[powerupType].removalTime
	let textInText = ""

	if (powerupType == "blab") textInText = choose(blabPhrases)

	const bgOpacity = 0.95
	let bg = add([
		rect(0, 0, { radius: 0 }),
		pos(center().x, height() - 100),
		color(BLACK.lighten(2)),
		positionSetter(),
		anchor("center"),
		layer("powerups"),
		opacity(bgOpacity),
		z(1),
		"poweruplog",
		`poweruplog_${powerupType}`,
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
				powerupTime = Math.round(parseFloat(powerupTypes[powerupType].removalTime.toFixed(1)))
				
				let stringPowerupTime = formatTime(powerupTime, true)
				let powerupMultiplier = powerupTypes[powerupType].multiplier

				if (powerupType == "clicks") textInText = `Click production increased x${powerupMultiplier} for ${stringPowerupTime}`
				else if (powerupType == "cursors") textInText = `Cursors production increased x${powerupMultiplier} for ${stringPowerupTime}`
				else if (powerupType == "time") {
					textInText = `+${formatNumber(Math.round(scoreManager.autoScorePerSecond()) * powerupTime)}, the score you would have gained in ${stringPowerupTime}`
				}
				else if (powerupType == "awesome") textInText = `Score production increased by x${powerupMultiplier} for ${stringPowerupTime}, AWESOME!!`
				else if (powerupType == "store") {
					const discount = 100 - Math.round(powerupMultiplier * 100)
					textInText = `Store prices have a discount of ${discount}% for ${stringPowerupTime}, get em' now!`
				}
				else if (powerupType == "blab") textInText = textInText
				
				else throw new Error("powerup type doesn't exist");

				this.text = textInText
			}
		}
	])

	let icon = bg.add([
		sprite("white_noise"),
		pos(textInBg.pos.x - textInBg.width / 2 - 15, textInBg.pos.y),
		anchor("center"),
		opacity(),
		{
			update() {
				this.opacity = bg.opacity
			}
		}
	])

	parseAnimation(icon, powerupTypes[powerupType].sprite)
	icon.width = 35
	icon.height = 35

	let index = get("poweruplog").length - 1
	let destinedPos = getPosForPowerupLog(index)

	bg.onUpdate(() => {
		let radius = 5
		let textWidth = textInBg.width + icon.width * 2
		let textHeight = formatText({ text: textInText, ...textInBgOpts as TextCompOpt }).height + 15
		if (textHeight < 50) textHeight = 50
		
		bg.height = lerp(bg.height, textHeight, 0.5)
		bg.width = lerp(bg.width, textWidth, 0.5)
		bg.radius = lerp(bg.radius, radius, 0.5)
	})

	tween(0, bgOpacity, 0.5, (p) => bg.opacity = p, easings.easeOutQuad)
	tween(height() + bg.height, destinedPos.y, 0.5, (p) => bg.pos.y = p, easings.easeOutQuad)

	wait(3.5, () => {
		tween(bg.pos.y, bg.pos.y - bg.height, 0.5, (p) => bg.pos.y = p, easings.easeOutQuad)
		bg.fadeOut(0.5).onEnd(() => destroy(bg))
		tween(textInBg.opacity, 0, 0.5, (p) => textInBg.opacity = p, easings.easeOutQuad)
		bg.unuse("poweruplog")
	})
}

export let allPowerupsInfo = {
	isHoveringAPowerup: false,
	canSpawnPowerups: false,
}

export function spawnPowerup(opts?:powerupOpt) {
	if (allPowerupsInfo.canSpawnPowerups == false) return
	if (opts == undefined) opts = {} as powerupOpt 

	function getRandomPowerup() : powerupName {
		// this doesn't include random of course
		let list = Object.keys(powerupTypes)
		
		if (Math.round(scoreManager.autoScorePerSecond()) < 1 || GameState.cursors < 1) list.splice(list.indexOf("time"), 1)
		if (opts.natural == false) list.splice(list.indexOf("awesome"), 1)
		else list.splice(list.indexOf("blab"), 1)

		let element = choose(list) as powerupName
		if (chance(0.2) && opts.natural == true) element = "blab"
		
		return element;
	}

	opts.type = opts.type
	if (opts.type == "random") opts.type = getRandomPowerup()
	const powerupColor = arrToColor(powerupTypes[opts.type].color)
	// was struggling because this returned undefined but then i realized it's because the type was random lol!

	opts.pos = opts.pos || randomPos()

	const hoverScale = vec2(1.1)

	let powerupObj = add([
		sprite(`${opts.type}Powerup`),
		pos(opts.pos),
		scale(),
		area(),
		anchor("center"),
		opacity(),
		layer("powerups"),
		color(WHITE),
		rotate(0),
		z(0),
		waver({ wave_speed: 1.25, maxAmplitude: 5, minAmplitude: 0 }),
		area(),
		timer(),
		"powerup",
		{
			type: opts.type,
			update() {
				this.angle = wave(-1, 1, time() * 3)
			},
			startHover() {
				tween(this.scale, hoverScale, 0.15, (p) => this.scale = p, easings.easeOutCubic)
			},
			endHover() {
				tween(this.scale, vec2(1), 0.15, (p) => this.scale = p, easings.easeOutCubic)
			},
			dissapear() {
				this.loop(0.1, () => {
					let maxOpacity = 1

					if (this.opacity == maxOpacity) {this.opacity = 0; maxOpacity -= 0.1}
					else if (this.opacity == 0) this.opacity = maxOpacity
				})
				this.wait(1, () => {
					this.area.scale = vec2(0)
					tween(this.opacity, 0, 0.15, (p) => this.opacity = p).onEnd(() => this.destroy())
				})
			},
			clickAnim() {
				this.area.scale = vec2(0)
				tween(this.scale, hoverScale, 0.15, (p) => this.scale = p, easings.easeOutCubic)
				tween(this.opacity, 0, 0.15, (p) => this.opacity = p, easings.easeOutCubic).onEnd(() => {
					destroy(this)
				})
				
				// little blink shadow
				let maxOpacity = 0.5
				let blink = add([
					sprite(this.type + "Powerup"),
					pos(this.pos),
					scale(this.scale),
					anchor(this.anchor),
					opacity(0.5),
					color(),
					layer("powerups"),
					z(this.z - 1),
					timer(),
				])

				blink.onUpdate(() => {
					blink.scale = this.scale
					blink.width = this.width
					blink.height = this.height
					blink.pos.y -= 0.5
				})

				let timeToLeave = 0.75
				tween(blink.color, powerupColor, timeToLeave, (p) => blink.color = p, easings.easeOutBack)
				tween(blink.opacity, 0, timeToLeave, (p) => blink.opacity = p, easings.easeOutBack)
				blink.wait(timeToLeave, () => {
					destroy(blink)
					// was going to add a second shimmer but got lazy
				})
			},
			click() {
				this.clickAnim()
				playSfx("powerup", { detune: rand(-35, 35) })
				checkForUnlockable()
				GameState.stats.powerupsClicked++

				// # multipliers
				let multiplier = 0
				let time = 0

				// getAdditive
				if (opts.multiplier == null) {
					if (opts.type == "clicks" || opts.type == "cursors") {
						time += opts.time ?? randi(15, 30)
						multiplier = rand(1.5, 3) * GameState.powerupPower
					}
					
					// op powerups
					else if (opts.type == "awesome") {
						time += opts.time ?? randi(10, 15)
						multiplier = randi(4, 8) * GameState.powerupPower
					}

					else if (opts.type == "store") {
						time += opts.time ?? randi(10, 15)
						multiplier = rand(0.85, 0.9) / GameState.powerupPower
					}

					// patience
					else if (opts.type == "time") {
						multiplier = 1
						time += opts.time ?? rand(30, 60) * GameState.powerupPower
						scoreManager.addTweenScore(scoreManager.scorePerSecond() * time)
					}

					// lol!
					else if (opts.type == "blab") {
						multiplier = 1
						time = 1
						scoreManager.addScore(1)
					}
				}

				if (opts.type == "clicks" || opts.type == "cursors" || opts.type == "store" || opts.type == "awesome") {
					// if there's already a timer don't add a new one!
					let checkTimer = get(`${opts.type}_putimer`)[0] 
					if (checkTimer) checkTimer.updateTime()
					else addTimer(opts.type) 
				}

				multiplier = parseFloat(multiplier.toFixed(1))

				powerupTypes[opts.type].multiplier = multiplier
				powerupTypes[opts.type].removalTime = time
				
				addPowerupLog(opts.type)
			}
		}
	])

	// other stuff
	powerupObj.startWave()

	// spawn anim
	tween(vec2(hoverScale).sub(0.4), hoverScale, 0.25, (p) => powerupObj.scale = p, easings.easeOutBack)
	tween(0, 1, 0.2, (p) => powerupObj.opacity = p, easings.easeOutBack)

	// events
	powerupObj.onHover(() => {
		powerupObj.startHover()
	
		query({
			include: ["insideHover", "outsideHover"],
			includeOp: "or",
		}).forEach((obj) => {
			if (obj.isBeingHovered == true) {
				obj.endHoverFunction()
			}
		})
	})

	powerupObj.onHoverEnd(() => {
		powerupObj.endHover()

		query({
			include: ["insideHover", "outsideHover"],
			includeOp: "or",
		}).forEach((obj) => {
			if (obj.isHovering() == true && obj.isBeingHovered == false) {
				obj.startHoverFunction()
			}
		})
	})

	powerupObj.onClick(() => {
		powerupObj.click()
	})

	powerupObj.wait(20, () => {
		powerupObj.dissapear()
	})

	powerupObj.loop(0.5, () => {
		let shimmer = add([
			layer(powerupObj.layer),
			z(powerupObj.z - 1),
			pos(powerupObj.pos),
			opacity(1),
			timer(),
			particles({
				max: 20,
				speed: [50, 100],
				angle: [0, 360],
				angularVelocity: [45, 90],
				lifeTime: [1, 2],
				scales: [0.7, 1],
				colors: [powerupColor, powerupColor.darken(25), powerupColor.lighten(100)],
				opacities: [0.1, 1.0, 0.0],
				texture: getSprite("part_star").data.tex,
				quads: [getSprite("part_star").data.frames[0]],
			}, {
				lifetime: 1.5,
				rate: 0,
				direction: 90,
				spread: 20,
			})
		])

		shimmer.emit(randi(2, 4))
		shimmer.onEnd(() => shimmer.destroy())
	})
}

/**
 * Manages the removal time of powerups, which is the amount of time they have after being activated
 */
export function Powerup_RemovalTimeManager() {
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

	// this runs on update, it's fine putting isHoveringAPowerup behaviour here
	if ((get("powerup").length > 0)) {
		// use isHovering and not isBeingHovered because powerups are on top of everything
		allPowerupsInfo.isHoveringAPowerup = get("powerup").some((powerup) => powerup.isHovering())
	}
}

/**
 * Manages the natural spawning of powerups
 */
export function Powerup_NaturalSpawnManager() {
	for (let powerup in powerupTypes) {
		powerupTypes[powerup].runningTime += dt()

		if (powerupTypes[powerup].runningTime > powerupTypes[powerup].maxTime) {
			powerupTypes[powerup].runningTime = 0

			if (chance(powerupTypes[powerup].chance)) {
				powerupTypes[powerup].maxTime += rand(-5, 5)
				spawnPowerup({
					type: powerup as powerupName,
				})
			}
		}
	}
}