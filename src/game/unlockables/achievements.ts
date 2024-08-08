import { GameState, scoreManager } from '../../gamestate';
import { windowKey } from '../windows/windows-api/windowManaging';
import { addToast, toastQueue } from '../additives';
import { addConfetti } from '.././plugins/confetti';
import { addUpgrades, upgradeInfo } from '../windows/store/upgrades';
import { songs, songsListened } from '../windows/musicWindow';
import { isWindowUnlocked, unlockableWindows, unlockWindow } from './unlockablewindows';
import { playSfx } from '../../sound';
import { ROOT } from '../../main';

type achievementOpt = {
	/**
	 * The id the achievement will have, (eg: 100score)
	 */
	id: string,
	/**
	 * The name/funny pun the achievement will have
	 */
	title: string,
	/**
	 * The actual condition you have to do to get this achievement
	 */
	description: string,
	/**
	 * The sprite the icon will have (eg: medals.100score)
	 * Always will be `medals.${idOfAchievement}`
	*/
	icon: string,
	/**
	 * This means the achievement is secret, and will only show it's description title and icon if the condition is met
	 */
	secretCondition?: () => boolean;
	/**
	 * How much time (in seconds) after the achievement was unlocked for
	 * The toast to appear
	*/
	timeAfter?: number,
	/**
	 * How long will the toast be for before dissapearing
	 */
	duration?: number,
	/**
	 * The condition in "code", if it doesn't have one it has to be unlocked manually
	 * By doing unlockAchievement()
	 * @returns Wheter the condition for it it's true or false
	 */
	condition?: () => boolean,
}

class Achievement {
	id:string
	title: string;
	description: string;
	icon: string;
	timeAfter: number;
	visible: { secret: boolean, condition: () => boolean };
	duration: number;
	condition: () => boolean;
	secretCondition: () => boolean;
	
	constructor(public opts: achievementOpt) {
		this.id = opts.id
		this.title = opts.title
		this.description = opts.description
		this.icon = opts.icon
		this.timeAfter = opts.timeAfter || 0
		this.duration = opts.duration || 3
		this.condition = opts.condition || null
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

export let achievements:Achievement[]

achievements = [
	/* TODO: Missing types of achievements
		- Score per second
		- Score forfeited on ascending
		- Score gained by tapping
		- Score gained by cursors
	*/
	// #region SCORE ACHIEVEMENTS =====================
	new Achievement({
		id: "100score",
		title: "It starts...",
		description: "Get 100 of score",
		icon: "upgrades.k_0",
		condition: () => GameState.scoreAllTime >= 100,
	}),

	new Achievement({
		id: "500score",
		title: "Wake and click",
		description: "Get 500 of score",
		icon: "upgrades.k_1",
		condition: () => GameState.scoreAllTime >= 500,
	}),

	new Achievement({
		id: "1000score",
		title: "Wake and click",
		description: "Get 1.000 of score",
		icon: "upgrades.k_1",
		condition: () => GameState.scoreAllTime >= 1000,
	}),

	new Achievement({
		id: "5000score",
		title: "Wake and click",
		description: "Get 5.000 of score",
		icon: "upgrades.k_1",
		condition: () => GameState.scoreAllTime >= 5000,
	}),

	new Achievement({
		id: "10000score",
		title: "Wake and click",
		description: "Get 10.000 of score",
		icon: "upgrades.k_1",
		condition: () => GameState.scoreAllTime >= 10000,
	}),

	new Achievement({
		id: "25000score",
		title: "Wake and click",
		description: "Get 25.000 of score",
		icon: "upgrades.k_1",
		condition: () => GameState.scoreAllTime >= 25000,
	}),

	new Achievement({
		id: "50000score",
		title: "Wake and click",
		description: "Get 50.000 of score",
		icon: "upgrades.k_1",
		condition: () => GameState.scoreAllTime >= 50000,
	}),

	new Achievement({
		id: "millionscore",
		title: "That's crazy",
		description: "Get 1 million of score",
		icon: "upgrades.k_1",
		condition: () => GameState.scoreAllTime >= 1_000_000,
	}),

	new Achievement({
		id: "1sextillionscore",
		title: "Getting scientific",
		description: "Get 1 sextillion of score",
		icon: "upgrades.k_1",
		duration: 4,
		condition: () => GameState.scoreAllTime >= scoreManager.scientificENOT,
	}),

	new Achievement({
		id: "1000clicks",
		title: "One hell of a clicker",
		description: "Click 1.000 times",
		icon: "cursors.cursor",
		condition: () => GameState.stats.timesClicked >= 1000,
	}),
	// #endregion SCORE ACHIEVEMENTS ====================

	// #region CLICKER/CURSOR ACHIEVEMENTS ==================
	// ### CLICKERS
	new Achievement({
		id: "10clickers",
		title: "Getting clickery",
		description: "Have 10 clickers",
		icon: "cursors.cursor",
		condition: () => GameState.clickers >= 10,
	}),

	new Achievement({
		id: "20clickers",
		title: "Getting clickery",
		description: "Have 20 clickers",
		icon: "cursors.cursor",
		condition: () => GameState.clickers >= 20,
	}),

	new Achievement({
		id: "30clickers",
		title: "Getting clickery",
		description: "Have 30 clickers",
		icon: "cursors.cursor",
		condition: () => GameState.clickers >= 30,
	}),

	new Achievement({
		id: "40clickers",
		title: "Getting clickery",
		description: "Have 40 clickers",
		icon: "cursors.cursor",
		condition: () => GameState.clickers >= 40,
	}),

	new Achievement({
		id: "50clickers",
		title: "Getting clickery",
		description: "Have 50 clickers",
		icon: "cursors.cursor",
		condition: () => GameState.clickers >= 50,
	}),
	
	// ### CURSORS
	new Achievement({
		id: "10cursors",
		title: "Getting cursory",
		description: "Have 10 cursors",
		icon: "cursors.cursor",
		condition: () => GameState.cursors >= 10,
	}),

	new Achievement({
		id: "20cursors",
		title: "Getting cursory",
		description: "Have 20 cursors",
		icon: "cursors.cursor",
		condition: () => GameState.cursors >= 20,
	}),

	new Achievement({
		id: "30cursors",
		title: "Getting cursory",
		description: "Have 30 cursors",
		icon: "cursors.cursor",
		condition: () => GameState.cursors >= 30,
	}),

	new Achievement({
		id: "40cursors",
		title: "Getting cursory",
		description: "Have 40 cursors",
		icon: "cursors.cursor",
		condition: () => GameState.cursors >= 40,
	}),

	new Achievement({
		id: "50cursors",
		title: "Getting cursory",
		description: "Have 50 cursors",
		icon: "cursors.cursor",
		condition: () => GameState.cursors >= 50,
	}),
	//#endregion CLICKERS/CURSORS ACHIEVEMENTS =================

	// #region SCORE PER SECOND ACHIEVEMENTS ==================
	new Achievement({
		id: "10scorepersecond",
		title: "Very fast score",
		description: "Get to 10 score per second",
		icon: "cursors.cursor",
		condition: () => scoreManager.autoScorePerSecond() >= 10,
	}),
	//#endregion SCORE PER SECOND ACHIEVEMENTS =================

	new Achievement({
		id: "allclickupgrades",
		title: "Very clickery score",
		description: "Buy all the click upgrades",
		icon: "icon_store",
		timeAfter: 1,
		condition: () => GameState.clicksUpgradesValue >= fullUpgradeValues.clicks(),
	}),

	new Achievement({
		id: "allupgrades",
		title: "Very very score",
		description: "Buy all the available upgrades",
		icon: "icon_store",
		timeAfter: 1,
		condition: () => GameState.clicksUpgradesValue >= fullUpgradeValues.clicks() && GameState.cursorsUpgradesValue >= fullUpgradeValues.cursors(),
	}),

	// #region POWERUP ACHIEVEMENTS =====================
	new Achievement({
		id: "click1powerup",
		title: "What?! Help me!",
		description: "Click 1 powerup",
		icon: "cursors.cursor",
		timeAfter: 0.5,
		condition: () => GameState.stats.powerupsClicked >= 1,
	}),

	new Achievement({
		id: "click5powerup",
		title: "What?! Help me!",
		description: "Click 5 powerup",
		icon: "cursors.cursor",
		timeAfter: 0.5,
		condition: () => GameState.stats.powerupsClicked >= 5,
	}),

	new Achievement({
		id: "click10powerup",
		title: "What?! Help me!",
		description: "Click 10 powerup",
		icon: "cursors.cursor",
		timeAfter: 0.5,
		condition: () => GameState.stats.powerupsClicked >= 10,
	}),

	new Achievement({
		id: "buy10powerup",
		title: "Scrooge McDuck",
		description: "Buy 10 powerup",
		icon: "icon_store",
		timeAfter: 1,
		condition: () => GameState.stats.powerupsBought >= 10,
	}),
	// #endregion POWERUP ACHIEVEMENTS ====================

	// #region ASCENSION ACHIEVEMENTS =====================
	new Achievement({
		id: "ascend1time",
		title: "Oh. So you've met him?",
		description: "Ascend for the first time",
		icon: "icon_ascend",
		secretCondition: () => GameState.stats.timesAscended >= 1
	}),

	new Achievement({
		id: "ascend5time",
		title: "He's funny, isn't he?",
		description: "Ascend for the fifth time",
		icon: "icon_ascend",
		condition: () => GameState.stats.timesAscended >= 5,
		secretCondition: () => GameState.stats.timesAscended >= 1,
	}),

	new Achievement({
		id: "ascend10time",
		title: "I am the clickery...",
		description: "Ascend for the tenth time",
		icon: "icon_ascend",
		condition: () => GameState.stats.timesAscended >= 10,
		secretCondition: () => GameState.stats.timesAscended >= 1,
	}),
	// #endregion ASCENSION ACHIEVEMENTS =====================

	// #region EXTRA ACHIEVEMENTS =====================
	new Achievement({
		id: "maxedcombo",
		title: "OVERDRIVE!!!",
		description: "Max your combo for the first time, FULL COMBO!!",
		icon: "hexagon",
		timeAfter: 2,
	}),

	new Achievement({
		id: "allwindowsontaskbar",
		title: "CPU Usage too high!!",
		description: "Open all windows in your taskbar at the same time",
		icon: "icon_extra.open_default",
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
		duration: 5,
		secretCondition: () => GameState.stats.timesGnomed >= 1,
	}),

	new Achievement({
		id: "allsongs",
		title: "Big fan",
		description: "Listen to all the songs at least once",
		icon: "icon_music",
		condition: () => songsListened.length == Object.keys(songs).length
	}),
	// #endregion EXTRA ACHIEVEMENTS =====================
	new Achievement({
		id: "allAchievements",
		title: "CONGRATS!!!!",
		description: "Complete all achievements, congratulations!!",
		icon: "osaka",
		condition: () => GameState.unlockedAchievements.length == achievements.length - 1
	}),
]

// TODO: Find a working api for the secret achievements
// TODO: Find a way to make that achievementId type
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

// the ones that don't have a condition is because they're unlocked at rare cases
export function checkForUnlockable() {
	achievements.forEach(achievement => {
		if (achievement.condition != null && !isAchievementUnlocked(achievement.id)) {
			if (achievement.condition()) {
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
	GameState.unlockedAchievements.push(id)

	let achievement = getAchievement(id)
	
	wait(achievement.timeAfter || 0, () => {

		addToast({
			icon: achievement.icon,
			title: achievement.title,
			body: achievement.description,
			duration: achievement.duration,
			type: "achievement",
		})

		if (id == "allachievements") {
			addConfetti({ pos: mousePos() })
		}

		ROOT.trigger("achivementUnlock", id)
	})
}
