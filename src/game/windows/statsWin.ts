import { GameState } from "../../gamestate";
import { positionSetter } from ".././plugins/positionSetter";
import { achievements } from "../unlockables/achievements";
import { formatNumber, formatNumberSimple, formatTime } from "../utils";

export function statsWinContent(winParent) {
	let stats = [];

	winParent.onUpdate(() => {
		stats = [
			{ "Score all time": formatNumber(GameState.scoreAllTime) },
			{ "Times clicked": formatNumberSimple(GameState.stats.timesClicked) },
			{ "Powerups clicked": formatNumberSimple(GameState.stats.powerupsClicked) },
			{ "Powerups bought": formatNumberSimple(GameState.stats.powerupsBought) },
			{ "Achievements unlocked": `${GameState.unlockedAchievements.length}/${achievements.length}` },
			{ "Total time played": formatTime(Math.round(GameState.stats.totalTimePlayed), true) },
		]

		if (GameState.stats.timesAscended > 0) {
			stats[0] = { "Score all time": formatNumber(GameState.scoreAllTime) }
			stats[1] = { "Score this run": formatNumber(GameState.scoreThisRun) }
			stats.splice(2, 0, { "Times clicked": `${formatNumberSimple(GameState.stats.timesClicked)}` });

			let ascendStatObject = { "Times ascended": `${GameState.stats.timesAscended}` }
			if (stats.indexOf(ascendStatObject) == -1) stats.push(ascendStatObject)
		}
	})

	let icons = winParent.add([
		pos(),
		// positionSetter(),
		anchor("top"),
	])

	icons.onDraw(() => {
		drawSprite({
			sprite: "cursors",
			frame: 2,
			anchor: "center",
			width: 50,
			height: 45,
		})

		drawSprite({
			sprite: "cursors",
			frame: 0,
			anchor: "center",
			pos: vec2(0, 40),
			width: 45,
			height: 45,
		})

		drawSprite({
			sprite: "hexagon",
			anchor: "center",
			pos: vec2(0, 80),
			width: 45,
			scale: vec2(0.9),
			height: 45,
		})

		drawSprite({
			sprite: "icon_medals",
			frame: 0,
			anchor: "center",
			pos: vec2(0, 160),
			width: 45,
			height: 45,
		})
	})

	function createStats() {
		let text = stats.map((stat) => `${Object.keys(stat)[0]}: ${Object.values(stat)[0]}`).join("\n")
		return text
	}

	let statsText = winParent.add([
		text(createStats()),
		pos(70, -230),
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
}