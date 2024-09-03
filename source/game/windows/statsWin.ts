import { GameObj } from "kaplay";
import { GameState } from "../../gamestate";
import { positionSetter } from ".././plugins/positionSetter";
import { achievements, isAchievementUnlocked } from "../unlockables/achievements";
import { formatNumber, formatNumberSimple, formatTime } from "../utils";

class Stat {
	key:string
	value: number | string
	constructor(key:string, value: number | string) {
		this.key = key
		this.value = value
	}
}

export function statsWinContent(winParent:GameObj) {
	let stats = [];

	winParent.onUpdate(() => {
		let scoreAllTime = new Stat("Score all time", formatNumber(GameState.scoreAllTime))
		let scoreThisRun = new Stat("Score this run", formatNumber(GameState.scoreThisRun))
		let timesClicked = new Stat("Times clicked", formatNumberSimple(GameState.stats.timesClicked))
		let powerupsClicked = new Stat("Power-ups clicked", formatNumberSimple(GameState.stats.powerupsClicked))
		let powerupsBought = new Stat("Power-ups bought", formatNumberSimple(GameState.stats.powerupsBought))
		let timesAscended = new Stat("Times ascended", formatNumberSimple(GameState.stats.timesAscended))
		let achievementsUnlocked = new Stat("Achievements unlocked", `${GameState.unlockedAchievements.length}/${achievements.length}`)
		let timePlayed = new Stat("Total time played", formatTime(Math.round(GameState.stats.totalTimePlayed), true))
		let timeForGameComplete = new Stat("Time for game completed", formatTime(Math.round(GameState.stats.timeGameComplete), true))

		stats = [
			scoreAllTime, timesClicked, powerupsClicked, powerupsBought, achievementsUnlocked, timePlayed
		]

		if (GameState.stats.timesAscended > 0) {
			stats.splice(stats.indexOf(achievementsUnlocked), 0, timesAscended);
			stats.splice(stats.indexOf(timesClicked), 0, scoreThisRun);
		}

		if (isAchievementUnlocked("extra.ALL")) {
			if (!stats.includes(timeForGameComplete)) stats.push(timeForGameComplete)
		}
	})

	function createStats() {
		let text = stats.map(stat => `${stat.key}: ${stat.value}`).join("\n")
		return text
	}

	let icons = winParent.add([
		sprite("statIcons1"),
		pos(-222, -152),
		anchor("top"),
		{
			update() {
				if (isAchievementUnlocked("extra.ALL") && this.sprite != "statIcons3") this.sprite = "statIcons3"
				else if (GameState.stats.timesAscended > 0 && this.sprite != "statIcons2") this.sprite = "statIcons2"
				else if (GameState.stats.timesAscended < 1 && this.sprite != "statIcons1") this.sprite = "statIcons1"
			}
		}
	])

	let statsText = winParent.add([
		text(createStats()),
		pos(-202, -150),
		anchor("topleft"),
		{
			update() {
				this.text = createStats()
			}
		}
	])
}