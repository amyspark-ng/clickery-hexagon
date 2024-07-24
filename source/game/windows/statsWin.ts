import { GameState } from "../../gamestate";
import { unlockables } from "../unlockables";
import { formatNumber, simpleNumberFormatting, toHHMMSS } from "../utils";

export function statsWinContent(winParent) {
	let stats = [];

	winParent.onUpdate(() => {
		stats = [
			{ "Total score": formatNumber(GameState.scoreAllTime) },
			{ "Times clicked": simpleNumberFormatting(GameState.stats.timesClicked) },
			{ "Powerups clicked": simpleNumberFormatting(GameState.stats.powerupsClicked) },
			{ "Powerups bought": simpleNumberFormatting(GameState.powerupsBought) },
			{ "Achievements unlocked": `${GameState.unlockedAchievements.length}/${unlockables.achievements.length}` },
			{ "Total time played": toHHMMSS(Math.round(GameState.stats.totalTimePlayed)) },
		]

		if (GameState.timesAscended > 0) {
			stats[0] = { "Score all time": formatNumber(GameState.scoreAllTime) }
			stats[1] = { "Score this run": formatNumber(GameState.scoreThisRun) }
			stats.splice(2, 0, { "Times clicked": `${simpleNumberFormatting(GameState.stats.timesClicked)}` });

			let ascendStatObject = { "Times ascended": `${GameState.timesAscended}` }
			if (stats.indexOf(ascendStatObject) == -1) stats.push(ascendStatObject)
		}
	})

	function createStats() {
		let text = stats.map((stat) => `${Object.keys(stat)[0]}: ${Object.values(stat)[0]}`).join("\n")
		return text
	}

	let statsText = winParent.add([
		text(createStats()),
		pos(-180, -230),
		{
			update() {
				this.text = createStats()
			}
		}
	])
}