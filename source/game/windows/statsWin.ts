import { GameState } from "../../gamestate";
import { unlockables } from "../unlockables";
import { toHHMMSS } from "../utils";
import { infoForWindows } from "./windows-api/windowsAPI";

export function statsWinContent(winParent) {
	let stats = {};

	winParent.onUpdate(() => {
		stats = {
			"Total score: ": Math.round(GameState.totalScore), 
			"Times clicked: ": GameState.stats.timesClicked,
			"Powerups clicked: ": GameState.stats.powerupsClicked,
			"Times ascended: ": GameState.stats.timesAscended,
			[`Clickers (${GameState.clickers}) / Cursors (${GameState.cursors}) owned: `]: `${GameState.clickers + GameState.cursors}`,
			"Windows unlocked: ": `${GameState.unlockedWindows.length}/${Object.keys(infoForWindows).length}`,
			"Achievements unlocked: ": `${GameState.unlockedAchievements.length}/${unlockables.achievements.length}`,
			"Total time played: ": toHHMMSS(Math.round(GameState.stats.totalTimePlayed)),
		}
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