import { GameState, scoreManager } from "../../gamestate"
import { ROOT } from "../../main"
import { positionSetter } from "../../plugins/positionSetter"
import { triggerAscension } from "../ascension/ascension"
import { formatNumber } from "../utils"

export function ascendWinContent(winParent) {
	// TODO: do a little bar that indicates score til next mana
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
				let scoreTilNextMana = formatNumber(scoreManager.scoreTilNextMana() - GameState.scoreAllTime)

				let text = [
					`${GameState.ascension.mana}✦`,
					`Score 'til next mana: ${scoreTilNextMana}`,
					`+${GameState.ascension.magicLevel}MG`
				].join("\n")

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
		pos(0, 0),
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
		color(BLUE.lighten(300)),
		opacity(1),
		z(barFrame.z - 1),
		{
			update() {
				let actualScoreUntilNextMana = scoreManager.scoreTilNextMana() - GameState.scoreAllTime
	
				let mappedWidth = map(actualScoreUntilNextMana, 0, 0, 0, barFrame.width)
				this.width = lerp(this.width, mappedWidth, 0.5)
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