import { GameState } from '../gamestate';
import { folded, folderObj, infoForWindows } from './windows/windows-api/windowsAPI';
import { playSfx } from '../sound';
import { waver } from '../plugins/wave';
import { addMinibutton} from './windows/windows-api/minibuttons';
import { bop } from './utils';
import { ROOT } from '../main';

export let storeWindowsConditionNumber = 25
export let unlockables = {
	"windows": {
		"storeWin": {
			condition: () => GameState.score >= storeWindowsConditionNumber
		},
		"musicWin": {
			condition: () => GameState.score >= 54
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
			condition: () => GameState.score >= 100
		},
		"panderitomode": {
			
		}
	}
}

export function checkForUnlockable() {
	Object.keys(unlockables).forEach(unlockabletype => {
		if (unlockabletype == "windows") {
			Object.keys(unlockables["windows"]).forEach(unlockableWindow => {
				if (!GameState.unlockedWindows.includes(unlockableWindow) && unlockables["windows"][unlockableWindow].condition()) {
					unlockWindow(unlockableWindow)
				}
			})
		}

		else if (unlockabletype == "achievements") {
			Object.keys(unlockables["achievements"]).forEach(unlockableAchievement => {
				// if !gamestate.unlockedAchievements.includes(unlockableachievement) && unlockables condition
				// unlockachievement

				// if (!GameState.unlockedWindows.includes(unlockableWindow) && unlockables["windows"][unlockableWindow].condition()) {
				// 	unlockWindow(unlockableWindow)
				// }
			})
		}
	});
}

export function destroyExclamation(obj) {
	obj?.get("exclamation")?.forEach(element => {
		element?.fadeOut(0.1).onEnd(() => { destroy(element) })
	});
}

export function unlockWindow(windowUnlocked) {
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
				get(windowUnlocked)?.filter(minibutton => minibutton.is("minibutton"))?.forEach((minibutton) => {
					addExclamation(minibutton)
				})
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

	ROOT.trigger("winUnlock")
}