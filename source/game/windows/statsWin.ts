import { GameState } from "../../gamestate";
import { unlockables } from "../unlockables";
import { formatNumber, toHHMMSS } from "../utils";

export function statsWinContent(winParent) {
	let stats = {};

	winParent.onUpdate(() => {
		// TODO: move this to an array of objects so it stays ordered
		stats = {
			"Total score: ": formatNumber(GameState.scoreThisRun), 
			"Times clicked: ": GameState.stats.timesClicked,
			"Powerups clicked: ": GameState.stats.powerupsClicked,
			"Achievements unlocked: ": `${GameState.unlockedAchievements.length}/${unlockables.achievements.length}`,
			"Total time played: ": toHHMMSS(Math.round(GameState.stats.totalTimePlayed)),
			// [`Clickers (${GameState.clickers}) / Cursors (${GameState.cursors}) owned: `]: `${GameState.clickers + GameState.cursors}`,
		}

		if (GameState.ascendLevel - 1 > 1) stats["Times ascended: "] = GameState.ascendLevel - 1
		// TODO: Add here score all time and replace total score with score in this run
	})

	function createStats() {
		let text = Object.keys(stats).map((key) => `${key} ${stats[key]}`).join("\n")
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