import { GameObj, PosComp, TextComp, Vec2 } from "kaplay"
import { GameState, scoreManager } from "../../gamestate"
import { startAscending } from "../ascension/ascension"
import { allPowerupsInfo} from "../powerups"
import { formatNumber, formatNumberSimple } from "../utils"
import { waver } from "../plugins/wave"
import { positionSetter } from "../plugins/positionSetter"
import { ROOT } from "../../main"

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

export function ascendWinContent(winParent:GameObj) {
	// TODO: if mana is increased while the ascend window is open add a little spark and a sound

	// ADDS THE MAAAAAGEEE
	let masked = winParent.add([
		mask("intersect"),
		anchor("center"),
		pos(),
		rect(winParent.width, winParent.height),
	])

	let winMageFull = addWinMage(vec2(0, 450), masked)
	let winMage = winMageFull.mage
	let winMageCursors = winMageFull.cursors
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
	let manaCounterText = winParent.add([
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
	
	let manaCounterRect = winParent.add([
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
	
	let manaCounterTri = winParent.add([
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
	let bottomPolygon = winParent.add([
		sprite("ascendBottomPolygon"),
		pos(140, 249),
		color(manaCounterRect.color),
		opacity(manaCounterRect.opacity),
		anchor("bot"),
		positionSetter(),
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
	let ascendEmptyBar = winParent.add([
		sprite("ascendBar"),
		pos(150, 178),
		anchor("center"),
		color(barColor),
		opacity(0.5),
	])

	let maskedBarContent = winParent.add([
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

	let ascendContentBar = maskedBarContent.add([
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

	let manaStar = winParent.add([
		sprite("ascendManaStar"),
		pos(306, 116),
		anchor("center"),
		color(barColor.lighten(10))
	])

	let scoreTilNextManaText = winParent.add([
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

	let ascendButton = winParent.add([
		sprite("ascendButton"),
		anchor("center"),
		color(WHITE),
		pos(262, 224),
		area(),
		opacity(),
		z(4),
		{
			update() {
				this.opacity = GameState.ascension.mana < 1 ? 0.5 : 1
			}
		}
	])

	ascendButton.onClick(() => {
		if (allPowerupsInfo.isHoveringAPowerup == true) return
		if (GameState.ascension.mana >= 1) startAscending()
	})

	let manaGainedCheck = ROOT.on("manaGained", () => {

	})

	winParent.on("close", () => {
		manaGainedCheck.cancel()
	})
}