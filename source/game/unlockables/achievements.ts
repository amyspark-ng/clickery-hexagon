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
import { drawDumbOutline } from '../plugins/drawThings';

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
		ngId: 80364,
		unlockCondition: () => GameState.scoreAllTime >= 1_000,
	}),

	new Achievement({
		id: "score.5_000",
		title: "Now you're clickin",
		description: "Get 5.000 of score",
		ngId: 80365,
		unlockCondition: () => GameState.scoreAllTime >= 5_000,
	}),

	new Achievement({
		id: "score.10_000",
		title: "Olimpic Hexagon",
		description: "Get 10.000 of score",
		ngId: 80367,
		unlockCondition: () => GameState.scoreAllTime >= 10_000,
	}),

	new Achievement({
		id: "score.25_000",
		title: "Usain Hexagon",
		description: "Get 25.000 of score",
		ngId: 80368,
		unlockCondition: () => GameState.scoreAllTime >= 25_000,
	}),

	new Achievement({
		id: "score.50_000",
		title: "Another one clicks the hexagon",
		description: "Get 50.000 of score",
		ngId: 80369,
		unlockCondition: () => GameState.scoreAllTime >= 50_000,
	}),

	new Achievement({
		id: "score.100_000",
		title: "You Spin Me Round (Like a hexagon)",
		description: "Get 100.000 of score",
		ngId: 80370,
		unlockCondition: () => GameState.scoreAllTime >= 100_000,
	}),

	new Achievement({
		id: "score.250_000",
		title: "Hex-a-Gone Crazy",
		description: "Get 250.000 of score",
		ngId: 80371,
		unlockCondition: () => GameState.scoreAllTime >= 250_000,
	}),

	new Achievement({
		id: "score.500_000",
		title: "Placeholder title",
		description: "Get 500.000 of score",
		ngId: 80372,
		unlockCondition: () => GameState.scoreAllTime >= 500_000,
	}),

	new Achievement({
		id: "score.750_000",
		title: "Did you know there's no actual limit to how long these names can be? I specifically spent a lot of time working on them so they can be as LONG as i want them to be and they will do their best to look good",
		description: `Get 750.000 score`,
		flavorText: "I'm not too sure how well it supports long descriptions, i can't really be bothered to test it, i'm pretty close to the deadline of this game coming out so i'd like not to dwell in those dark functions...",
		readingTime: 10,
		ngId: 80384,
		unlockCondition: () => GameState.scoreAllTime >= 750_000,
	}),

	new Achievement({
		id: "score.1_million",
		title: "Master of hexagons",
		description: "Get 1 million of score",
		ngId: 80374,
		unlockCondition: () => GameState.scoreAllTime >= 1_000_000,
	}),

	new Achievement({
		id: "score.15_million",
		title: "Hex-a-Lent",
		description: "Get 15 million of score",
		ngId: 80375,
		unlockCondition: () => GameState.scoreAllTime >= 15_000_000,
	}),

	new Achievement({
		id: "score.50_million",
		title: "Hex-machina",
		description: "Get 50 million of score",
		ngId: 80376,
		unlockCondition: () => GameState.scoreAllTime >= 50_000_000,
	}),

	new Achievement({
		id: "score.100_million",
		title: "Clickery Hexagon forever and forever a 100 years clickery Hexagon, all day long forever, forever a hundred times, over and over clickery Hexagon adventures dot com",
		description: "Get 100 million of score",
		ngId: 80385,
		unlockCondition: () => GameState.scoreAllTime >= 100_000_000,
	}),

	new Achievement({
		id: "score.250_million",
		title: "Hex-traordinary",
		description: "Get 250 million of score",
		ngId: 80378,
		unlockCondition: () => GameState.scoreAllTime >= 250_000_000,
	}),

	new Achievement({
		id: "score.500_million",
		title: "Hexagonmania!",
		description: "Get 500 million of score",
		ngId: 80379,
		unlockCondition: () => GameState.scoreAllTime >= 500_000_000,
	}),

	new Achievement({
		id: "score.600_million",
		title: "Click my hexagons...",
		description: "Get 600 million of score",
		ngId: 80380,
		unlockCondition: () => GameState.scoreAllTime >= 600_000_000,
	}),

	// this is the gimmiko achievement
	new Achievement({
		id: "score.750_million",
		title: "Who else is gimmicking their dice right now?",
		description: "Get 750 million of score",
		ngId: 80381,
		unlockCondition: () => GameState.scoreAllTime >= 750_000_000,
	}),

	new Achievement({
		id: "score.950_million",
		title: "You've come so far",
		description: "Get 950 million of score",
		ngId: 80382,
		unlockCondition: () => GameState.scoreAllTime >= 950_000_000,
	}),

	new Achievement({
		id: "score.1_billion",
		title: "F I N A L L Y",
		rare: true,
		description: "Get 1 billion of score, you're crazy for this...",
		ngId: 80383,
		unlockCondition: () => GameState.scoreAllTime >= 1_000_000_000,
	}),
	// #endregion SCORE ACHIEVEMENTS ====================

	// #region CLICKER/CURSOR ACHIEVEMENTS ==================
	// ### CLICKERS
	new Achievement({
		id: "clickers.10",
		title: "Seeing decuple",
		description: "Have 10 clickers",
		ngId: 80446,
		unlockCondition: () => GameState.clickers >= 10,
	}),

	new Achievement({
		id: "clickers.20",
		title: "Mitosis",
		flavorText: "At the Telophase",
		description: "Have 20 clickers",
		ngId: 80447,
		unlockCondition: () => GameState.clickers >= 20,
	}),

	new Achievement({
		id: "clickers.30",
		title: "DIE HARD",
		flavorText: "I've never seen die hard",
		description: "Have 30 clickers",
		ngId: 80448,
		unlockCondition: () => GameState.clickers >= 30,
	}),

	new Achievement({
		id: "clickers.40",
		title: "Ommmmmm",
		flavorText: "Mastering clicking power",
		description: "Have 40 clickers",
		ngId: 80449,
		unlockCondition: () => GameState.clickers >= 40,
	}),

	new Achievement({
		id: "clickers.50",
		title: "Iridescent Cursor",
		flavorText: "50 millions clicks, is what it would take for you to break your mouse, kinda",
		description: "Have 50 clickers",
		rare: true,
		ngId: 80450,
		unlockCondition: () => GameState.clickers >= 50,
	}),
	
	// ### CURSORS
	new Achievement({
		id: "cursors.10",
		title: "I work hard for the money",
		flavorText: "So hard for the money",
		description: "Have 10 cursors",
		ngId: 80451,
		unlockCondition: () => GameState.cursors >= 10,
	}),

	new Achievement({
		id: "cursors.20",
		title: "Check out this ruby i got",
		flavorText: "That's an emerald dude",
		description: "Have 20 cursors",
		ngId: 80452,
		unlockCondition: () => GameState.cursors >= 20,
	}),

	new Achievement({
		id: "cursors.30",
		title: "Telekinesis",
		flavorText: "Not even touching the mouse",
		description: "Have 30 cursors",
		ngId: 80453,
		unlockCondition: () => GameState.cursors >= 30,
	}),

	new Achievement({
		id: "cursors.40",
		title: "Twisted",
		flavorText: "Scrumptious amounts",
		description: "Have 40 cursors",
		ngId: 80454,
		unlockCondition: () => GameState.cursors >= 40,
	}),

	new Achievement({
		id: "cursors.50",
		title: "Frankenstein's cursor",
		flavorText: "RAAAAAA",
		description: "Have 50 cursors",
		rare: true,
		ngId: 80455,
		unlockCondition: () => GameState.cursors >= 50,
	}),
	//#endregion CLICKERS/CURSORS ACHIEVEMENTS =================

	new Achievement({
		id: "store.allUpgrades",
		title: "All done (no)",
		flavorText: "Some Power-Ups would go great on this",
		description: "Buy all the available upgrades",
		timeAfter: 1,
		ngId: 80456,
		unlockCondition: () => GameState.clicksUpgradesValue >= fullUpgradeValues.clicks() && GameState.cursorsUpgradesValue >= fullUpgradeValues.cursors(),
	}),

	// #region POWERUP ACHIEVEMENTS =====================
	new Achievement({
		id: "powerups.click_1",
		title: "Golden Cook- wait",
		flavorText: "Wrong game sorry",
		description: "Click 1 powerup",
		timeAfter: 0.5,
		ngId: 80457,
		unlockCondition: () => GameState.stats.powerupsClicked >= 1,
	}),

	new Achievement({
		id: "powerups.click_5",
		title: "What?! Help me!",
		flavorText: "Help = LIKE",
		description: "Click 5 powerup",
		timeAfter: 0.5,
		ngId: 80458,
		unlockCondition: () => GameState.stats.powerupsClicked >= 5,
	}),

	new Achievement({
		id: "powerups.click_10",
		title: "Full of power",
		description: "And soup",
		timeAfter: 0.5,
		ngId: 80459,
		unlockCondition: () => GameState.stats.powerupsClicked >= 10,
	}),

	new Achievement({
		id: "powerups.click_20",
		title: "Super HEXAGON",
		description: "Click 20 powerup",
		rare: true,
		timeAfter: 0.5,
		ngId: 80460,
		unlockCondition: () => GameState.stats.powerupsClicked >= 20,
	}),

	new Achievement({
		id: "powerups.buy_10",
		title: "Pay to win",
		flavorText: "Only 899.99 monthly",
		description: "Buy 10 powerup",
		timeAfter: 1,
		ngId: 80461,
		unlockCondition: () => GameState.stats.powerupsBought >= 10,
	}),
	// #endregion POWERUP ACHIEVEMENTS ====================

	// #region ASCENSION ACHIEVEMENTS =====================
	new Achievement({
		id: "ascension.times_1",
		title: "Oh. So you've met him?",
		description: "Ascend for the first time",
		ngId: 80462,
		visibleCondition: () => GameState.stats.timesAscended >= 1
	}),

	new Achievement({
		id: "ascension.times_5",
		title: "He's funny, isn't he?",
		description: "Ascend for the fifth time",
		ngId: 80463,
		unlockCondition: () => GameState.stats.timesAscended >= 5,
		visibleCondition: () => isAchievementUnlocked("ascension.times_1"),
	}),

	new Achievement({
		id: "ascension.times_10",
		title: "I am the clickery...",
		description: "Ascend for the tenth time",
		rare: true,
		ngId: 80464,
		unlockCondition: () => GameState.stats.timesAscended >= 10,
		visibleCondition: () => isAchievementUnlocked("ascension.times_1"),
	}),

	new Achievement({
		id: "ascension.cardsBought_10",
		title: "The trickster",
		flavorText: "Wooimabouttomakeanameformyselfhere",
		description: "Buy 10 cards",
		ngId: 80465,
		unlockCondition: () => (GameState.ascension.clickPercentagesBought + GameState.ascension.cursorsPercentagesBought + GameState.ascension.powerupPowersBought + GameState.ascension.critPowersBought) >= 10,
		visibleCondition: () => isAchievementUnlocked("ascension.times_1"),
	}),
	// #endregion ASCENSION ACHIEVEMENTS =====================

	// #region EXTRA ACHIEVEMENTS =====================
	new Achievement({
		id: "clicks.1000",
		title: "Letting the clicks go by",
		flavorText: "Score flowing underground",
		description: "Click 1000 times",
		ngId: 80466,
		unlockCondition: () => GameState.stats.timesClicked >= 1000
	}),

	new Achievement({
		id: "extra.maxedcombo",
		title: "OVERDRIVE!!!",
		description: "Max your combo for the first time",
		flavorText: "FULL COMBO!!",
		ngId: 80467,
		timeAfter: 2,
	}),

	new Achievement({
		id: "extra.panderito",
		title: "So tasty",
		flavorText: "Panderitos.....",
		description: "Spell panderito",
		ngId: 80468,
	}),

	new Achievement({
		id: "extra.theSlot",
		title: "Click click lick",
		flavorText: "It wasn't hard was it?",
		description: "Click this achivement's slot",
		ngId: 80469,
	}),

	new Achievement({
		id: "extra.gnome",
		title: "HOLY CRAP GUYS DID YOU SEE THAT???",
		description: "WHAT THE HELL WAS THAT DID WE GET THAT ON CAMERA??????!!",
		timeAfter: 1.5,
		readingTime: 5,
		ngId: 80470,
		visibleCondition: () => GameState.stats.beenGnomed == true,
	}),

	new Achievement({
		id: "extra.songs",
		title: "Music lover",
		description: "Listen to all the songs at least once",
		ngId: 80471,
		unlockCondition: () => songsListened.length == Object.keys(songs).length
	}),

	// inflation was the original name, it was pretty good i think
	new Achievement({
		id: "store.stuffBought_10",
		title: "Scrooge McDuck",
		description: "Buy 10 things consecutively",
		ngId: 80472,
	}),

	new Achievement({
		id: "extra.time_15minutes",
		title: "Hex-citing Times",
		description: "Play for 15 minutes",
		flavorText: "Thanks for playing!",
		ngId: 80473,
		unlockCondition: () => GameState.stats.totalTimePlayed >= 60 * 15
	}),

	// #endregion EXTRA ACHIEVEMENTS =====================
	new Achievement({
		id: "extra.ALL",
		title: "F I N A L L Y",
		flavorText: "You're the master now",
		description: "Complete all achievements",
		ngId: 80474,
		unlockCondition: () => GameState.unlockedAchievements.length == achievements.length - 1
	}),
] as Achievement[]

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
	
	const theAchievement = getAchievement(id)
	wait(theAchievement.timeAfter || 0, () => {
		addToast({
			icon: `medals_${theAchievement.id}`,
			title: theAchievement.title,
			body: `${theAchievement.description}. ${theAchievement.flavorText ?? theAchievement.flavorText}`,
			duration: theAchievement.readingTime,
			type: "achievement",
			whenAdded: (toastObj, icon) => {
				playSfx("unlockachievement", { detune: toastObj.index * 100 })
			
				if (theAchievement.id != "extra.theSlot") {
					icon.onDraw(() => {
						drawRect({
							anchor: icon.anchor,
							width: icon.width,
							height: icon.height,
							color: BLACK,
							fill: false,
							fixed: true,
							outline: {
								width: 3,
								color: BLACK
							}
						})
					})
	
					if (theAchievement.id == "extra.ALL") icon.play("master")
				}
			},
		})

		if (id == "allachievements") {
			addConfetti({ pos: mousePos() })
		}

		ROOT.trigger("achivementUnlock", id)
	})

	// if (ngEnabled == true) {
	// 	if (theAchievement.ngId) ng.unlockMedal(theAchievement.ngId)
	// }
}
