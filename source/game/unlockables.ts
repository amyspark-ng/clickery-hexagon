import { GameState, scoreManager } from '../gamestate';
import { windowKey } from './windows/windows-api/windowManaging';
import { playSfx } from '../sound';
import { waver } from '../plugins/wave';
import { addMinibutton} from './windows/windows-api/minibuttons';
import { bop } from './utils';
import { ROOT } from '../main';
import { addToast } from './additives';
import { addConfetti } from '../plugins/confetti';
import { gridContainer, makeGridMinibutton } from './windows/extraWindow';
import { upgradeInfo } from './windows/store/upgrades';
import { songs, songsListened } from './windows/musicWindow';
import { GameObj } from 'kaplay';
import { folded, folderObj } from './windows/windows-api/folderObj';

// type achievementType = {
// 	title: string, // what you have to do in order to get it
// 	flavorText: string, // some cheeky little joke
// 	condition: () => boolean// the condition
// }

// class Achievement {
// 	constructor(public opts = {} as achievementType) { 

// 	}
// 	// constructor(
// 	// 	public name: string,
// 	// 	public description: string,
// 	// 	public condition: () => boolean
// 	// ) { }
// }

let fullUpgradeValues = {
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
			if (key.includes("c_") && upgradeInfo[key].freq != null) {
				sum += upgradeInfo[key].value
			}
		});
		return sum;
	}
}

// export let achievements: Achievement[] = []

// achievements["100id"] = new Achievement({
// 	title: "Get 100 of score, cool",
// 	flavorText: "Get 100 of score, cool",
// 	condition: () => GameState.score >= 100
// })

// type achievementList = keyof typeof achievements

export let unlockables = {
	"windows": {
		"storeWin": {
			condition: () => GameState.score >= 25
		},
		"settingsWin": {
			condition: () => GameState.score >= 50
		},
		"statsWin": {
			condition: () => GameState.score >= 60
		},
		"extraWin": {
			condition: () => GameState.score >= 149
		},
		"musicWin": {
			condition: () => GameState.score >= 150
		},
		"medalsWin": {
			condition: () => GameState.score >= 105
		},
		"creditsWin": {
			condition: () => GameState.score >= 200
		},
		"ascendWin": {
			condition: () => GameState.scoreAllTime >= scoreManager.seventyMillions
		},
	},

	// i have to use this fuckass format because javascript object sorting FUCKS. ME. UP
	
	/* TODO: Missing types of achievements
	- Score per second
	- Score forfeited on ascending
	- Score gained by tapping
	- Score gained by cursors
	*/
	"achievements": [
		// #region SCORE ACHIEVEMENTS =====================
		{"name":"100score",
			"text": "Get 100 of score, cool", 
			"icon":"upgrades.k_0",
			condition: () => GameState.score >= 100
		},
		{"name":"500score",
			"text": "Get 500 of score, cool", 
			"icon":"upgrades.k_1",
			condition: () => GameState.score >= 500
		},
		{"name":"1000score",
			"text": "Get 1.000 of score, cool", 
			"icon":"upgrades.k_2",
			condition: () => GameState.score >= 1000
		},
		{"name":"5000score",
			"text": "Get 5.000 of score, cool", 
			"icon":"upgrades.k_3",
			condition: () => GameState.score >= 5000
		},
		{"name":"10000score",
			"text": "Get 10.0000 of score, cool", 
			"icon":"upgrades.k_4",
			condition: () => GameState.score >= 10000
		},
		{"name":"25000score",
			"text": "Get 25.0000 of score, cool", 
			"icon":"upgrades.k_5",
			condition: () => GameState.score >= 25000
		},
		{"name":"50000score",
			"text": "Get 50.0000 of score, cool", 
			"icon":"upgrades.c_6",
			condition: () => GameState.score >= 50000
		},
		{"name":"scientificenotscore",
			"text": "Get 1 sextillion of score, now using scientific e notation", 
			"icon":"upgrades.c_6",
			condition: () => GameState.score >= scoreManager.scientificENOT
		},
		// #endregion SCORE ACHIEVEMENTS ====================
		// #region CLICKER/CURSOR ACHIEVEMENTS ==================
		// #### CLICKERS
		{"name":"10clickers",
			"text": "Have 10 clickers", 
			"icon": "cursors.cursor",
			condition: () => GameState.clickers >= 10
		},
		{"name":"20clickers",
			"text": "Have 20 clickers", 
			"icon": "cursors.cursor",
			condition: () => GameState.clickers >= 20
		},
		{"name":"30clickers",
			"text": "Have 30 clickers", 
			"icon": "cursors.cursor",
			condition: () => GameState.clickers >= 30
		},
		{"name":"40clickers",
			"text": "Have 40 clickers", 
			"icon": "cursors.cursor",
			condition: () => GameState.clickers >= 40
		},
		{"name":"50clickers",
			"text": "Have 50 clickers", 
			"icon": "cursors.cursor",
			condition: () => GameState.clickers >= 50
		},
		// ##### CURSORS
		{"name":"10cursor",
			"text": "Have 10 cursor", 
			"icon": "cursors.point",
			condition: () => GameState.cursors >= 10
		},
		{"name":"20cursor",
			"text": "Have 20 cursor", 
			"icon": "cursors.point",
			condition: () => GameState.cursors >= 20
		},
		{"name":"30cursor",
			"text": "Have 30 cursor", 
			"icon": "cursors.point",
			condition: () => GameState.cursors >= 30
		},
		{"name":"40cursor",
			"text": "Have 40 cursor", 
			"icon": "cursors.point",
			condition: () => GameState.cursors >= 40
		},
		{"name":"50cursor",
			"text": "Have 50 cursor", 
			"icon": "cursors.point",
			condition: () => GameState.cursors >= 50
		},
		//#endregion CLICKERS/CURSORS ACHIEVEMENTS =================
		// #region SCORE PER SECOND ACHIEVEMENTS ==================
		{"name":"10scorepersecond",
			"text":"Get to 10 score per second",
			"icon":"cursors.cursor",
			condition: () => scoreManager.autoScorePerSecond() >= 10
		},
		//#endregion SCORE PER SECOND ACHIEVEMENTS =================
		{"name":"allclickupgrades",
			"text":"Buy all click upgrades",
			"icon":"icon_store",
			"timeAfter": 1,
			condition: () => GameState.clicksUpgradesValue == fullUpgradeValues.clicks()
		},
		{"name":"buyallupgrades",
			"text":"Buy all available upgrades",
			"icon":"icon_store",
			"timeAfter": 1,
			condition: () => GameState.clicksUpgradesValue == fullUpgradeValues.clicks() && GameState.cursorsUpgradesValue == fullUpgradeValues.cursors() && GameState.timeUntilAutoLoopEnds == 1
		},
		// #region POWERUP ACHIEVEMENTS =====================
		{"name":"click1powerup",
			"text":"Click 1 powerup, little helping hand :)",
			"icon":"cursors.cursor",
			"timeAfter": 0.5,
			condition: () => GameState.stats.powerupsClicked >= 1
		},
		{"name":"click5powerup",
			"text":"Click 5 powerup, you've played a while...",
			"icon":"cursors.cursor",
			"timeAfter": 0.5,
			condition: () => GameState.stats.powerupsClicked >= 5
		},
		{"name":"click10powerup",
			"text":"Click 10 powerup, ran out of texts...",
			"icon":"cursors.cursor",
			"timeAfter": 0.5,
			condition: () => GameState.stats.powerupsClicked >= 10
		},
		{"name":"click15powerup",
			"text":"Click 15 powerup, ran out of texts...",
			"icon":"cursors.cursor",
			"timeAfter": 0.5,
			condition: () => GameState.stats.powerupsClicked >= 15
		},
		{"name":"click20powerup",
			"text":"Click 20 powerup, ran out of texts...",
			"icon":"cursors.cursor",
			"timeAfter": 0.5,
			condition: () => GameState.stats.powerupsClicked >= 20
		},
		{"name":"click25powerup",
			"text":"Click 25 powerup, ran out of texts...",
			"icon":"cursors.cursor",
			"timeAfter": 0.5,
			condition: () => GameState.stats.powerupsClicked >= 25
		},
		// # BUYING ACHIEVEMENTS
		{"name":"buy1powerup",
			"text":"Buy 1 powerup, pay to win",
			"icon":"icon_store",
			"timeAfter": 0.5,
			condition: () => GameState.stats.powerupsBought >= 1
		},
		{"name":"buy5powerup",
			"text":"Buy 5 powerup, Scrooge McDuck over here",
			"icon":"icon_store",
			"timeAfter": 0.5,
			condition: () => GameState.stats.powerupsBought >= 5
		},
		{"name":"buy10powerup",
			"text":"Buy 10 powerup, ok that's enough we're running out",
			"icon":"icon_store",
			"timeAfter": 0.5,
			condition: () => GameState.stats.powerupsBought >= 10
		},
		// #endregion POWERUP ACHIEVEMENTS ====================
		// #region ASCENSION ACHIEVEMENTS ====================
		{"name":"ascend1time",
			"text":"Ascend for the first time",
			"icon":"icon_ascend",
		},
		{"name":"ascend5time",
			"text":"Ascend 5 times",
			"icon":"icon_ascend",
			condition: () => GameState.stats.timesAscended >= 5
		},
		//#endregion
		// #region EXTRA ACHIEVEMENTS ========================
		{"name":"maxedcombo",
			"text": "Max combo for the first time, FULL COMBO!!!!", 
			"icon": "hexagon",
			"timeAfter": 2
		},
		{"name":"allwindowsontaskbar",
			"text": "Open all the windows in your taskbar, CPU usage too high", 
			"icon": "icon_extra.open_default"
		},
		{"name":"panderitomode",
			"text": "Panderito, panderito mode", 
			"icon": "panderito"
		},
		{"name":"tapachievementslot",
			"text": "Tap this achievement slot, simple enough", 
			"icon": "cursors.point"
		},
		{"name":"gnome",
			"text": "HOLY SHIT DID YOU GUYS SEE THAT????", 
			"icon": "gnome",
			"timeAfter": 2.5,
		},
		{"name":"allsongs",
			"text": "Big fan, listen to all the songs", 
			"icon": "icon_music",
			condition: () => songsListened.length == Object.keys(songs).length,
		},
		// #endregion EXTRA ACHIEVEMENTS ========================
		{"name":"allachievements",
			"text": "Complete all achievements, congrats!!!", 
			"icon": "osaka",
			"timeAfter": 1,
			condition: () => GameState.unlockedAchievements.length == Object.keys(unlockables["achievements"]).length - 1
		},
	], 
}

// TODO: find a way for these to take an actual achievement id (being the name) instead of a string
// export function testAchivement(achievement:achievementList) {

// }

export function getAchievementFor(achievementName:string) {
	return unlockables.achievements.filter(achievementObject => achievementObject.name == achievementName)[0]
}

export function getIndexForAchievement(achievementName:string) {
	return unlockables.achievements.indexOf(getAchievementFor(achievementName))
}

export function allAchivementsNames() {
	return unlockables.achievements.map(achievement => achievement.name)
}

export function isWindowUnlocked(windowName:windowKey) {
	return GameState.unlockedWindows.includes(windowName)
}

export function isAchievementUnlocked(achievementName:string) {
	return GameState.unlockedAchievements.includes(achievementName)
}

// the ones that don't have a condition is because they're unlocked at rare cases
export function checkForUnlockable() {
	Object.keys(unlockables).forEach(unlockabletype => {
		if (unlockabletype == "windows") {
			// gets all the windows unlockable
			//  and filters the one that are not already unlocked AND have a condition
			Object.keys(unlockables["windows"]).filter(window => !isWindowUnlocked(window as windowKey) && unlockables["windows"][window].condition).forEach(unlockableWindow => {
				// if condition is met
				if (unlockables["windows"][unlockableWindow].condition()) {
					unlockWindow(unlockableWindow as windowKey)
				}
			})
		}

		else if (unlockabletype == "achievements") {
			// gets all the achievements unlockable
			// and filters the one that are not already unlocked AND have a condition
			unlockables.achievements.filter(achievementObject => !isAchievementUnlocked(achievementObject.name) && achievementObject.condition != null).forEach(unlockableAchievement => {
				// if condition is met
				if (getAchievementFor(unlockableAchievement.name).condition()) {
					unlockAchievement(unlockableAchievement.name)
				}
			})
		}
	});
}

export function unlockAchievement(achievementName:string) {
	let achievementInfo = getAchievementFor(achievementName)
	let waitTime = achievementInfo.timeAfter ?? 0

	GameState.unlockedAchievements.push(achievementName)

	wait(waitTime, () => {
		addToast({
			icon: achievementInfo.icon,
			title: "Unlocked Achievement!",
			body: `${achievementInfo.text}`,
		})

		if (achievementName == "allachievements") {
			addConfetti({ pos: mousePos() })
		}
	})
}

export function destroyExclamation(obj) {
	obj?.get("exclamation")?.forEach(element => {
		element?.fadeOut(0.1).onEnd(() => { destroy(element) })
	});
}

export function addExclamation(obj:GameObj) {
	// there's no exclamation
	if (obj.get("exclamation").length == 0) {
		let exclamation = obj.add([
			text("!", { font: "lambdao", size: 45 }),
			pos(obj.width / 2, -obj.height / 2),
			anchor("center"),
			scale(),
			opacity(1),
			waver({ maxAmplitude: 5 }),
			"exclamation",
			{
				times: 0,
			}
		])
	
		tween(-obj.height, -obj.height / 2, 0.32, (p) => exclamation.pos.y = p, easings.easeOutBack).onEnd(() => {
			exclamation.startWave()
		})
		tween(0.5, 1, 0.32, (p) => exclamation.opacity = p, easings.easeOutQuad)
	}

	else {
		let exclamation = obj.get("exclamation")[0]
		bop(exclamation)
	}
}

export function unlockWindow(windowJustUnlocked:windowKey) {
	// does the actual stuff
	GameState.unlockedWindows.push(windowJustUnlocked)
	playSfx("windowUnlocked")
	
	if (GameState.taskbar.length < 4 || windowJustUnlocked == "extraWin") {
		GameState.taskbar.push(windowJustUnlocked)
	}

	else {
		// i got a 'Too much recursion!' crash here, got pretty scared :(
		// if (GameState.unlockedWindows.includes("extraWin") == false) {
		// 	unlockWindow("extraWin")
		// 	GameState.taskbar.push("extraWin")
		// }
	}

	// if the folderObj is folded
	if (folded == true) {
		addExclamation(folderObj)

		let unfoldCheckEvent = folderObj.on("unfold", () => {
			destroyExclamation(folderObj)

			// is on taskbar
			if (GameState.taskbar.includes(windowJustUnlocked)) {
				let newlyUnlockedBtn = get("minibutton").filter(btn => btn.windowKey == windowJustUnlocked)[0]
				addExclamation(newlyUnlockedBtn)
			}

			// it went to extraa win
			else if (GameState.taskbar.includes(windowJustUnlocked) == false) {
				let extraWinBtn = get("minibutton").filter(btn => btn.windowKey == "extraWin")[0]
				addExclamation(extraWinBtn)
			}

			unfoldCheckEvent.cancel()
		})
	}

	// if the folderobj is unfolded
	else if (folded == false) {
		if (GameState.taskbar.includes(windowJustUnlocked)) {
			// index in taskbar of the new button
			let newIndex = GameState.taskbar.indexOf(windowJustUnlocked)
			
			let btnForNewWindow = addMinibutton({
				windowKey: windowJustUnlocked,
				taskbarIndex: newIndex,
				initialPosition: folderObj.pos,
				moveToPosition: true,
			})

			addExclamation(btnForNewWindow)
		}

		else {
			let extraWinBtn = get("minibutton").filter(btn => btn.windowKey == "extraWin")[0]
			addExclamation(extraWinBtn)
			// if the window goes to the extra window but the extra win hasn't been unlocked yet 
			// we're oging to have trouble
			// i just unlock extra win before musicwin and hope that fixes everything
		}
	}

	// if the window is on extra win i have to check if the extra win is opened to add the extra minibutton
	// if is not open i have to wait until then
	if (GameState.taskbar.includes(windowJustUnlocked) == false) {
		let extraWinOpenCheck = ROOT.on("winOpen", (windowOpened) => {
			if (windowOpened == "extraWin") {
				let gridMinibtn = get("gridMiniButton", { recursive: true }).filter((btn) => btn.windowKey == windowJustUnlocked)[0]
				addExclamation(gridMinibtn)
	
				extraWinOpenCheck.cancel()
			}
		})
	}

	ROOT.trigger("winUnlock", windowJustUnlocked)
}