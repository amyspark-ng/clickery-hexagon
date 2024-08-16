import { GameState } from "../../gamestate";
import { positionSetter } from ".././plugins/positionSetter";
import { achievements } from "../unlockables/achievements";
import { formatNumber, formatNumberSimple, formatTime } from "../utils";

class Stat {
	key:string
	value: number | string
	icon: string
	constructor(key:string, value: number | string, icon?: string) {
		this.key = key
		this.value = value
		this.icon = icon
	}
}

export function statsWinContent(winParent) {
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

		stats = [
			scoreAllTime, timesClicked, powerupsClicked, powerupsBought, achievementsUnlocked, timePlayed
		]

		if (GameState.stats.timesAscended > 0) {
			stats.splice(stats.indexOf(achievementsUnlocked), 0, timesAscended);
			stats.splice(stats.indexOf(timesClicked), 0, scoreThisRun);
		}
	})

	function createStats() {
		let text = stats.map(stat => `${stat.key}: ${stat.value}`).join("\n")
		return text
	}

	let icons = winParent.add([
		sprite("statIcons1"),
		pos(-221, -127),
		positionSetter(),
		anchor("top"),
		{
			update() {
				if (GameState.stats.timesAscended > 0 && this.sprite != "statIcons2") this.sprite = "statIcons2"
				else if (GameState.stats.timesAscended == 0 && this.sprite != "statIcons1") this.sprite = "statIcons1"
			}
		}
	])

	let statsText = winParent.add([
		text(createStats()),
		pos(14, -122),
		anchor("top"),
		// positionSetter(),
		{
			update() {
				this.text = createStats()
			}
		}
	])
}