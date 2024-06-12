import { saveAnim } from "./scenes/game/utils"

// lajbel you genius
class VolumeData {
	constructor(defaultVolume = 1, muted = false, favoriteIdx = null) {
		this.volume = defaultVolume;
		this.muted = muted;
		this.favoriteIdx = favoriteIdx // this is exclusively for music
	}
}

// class medalData {
// 	constructor(name, ng_id,  = 1, muted = false) {
// 		this.volume = defaultVolume;
// 		this.muted = muted;
// 	}
// }

export let GameState = {
	score: 0,
	totalScore: 0,
	
	clickers: 0,
	clicksUpgrades: 0, // multiplier for clicks
	clickPercentage: 0, // percentage added

	cursors: 0,
	cursorUpgrades: 0, // multiplier for cursors
	cursorsPercentage: 0, // percentage added
	timeUntilAutoLoopEnds: 10, // cursor frequency

	hasUnlockedPowerups: false,
	powerupsBought: 0,
	powerupsFrequency: 120,
	powerupsChance: 0.1,
	powerupsPower: 0,
	
	achievementMultiplierPercentage: 0,
	generalUpgrades: 1, // general multiplier

	ascendLevel: 0,

	upgradesBought: new Array(16).fill(false),

	medals: {
		itstartedforyou: {
			id: 0,
			ng_id: 10834,
			unlocked: false,
		}
	},

	unlockedWindows: [],
	taskbar: [],

	// medals: {
	// 	start: new medalData("It starts", 3484, false, "itstarts")
	// },

	stats: {
		clicks: 0,
		scoreGainedByClicks: 0,
		powerupsClicked: 0,
		flakesClicked: 0,
		timePlayed: 0,
	},

	settings: {
		sfx: new VolumeData(1, false),
		music: new VolumeData(1, false),
		volume: 1,
		hexColor: [255, 255, 255],
		bgColor: [0, 0, 0, 0.55],
		keepAudioOnTabChange: true,
		dropDragsOnMouseOut: true,
		shortNumbers: false,
		fullscreen: false,
		panderitoMode: false,
	},

	save(anim = true) {
		if (anim) {
			setData("hexagon-save", this)
			saveAnim()
			
		}
		else {
			setData("hexagon-save", this)
		}
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
