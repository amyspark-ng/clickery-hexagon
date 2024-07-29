import { GameState, scoreManager } from "../gamestate.ts"
import { addHexagon, hexagon } from "./hexagon.ts"
import { buildingsText, scoreText, spsText, uiCounters } from "./uicounters.ts"
import { arrayToColor, debugFunctions, formatNumber, randomPos, randomPowerup, toHHMMSS } from "./utils.ts"
import { addToast, gameBg, mouse } from "./additives.ts"
import { playMusic, playSfx } from "../sound.ts"
import { folderObj, folderObjManaging, isWindowOpen, windowsDefinition } from "./windows/windows-api/windowsAPI.ts"
import { songs } from "./windows/musicWindow.ts"
import { curDraggin } from "../plugins/drag.ts"
import { DEBUG, ROOT } from "../main.ts"
import { powerup, powerupManagement, powerupTypes, spawnPowerup } from "./powerups.ts"
import { checkForUnlockable, isAchievementUnlocked, unlockables, unlockAchievement } from "./unlockables.ts"
import { ascension } from "./ascension/ascension.ts"
import { Vec2 } from "kaplay"

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
	pos: 0 as unknown,
	zoom: 1,
	rotation: 0,
};

export function togglePanderito() {
	GameState.settings.panderitoMode = !GameState.settings.panderitoMode
	panderitoIndex = 0

	if (!isAchievementUnlocked("panderitomode")) {
		unlockAchievement("panderitomode")
	}

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
	}
	
	else {
		hexagon.use(sprite("hexagon"))
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
		
		// an hour is 3600 seconds
		let times = "";
		if (timeInSeconds > 3600) {
			if (timeInSeconds < 3600 * 2) times = "hour"
			else times = "hours"
		}
		
		// minutes
		else if (timeInSeconds > 60) {
			if (timeInSeconds < 120) times = "min"
			else times = "mins"
		}
		
		// seconds
		else if (timeInSeconds > 0) {
			if (timeInSeconds < 2) times = "sec"
			else times = "secs"
		}

		let body = `You were out for: ${toHHMMSS(timeInSeconds)} ${times}`; 
		if (score != null) body += `\n+${formatNumber(score)}` 
		
		let hasCombo = scoreManager.combo > 1
		let hasPowerup = get("putimer")?.length > 0
		let applicationMessage = ""
		
		if (hasCombo) applicationMessage += `\n(Combo is not applicable)`
		else if (hasPowerup) applicationMessage += "\n(Power-ups are not applicable)"
		else if (hasCombo && hasPowerup) applicationMessage += "\n(Combo nor Power-ups are applicable)"
		body += applicationMessage

		let toast = addToast({ icon: "cursors.cursor", title: "Welcome back!", body: body })
		toast.on("closed", () => checkForUnlockable())
	
		if (GameState.hasUnlockedPowerups == true) {
			// if you left for 60 seconds there's a 10% chance you get a powerup
			if (timeInSeconds > 60) {
				if (chance(0.1)) spawnPowerup()
			}

			// if the time you left is greater than 120 seconds
			if (timeInSeconds > 120) {
				// there's a chance of 25% to get a powerup
				if (chance(0.25)) {
					// if an additional 5% chance also happens to be you get 2
					if (chance(0.05)) {
						for (let i = 0; i < 2; i++) spawnPowerup()
					}

					// else you get a single one
					else {
						spawnPowerup()
					}
				}
			}
		}
	}
	
	let welcomeBackToasts = get("toast").filter(toast => toast.type == "welcome")
	if (welcomeBackToasts.length > 0) {
		welcomeBackToasts.forEach(toast => {
			toast.destroy()
		})
	}

	if (idle == false) {
		if (GameState.cursors < 1 || ascension.ascending == true) {addWelcomeBackToast(null, totalTimeOutsideTab / 1000); return;}
		
		autoLoopTime += totalTimeOutsideTab / 1000
		excessTime = autoLoopTime - GameState.timeUntilAutoLoopEnds
		let gainedScore = 0
		if (excessTime >= 0) {
			gainedScore = Math.floor(excessTime / GameState.timeUntilAutoLoopEnds); // can't add scorePerAutoClick here bc
			excessTime -= GameState.timeUntilAutoLoopEnds * gainedScore // I use it before to shave off the extra time
			// actual gainedScore
			gainedScore = gainedScore * scoreManager.scorePerAutoClick()
	
			// SECONDS FOR LOG
			if ((totalTimeOutsideTab / 1000) > 60) {
				addWelcomeBackToast(gainedScore, totalTimeOutsideTab / 1000)
			}
	
			scoreManager.addTweenScore(gainedScore)
		}
	}

	else {
		if (GameState.cursors < 1 || ascension.ascending == true) {addWelcomeBackToast(null, timeSlept); return;}
		
		// SECONDS FOR LOG
		if (timeSlept > 60) {
			addWelcomeBackToast(Math.round(scoreManager.autoScorePerSecond() * timeSlept), timeSlept)
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

export function triggerGnome() {
	let gnome = add([
		sprite("gnome"),
		pos(),
		layer("mouse"),
		scale(1.25),
		z(mouse.z - 1),
		anchor("center"),
		{
			update() {
				this.angle = wave(-10, 10, time() / 2)
			}
		}
	])

	playSfx("gnome")
	
	tween(0, width(), 0.1, (p) => gnome.pos.x = p, easings.linear)
	tween(0, height(), 0.1, (p) => gnome.pos.y = p, easings.linear).onEnd(() => {
		destroy(gnome)
	})

	if (!isAchievementUnlocked("gnome")) unlockAchievement("gnome")
}

export let hexagonIntro;
export let hasStartedGame:boolean;
export function gamescene() {
	return scene("gamescene", () => {
		GameState.load() // loadSave()
		hasStartedGame = GameState.scoreAllTime > 1
		ascension.ascending = false

		cam = {
			pos: vec2(center()),
			zoom: 1,
			rotation: 0,
		}

		addHexagon()
		uiCounters()
		folderObjManaging()
		windowsDefinition()
		
		setGravity(1600)

		ROOT.on("gamestart", () => {
			// wait 60 seconds
			wait(60, () => {
				loop(120, () => {
					if (GameState.scoreAllTime > 25) if (DEBUG == false) {
						GameState.save(true)
					}
				})
			})

			function naturalPowerupSpawningManagement() {
				wait(60, () => {
					loop(60, () => {
						if (chance(0.25)) {
							if (GameState.hasUnlockedPowerups) {
								spawnPowerup({
									type: randomPowerup(),
									pos: randomPos()
								})
							}
						}
					})
				})
			}

			if (!GameState.hasUnlockedPowerups) {
				ROOT.on("powerupunlock", () => {
					wait(60, () => {
						naturalPowerupSpawningManagement()
						spawnPowerup({
							type: randomPowerup(),
							pos: randomPos(),
						})
					})
				})
			}

			else naturalPowerupSpawningManagement()

			// check for idling
			idleWaiter = wait(0, () => {})
			onMouseMove(() => resetIdleTime())
			onKeyPress(() => resetIdleTime())
			onClick(() => resetIdleTime())

			// panderito checkin
			onCharInput((ch) => {
				if (!hasStartedGame) return
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

			// gnome
			if (!isAchievementUnlocked("gnome")) {
				wait(60, () => {
					loop(1, () => {
						if (chance(0.0025)) {
							if (ascension.ascending == true) return
							if (!isAchievementUnlocked("gnome")) triggerGnome()
						}
					})
				})
			}
		})

		onUpdate(() => {
			camRot(cam.rotation)
			camScale(vec2(cam.zoom))
			camPos(cam.pos as Vec2)
			
			if (isKeyDown("shift") && isKeyPressed("r") && panderitoIndex != 6) go("gamescene")
			if (isKeyDown("shift") && isKeyPressed("s") && GameState.scoreAllTime > 25) GameState.save()
			
			GameState.stats.totalTimePlayed += dt()
			
			GameState.score = clamp(GameState.score, 0, Infinity)
			GameState.score = Math.round(GameState.score)

			// INCREASES MANA
			if (GameState.scoreAllTime >= scoreManager.scoreYouGetNextManaAt()) {
				GameState.ascension.mana++
				GameState.ascension.manaAllTime++
				ROOT.trigger("manaGained")
			}
			
			GameState.stats.timesAscended = GameState.ascension.magicLevel - 1

			// auto loop stuff
			if (GameState.cursors >= 1 && ascension.ascending == false) {
				autoLoopTime += dt()
				
				// this runs when time's up
				if (autoLoopTime >= GameState.timeUntilAutoLoopEnds) {
					if (excessTime > 0) autoLoopTime = excessTime
					else { autoLoopTime = 0; hexagon.autoClick() }
					excessTime = 0
				}
			}

			else {
				autoLoopTime = 0
			}

			if (sleeping) timeSlept += dt()

			powerupManagement()
			GameState.settings.fullscreen = isFullscreen()
		})

		// #region OUTSIDE OF TAB STUFF
		// Function to handle tab visibility change
		function handleVisibilityChange() {
			if (!hasStartedGame) return;
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

					if (!(GameState.scoreAllTime > 0)) return;
					// 30 being the seconds outside of screen to get the zzz screen
					if (totalTimeOutsideTab / 1000 > 30) {
						// false means it was out not idle
						triggerZZZ(false)
						// false means it was out not idle
						welcomeBack(false)
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

		document.getElementById("kanva").addEventListener("mouseout", () => {
			// all of the objects that are draggable have this function
			if (curDraggin && curDraggin.releaseDrop) curDraggin.releaseDrop()
		}, false);

		document.getElementById("kanva").addEventListener("fullscreenchange", () => {
			wait(0.01, () => {
				ROOT.trigger("fullscreenchange")
			})
		})
	
		let introAnimations = {
			intro_hopes() {
				// field of hopes and dreams reference
				// when the ominus stuff ends do this
				let reference = add([
					text("♪ ~ Clicker.wav", {
						align: "right",
						font: "lambdao",
					}),
					opacity(),
					pos(width(), -2),
				])
				tween(reference.pos.x, 733, 0.32, (p) => reference.pos.x = p, easings.easeOutCubic)
				tween(0, 1, 0.32, (p) => reference.opacity = p, easings.easeOutCubic)
				
				wait(4, () => {
					tween(reference.pos.x, width(), 0.32, (p) => reference.pos.x = p, easings.easeInCubic).onEnd(() => destroy(reference))
					tween(1, 0, 0.32, (p) => reference.opacity = p, easings.easeOutCubic)
				})
			},
			intro_playMusic() {
				// don't check anything for muted, it will play but no sound, that's good
				playMusic(GameState.settings.music.favoriteIdx == null ? "clicker.wav" : Object.keys(songs)[GameState.settings.music.favoriteIdx])
			},
			intro_hexagon() {
				tween(vec2(center().x, center().y + 110), vec2(center().x, center().y + 55), 0.5, (p) => hexagon.pos = p, easings.easeOutQuad).onEnd(() => {
					hexagon.trigger("startAnimEnd")
				})
				tween(0.25, 1, 1, (p) => hexagon.opacity = p, easings.easeOutQuad)
			},
			intro_gameBg() {
				tween(BLACK, arrayToColor(GameState.settings.bgColor), 0.5, (p) => gameBg.color = p, easings.easeOutQuad)
				tween(-5, 5, 0.5, (p) => gameBg.movAngle = p, easings.easeOutQuad)
				tween(1, GameState.settings.bgColor[3], 0.5, (p) => gameBg.color.a = p, easings.easeOutQuad)
			},
			intro_scoreCounter() {
				// scoreCounter
				tween(scoreText.scoreShown, GameState.score, 0.25, (p) => scoreText.scoreShown = p, easings.easeOutQuint)
				tween(vec2(center().x, 80), vec2(center().x, 60), 0.5, (p) => scoreText.pos = p, easings.easeOutQuad).onEnd(() => {
					scoreText.trigger("startAnimEnd")
				})
				tween(0.25, 1, 0.5, (p) => scoreText.opacity = p, easings.easeOutQuad)
			},
			intro_spsText() {
				tween(0.25, 1, 0.5, (p) => spsText.opacity = p, easings.easeOutQuad)
			},
			intro_buildingsText() {
				// buildingsText
				tween(5, 10, 0.5, (p) => buildingsText.pos.x = p, easings.easeOutQuad)
				tween(0.25, 1, 0.5, (p) => buildingsText.opacity = p, easings.easeOutQuad)
			},
			intro_folderObj() {
				// folderObj
				tween(width() - 30, width() - 40, 0.5, (p) => folderObj.pos.x = p, easings.easeOutQuad)
				tween(0.25, 1, 0.5, (p) => folderObj.opacity = p, easings.easeOutQuad)
			}
		}

		hexagonIntro = introAnimations.intro_hexagon

		if (hasStartedGame) {
			Object.values(introAnimations).filter(animation => !animation.name.includes("hopes")).forEach((animation) => {
				animation() // animations take 0.5 seconds
			})

			wait(0.5, () => {
				hexagon.interactable = true
				ROOT.trigger("gamestart")
			})
		}

		else {
			gameBg.color.a = 1
			hexagon.interactable = false
			let black = add([
				rect(width(), height()),
				pos(center()),
				anchor("center"),
				color(BLACK),
				opacity(),
				layer("mouse"),
				z(mouse.z - 1)
			])

			wait(2, () => {
				black.destroy()
				let ominus = playSfx("ominus", { loop: true })
				playSfx("biglight")
				hexagon.interactable = true
				folderObj.interactable = false
				spsText.opacity = 0
				scoreText.opacity = 0
				buildingsText.opacity = 0
				folderObj.opacity = 0

				hexagon.on("clickrelease", () => {
					switch (GameState.scoreAllTime) {
						case 1:
							ominus.stop()
							gameBg.color.a = 0.84
							introAnimations.intro_scoreCounter()
						break;
					
						case 2: 
							introAnimations.intro_playMusic()
							introAnimations.intro_hopes()
							introAnimations.intro_spsText()
						break;

						case 3: 
							introAnimations.intro_buildingsText()
						break;

						case 25:
							introAnimations.intro_folderObj()
							hasStartedGame = true;
							folderObj.interactable = true
							ROOT.trigger("gamestart")
						break;
					}
				})
			})
		}

		ROOT.on("buy", (info) => {
			checkForUnlockable()
		})

		ROOT.on("scoreGained", (amount) => {
			// kill myself
		})

		if (DEBUG) debugFunctions()
	})
}