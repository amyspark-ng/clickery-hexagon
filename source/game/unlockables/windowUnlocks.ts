import { GameObj } from "kaplay";
import { GameState, scoreManager } from "../../gamestate";
import { isWindowOpen, windowKey } from "../windows/windows-api/windowManaging";
import { waver } from "../plugins/wave";
import { bop, sortedTaskbar } from "../utils";
import { playSfx } from "../../sound";
import { folded, folderObj } from "../windows/windows-api/folderObj";
import { addMinibutton } from "../windows/windows-api/minibuttons";
import { ROOT } from "../../main";
import { addGridButton } from "../windows/extraWin";

export let unlockableWindows = {
	"storeWin": {
		condition: () => GameState.scoreAllTime >= 25
	},
	"settingsWin": {
		condition: () => GameState.scoreAllTime >= 50
	},
	"statsWin": {
		condition: () => GameState.scoreAllTime >= 60
	},
	// they're unlocked at the same time lol!
	"extraWin": {
		condition: () => GameState.scoreAllTime >= 150
	},
	"musicWin": {
		condition: () => GameState.scoreAllTime >= 150
	},
	"medalsWin": {
		condition: () => GameState.scoreAllTime >= 105
	},
	"creditsWin": {
		condition: () => GameState.scoreAllTime >= 200
	},
	"leaderboardsWin": {
		condition: () => GameState.scoreAllTime >= 1_100_000
	},
	"ascendWin": {
		condition: () => GameState.scoreAllTime >= scoreManager.ascensionConstant
	},
}

export function isWindowUnlocked(windowName:windowKey) {
	return GameState.unlockedWindows.includes(windowName)
}

export function destroyExclamation(obj) {
	obj?.get("exclamation")?.forEach(element => {
		element?.fadeOut(0.1).onEnd(() => { destroy(element) })
	});
}

export function addExclamation(obj:any) {
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
				update() {
					if (obj.opacity != null) this.opacity = obj.opacity
				}
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

	GameState.taskbar = sortedTaskbar()

	// else {
		// i got a 'Too much recursion!' crash here, got pretty scared :(
		// if (GameState.unlockedWindows.includes("extraWin") == false) {
		// 	unlockWindow("extraWin")
		// 	GameState.taskbar.push("extraWin")
		// }
	// }

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
				if (extraWinBtn) addExclamation(extraWinBtn)
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
		if (isWindowOpen("extraWin")) {
			let gridBtn = addGridButton(windowJustUnlocked)
			addExclamation(gridBtn)
		}

		else {
			let extraWinOpenCheck = ROOT.on("winOpen", (windowOpened) => {
				if (windowOpened == "extraWin") {
					let gridMinibtn = get("gridMiniButton", { recursive: true }).filter((btn) => btn.windowKey == windowJustUnlocked)[0]
					addExclamation(gridMinibtn)
	
					extraWinOpenCheck.cancel()
				}
			})
		}
		
	}
}	
