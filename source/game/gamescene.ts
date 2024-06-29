import { GameState } from "../gamestate.ts"
import { scoreVars, addHexagon, hexagon } from "./hexagon.ts"
import { buildingsText, scoreText, spsText, uiCounters } from "./uicounters.ts"
import { arrayToColor, debugFunctions, toHHMMSS } from "./utils.ts"
import { addToast, gameBg, mouse, toastOpts } from "./additives.ts"
import { playMusic } from "../sound.ts"
import { folderObj, folderObjManaging, windowsDefinition } from "./windows/windows-api/windowsAPI.ts"
import { songs } from "./windows/musicWindow.ts"
import { curDraggin } from "../plugins/drag.js"
import { DEBUG } from "../main.ts"

let panderitoLetters = "panderito".split("")
export let panderitoIndex = 0

let isTabActive = true; // Variable to track if the tab is currently active
let totalTimeOutsideTab = 0; // Variable to store the total time the user has been outside of the tab ; Miliseconds
let startTimeOutsideTab; // Variable to store the start time when the tab becomes inactive
export let excessTime = 0; // Time that has passed after autoLoopTime

export let autoLoopTime = 0;

let idleWaiter:any;
let sleeping = false;
let timeSlept = 0;

export let cam = {
	scale: 1,
	rotation: 0,
}

export function togglePanderito() {
	GameState.settings.panderitoMode = !GameState.settings.panderitoMode
	panderitoIndex = 0

	let block = add([
		rect(width(), 100),
		pos(center()),
		anchor("center"),
		opacity(0.5),
		color(BLACK),
		layer("mouse"),
		z(mouse.z - 2),
	])

	let panderitoText = add([
		text(`Panderito mode: ${GameState.settings.panderitoMode ? "ACTIVATED" : "DEACTIVATED"}`, {
			size: 26,
			font: 'emulogic',
		}),
		pos(center()),
		anchor("center"),
		layer("mouse"),
		z(mouse.z - 1),
		opacity(1),
	])

	wait(0.8, () => {
		tween(0.5, 0, 0.5, (p) => block.opacity = p, )
		tween(1, 0, 0.5, (p) => panderitoText.opacity = p, )
		wait(0.5, () => {
			destroy(panderitoText)
			destroy(block)
		})
	})

	if (GameState.settings.panderitoMode) {
		hexagon.use(sprite("panderito"))
		hexagon.area.scale = vec2(0.5, 0.8)
	}
	
	else {
		hexagon.use(sprite("hexagon"))
		hexagon.area.scale = vec2(1.08)
	}

	GameState.save(false)
}

// idle means the game was open but the player stoped moving
function triggerZZZ(idle = true) {
	if (idle) sleeping = true
	
	let black = add([
		rect(width(), height()),
		pos(center()),
		anchor("center"),
		color(BLACK),
		layer("mouse"),
		z(mouse.z - 2),
		opacity(1),
	])
	if (idle) black.fadeIn(0.5)

	let sleepyText = add([
		text("Z Z Z . . . ", {
			size: 90,
			font: "lambda",
			transform: (idx) => ({
				pos: vec2(0, wave(-4, 4, time() * 4 + idx * 0.5)),
				scale: wave(1, 1.2, time() * 3 + idx),
				angle: wave(-9, 9, time() * 3 + idx),
			}),
		}),
		z(mouse.z - 1),
		layer("mouse"),
		anchor("center"),
		pos(center()),
		opacity(1),
	])
	if (idle) sleepyText.fadeIn(0.5)

	let events:any[];
	function wakeUp() {
		sleeping = false
		wait(0.5, () => {
			black.fadeOut(0.5)
			sleepyText.fadeOut(0.5).onEnd(() => {
				black?.destroy()
				sleepyText?.destroy()
				if (idle) welcomeBack(true)
			})
		})
		events?.forEach(event => {
			event.cancel()
		});
	}

	if (idle) {
		let mouse = onMouseMove(() => wakeUp())
		let click = onClick(() => wakeUp())
		let key = onKeyPress(() => wakeUp())
		events = [mouse, click, key]
	}

	else wakeUp()
}

function welcomeBack(idle = false) {
	function addWelcomeBackToast(score:any, timeInSeconds:number) {
		let body = `You were out for: ${toHHMMSS(timeInSeconds)} ${timeInSeconds > 60 ? "mins" : "secs"}`; 
		if (score != null) body += `\nYou gained: ${score}` 
		
		let hasCombo = scoreVars.combo > 1
		let hasPowerup = get("poweruptimer")?.length > 0
		let applicationMessage = "\n"
		
		if (hasCombo) applicationMessage += `(Combo is not applicable)`
		else if (hasPowerup) applicationMessage += "(Power-ups are not applicable)"
		else if (hasCombo && hasPowerup) applicationMessage += "(Combo nor Power-ups are applicable)"
		
		addToast({ icon: "cursors.cursor", title: "Welcome back!", body: body })
		debug.log("que")
	}
	
	let welcomebacktoast = get("toast").filter(toast => toast.type == "welcome")
	if (welcomebacktoast.length > 0) {
		welcomebacktoast.forEach(toast => {
			toast.destroy()
		})
	}

	if (idle == false) {
		if (GameState.cursors < 1) {addWelcomeBackToast(null, totalTimeOutsideTab / 1000); return;}
		
		autoLoopTime += totalTimeOutsideTab / 1000
		excessTime = autoLoopTime - GameState.timeUntilAutoLoopEnds
		let gainedScore = 0
		if (excessTime >= 0) {
			gainedScore = Math.floor(excessTime / GameState.timeUntilAutoLoopEnds); // can't add scorePerAutoClick here bc
			excessTime -= GameState.timeUntilAutoLoopEnds * gainedScore // I use it before to shave off the extra time
			// actual gainedScore
			gainedScore = gainedScore * scoreVars.scorePerAutoClick
	
			// 120 being the seconds outside screen you have to be to get a log
			if ((totalTimeOutsideTab / 1000) > (DEBUG ? 2 : 120)) {
				addWelcomeBackToast(gainedScore, totalTimeOutsideTab / 1000)
			}
	
			tween(GameState.score, GameState.score + gainedScore, 0.25, (p) => GameState.score = p, easings.easeOutQuint)
			tween(GameState.totalScore, GameState.totalScore + gainedScore, 0.25, (p) => GameState.totalScore = p, easings.easeOutQuint)
		}
	}

	else {
		if (GameState.cursors < 1) {addWelcomeBackToast(null, timeSlept); return;}
		
		// 120 being the seconds outside screen you have to be to get a log
		if (timeSlept > (DEBUG ? 2 : 120)) {
			addWelcomeBackToast(Math.round(scoreVars.scorePerAutoClick * timeSlept), timeSlept)
			timeSlept = 0
		}
		// don't add no score because it is aded in the loop
	}
}

function resetIdleTime() {
	idleWaiter.cancel()
	idleWaiter = wait((20), () => {
		// true means it's idle
		triggerZZZ(true)
	})
}

export function gamescene() {
	return scene("gamescene", () => {
		GameState.load() // loadSave()

		cam.scale = 1

		addHexagon()
		uiCounters()
		folderObjManaging()
		windowsDefinition()
		
		setGravity(1600)

		// don't check anything for muted, it will play but no sound, that's good
		playMusic(GameState.settings.music.favoriteIdx == null ? "clicker.wav" : Object.keys(songs)[GameState.settings.music.favoriteIdx])

		// wait 60 seconds
		wait(60, () => {
			loop(120, () => {
				if (GameState.totalScore > 1) if (!DEBUG) GameState.save(true)
			})
		})

		// check for idling
		idleWaiter = wait(0, () => {})
		onMouseMove(() => resetIdleTime())
		onKeyPress(() => resetIdleTime())
		onClick(() => resetIdleTime())

		// field of hopes and dreams reference
		// when the ominus stuff ends do this
		// wait(1, () => {
		// 	let reference = add([
		// 		text("♪ ~ Clicker.wav", {
		// 			align: "right",
		// 			font: "lambdao",
		// 		}),
		// 		pos(width(), -2),
		// 	])
		// 	tween(reference.pos.x, 733, 0.32, (p) => reference.pos.x = p, easings.easeOutCubic)
			
		// 	wait(4, () => {
		// 		tween(reference.pos.x, width(), 0.32, (p) => reference.pos.x = p, easings.easeInCubic).onEnd(() => destroy(reference))
		// 	})
		// })

		onUpdate(() => {
			GameState.stats.totalTimePlayed += dt()
			
			GameState.score = clamp(GameState.score, 0, Infinity)
			GameState.score = Math.round(GameState.score)
			
			// auto loop stuff
			if (GameState.cursors >= 1) {
				autoLoopTime += dt()
				
				// this runs when time's up
				if (autoLoopTime >= GameState.timeUntilAutoLoopEnds) {
					if (excessTime > 0) autoLoopTime = excessTime
					else { autoLoopTime = 0; hexagon.autoClick() }
					excessTime = 0
				}
			}

			if (sleeping) timeSlept += dt()

			camRot(cam.rotation)
			camScale(vec2(cam.scale))

			// if (!gamestate.unlockedAchivements.include(achievements["gnome"]) && chance(0.01)) {
				// debug.log("holy shit did you guys see that")
			// }

			if (isKeyPressed("shift") && isKeyPressed("r") && panderitoIndex != 6) go("gamescene")
		})

		// panderito checkin
		onCharInput((ch) => {
			if (ch == panderitoLetters[panderitoIndex]) {
				panderitoIndex++
			}
		
			else {
				panderitoIndex = 0	
			}
		
			if (panderitoIndex == panderitoLetters.length) {
				togglePanderito()
			}
		})

		// #region OUTSIDE OF TAB STUFF
		// Function to handle tab visibility change
		function handleVisibilityChange() {
			if (document.hidden) {
				// Tab becomes inactive
				totalTimeOutsideTab = 0
				isTabActive = false;
				startTimeOutsideTab = performance.now(); // Store the start time when the tab becomes inactive
			}
		
			else {
				if (!isTabActive) {
					isTabActive = true
					
					// If the tab was previously inactive, calculate the time outside the tab and update the total time
					const timeOutsideTab = performance.now() - startTimeOutsideTab;
					totalTimeOutsideTab += timeOutsideTab;
					GameState.stats.totalTimePlayed += totalTimeOutsideTab / 1000

					if (!(GameState.totalScore > 0)) return;
					// 60 being the seconds outside of screen to get the zzz screen
					if (totalTimeOutsideTab / 1000 > (DEBUG ? 2 : 60)) {
						// false means it was out not idle
						triggerZZZ(false)
					} 
		
					// false means it was out not idle
					welcomeBack(false)
				}
			}
		}
		
		// Listen for visibility change events
		document.addEventListener("visibilitychange", handleVisibilityChange);
 		// #endregion

		// prevent dumb ctrl + s
		document.addEventListener("keydown", (event) => {
			if (event.keyCode == 83 && (navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey)) {
				event.preventDefault();
			}
		}, false);

		document.getElementById("kanva").addEventListener("mouseout", () => {
			// all of the objects that are draggable have this function
			if (curDraggin && curDraggin.releaseDrop) curDraggin.releaseDrop()
		}, false);
	
		// # INTRO ANIMATIONS
		// gameBg
		tween(BLACK, arrayToColor(GameState.settings.bgColor), 0.5, (p) => gameBg.color = p, easings.easeOutQuad)
		tween(-5, 5, 0.5, (p) => gameBg.movAngle = p, easings.easeOutQuad)
		tween(1, GameState.settings.bgColor[3], 0.5, (p) => gameBg.color.a = p, easings.easeOutQuad)

		// hexagon
		tween(vec2(center().x, center().y + 110), vec2(center().x, center().y + 55), 0.5, (p) => hexagon.pos = p, easings.easeOutQuad).onEnd(() => {
			hexagon.trigger("startAnimEnd")
		})
		tween(0.25, 1, 1, (p) => hexagon.opacity = p, easings.easeOutQuad)
		
		// scoreCounter
		tween(vec2(center().x, 80), vec2(center().x, 60), 0.5, (p) => scoreText.pos = p, easings.easeOutQuad).onEnd(() => {
			scoreText.trigger("startAnimEnd")
		})
		tween(0.25, 1, 0.5, (p) => scoreText.opacity = p, easings.easeOutQuad)
		tween(0.25, 1, 0.5, (p) => spsText.opacity = p, easings.easeOutQuad)

		// buildingsText
		tween(5, 10, 0.5, (p) => buildingsText.pos.x = p, easings.easeOutQuad)
		tween(0.25, 1, 0.5, (p) => buildingsText.opacity = p, easings.easeOutQuad)

		// folderObj
		tween(width() - 30, width() - 40, 0.5, (p) => folderObj.pos.x = p, easings.easeOutQuad)
		tween(0.25, 1, 0.5, (p) => folderObj.opacity = p, easings.easeOutQuad)

		if (DEBUG) debugFunctions()
	})
}