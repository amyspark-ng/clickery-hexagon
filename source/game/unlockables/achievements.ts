import { GameState, scoreManager } from '../../gamestate';
import { windowKey } from '../windows/windows-api/windowManaging';
import { addToast } from '../additives';
import { addConfetti } from '.././plugins/confetti';
import { addUpgrades, upgradeInfo } from '../windows/store/upgrades';
import { songs, songsListened } from '../windows/musicWindow';
import { isWindowUnlocked, unlockableWindows, unlockWindow } from './unlockablewindows';
import { ROOT } from '../../main';
import ng from 'newgrounds.js';
import { ngEnabled } from '../../newgrounds';
import { playSfx } from '../../sound';

type achievementOpt = {
	/**
	 * The id the achievement will have, (eg: 100score)
	 */
	id: string,
	/**
	 * The id the achievement has on newgrounds
	 * (remember to pass it as a number don't mess it up this time)
	*/
	ngId?: number, // IS OPTIONAL WHILE I ADD THEM
	/**
	 * The name/funny pun the achievement will have
	 * (eg: the achievement is get 100 score, 'It starts...')
	 */
	title: string,
	/**
	 * The actual thing you have to do to get this achievement, can have a little flavour text at the end
	 * (eg: Get 100 of score all time, that wasn't hard was it? )
	 * If it has a flavor text, increase the reading time
	 */
	description: string,
	/**
	 * The sprite the icon will have (eg: medals_100score)
	*/
	// TODO: at some point deprecate this in favor of just using the id
	icon: string,
	/**
	 * This means the achievement is secret!
	 * It will only show its description and title when unlocked
	 * Otherwise the question mark in the medals window will be tinted purple
	* @returns Wheter the condition for it it's true or false
	 */
	secretCondition?: () => boolean;
	/**
	 * The unlockCondition in "code", if it doesn't have one it has to be unlocked manuall by doing unlockAchievement()
	 * @returns Wheter the condition for it it's true or false
	 */
	unlockCondition?: () => boolean,
	/**
	 * How much time (in seconds) after the achievement was unlocked for
	 * The toast to appear
	*/
	timeAfter?: number,
	/**
	 * How long will the toast be for before dissapearing
	 */
	readingTime?: number,
}

export class Achievement {
	id:string;
	ngId?:number;
	title: string;
	description: string;
	icon: string;
	timeAfter: number;
	visible: { secret: boolean, unlockCondition: () => boolean };
	readingTime: number;
	unlockCondition: () => boolean;
	secretCondition: () => boolean;

	constructor(public opts: achievementOpt) {
		this.id = opts.id
		this.ngId = opts.ngId

		this.title = opts.title
		this.description = opts.description
		this.icon = opts.icon
		this.timeAfter = opts.timeAfter || 0
		this.readingTime = opts.readingTime || 3
		this.unlockCondition = opts.unlockCondition || null
		this.secretCondition = opts.secretCondition || null
	}
}

export let fullUpgradeValues = {
	clicks: () => {
		let sum = 0
		Object.keys(upgradeInfo).forEach(key => {
			if (key.includes("k_")) {
				sum += upgradeInfo[key].value
			}
		});
		return sum;
	},
	cursors: () => {
		let sum = 0
		Object.keys(upgradeInfo).forEach(key => {
			// if the key includes C_ (is a cursor) and the freq is null (is not a frequency upgrade)
			if (key.includes("c_") && upgradeInfo[key].freq == null) {
				sum += upgradeInfo[key].value
			}
		});
		return sum;
	}
}

const hamiltonSong = `Here's hamilton!\nHow does a bastard, orphan, son of a whore
And a Scotsman, dropped in the middle of a forgotten spot
In the Caribbean by providence impoverished
In squalor, grow up to be a hero and a scholar?
The ten-dollar founding father without a father
Got a lot farther by working a lot harder
By being a lot smarter
By being a self-starter
By fourteen, they placed him in charge of a trading charter
And every day while slaves were being slaughtered and carted away
Across the waves, he struggled and kept his guard up
Inside, he was longing for something to be a part of
The brother was ready to beg, steal, borrow, or bar-
Wait, i got lazy.`

export let achievements = [
	// #region SCORE ACHIEVEMENTS =====================
	new Achievement({
		id: "100score",
		title: "It starts...",
		description: "Get 100 of score",
		icon: "upgrades.k_0",
		unlockCondition: () => GameState.scoreAllTime >= 100,
	}),

	new Achievement({
		id: "500score",
		title: "Wake and click",
		description: "Get 500 of score",
		icon: "upgrades.k_1",
		unlockCondition: () => GameState.scoreAllTime >= 500,
	}),

	new Achievement({
		id: "1000score",
		title: "Wake and click",
		description: "Get 1.000 of score",
		icon: "upgrades.k_1",
		unlockCondition: () => GameState.scoreAllTime >= 1_000,
	}),

	new Achievement({
		id: "5000score",
		title: "Testing Testing",
		description: "Ok these seem to be working",
		icon: "upgrades.k_1",
		unlockCondition: () => GameState.scoreAllTime >= 5_000,
	}),

	new Achievement({
		id: "10000score",
		title: "Wake and click",
		description: "Get 10.000 of score",
		icon: "upgrades.k_1",
		unlockCondition: () => GameState.scoreAllTime >= 10_000,
	}),

	new Achievement({
		id: "25000score",
		title: "Wake and click",
		description: "Get 25.000 of score",
		icon: "upgrades.k_1",
		unlockCondition: () => GameState.scoreAllTime >= 25_000,
	}),

	new Achievement({
		id: "50000score",
		title: "Wake and click",
		description: "Get 50.000 of score",
		icon: "upgrades.k_1",
		unlockCondition: () => GameState.scoreAllTime >= 50_000,
	}),

	new Achievement({
		id: "100000score",
		title: "Wake and click",
		description: "Get 100.000 of score",
		icon: "upgrades.k_1",
		unlockCondition: () => GameState.scoreAllTime >= 100_000,
	}),

	new Achievement({
		id: "250000score",
		title: "Wake and click",
		description: "Get 250.000 of score",
		icon: "upgrades.k_1",
		unlockCondition: () => GameState.scoreAllTime >= 250_000,
	}),

	new Achievement({
		id: "500000score",
		title: "Wake and click",
		description: "Get 500.000 of score",
		icon: "upgrades.k_1",
		unlockCondition: () => GameState.scoreAllTime >= 500_000,
	}),

	new Achievement({
		id: "750000score",
		title: "Did you know there's no actual limit to how long these names can be? I specifically spent a lot of time working on them so they can be as LONG as i want them to be and they will do their best to look good",
		description: `I'm not too sure how well it supports long descriptions, i can't really be bothered to test it, i'm pretty close to the deadline of this game coming out so i'd like not to dwell in those dark functions...`,
		icon: "upgrades.k_1",
		readingTime: 20,
		unlockCondition: () => GameState.scoreAllTime >= 750_000,
	}),

	new Achievement({
		id: "1millionscore",
		title: "That's crazy",
		description: "Get 1 million of score",
		icon: "upgrades.k_1",
		unlockCondition: () => GameState.scoreAllTime >= 1_000_000,
	}),

	new Achievement({
		id: "15millionscore",
		title: "That's crazy",
		description: "Get 15 million of score",
		icon: "upgrades.k_1",
		unlockCondition: () => GameState.scoreAllTime >= 15_000_000,
	}),

	new Achievement({
		id: "50millionscore",
		title: "That's crazy",
		description: "Get 50 million of score",
		icon: "upgrades.k_1",
		unlockCondition: () => GameState.scoreAllTime >= 50_000_000,
	}),

	new Achievement({
		id: "100millionscore",
		title: "That's crazy",
		description: "Get 100 million of score",
		icon: "upgrades.k_1",
		unlockCondition: () => GameState.scoreAllTime >= 100_000_000,
	}),

	new Achievement({
		id: "250millionscore",
		title: "That's crazy",
		description: "Get 250 million of score",
		icon: "upgrades.k_1",
		unlockCondition: () => GameState.scoreAllTime >= 250_000_000,
	}),

	new Achievement({
		id: "500millionscore",
		title: "That's crazy",
		description: "Get 500 million of score",
		icon: "upgrades.k_1",
		unlockCondition: () => GameState.scoreAllTime >= 500_000_000,
	}),

	new Achievement({
		id: "600millionscore",
		title: "That's crazy",
		description: "Get 600 million of score",
		icon: "upgrades.k_1",
		unlockCondition: () => GameState.scoreAllTime >= 600_000_000,
	}),

	new Achievement({
		id: "750millionscore",
		title: "That's crazy",
		description: "Get 750 million of score",
		icon: "upgrades.k_1",
		unlockCondition: () => GameState.scoreAllTime >= 750_000_000,
	}),

	new Achievement({
		id: "950millionscore",
		title: "That's crazy",
		description: "Get 950 million of score",
		icon: "upgrades.k_1",
		unlockCondition: () => GameState.scoreAllTime >= 950_000_000,
	}),

	new Achievement({
		id: "1billionscore",
		title: "That's crazy",
		description: "Get 1 billion of score, you're crazy for this...",
		icon: "upgrades.k_1",
		unlockCondition: () => GameState.scoreAllTime >= 1_000_000_000,
	}),
	// #endregion SCORE ACHIEVEMENTS ====================

	// #region CLICKER/CURSOR ACHIEVEMENTS ==================
	// ### CLICKERS
	new Achievement({
		id: "10clickers",
		title: "Getting clickery",
		description: "Have 10 clickers",
		icon: "cursors.cursor",
		unlockCondition: () => GameState.clickers >= 10,
	}),

	new Achievement({
		id: "20clickers",
		title: "Getting clickery",
		description: "Have 20 clickers",
		icon: "cursors.cursor",
		unlockCondition: () => GameState.clickers >= 20,
	}),

	new Achievement({
		id: "30clickers",
		title: "Getting clickery",
		description: "Have 30 clickers",
		icon: "cursors.cursor",
		unlockCondition: () => GameState.clickers >= 30,
	}),

	new Achievement({
		id: "40clickers",
		title: "Getting clickery",
		description: "Have 40 clickers",
		icon: "cursors.cursor",
		unlockCondition: () => GameState.clickers >= 40,
	}),

	new Achievement({
		id: "50clickers",
		title: "Getting clickery",
		description: "Have 50 clickers",
		icon: "cursors.cursor",
		unlockCondition: () => GameState.clickers >= 50,
	}),
	
	// ### CURSORS
	new Achievement({
		id: "10cursors",
		title: "Getting cursory",
		description: "Have 10 cursors",
		icon: "cursors.cursor",
		unlockCondition: () => GameState.cursors >= 10,
	}),

	new Achievement({
		id: "20cursors",
		title: "Getting cursory",
		description: "Have 20 cursors",
		icon: "cursors.cursor",
		unlockCondition: () => GameState.cursors >= 20,
	}),

	new Achievement({
		id: "30cursors",
		title: "Getting cursory",
		description: "Have 30 cursors",
		icon: "cursors.cursor",
		unlockCondition: () => GameState.cursors >= 30,
	}),

	new Achievement({
		id: "40cursors",
		title: "Getting cursory",
		description: "Have 40 cursors",
		icon: "cursors.cursor",
		unlockCondition: () => GameState.cursors >= 40,
	}),

	new Achievement({
		id: "50cursors",
		title: "Getting cursory",
		description: "Have 50 cursors",
		icon: "cursors.cursor",
		unlockCondition: () => GameState.cursors >= 50,
	}),
	//#endregion CLICKERS/CURSORS ACHIEVEMENTS =================

	new Achievement({
		id: "allupgrades",
		title: "Very very score",
		description: "Buy all the available upgrades",
		icon: "icon_store",
		timeAfter: 1,
		unlockCondition: () => GameState.clicksUpgradesValue >= fullUpgradeValues.clicks() && GameState.cursorsUpgradesValue >= fullUpgradeValues.cursors(),
	}),

	// #region POWERUP ACHIEVEMENTS =====================
	new Achievement({
		id: "click1powerup",
		title: "What?! Help me!",
		description: "Click 1 powerup",
		icon: "cursors.cursor",
		timeAfter: 0.5,
		unlockCondition: () => GameState.stats.powerupsClicked >= 1,
	}),

	new Achievement({
		id: "click5powerup",
		title: "What?! Help me!",
		description: "Click 5 powerup",
		icon: "cursors.cursor",
		timeAfter: 0.5,
		unlockCondition: () => GameState.stats.powerupsClicked >= 5,
	}),

	new Achievement({
		id: "click10powerup",
		title: "What?! Help me!",
		description: "Click 10 powerup",
		icon: "cursors.cursor",
		timeAfter: 0.5,
		unlockCondition: () => GameState.stats.powerupsClicked >= 10,
	}),

	new Achievement({
		id: "click20powerup",
		title: "What?! Help me!",
		description: "Click 20 powerup",
		icon: "cursors.cursor",
		timeAfter: 0.5,
		unlockCondition: () => GameState.stats.powerupsClicked >= 20,
	}),

	new Achievement({
		id: "buy10powerup",
		title: "Pay to win",
		description: "Buy 10 powerup",
		icon: "icon_store",
		timeAfter: 1,
		unlockCondition: () => GameState.stats.powerupsBought >= 10,
	}),
	// #endregion POWERUP ACHIEVEMENTS ====================

	// #region ASCENSION ACHIEVEMENTS =====================
	new Achievement({
		id: "ascend1time",
		title: "Oh. So you've met him?",
		description: "Ascend for the first time, it seems that you've met him",
		icon: "icon_ascend",
		secretCondition: () => GameState.stats.timesAscended >= 1
	}),

	new Achievement({
		id: "ascend5time",
		title: "He's funny, isn't he?",
		description: "Ascend for the fifth time",
		icon: "icon_ascend",
		unlockCondition: () => GameState.stats.timesAscended >= 5,
		secretCondition: () => GameState.stats.timesAscended >= 1,
	}),

	new Achievement({
		id: "ascend10time",
		title: "I am the clickery...",
		description: "Ascend for the tenth time",
		icon: "icon_ascend",
		unlockCondition: () => GameState.stats.timesAscended >= 10,
		secretCondition: () => GameState.stats.timesAscended >= 1,
	}),

	new Achievement({
		id: "buy10cards",
		title: "The trickster",
		description: "Buy 10 cards",
		icon: "icon_ascend",
		unlockCondition: () => GameState.ascension.clickPercentagesBought + GameState.ascension.cursorsPercentagesBought + GameState.ascension.powerupPowersBought + GameState.ascension.critPowersBought >= 10,
		secretCondition: () => GameState.stats.timesAscended >= 1,
	}),
	// #endregion ASCENSION ACHIEVEMENTS =====================

	// #region EXTRA ACHIEVEMENTS =====================
	new Achievement({
		id: "click1000times",
		title: "One hell of a clicker",
		description: "Click 1000 times",
		icon: "hexagon",
		unlockCondition: () => GameState.stats.timesClicked >= 1000
	}),

	new Achievement({
		id: "maxedcombo",
		title: "OVERDRIVE!!!",
		description: "Max your combo for the first time, FULL COMBO!!",
		icon: "hexagon",
		timeAfter: 2,
	}),

	new Achievement({
		id: "panderitomode",
		title: "Hmmmmmmmm panderitos...",
		description: "Spell panderito",
		icon: "panderito",
	}),

	new Achievement({
		id: "tapachievementslot",
		title: "That was easy right?",
		description: "Tap this achivement's slot",
		icon: "cursors.point",
	}),

	new Achievement({
		id: "gnome",
		title: "HOLY SHIT GUYS DID YOU SEE THAT???",
		description: "WHAT THE FUCK WAS THAT DID WE GET THAT ON CAMERA??????!!",
		icon: "gnome",
		timeAfter: 1.5,
		readingTime: 5,
		secretCondition: () => GameState.stats.timesGnomed >= 1,
	}),

	new Achievement({
		id: "allsongs",
		title: "Big fan",
		description: "Listen to all the songs at least once",
		icon: "icon_music",
		unlockCondition: () => songsListened.length == Object.keys(songs).length
	}),

	new Achievement({
		id: "buy10stuff",
		title: "Inflation",
		description: "Buy 10 things consecutively",
		icon: "icon_store",
	}),

	new Achievement({
		id: "play15minutes",
		title: "Thank you for playing!",
		description: "Play for 15 minutes",
		icon: "cursors.wait",
		unlockCondition: () => GameState.stats.totalTimePlayed >= 60 * 15
	}),

	// #endregion EXTRA ACHIEVEMENTS =====================
	new Achievement({
		id: "allAchievements",
		title: "CONGRATS!!!!",
		description: "Complete all achievements",
		icon: "osaka",
		unlockCondition: () => GameState.unlockedAchievements.length == achievements.length - 1
	}),
] as Achievement[]

// TODO: Find a working api for the secret achievements
export function getAchievement(achievementId:string) {
	return achievements.filter(achievementObject => achievementObject.id == achievementId)[0]
}

export function isAchievementUnlocked(achievementName:string) {
	return GameState.unlockedAchievements.includes(achievementName)
}

export let achievementsInfo = {
	ids: achievements.map(achievement => achievement.id),
	objects: achievements.map(achievement => achievement),
}

// the ones that don't have a unlockCondition is because they're unlocked at rare cases
export function checkForUnlockable() {
	achievements.forEach(achievement => {
		if (achievement.unlockCondition != null && !isAchievementUnlocked(achievement.id)) {
			if (achievement.unlockCondition()) {
				unlockAchievement(achievement.id)
			}
		}
	})

	// checks for windows
	Object.keys(unlockableWindows).forEach(window => {
		if (!isWindowUnlocked(window as windowKey)) {
			if (unlockableWindows[window].condition()) {
				unlockWindow(window as windowKey)
			}
		}
	})
}

export function unlockAchievement(id:string) {
	if (isAchievementUnlocked(id)) return
	GameState.unlockedAchievements.push(id)
	
	let achievement = getAchievement(id)
	wait(achievement.timeAfter || 0, () => {
		addToast({
			icon: achievement.icon,
			title: achievement.title,
			body: achievement.description,
			duration: achievement.readingTime,
			type: "achievement",
			whenAdded: (toastObj) => {
				playSfx("unlockachievement", { detune: toastObj.index * 100 })
			},
		})

		if (id == "allachievements") {
			addConfetti({ pos: mousePos() })
		}

		ROOT.trigger("achivementUnlock", id)
	})

	if (ngEnabled == true) {
		if (achievement.ngId) ng.unlockMedal(achievement.ngId)
	}
}
