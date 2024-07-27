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
				let scoreTilNextMana = formatNumber(scoreManager.scoreTilNextMana())

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

	button.onClick(() => {
		if (GameState.ascension.mana >= 1) triggerAscension()
	})

	ROOT.on("manaGained", () => {
		
	})

	// winParent.on("close", () => {
	// 	debug.log("goodbye")
	// })
}