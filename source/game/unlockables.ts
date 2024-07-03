import { GameState } from '../gamestate';
import { folded, folderObj, infoForWindows } from './windows/windows-api/windowsAPI';
import { playSfx } from '../sound';
import { waver } from '../plugins/wave';
import { addMinibutton} from './windows/windows-api/minibuttons';
import { bop } from './utils';
import { ROOT } from '../main';
import { addToast } from './additives';

export let storeWindowsConditionNumber = 25

export let unlockables = {
	"windows": {
		"storeWin": {
			condition: () => GameState.score >= storeWindowsConditionNumber
		},
		"musicWin": {
			condition: () => GameState.score >= 50
		},
		"statsWin": {
			condition: () => GameState.score >= 54
		},
		"ascendWin": {
			condition: () => GameState.score >= 56
		},
		"settingsWin": {
			condition: () => GameState.score >= 56
		},
		"medalsWin": {
			condition: () => GameState.score >= 56
		},
		"creditsWin": {
			condition: () => GameState.score >= 56
		},
	},
	
	"achievements": {
		"100score": {
			text: "Get 100 score, it starts....",
			icon: "icon_about",
			condition: () => GameState.score >= 100,
		},
		"maxedcombo": {
			text: "Max combo for the first time, FULL COMBO!!!!!!",
			icon: "hexagon",
		},
		"allwindowsontaskbar": {
			text: "Open all the windows in your taskbar, cpu usage too high",
			icon: "hexagon",
		},
		"panderitomode": {
			text: "Panderito, panderito mode",
			icon: "panderito"
		},
		"tapachievementslot": {
			text: "Tap this achievement slot, easy enough",
			icon: "cursors.point",
		},
		"gnome": {
			text: "HOLY SHIT DID YOU GUYS SEE THAT???",
			icon: "gnome",
			timeAfter: 2.5,
		}
	}
}

export function hasUnlockedWindow(window) {
	return GameState.unlockedWindows.includes(window)
}

export function isAchievementUnlocked(achievement) {
	return GameState.unlockedAchievements.includes(achievement)
}

// the ones that don't have a condition is because they're unlocked at rare cases
export function checkForUnlockable() {
	Object.keys(unlockables).forEach(unlockabletype => {
		if (unlockabletype == "windows") {
			// gets all the windows unlockable
			//  and filters the one that are not already unlocked AND have a condition
			Object.keys(unlockables["windows"]).filter(window => !hasUnlockedWindow(window) && unlockables["windows"][window].condition).forEach(unlockableWindow => {
				// if condition is met
				if (unlockables["windows"][unlockableWindow].condition()) {
					unlockWindow(unlockableWindow)
				}
			})
		}

		else if (unlockabletype == "achievements") {
			// gets all the achievements unlockable
			// and filters the one that are not already unlocked AND have a condition
			Object.keys(unlockables["achievements"]).filter(achievement => !isAchievementUnlocked(achievement) && unlockables["achievements"][achievement].condition).forEach(unlockableAchievement => {
				// if condition is met
				if (unlockables["achievements"][unlockableAchievement].condition()) {
					unlockAchievement(unlockableAchievement)
				}
			})
		}
	});
}

export function unlockAchievement(achievement:string) {
	let waitTime = unlockables["achievements"][achievement].timeAfter || 0
	
	wait(waitTime, () => {
		addToast({
			icon: unlockables["achievements"][achievement].icon,
			title: "Unlocked Achievement!",
			body: `${unlockables["achievements"][achievement].text}`,
		})
	
		GameState.unlockedAchievements.push(achievement)
	})
}

export function destroyExclamation(obj) {
	obj?.get("exclamation")?.forEach(element => {
		element?.fadeOut(0.1).onEnd(() => { destroy(element) })
	});
}

export function unlockWindow(window:string) {
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
	GameState.unlockedWindows.push(window)
	playSfx("hoverhex")
	
	if (GameState.taskbar.length < 4) {
		GameState.taskbar.push(window)
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
				get(window)?.filter(minibutton => minibutton.is("minibutton"))?.forEach((minibutton) => {
					addExclamation(minibutton)
				})
				manageFoldEvent.cancel()
			}
		})
	}

	// unfolded, yikes!!
	else {
		if (window == "extraWin" || GameState.taskbar.includes(window)) {
			let newIndex = GameState.taskbar.indexOf(window)

			let newMinibutton = addMinibutton({
				idxForInfo: infoForWindows[window].idx,
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

	ROOT.trigger("winUnlock")
}