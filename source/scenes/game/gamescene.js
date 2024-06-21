import { GameState } from "../../gamestate"
import { scoreVars, addHexagon, hexagon } from "./hexagon.js"
import { uiCounters } from "./uicounters"
import { arrayToColor, debugFunctions } from "./utils"
import { addToast, gameBg, mouse } from "./additives"
import { playMusic } from "../../sound"
import { folderObjManaging, windowsDefinition } from "./windows/windows-api/windowsAPI"
import { songs } from "./windows/musicWindow"
import { curDraggin, setCurDraggin } from "../../plugins/drag"
import { k } from "../../main"

// debug

let panderitoLetters = "panderito".split("")
export let panderitoIndex = 0

let isTabActive = true; // Variable to track if the tab is currently active
let totalTimeOutsideTab = 0; // Variable to store the total time the user has been outside of the tab ; Miliseconds
let startTimeOutsideTab; // Variable to store the start time when the tab becomes inactive
export let excessTime = 0; // Time that has passed after autoLoopTime

export let autoLoopTime = 0;

export let cam = {
	scale: [],
	rotation: 0,
}

export function togglePanderito() {
	GameState.settings.panderitoMode = !GameState.settings.panderitoMode
	panderitoIndex = 0

	let panderitoText = add([
		text(`Panderito mode: ${GameState.settings.panderitoMode ? "ACTIVATED" : "DEACTIVATED"}`, {
			size: 26,
			font: 'emulogic',
		}),
		pos(center()),
		anchor("center"),
		z(999),
		opacity(1),
	])

	let block = add([
		rect(width(), 100),
		pos(center()),
		anchor("center"),
		opacity(0.5),
		color(BLACK),
		z(998),
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

export function gamescene() {
	return scene("gamescene", () => {

		cam.scale = 1

		addHexagon()
		uiCounters()
		folderObjManaging()
		windowsDefinition()

		setGravity(1600)

		GameState.load()

		if (!GameState.settings.music.muted) {
			playMusic(GameState.settings.music.favoriteIdx == null ? "clicker.wav" : Object.keys(songs)[GameState.settings.music.favoriteIdx])
		}

		// wait 60 seconds
		wait(60, () => {
			loop(60, () => {
				if (GameState.totalScore > 1) GameState.save(true)
			})
		})

		// set bg valeus
		tween(BLACK, arrayToColor(GameState.settings.bgColor), 0.5, (p) => gameBg.color = p, easings.easeOutQuad)
		tween(-5, 5, 0.5, (p) => gameBg.movAngle = p, easings.easeOutQuad)
		tween(1, GameState.settings.bgColor[3], 0.5, (p) => gameBg.color.a = p, easings.easeOutQuad)

		onUpdate(() => {
			GameState.score = clamp(GameState.score, 0, Infinity)
			GameState.score = Math.round(GameState.score)
			
			if (GameState.score > 50) {
				// if (!GameState.unlockedWindows.includes("storeWin")) unlockWindow("storeWin")
			}

			if (GameState.score > 100) {
				// if (!GameState.unlockedWindows.includes("musicWin")) unlockWindow("musicWin")
			}

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

			// k.backgroundAudio = GameState.settings.keepAudioOnTabChange
			// debug.log(k.backgroundAudio)
			// debug
			// if (isKeyPressed("h")) { GameState.timeUntilAutoLoopEnds--; debug.log(GameState.timeUntilAutoLoopEnds) } 
			camRot(cam.rotation)
			camScale(cam.scale)
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
		
					// 60 being the seconds outside of screen to get the zzz screen
					if (totalTimeOutsideTab / 1000 > 10) {
						let black = add([
							rect(width(), height()),
							pos(center()),
							anchor("center"),
							color(BLACK),
							z(mouse.z - 2),
							opacity(1),
						])
		
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
							anchor("center"),
							pos(center()),
							opacity(1),
						])
		
						wait(0.5, () => {
							tween(black.opacity, 0, 0.5, (p) => black.opacity = p, )
							tween(sleepyText.opacity, 0, 0.5, (p) => sleepyText.opacity = p, )
						})
					} 
		
					if (GameState.cursors >= 1) {
						// what the fuck
						autoLoopTime += totalTimeOutsideTab / 1000
						excessTime = autoLoopTime - GameState.timeUntilAutoLoopEnds
						let gainedScore = 0
						if (excessTime >= 0) {
							gainedScore = Math.floor(excessTime / GameState.timeUntilAutoLoopEnds); // can't add scorePerAutoClick here bc
							excessTime -= GameState.timeUntilAutoLoopEnds * gainedScore // I use it before to shave off the extra time
							// actual gainedScore
							gainedScore = gainedScore * scoreVars.scorePerAutoClick
		
							// 120 being the seconds outside screen you have to be to get a "pop up"
							if ((totalTimeOutsideTab / 1000) > 2) {
								addToast({ icon: "cursor", title: "Welcome back!", body: `+${gainedScore} points!`, color: GREEN })
							}
				
							tween(GameState.score, GameState.score + gainedScore, 0.25, (p) => GameState.score = p, easings.easeOutQuint)
							tween(GameState.totalScore, GameState.totalScore + gainedScore, 0.25, (p) => GameState.totalScore = p, easings.easeOutQuint)
						}
					}
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

		document.getElementById("kanva").addEventListener("mouseout", (event) => {
			if (GameState.settings.dropDragsOnMouseOut == true) {
				if (curDraggin) {
					curDraggin.trigger("dragEnd")
					setCurDraggin(null)
					mouse.releaseAndPlay()
				}
			}
		}, false);

		if (k.debug) debugFunctions()
	})
}