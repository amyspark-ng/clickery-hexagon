import { GameState } from "../../GameState"
import { scoreVars, addHexagon, autoClick, hexagon } from "./addHexagon.js"
import { uiCounters } from "./uiCounter"
import { addBackground, addMouse, addToast, debugFunctions, debugTexts, mouse, percentage } from "./utils"
import { musicHandler, playMusic } from "../../sound"
import { folderObjManaging, unlockWindow, windowsDefinition } from "./windows/WindowsMenu"
import { songs } from "./windows/winMusic"
import { curDraggin, setCurDraggin } from "../../plugins/drag"
import { k } from "../../main"

// debug
let cameraScale = 1

let panderitoLetters = "panderito".split("")
export let panderitoIndex = 0

let isTabActive = true; // Variable to track if the tab is currently active
let totalTimeOutsideTab = 0; // Variable to store the total time the user has been outside of the tab ; Miliseconds
let startTimeOutsideTab; // Variable to store the start time when the tab becomes inactive
export let excessTime = 0; // Time that has passed after autoLoopTime

export let autoLoopTime = 0;

export function gamescene() {
	return scene("gamescene", () => {

		addBackground()
		addMouse()
		addHexagon()
		uiCounters()
		folderObjManaging()
		windowsDefinition()

		debugTexts()

		setGravity(1600)

		playMusic(GameState.settings.music.favoriteIdx == null ? "clicker.wav" : Object.keys(songs)[GameState.settings.music.favoriteIdx])
		if (GameState.settings.music.muted) musicHandler.paused = true
		
		k.backgroundAudio = GameState.settings.keepAudioOnTabChange

		// wait 60 seconds
		wait(60, () => {
			loop(60, () => {
				if (GameState.totalScore > 1) GameState.save(true)
			})
		})

		onKeyPress("j", () => {
			addToast({ title: "This is a title", body: "This is a body", color: GREEN })
		})
		onKeyPress("k", () => {
			addToast({ title: "Unlocked store window", body: "This is a body", color: BLUE })
		})

		onUpdate(() => {
			GameState.score = clamp(GameState.score, 0, Infinity)
			GameState.score = Math.round(GameState.score)
			debugFunctions()
			
			if (GameState.score > 50) {
				if (!GameState.unlockedWindows.includes("storeWin")) unlockWindow("storeWin")
			}

			if (GameState.score > 100) {
				if (!GameState.unlockedWindows.includes("musicWin")) unlockWindow("musicWin")
			}

			// auto loop stuff
			if (GameState.cursors >= 1) {
				autoLoopTime += dt()
				
				// this runs when time's up
				if (autoLoopTime >= GameState.timeUntilAutoLoopEnds) {
					if (excessTime > 0) autoLoopTime = excessTime
					else { autoLoopTime = 0; autoClick() }
					excessTime = 0
				}
			}

			// debug
			// if (isKeyPressed("h")) { GameState.timeUntilAutoLoopEnds--; debug.log(GameState.timeUntilAutoLoopEnds) } 
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
				GameState.personalization.panderitoMode = !GameState.personalization.panderitoMode
				panderitoIndex = 0

				let panderitoText = add([
					text(`Panderito mode: ${GameState.personalization.panderitoMode ? "ACTIVATED" : "DEACTIVATED"}`, {
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

				if (GameState.personalization.panderitoMode) {
					hexagon.use(sprite("panderito"))
					hexagon.area.scale = vec2(0.5, 0.8)
				}
				
				else {
					hexagon.use(sprite("hexagon"))
					hexagon.area.scale = vec2(1.08)
				}

				GameState.save(false)
			}
		})

		// #region debug stuff
		onScroll((delta)=>{
			cameraScale = cameraScale * (1 - 0.1 * Math.sign(delta.y))
			camScale(cameraScale)
		})

		onMousePress("middle", () => {
			cameraScale = 1
			camScale(1)
		})

		//#endregion
	
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
					if (totalTimeOutsideTab / 1000 > 1) {
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
								addToast({ title: `+${gainedScore} points!`, body: `Auto Click`, color: GREEN })
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

		onKeyPress("u", () => {
			GameState.settings.dropDragsOnMouseOut = !GameState.settings.dropDragsOnMouseOut
		})

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
					mouse.release()
				}
			}
		}, false);
	})
}