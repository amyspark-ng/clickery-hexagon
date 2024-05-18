import { GameState } from "../../GameState"
import { actualScorePerSecond, addHexagon, autoClick, autoScorePerSecond, hexagon } from "./addHexagon.js"
import { uiCounters } from "./uiCounter"
import { addBackground, addMouse, debugFunctions, debugTexts, formatNumber, getPrice, mouse, percentage } from "./utils"
import { musicHandler, playMusic } from "../../sound"
import { folderObjManaging as folderObjManaging, unlockWindow, windowsDefinition } from "./windows/WindowsMenu"
import { songs } from "./windows/winMusic"

export let scorePerClick = 1
export let scorePerAutoClick = 1

// debug
let cameraScale = 1

let panderitoLetters = "panderito".split("")
export let panderitoIndex = 0

export let autoLoopTime = 0;

let clickVars = {
	autoScorePerSecond: autoScorePerSecond,
	actualScorePerSecond: actualScorePerSecond
}

let isTabActive = true; // Variable to track if the tab is currently active
let totalTimeOutsideTab = 0; // Variable to store the total time the user has been outside of the tab ; Miliseconds
let startTimeOutsideTab; // Variable to store the start time when the tab becomes inactive
export let excessTime = 0; // Time that has passed after autoLoopTime

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

		playMusic(GameState.music.favoriteIdx == null ? "clicker.wav" : Object.keys(songs)[GameState.music.favoriteIdx])
		if (GameState.music.muted) musicHandler.paused = true
		
		// wait 60 seconds
		wait(60, () => {
			loop(60, () => {
				if (GameState.totalScore > 1) GameState.save(true)
			})
		})

		onUpdate(() => {
			debugFunctions()
			
			// debug.log("spac: " + scorePerAutoClick)
			// debug.log("asps: " + autoScorePerSecond)
			
			// allowed i guess
			GameState.score = Math.round(GameState.score)
			// auto loop stuff
			if (GameState.cursors >= 1) {
				autoLoopTime += dt()
				// debug.log(`Time left til click: ${GameState.timeUntilAutoLoopEnds - autoLoopTime}`)
				// debug.log(autoLoopTime.toFixed(1) + `/${GameState.timeUntilAutoLoopEnds}`)
				
				// this runs when time's up
				if (autoLoopTime >= GameState.timeUntilAutoLoopEnds) {
					if (excessTime > 0) autoLoopTime = excessTime
					else { autoLoopTime = 0; autoClick() }
					excessTime = 0
				}
			}

			// debug
			// if (isKeyPressed("h")) { GameState.timeUntilAutoLoopEnds--; debug.log(GameState.timeUntilAutoLoopEnds) } 
		
			// other stuff
			// debug.log(GameState.clicksUpgrades)
			scorePerClick = GameState.clicksUpgrades > 0 ? GameState.clickers * GameState.clicksUpgrades : GameState.clickers
			scorePerClick += Math.round(percentage(scorePerClick, GameState.clickPercentage))
			scorePerAutoClick = GameState.cursorUpgrades > 0 ? GameState.cursors * GameState.cursorUpgrades : GameState.cursors
			scorePerAutoClick += Math.round(percentage(scorePerAutoClick, GameState.cursorsPercentage))
		})

		// panderito checkin
		onCharInput((ch) => {
			if (ch == panderitoLetters[panderitoIndex]) {
				panderitoIndex++
			}
		
			else {
				panderitoIndex = 0	
			}
		
			if (panderitoIndex == 9) {
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

		// onKeyPress("x", () => {
		// 	wait(0.5, () => {
		// 		go("introscene")
		// 	})
		// 	tween(GameState.musicVolIndex, 0, 0.5, (p) => GameState.musicVolIndex = p)
		// })
		
		// #region debug stuff
		onScroll((delta)=>{
			cameraScale = cameraScale * (1 - 0.1 * Math.sign(delta.y))
			camScale(cameraScale)
		})

		onMousePress("middle", () => {
			cameraScale = 1
			camScale(1)
		})
		// GameState.score = 999999
		// GameState.totalScore = 999999

		//#endregion
	
		// #region OUTSIDE OF TAB STUFF
		// Function to handle tab visibility change
		function handleVisibilityChange() {
			if (GameState.cursors >= 1) {
				if (document.hidden) {
					// Tab becomes inactive
					totalTimeOutsideTab = 0
					isTabActive = false;
					startTimeOutsideTab = performance.now(); // Store the start time when the tab becomes inactive
				}
				
				else {
					// Tab becomes active
					if (!isTabActive) {
						// If the tab was previously inactive, calculate the time outside the tab and update the total time
						const timeOutsideTab = performance.now() - startTimeOutsideTab;
						totalTimeOutsideTab += timeOutsideTab;
					
						// what the fuck
						autoLoopTime += totalTimeOutsideTab / 1000
						excessTime = autoLoopTime - GameState.timeUntilAutoLoopEnds
						let gainedScore = 0
						if (excessTime >= 0) {
							gainedScore = Math.floor(excessTime / GameState.timeUntilAutoLoopEnds); // can't add scorePerAutoClick here bc
							excessTime -= GameState.timeUntilAutoLoopEnds * gainedScore // I use it before to shave off the extra time
							// actual gainedScore
							gainedScore = gainedScore * scorePerAutoClick
						}
	
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

						// 120 being the seconds outside screen you have to be to get a "pop up"
						if ((totalTimeOutsideTab / 1000) > 2) {
							// debug.log(`You were out for: ${totalTimeOutsideTab / 1000}`)
							// debug.log(`And made: ${gainedScore}, cool!`)
							// debug.log("Excess time:" + excessTime)
						}

						tween(GameState.score, GameState.score + gainedScore, 0.25, (p) => GameState.score = p, easings.easeOutQuint)
						tween(GameState.totalScore, GameState.totalScore + gainedScore, 0.25, (p) => GameState.totalScore = p, easings.easeOutQuint)
					}

					isTabActive = true;
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
	})	
}