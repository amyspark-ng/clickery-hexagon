import { GameState, scoreManager } from '../../gamestate';
import { windowKey } from '../windows/windows-api/windowManaging';
import { addToast } from '../additives';
import { addConfetti } from '.././plugins/confetti';
import { addUpgrades, upgradeInfo } from '../windows/store/upgrades';
import { songs, songsListened } from '../windows/musicWindow';
import { isWindowUnlocked, unlockableWindows, unlockWindow } from './windowUnlocks';
import { ROOT } from '../../main';
import ng from 'newgrounds.js';
import { ngEnabled } from '../../newgrounds';
import { playSfx } from '../../sound';

export interface AchievementInterface {
	/**
	 * The id the achievement will have, (eg: score.100)
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
	 * The actual thing you have to do to get this achievement in readable string form
	 */
	description: string,
	/**
	 * Might be another funny title pun
	 */
	flavorText?: string,
	/**
	 * The sprite the icon will have
	 * @deprecated Should use ID instead
	*/
	icon?: string,
	/**
	 *  Wheter the achievement is RARE, the question mark will be yellow in that case 
	 */
	rare?: boolean,
	/**
	 * This means the achievement is secret!
	 * It will only show its description and title when unlocked
	 * Otherwise the question mark in the medals window will be tinted purple
	* @returns Wheter the condition for it it's true or false, if it's true it means it's no longer secret
	 */
	visibleCondition?: () => boolean;
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

interface Achievement extends AchievementInterface { }
class Achievement {
    constructor(opts:AchievementInterface) {
		this.id = opts.id
		this.ngId = opts.ngId

		this.title = opts.title
		this.description = opts.description
		this.flavorText = opts.flavorText || ""
		this.icon = opts.icon || `medals_${this.id}`
		this.rare = opts.rare || false
		this.timeAfter = opts.timeAfter || 0
		this.readingTime = opts.readingTime || 3
		this.unlockCondition = opts.unlockCondition || null
		this.visibleCondition = opts.visibleCondition || null
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
		id: "score.100",
		title: "Clicktastic",
		description: "Get 100 of score",
		ngId: 80187,
		unlockCondition: () => GameState.scoreAllTime >= 100,
	}),

	new Achievement({
		id: "score.1_000",
		title: "Finger clickin' good",
		description: "Get 1.000 of score",
		unlockCondition: () => GameState.scoreAllTime >= 1_000,
	}),

	new Achievement({
		id: "score.5_000",
		title: "Now you're clickin",
		description: "Get 5.000 of score",
		unlockCondition: () => GameState.scoreAllTime >= 5_000,
	}),

	new Achievement({
		id: "score.10_000",
		title: "Olimpic Hexagon",
		description: "Get 10.000 of score",
		unlockCondition: () => GameState.scoreAllTime >= 10_000,
	}),

	new Achievement({
		id: "score.25_000",
		title: "Usain Hexagon",
		description: "Get 25.000 of score",
		unlockCondition: () => GameState.scoreAllTime >= 25_000,
	}),

	new Achievement({
		id: "score.50_000",
		title: "Another one click the hexagon",
		description: "Get 50.000 of score",
		unlockCondition: () => GameState.scoreAllTime >= 50_000,
	}),

	new Achievement({
		id: "score.100_000",
		title: "You Spin Me Round (Like a hexagon)",
		description: "Get 100.000 of score",
		unlockCondition: () => GameState.scoreAllTime >= 100_000,
	}),

	new Achievement({
		id: "score.250_000",
		title: "Hex-a-Gone Crazy",
		description: "Get 250.000 of score",
		unlockCondition: () => GameState.scoreAllTime >= 250_000,
	}),

	new Achievement({
		id: "score.500_000",
		title: "[CAMBIAR]",
		description: "Get 500.000 of score",
		unlockCondition: () => GameState.scoreAllTime >= 500_000,
	}),

	new Achievement({
		id: "score.750_000",
		title: "Did you know there's no actual limit to how long these names can be? I specifically spent a lot of time working on them so they can be as LONG as i want them to be and they will do their best to look good",
		description: `Get 750.000 score`,
		flavorText: "I'm not too sure how well it supports long descriptions, i can't really be bothered to test it, i'm pretty close to the deadline of this game coming out so i'd like not to dwell in those dark functions...",
		readingTime: 20,
		unlockCondition: () => GameState.scoreAllTime >= 750_000,
	}),

	new Achievement({
		id: "score.1_million",
		title: "Master of hexagons",
		description: "Get 1 million of score",
		unlockCondition: () => GameState.scoreAllTime >= 1_000_000,
	}),

	new Achievement({
		id: "score.15_million",
		title: "Hex-a-Lent",
		description: "Get 15 million of score",
		unlockCondition: () => GameState.scoreAllTime >= 15_000_000,
	}),

	new Achievement({
		id: "score.50_million",
		title: "Hex-machina",
		description: "Get 50 million of score",
		unlockCondition: () => GameState.scoreAllTime >= 50_000_000,
	}),

	new Achievement({
		id: "score.100_million",
		title: "Clickery Hexagon forever and forever a 100 years clickery Hexagon, all day long forever, forever a hundred times, over and over clickery Hexagon adventures dot com",
		description: "Get 100 million of score",
		unlockCondition: () => GameState.scoreAllTime >= 100_000_000,
	}),

	new Achievement({
		id: "score.250_million",
		title: "Hex-traordinary",
		description: "Get 250 million of score",
		unlockCondition: () => GameState.scoreAllTime >= 250_000_000,
	}),

	// cambialo
	new Achievement({
		id: "score.500_million",
		title: "Hexagonmania!",
		description: "Get 500 million of score",
		unlockCondition: () => GameState.scoreAllTime >= 500_000_000,
	}),

	new Achievement({
		id: "score.600_million",
		title: "Click my hexagons...",
		description: "Get 600 million of score",
		unlockCondition: () => GameState.scoreAllTime >= 600_000_000,
	}),

	// this is the gimmiko achievement
	new Achievement({
		id: "score.750_million",
		title: "Who else is gimmicking their dice right now?",
		description: "Get 750 million of score",
		unlockCondition: () => GameState.scoreAllTime >= 750_000_000,
	}),

	// cambialo
	new Achievement({
		id: "score.950_million",
		title: "Hex-traordinary",
		rare: true,
		description: "Get 950 million of score",
		unlockCondition: () => GameState.scoreAllTime >= 950_000_000,
	}),

	new Achievement({
		id: "score.1_billion",
		title: "F I N A L L Y",
		rare: true,
		description: "Get 1 billion of score, you're crazy for this...",
		unlockCondition: () => GameState.scoreAllTime >= 1_000_000_000,
	}),
	// #endregion SCORE ACHIEVEMENTS ====================

	// #region CLICKER/CURSOR ACHIEVEMENTS ==================
	// ### CLICKERS
	new Achievement({
		id: "clickers.10",
		title: "CAMBIAR",
		description: "Have 10 clickers",
		icon: "cursors.cursor",
		unlockCondition: () => GameState.clickers >= 10,
	}),

	new Achievement({
		id: "clickers.20",
		title: "CAMBIAR",
		description: "Have 20 clickers",
		icon: "cursors.cursor",
		unlockCondition: () => GameState.clickers >= 20,
	}),

	new Achievement({
		id: "clickers.30",
		title: "CAMBIAR",
		description: "Have 30 clickers",
		icon: "cursors.cursor",
		unlockCondition: () => GameState.clickers >= 30,
	}),

	new Achievement({
		id: "clickers.40",
		title: "CAMBIAR",
		description: "Have 40 clickers",
		icon: "cursors.cursor",
		unlockCondition: () => GameState.clickers >= 40,
	}),

	new Achievement({
		id: "clickers.50",
		title: "Iridescent Cursor",
		description: "Have 50 clickers",
		rare: true,
		icon: "cursors.cursor",
		unlockCondition: () => GameState.clickers >= 50,
	}),
	
	// ### CURSORS
	new Achievement({
		id: "cursors.10",
		title: "CAMBIAR",
		description: "Have 10 cursors",
		icon: "cursors.point",
		unlockCondition: () => GameState.cursors >= 10,
	}),

	new Achievement({
		id: "cursors.20",
		title: "CAMBIAR",
		description: "Have 20 cursors",
		icon: "cursors.point",
		unlockCondition: () => GameState.cursors >= 20,
	}),

	new Achievement({
		id: "cursors.30",
		title: "CAMBIAR",
		description: "Have 30 cursors",
		icon: "cursors.point",
		unlockCondition: () => GameState.cursors >= 30,
	}),

	new Achievement({
		id: "cursors.40",
		title: "CAMBIAR",
		description: "Have 40 cursors",
		icon: "cursors.point",
		unlockCondition: () => GameState.cursors >= 40,
	}),

	new Achievement({
		id: "cursors.50",
		title: "CAMBIAR",
		description: "Have 50 cursors",
		rare: true,
		icon: "cursors.point",
		unlockCondition: () => GameState.cursors >= 50,
	}),
	//#endregion CLICKERS/CURSORS ACHIEVEMENTS =================

	new Achievement({
		id: "store.allUpgrades",
		title: "CAMBIAR",
		description: "Buy all the available upgrades",
		icon: "icon_store",
		timeAfter: 1,
		unlockCondition: () => GameState.clicksUpgradesValue >= fullUpgradeValues.clicks() && GameState.cursorsUpgradesValue >= fullUpgradeValues.cursors(),
	}),

	// #region POWERUP ACHIEVEMENTS =====================
	new Achievement({
		id: "powerups.click_1",
		title: "What?! Help me!",
		description: "Click 1 powerup",
		icon: "cursors.cursor",
		timeAfter: 0.5,
		unlockCondition: () => GameState.stats.powerupsClicked >= 1,
	}),

	new Achievement({
		id: "powerups.click_5",
		title: "What?! Help me!",
		description: "Click 5 powerup",
		icon: "cursors.cursor",
		timeAfter: 0.5,
		unlockCondition: () => GameState.stats.powerupsClicked >= 5,
	}),

	new Achievement({
		id: "powerups.click_10",
		title: "What?! Help me!",
		description: "Click 10 powerup",
		icon: "cursors.cursor",
		timeAfter: 0.5,
		unlockCondition: () => GameState.stats.powerupsClicked >= 10,
	}),

	new Achievement({
		id: "powerups.click_20",
		title: "What?! Help me!",
		description: "Click 20 powerup",
		rare: true,
		icon: "cursors.cursor",
		timeAfter: 0.5,
		unlockCondition: () => GameState.stats.powerupsClicked >= 20,
	}),

	new Achievement({
		id: "powerups.buy_10",
		title: "Pay to win",
		description: "Buy 10 powerup",
		icon: "icon_store",
		timeAfter: 1,
		unlockCondition: () => GameState.stats.powerupsBought >= 10,
	}),
	// #endregion POWERUP ACHIEVEMENTS ====================

	// #region ASCENSION ACHIEVEMENTS =====================
	new Achievement({
		id: "ascension.times_1",
		title: "Oh. So you've met him?",
		description: "Ascend for the first time",
		icon: "icon_ascend",
		visibleCondition: () => GameState.stats.timesAscended >= 1
	}),

	new Achievement({
		id: "ascension.times_5",
		title: "He's funny, isn't he?",
		description: "Ascend for the fifth time",
		icon: "icon_ascend",
		unlockCondition: () => GameState.stats.timesAscended >= 5,
		visibleCondition: () => isAchievementUnlocked("ascension.times_1"),
	}),

	new Achievement({
		id: "ascension.times_10",
		title: "I am the clickery...",
		description: "Ascend for the tenth time",
		rare: true,
		icon: "icon_ascend",
		unlockCondition: () => GameState.stats.timesAscended >= 10,
		visibleCondition: () => isAchievementUnlocked("ascension.times_1"),
	}),

	new Achievement({
		id: "ascension.cardsBought_10",
		title: "The trickster",
		description: "Buy 10 cards",
		icon: "icon_ascend",
		unlockCondition: () => (GameState.ascension.clickPercentagesBought + GameState.ascension.cursorsPercentagesBought + GameState.ascension.powerupPowersBought + GameState.ascension.critPowersBought) >= 10,
		visibleCondition: () => isAchievementUnlocked("ascension.times_1"),
	}),
	// #endregion ASCENSION ACHIEVEMENTS =====================

	// #region EXTRA ACHIEVEMENTS =====================
	new Achievement({
		id: "clicks.1000",
		title: "Letting the clicks go by",
		description: "Click 1000 times",
		icon: "hexagon",
		unlockCondition: () => GameState.stats.timesClicked >= 1000
	}),

	new Achievement({
		id: "extra.maxedcombo",
		title: "OVERDRIVE!!!",
		description: "Max your combo for the first time",
		flavorText: "FULL COMBO!!",
		icon: "hexagon",
		timeAfter: 2,
	}),

	new Achievement({
		id: "extra.panderito",
		title: "Hmmmmmmmm panderitos...",
		description: "Spell panderito",
		icon: "panderito",
	}),

	new Achievement({
		id: "extra.theSlot",
		title: "That was easy right?",
		description: "Tap this achivement's slot",
		icon: "cursors.point",
	}),

	new Achievement({
		id: "extra.gnome",
		title: "HOLY SHIT GUYS DID YOU SEE THAT???",
		description: "WHAT THE FUCK WAS THAT DID WE GET THAT ON CAMERA??????!!",
		icon: "gnome",
		timeAfter: 1.5,
		readingTime: 5,
		visibleCondition: () => GameState.stats.timesGnomed >= 1,
	}),

	new Achievement({
		id: "extra.songs",
		title: "Big fan",
		description: "Listen to all the songs at least once",
		icon: "icon_music",
		unlockCondition: () => songsListened.length == Object.keys(songs).length
	}),

	new Achievement({
		id: "store.stuffBought_10",
		title: "Inflation",
		description: "Buy 10 things consecutively",
		icon: "icon_store",
	}),

	new Achievement({
		id: "extra.time_15minutes",
		title: "Hex-citing Times",
		description: "Play for 15 minutes",
		icon: "cursors.wait",
		unlockCondition: () => GameState.stats.totalTimePlayed >= 60 * 15
	}),

	// #endregion EXTRA ACHIEVEMENTS =====================
	new Achievement({
		id: "extra.ALL",
		title: "CONGRATS!!!!",
		description: "Complete all achievements",
		icon: "osaka",
		unlockCondition: () => GameState.unlockedAchievements.length == achievements.length - 1
	}),
] as Achievement[]

// TODO: Find a working api for the secret achievements
export function getAchievement(achievementId:string) {
	if (!achievements.map(achievement => achievement.id).includes(achievementId)) throw new Error(`Achievement: ${achievementId} does not exist`)
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
	if (!achievements.map(achievement => achievement.id).includes(id)) throw new Error(`Achievement: ${id} does not exist`)
	GameState.unlockedAchievements.push(id)
	
	let achievement = getAchievement(id)
	wait(achievement.timeAfter || 0, () => {
		addToast({
			icon: achievement.icon,
			title: achievement.title,
			body: `${achievement.description}. ${achievement.flavorText ?? achievement.flavorText}`,
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
