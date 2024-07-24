import { GameState } from '../gamestate';
import { folded, folderObj, infoForWindows } from './windows/windows-api/windowsAPI';
import { playSfx } from '../sound';
import { waver } from '../plugins/wave';
import { addMinibutton} from './windows/windows-api/minibuttons';
import { bop } from './utils';
import { ROOT } from '../main';
import { addToast } from './additives';
import { addConfetti } from '../plugins/confetti';
import { gridContainer } from './windows/extraWindow';
import { upgradeInfo } from './windows/store/upgrades';

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
			condition: () => GameState.score >= 1000000
		},
	},

	// i have to use this fuckass format because javascript object sorting FUCKS. ME. UP
	"achievements": [
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
			condition: () => isAchievementUnlocked("allclickupgrades") && GameState.cursorsUpgradesValue == fullUpgradeValues.cursors() && GameState.timeUntilAutoLoopEnds == 1
		},
		// #region powerup achievements 
		{"name":"buy1powerup",
			"text":"Buy 1 powerup, pay to win",
			"icon":"icon_store",
			"timeAfter": 0.5,
			condition: () => GameState.powerupsBought >= 1
		},
		{"name":"buy5powerup",
			"text":"Buy 5 powerup, Scrooge McDuck over here",
			"icon":"icon_store",
			"timeAfter": 0.5,
			condition: () => GameState.powerupsBought >= 5
		},
		{"name":"buy10powerup",
			"text":"Buy 10 powerup, ok that's enough we're running out",
			"icon":"icon_store",
			"timeAfter": 0.5,
			condition: () => GameState.powerupsBought >= 10
		},
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
		//#endregion
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
		{"name":"allachievements",
			"text": "Complete all achievements, congrats!!!", 
			"icon": "osaka",
			"timeAfter": 1,
			condition: () => GameState.unlockedAchievements.length == Object.keys(unlockables["achievements"]).length - 1
		},
	], 
}

export function getAchievementFor(achievementName:string) {
	return unlockables.achievements.filter(achievementObject => achievementObject.name == achievementName)[0]
}

export function getIndexForAchievement(achievementName:string) {
	return unlockables.achievements.indexOf(getAchievementFor(achievementName))
}

export function allAchivementsNames() {
	return unlockables.achievements.map(achievement => achievement.name)
}

export function isWindowUnlocked(windowName:string) {
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
			Object.keys(unlockables["windows"]).filter(window => !isWindowUnlocked(window) && unlockables["windows"][window].condition).forEach(unlockableWindow => {
				// if condition is met
				if (unlockables["windows"][unlockableWindow].condition()) {
					unlockWindow(unlockableWindow)
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

export function unlockWindow(windowUnlocked:string) {
	function addExclamation(obj:any) {
		if (obj.get("exclamation").length == 0) {
			let exclamation = obj.add([
				text("!", { font: "lambdao", size: 45 }),
				pos(obj.width / 2, -obj.height / 2),
				anchor("center"),
				scale(),
				opacity(1),
				"exclamation",
				{
					times: 0,
				}
			])
		
			tween(-obj.height, -obj.height / 2, 0.32, (p) => exclamation.pos.y = p, easings.easeOutBack).onEnd(() => {
				exclamation.use(waver({ maxAmplitude: 5 }))
				exclamation.startWave()
			})
			tween(0.5, 1, 0.32, (p) => exclamation.opacity = p, easings.easeOutQuad)
		}

		else {
			let exclamation = obj.get("exclamation")[0]
			bop(exclamation)
		}
	}

	// does the actual stuff
	GameState.unlockedWindows.push(windowUnlocked)
	playSfx("hoverhex")
	
	if (GameState.taskbar.length < 4) {
		GameState.taskbar.push(windowUnlocked)
	}

	else {
		// i got a 'Too much recursion!' crash here, got pretty scared :(
		if (!GameState.unlockedWindows.includes("extraWin")) {
			unlockWindow("extraWin")
			GameState.taskbar.push("extraWin")
		}
	}

	if (folded) {
		// adds the exclamation, when the folderObj unfolds it 
		addExclamation(folderObj)
		
		// only add the exclamation to the button if the folderobj also has an exclamation
		if (!folderObj.get("exclamation")) return

		// adds the exclamation to the new minibutton
		let manageFoldEvent = folderObj.on("managefold", (folded:boolean) => {
			if (folderObj.get("exclamation")) {
				destroyExclamation(folderObj)
				manageFoldEvent.cancel() // behaves as a return??? kinda
			}

			if (folded == false) {
				// if the newly unlocked one went to extra window
				if (!GameState.taskbar.includes(windowUnlocked)) {
					// grab the extraWin minibutton and add the exclamation to it
					let thatOne = get("minibutton").filter(minibutton => minibutton.is("extraWin"))[0]
					addExclamation(thatOne)
				}
				
				else {
					// why is it a foreach????
					let thatOne = get("minibutton").filter(minibutton => minibutton.is(windowUnlocked))[0] 
					addExclamation(thatOne)
				}

				manageFoldEvent.cancel()
			}
		})
	}

	// unfolded, yikes!!
	else {
		if (windowUnlocked == "extraWin" || GameState.taskbar.includes(windowUnlocked)) {
			let newIndex = GameState.taskbar.indexOf(windowUnlocked)

			let newMinibutton = addMinibutton({
				idxForInfo: infoForWindows[windowUnlocked].idx,
				taskbarIndex: newIndex,
				initialPosition: folderObj.pos,
				moveToPosition: true,
			})

			addExclamation(newMinibutton)
		}

		// if the taskbar doesn't contain the new unlocked because taskbar is full then
		// put an exclamation on the extrawinbutton
		else {
			let extraWinButton = get("extraWin")?.filter(obj => obj.is("minibutton"))[0] 
			if (extraWinButton) addExclamation(extraWinButton)
		}
	}

	// if window goes to extraWindow
	if (!GameState.taskbar.includes(windowUnlocked)) {
		let winOpenEvent = ROOT.on("winOpen", (windowOpened) => {
			if (windowUnlocked == "extraWin") return
			if (windowOpened != "extraWin") return

			wait(0.01, () => {
				let thatOne = gridContainer.get("gridMiniButton").filter(gridminibutton => gridminibutton.windowKey == windowUnlocked)[0]
				addExclamation(thatOne)
			})

			winOpenEvent?.cancel()
		})
	}

	ROOT.trigger("winUnlock", windowUnlocked)
}