import { GameObj, Vec2 } from "kaplay"
import { GameState, scoreManager } from "../../gamestate"
import { ROOT } from "../../main"
import { positionSetter } from ".././plugins/positionSetter"
import { triggerAscension } from "../ascension/ascension"
import { isHoveringAPowerup } from "../powerups"
import { formatNumber } from "../utils"
import { waver } from "../plugins/wave"

let objectsPositions = {
	mage_hidden: 450,
	mage_visible: 30,
	cursors_hidden: 470,
	cursors_visible: 26,
}

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

export function ascendWinContent(winParent) {
	// TODO: if mana is increased while the ascend window is open add a little spark and a sound

	let manaText = winParent.add([
		text("", {
			size: 40,
			align: "left",
		}),
		anchor("left"),
		color(WHITE),
		pos(-182, -189),
		area(),
		{
			update() {
				let scoreTilNextMana = formatNumber(Math.round(scoreManager.scoreYouGetNextManaAt()) - Math.round(GameState.scoreAllTime))

				let text = [
					// TODO: make it so it shows how much mana you've  gotten since the run started
					`${GameState.ascension.mana}✦`,
					`Score 'til next mana: ${scoreTilNextMana}`,
					`+${GameState.ascension.magicLevel}MG`
				].join("\n")

				// let manaSinceRunStart = formatNumber(GameState.ascension.mana - GameState.ascension.manaAtStartOfRun)

				this.text = text
			}
		}
	])

	let button = winParent.add([
		text("ASCEND!!!", {
			size: 20,
			align: "center",
			font: "lambdao",
		}),
		anchor("center"),
		color(WHITE),
		pos(0, -100),
		area(),
		opacity(),
		{
			update() {
				if (GameState.ascension.mana < 1) this.opacity = 0.5
				else this.opacity = 1
			}
		}
	])

	let manaBarContent = null;
	let barFrame = winParent.add([
		rect(winParent.width, winParent.height / 12, { fill: false, radius: 5 }),
		pos(0, 0),
		anchor("center"),
		opacity(1),
		outline(3.5, BLACK),
		z(1),
	])

	let barFrameBg = winParent.onDraw(() => {
		drawRect({
			pos: barFrame.pos,
			anchor: barFrame.anchor,
			width: barFrame.width,
			height: barFrame.height,
			opacity: barFrame.opacity * 0.28,
			radius: 5,
			color: BLACK,
		})
	})

	barFrame.onDestroy(() => {
		barFrameBg.cancel()
	})

	manaBarContent = winParent.add([
		rect(0, barFrame.height, { radius: 5 }),
		pos(-barFrame.width / 2, barFrame.pos.y),
		anchor("left"),
		color(WHITE),
		opacity(1),
		z(barFrame.z - 1),
		{
			update() {
				let scoreTilNextMana = Math.round(scoreManager.scoreYouGetNextManaAt() - GameState.scoreAllTime)
	
				let mappedWidth = map(scoreTilNextMana, 0, GameState.scoreAllTime + scoreManager.scoreYouGetNextManaAt(), barFrame.width, 0)
				this.width = lerp(this.width, mappedWidth, 0.5)
			
				const lighter = rgb(178, 208, 247)
				const darker = rgb(100, 157, 232)
				this.color.r = wave(lighter.r, darker.r, time() * 2)
				this.color.g = wave(lighter.g, darker.g, time() * 2)
				this.color.b = wave(lighter.b, darker.b, time() * 2)
			}
		}
	])
	
	button.onClick(() => {
		if (isHoveringAPowerup == true) return
		if (GameState.ascension.mana >= 1) triggerAscension()
	})

	let manaGainedCheck = ROOT.on("manaGained", () => {
		
	})

	let masked = winParent.add([
		mask("intersect"),
		anchor("center"),
		pos(),
		rect(winParent.width, winParent.height),
	])

	let winMageFull = addWinMage(vec2(0, 450), masked)
	let winMage = winMageFull.mage
	let winMageCursors = winMageFull.cursors

	winMageCursors.use(positionSetter()),

	tween(objectsPositions.mage_hidden, objectsPositions.mage_visible, 0.6, (p) => winMage.pos.y = p, easings.easeOutQuint).onEnd(() => {
		winMage.wave_verPosition = objectsPositions.mage_visible
		// winMage.startWave()
	})

	wait(0.2, () => {
		tween(objectsPositions.cursors_hidden, objectsPositions.cursors_visible, 0.5, (p) => winMageCursors.pos.y = p, easings.easeOutBack).onEnd(() => {
			// winMageCursors.startWave()
		})
	})

	winParent.on("close", () => {
		manaGainedCheck.cancel()
	})
}