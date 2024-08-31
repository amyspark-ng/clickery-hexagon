import { GameObj, PosComp, TextComp, Vec2 } from "kaplay"
import { GameState, scoreManager } from "../../gamestate"
import { startAscending } from "../ascension/ascension"
import { allPowerupsInfo} from "../powerups"
import { bop, formatNumber, formatNumberSimple } from "../utils"
import { waver } from "../plugins/wave"
import { positionSetter } from "../plugins/positionSetter"
import { ROOT } from "../../main"
import { insideWindowHover } from "../hovers/insideWindowHover"
import { makeSmallParticles } from "../plugins/confetti"

let objectsPositions = {
	mage_hidden: 450,
	mage_visible: 30,
	cursors_hidden: 470,
	cursors_visible: 26,
}

const windowLerp = 0.25

function addWinMage(position: Vec2, parent:GameObj) {
	let winMage = parent.add([
		pos(position),
		anchor("center"),
		waver({ maxAmplitude: 2 })
	])

	let body = winMage.add([
		sprite("winMage_body"),
		anchor("center"),
	])

	let eye = winMage.add([
		sprite("winMage_eye"),
		anchor("center"),
		"winMage_eye"
	])

	let cursors = parent.add([
		sprite("winMage_cursors"),
		anchor("center"),
		pos(),
		waver({ maxAmplitude: 3 })
	])

	return {
		mage: winMage,
		cursors: cursors,
	};
}

/**
 * @returns An object holding the eye and the scroll
 */
function addAscendButton(position: Vec2, winParent:GameObj) {
	const buttonContainer = winParent.add([
		pos(position),
		anchor("center"),
		positionSetter(),
		{
			eye: null,
			scroll: null,
		}
	])
	
	const scroll = buttonContainer.add([
		sprite("ascendButtonScroll"),
		pos(-15, -1),
		anchor("right"),
		scale(),
	])

	scroll.scale.x = 0
	
	const eye = buttonContainer.add([
		sprite("ascendButtonEyes", { anim: "dumb" }),
		pos(position),
		anchor("center"),
		area(),
		insideWindowHover(winParent),
		scale(),
		opacity(),
		{
			update() {
				if (GameState.ascension.mana < 1) this.opacity = 0.8
				else this.opacity = 1
			}
		}
	])

	eye.startingHover(() => {
		if (GameState.ascension.mana > 0) {
			tween(scroll.scale.x, 1, 0.15, (p) => scroll.scale.x = p, easings.easeOutQuint)
			eye.play("woke")
		}
		
		else {
			eye.play("dumb")
		}

		tween(1.5, 1.05, 0.15, (p) => eye.scale.y = p, easings.easeOutQuint)
		tween(1, 1.05, 0.15, (p) => eye.scale.x = p, easings.easeOutQuint)
	})

	eye.endingHover(() => {
		eye.play("dumb")
		tween(scroll.scale.x, 0, 0.15, (p) => scroll.scale.x = p, easings.easeOutQuint)
		
		tween(eye.scale.y, 1, 0.15, (p) => eye.scale.y = p, easings.easeOutQuint)
		tween(eye.scale.x, 1, 0.15, (p) => eye.scale.x = p, easings.easeOutQuint)
	})

	eye.onPressClick(() => {
		bop(eye)
		startAscending()
	})

	buttonContainer.eye = eye
	buttonContainer.scroll = scroll
	return buttonContainer;
}

export function ascendWinContent(winParent:GameObj) {
	// ADDS THE MAAAAAGEEE
	const masked = winParent.add([
		mask("intersect"),
		anchor("center"),
		pos(),
		rect(winParent.width, winParent.height),
	])

	const winMageFull = addWinMage(vec2(0, 450), masked)
	const winMage = winMageFull.mage
	const winMageCursors = winMageFull.cursors
	winMageCursors.pos.y = objectsPositions.cursors_hidden

	tween(objectsPositions.mage_hidden, objectsPositions.mage_visible, 0.6, (p) => winMage.pos.y = p, easings.easeOutQuint).onEnd(() => {
		winMage.wave_verPosition = objectsPositions.mage_visible
		winMage.startWave()
	})

	wait(0.2, () => {
		tween(objectsPositions.cursors_hidden, objectsPositions.cursors_visible, 0.5, (p) => winMageCursors.pos.y = p, easings.easeOutQuint).onEnd(() => {
			winMageCursors.wave_verPosition = objectsPositions.cursors_visible
			winMageCursors.startWave()
		})
	})

	// scaryyy
	if (GameState.stats.timesAscended < 1) {
		winMage.get("winMage_eye")[0].destroy()
		let vignette = winParent.add([
			sprite("winMage_vignette"),
			pos(0),
			anchor("center"),
			opacity(0.75),
			z(3),
		])

		vignette.width = winParent.width
		vignette.height = winParent.height
		vignette.fadeIn(0.5, easings.easeOutQuad)
	}

	// ✦
	// let manaCounterText:GameObj<PosComp | TextComp>;

	// MANA COUNTER
	// 36 tall
	const manaCounterText = winParent.add([
		text("✦", { align: "left" }),
		pos(-308, -169),
		anchor("left"),
		z(1),
		{
			update() {
				this.text = `+${formatNumberSimple(GameState.ascension.manaAllTime)}%\n✦${GameState.ascension.mana}`
			}
		}
	])
	
	const manaCounterRect = winParent.add([
		rect(0, 10),
		color(BLACK),
		anchor("topleft"),
		opacity(0.9),
		pos(-314, 0),
		z(0),
		{
			update() {
				this.pos.y = manaCounterText.pos.y - manaCounterText.height * 0.5

				let width = formatText({ text: manaCounterText.text, size: manaCounterText.textSize, align: manaCounterText.align }).width + 14
				this.width = lerp(this.width, width, windowLerp)
				this.height = lerp(this.height, manaCounterText.height, windowLerp)
			}
		}
	])
	
	const manaCounterTri = winParent.add([
		sprite("manaCounterTri"),
		pos(),
		anchor(manaCounterRect.anchor),
		color(manaCounterRect.color),
		opacity(manaCounterRect.opacity),
		{
			update() {
				this.height = manaCounterRect.height
				this.pos.y = manaCounterRect.pos.y
				this.pos.x = manaCounterRect.pos.x + manaCounterRect.width
			}
		}
	])

	// BOTTOM POLYGON

	// can't bother to make it masked
	const bottomPolygon = winParent.add([
		sprite("ascendBottomPolygon"),
		pos(140, 249),
		color(manaCounterRect.color),
		opacity(manaCounterRect.opacity),
		anchor("bot"),
		{
			add() {
				this.height = 0
			},
			
			update() {
				this.height = lerp(this.height, 146, windowLerp)
			}
		}
	])

	const barColor = rgb(105, 180, 225)
	const ascendEmptyBar = winParent.add([
		sprite("ascendBar"),
		pos(150, 178),
		anchor("center"),
		color(barColor),
		opacity(0.5),
	])

	const maskedBarContent = winParent.add([
		mask("intersect"),
		anchor("botleft"),
		pos(ascendEmptyBar.pos.x - ascendEmptyBar.width / 2, ascendEmptyBar.pos.y + ascendEmptyBar.height / 2),
		rect(0, ascendEmptyBar.height),
		opacity(0.5),
		{
			// this is the actual workings of the bar
			update() {
				let currentScore = scoreManager.getScoreForManaAT(GameState.ascension.manaAllTime)
				let nextScore = scoreManager.getScoreForManaAT(GameState.ascension.manaAllTime + 1)

				let mappedWidth = map(GameState.scoreAllTime, currentScore, nextScore, 0, ascendEmptyBar.width)
				this.width = lerp(this.width, mappedWidth, 0.15)
				this.width = clamp(this.width, 0, ascendEmptyBar.width)
			}
		}
	])

	const ascendContentBar = maskedBarContent.add([
		sprite("ascendBar"),
		pos(157, -65),
		anchor("center"),
		color(barColor),
		opacity(1),
		{
			update() {
				const lighter = barColor
				const darker = barColor.darken(10)
				this.color.r = wave(lighter.r, darker.r, time() * 2)
				this.color.g = wave(lighter.g, darker.g, time() * 2)
				this.color.b = wave(lighter.b, darker.b, time() * 2)
			}
		}
	])

	const manaStar = winParent.add([
		sprite("ascendManaStar"),
		pos(306, 116),
		anchor("center"),
		color(barColor.lighten(10)),
		scale(),
	])

	const scoreTilNextManaText = winParent.add([
		text("", {
			align: "right",
			size: 22,
		}),
		anchor("right"),
		color(WHITE),
		pos(307, 140),
		rotate(-22),
		{
			update() {
				let scoreTextOrManaPerSecond = `Score 'til next mana: `
				
				let scoreTilNextMana = Math.round(scoreManager.scoreYouGetNextManaAt() - Math.round(GameState.scoreAllTime))
				let formattedNumber = formatNumber(Math.round(scoreManager.scoreYouGetNextManaAt()) - Math.round(GameState.scoreAllTime))

				// getting scrumptious amounts of mana
				if (scoreTilNextMana < -1) {
					formattedNumber = formatNumber(Math.round(scoreManager.manaPerSecond()))
					scoreTextOrManaPerSecond = "Mana per second: "
				}

				this.text = `${scoreTextOrManaPerSecond}${formattedNumber}`
			}
		}
	])

	// i wasn't able to place it properly using positionSetter() for the LIFE of me i swear
	const buttonPos = vec2(280, 220)
	const ascendButton = addAscendButton(vec2(0), winParent)
	ascendButton.pos = buttonPos
	
	function manaParticles(position:Vec2) {
		let manaParticles = add([
			pos(position),
			particles({
				max: 8,
				texture: getSprite("part_star").data.tex,
				quads: [getSprite("part_star").data.frames[0]],

				speed: [100, 250],
				angle: [0, 0],
				colors: [manaStar.color.lighten(50), manaStar.color.darken(50)],
				scales: [1, 1.1],
				lifeTime: [0.35, 0.5],
				opacities: [1, 0],
				acceleration: [vec2(50), vec2(-50)],
				angularVelocity: [30, 60],
			}, {
				lifetime: 1.5,
				rate: 100,
				direction: 180,
				spread: -90,
			}),
			layer(winParent.layer),
		])

		manaParticles.emit(randi(4, 8))
		manaParticles.onEnd(() => manaParticles.destroy())
	}

	const manaGainedCheck = ROOT.on("manaGained", () => {
		tween(2, 1, 0.15, (p) => manaStar.scale.y = p, easings.easeOutQuad)
		manaParticles(manaStar.worldPos())
	})

	winParent.on("close", () => {
		manaGainedCheck.cancel()
	})
}