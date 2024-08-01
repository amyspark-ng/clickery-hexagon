import { GameState, scoreManager } from "../../gamestate"
import { ROOT } from "../../main"
import { positionSetter } from ".././plugins/positionSetter"
import { triggerAscension } from "../ascension/ascension"
import { formatNumber } from "../utils"

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
		positionSetter(),
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
		if (GameState.ascension.mana >= 1) triggerAscension()
	})

	let manaGainedCheck = ROOT.on("manaGained", () => {
		
	})

	winParent.on("close", () => {
		manaGainedCheck.cancel()
	})
}