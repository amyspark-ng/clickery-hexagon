import { GameState } from "../../gamestate";
import { positionSetter } from ".././plugins/positionSetter";
import { achievements } from "../unlockables/achievements";
import { formatNumber, formatNumberSimple, formatTime } from "../utils";

class Stat {
	key:string
	value: number | string
	icon: string
	constructor(key:string, value: number | string, icon: string) {
		this.key = key
		this.value = value
		this.icon = icon
	}
}

export function statsWinContent(winParent) {
	let stats = [];

	winParent.onUpdate(() => {
		stats = [
			new Stat("Score all time", formatNumber(GameState.scoreAllTime), "cursors"),
			new Stat("Times clicked", formatNumberSimple(GameState.stats.timesClicked), "cursors"),
			new Stat("Power-ups clicked", formatNumberSimple(GameState.stats.powerupsClicked), "cursors"),
			new Stat("Power-ups bought", formatNumberSimple(GameState.stats.powerupsBought), "cursors"),
			new Stat("Achievements unlocked", `${GameState.unlockedAchievements.length}/${achievements.length}`, "cursors"),
			new Stat("Total time played", formatTime(Math.round(GameState.stats.totalTimePlayed), true), "cursors"),
		]

		if (GameState.stats.timesAscended > 0) {
			stats[0] = new Stat("Score all time", formatNumber(GameState.scoreAllTime), "cursors")
			stats[1] = new Stat("Score this run", formatNumber(GameState.scoreThisRun), "cursors")

			stats.splice(2, 0, new Stat("Times clicked", formatNumberSimple(GameState.stats.timesClicked), "cursors"));

			let ascendStatObject = new Stat("Times ascended", `${GameState.stats.timesAscended}`, "cursors")
			if (stats.indexOf(ascendStatObject) == -1) stats.push(ascendStatObject)
		}
	})

	function createStats() {
		let text = stats.map(stat => `${stat.key}: ${stat.value}`).join("\n")
		return text
	}

	let icons = winParent.add([
		pos(),
		// positionSetter(),
		anchor("top"),
	])

	let statsText = winParent.add([
		text(createStats()),
		pos(14, -122),
		anchor("top"),
		positionSetter(),
		{
			update() {
				this.text = createStats()
				icons.pos.y = this.pos.y + 20
				icons.pos.x = (this.pos.x - this.width / 2) - 25
			}
		}
	])

	let statLineHeight = formatText({ text: "Score all time: 0" }).height / 2

	debug.log(statLineHeight)

	let ffff = winParent.add([
		rect(10, 0),
		anchor("top"),
		pos(icons.pos.x, icons.pos.y),
		{
			update() {
				if (isKeyPressed("up")) this.height--
				if (isKeyPressed("down")) this.height++
			}
		}
	])

	icons.onDraw(() => {
		for (let i = 0; i < stats.length; i++) {
			let stat = stats[i]

			// drawSprite({
			// 	pos: vec2(icons.pos.x, icons.pos.y + (i * statLineHeight)),
			// 	sprite: "statIcon",
			// 	frame: i,
			// })
		}
	})
}