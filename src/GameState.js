import { saveAnim } from "./scenes/game/utils"

// lajbel you genius
class VolumeData {
	constructor(defaultVolume = 1, muted = false) {
		this.volume = defaultVolume;
		this.muted = muted;
	}
}

export let GameState = {
	score: 0,
	totalScore: 0,
	
	clickers: 1,
	clicksUpgrades: 0, // multiplier for clicks
	clickPercentage: 0,

	cursors: 0,
	cursorUpgrades: 0, // multiplier for cursors
	cursorsPercentage: 0,
	timeUntilAutoLoopEnds: 10, // cursor frequency

	hasUnlockedPowerups: false,
	powerupsBought: 0,
	powerupsFrequency: 120,
	powerupsChance: 0.1,
	powerupsPower: 0,
	
	achievementMultiplierPercentage: 0,
	generalUpgrades: 1, // general multiplier
	
	ascendLevel: 0,

	upgradesBought: [
		false,
		false,
		false,
		false,
		false,
		false,
		false,
		false,
		false,
		false,
		false,
		false,
		false,
		false,
		false,
		false,
		false,
	],

	personalization: {
		panderitoMode: false,
		colorIndex: 0,
		cursorSkins: [],
	},
	
	medals: {
		itstartedforyou: {
			id: 0,
			ng_id: 10834,
			unlocked: false,
		}
	},

	// medals: {
	// 	start: new medalData("It starts", 3484, false, "itstarts")
	// },

	// # stats
	// clicks
	// scoregainedbyclicks
	// powerupsclicked
	// flakesclicked
	// timeplayed
	// max cookies per second gained

	sfxVolindex: new VolumeData(1, false),
	musicVolIndex: new VolumeData(1, false),
	volumeIndex: 1,

	save(anim = true) {
		if (anim) {
			setData("hexagon-save", this)
			saveAnim()
		}

		else {
			setData("hexagon-save", this)
		}
		// console.log(this)
	},

	load() {
		let gottenData = getData("hexagon-save") 
		if (gottenData) {
			Object.assign(this, gottenData)
		}
		else {
			// no data????
		}
	},

	delete() {
		localStorage.removeItem("hexagon-save")
		Object.assign(this, this)
		go("gamescene")
	},

	cheat() {
		this.score = 1000000
		this.totalScore = 1000000
		this.scoreMultiplier = 500
		this.cursors = 500
	},

	addScore(amount) {
		this.score += amount
		this.totalScore += amount
	},

	setScore(amount) {
		this.score = amount
		this.totalScore = amount
	},
}
