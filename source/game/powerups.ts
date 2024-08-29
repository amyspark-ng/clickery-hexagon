import { TextCompOpt, Vec2 } from "kaplay"
import { waver } from "./plugins/wave";
import { playSfx } from "../sound";
import { GameState, scoreManager } from "../gamestate";
import { bop, formatNumber, formatTime, getPosInGrid, getPositionOfSide, parseAnimation, randomPos } from "./utils";
import { positionSetter } from "./plugins/positionSetter";
import { checkForUnlockable } from "./unlockables/achievements";
import { outsideWindowHover } from "./hovers/outsideWindowHover";

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

	constructor(sprite:string, maxTime: number, chance: number, runningTime?:number, multiplier?:number) {
		this.sprite = sprite;
		this.maxTime = maxTime;
		this.chance = chance;
		this.runningTime = runningTime || 0
		this.multiplier = multiplier || 1
	}
}

export let powerupTypes = {
	/**
	 * Makes clicks more powerful
	 */
	"clicks": new Powerup("cursors.cursor", 80, 0.15),
	/**
	 * Makes cursors more powerful
	 */
	"cursors": new Powerup("cursors.point", 60, 0.2),
	/**
	 * Gives you the score you would have gotten in X amount of time
	 */
	"time": new Powerup("cursors.wait", 60, 0.45),
	/**
	 * Increses production
	 */
	"awesome": new Powerup("cursors.check", 120, 0.30),
	/**
	 * Gives discounts for clickers and cursors
	 */
	"store": new Powerup("icon_store", 90, 0.45),
	/**
	 * Is just silly, very silly
	 */
	"blab": new Powerup("panderito", 20, 0.15),
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
]

export type powerupName = keyof typeof powerupTypes | "random";

type powerupOpt = {
	type: powerupName;
	pos?: Vec2,
	multiplier?: number,
	time?: number,
	natural?: boolean,
}

let timerSpacing = 65
function getTimerXPos(index:number) : number {
	let initialPos = vec2(width() + timerSpacing / 2)
	return getPosInGrid(initialPos, 0, -index - 1, vec2(timerSpacing, 0)).x
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
					tween(element.pos.x, getTimerXPos(element.index), 0.32, (p) => element.pos.x = p, easings.easeOutQuint)
				});
				// # holy shit im a genius
			},
		}
	])

	tween(30, 40, 0.32, (p) => timerObj.pos.y = p, easings.easeOutQuint)
	tween(90, 0, 0.32, (p) => timerObj.angle = p, easings.easeOutQuint)

	timerObj.pos.x = getTimerXPos(timerObj.index)

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
			addPowerupLog(opts.type as powerupName)
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
		let width = textInBg.width + icon.width * 2
		let height = formatText({ text: textInText, ...textInBgOpts as TextCompOpt }).height + 15
		
		bg.height = lerp(bg.height, height, 0.5)
		bg.width = lerp(bg.width, width, 0.5)
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
		
		let element = choose(list) as powerupName
		if (chance(0.2) && opts.natural == true) element = "blab"
		
		return element;
	}

	opts.type = opts.type
	if (opts.type == "random") opts.type = getRandomPowerup()

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
				blink.scale = this.scale
				blink.width = this.width
				blink.height = this.height

				let timeToLeave = 0.75
				tween(0.5, 0, timeToLeave, (p) => blink.maxOpacity = p, easings.easeOutBack)
				blink.wait(timeToLeave, () => {
					destroy(blink)
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

				if (opts.multiplier == null) {
					if (opts.type == "clicks" || opts.type == "cursors") {
						time += opts.time ?? randi(15, 30)
						multiplier = randi(1.5, 3) * GameState.powerupPower
					}
					
					// op powerups
					else if (opts.type == "awesome") {
						time += opts.time ?? randi(10, 15)
						multiplier = randi(4, 8) * GameState.powerupPower
					}

					else if (opts.type == "store") {
						time += opts.time ?? randi(10, 15)
						// i don't understand this why is it the bigger the cheaper???????
						multiplier = rand(0.5, 0.75) / GameState.powerupPower
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

				if (opts.type != "time") {
					// if there's already a timer don't add a new one!
					let checkTimer = get(`${opts.type}_putimer`)[0] 
					if (checkTimer) checkTimer.updateTime()
					else addTimer({ sprite: powerupTypes[powerupObj.type].sprite, type: opts.type}) 
				}

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
		powerupObj.dissapear()
		// powerupObj.click()
	})

	powerupObj.wait(20, () => {
		powerupObj.dissapear()
	})

	let shimmer = add([
		layer("ui"),
		pos(mousePos()),
		opacity(),
		timer(),
		particles({
			max: 8,
			texture: getSprite("part_star").data.tex,
			quads: [getSprite("part_star").data.frames[0]],

			speed: [100, 250],
			angle: [0, 0],
			colors: [WHITE],
			scales: [1.5, 2.1],
			lifeTime: [0.35, 0.5],
			opacities: [1, 0],
			damping: [1, 2],
			acceleration: [vec2(0), vec2(-50)],
		}, {
			lifetime: 1.5,
			rate: 100,
			direction: 90,
			spread: -90,
		})
	])

	let shimmerLoopTime = 0
	shimmer.onUpdate(() => {
		shimmerLoopTime += dt()

		if (shimmerLoopTime > 0.5) {
			shimmerLoopTime = 0 
			shimmer.emit(5)
			debug.log("emitted")
		}

		debug.log(shimmerLoopTime)
	})

	shimmer.onEnd(() => {
		shimmer.destroy()
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