
import { GameState } from "../gamestate.ts";
import { scoreText, spsText } from "./uicounters.ts";
import { arrayToColor } from "./utils.ts";
import { mouse } from "./additives.ts";
import { playSfx } from "../sound.ts";
import { isDraggingAWindow, isHoveringAWindow, manageWindow } from "./windows/windows-api/windowsAPI.ts";
import { waver } from "../plugins/wave.js";
import { isDraggingASlider } from "./windows/colorWindow.ts";
import { addPlusScoreText, getClicksFromCombo, increaseCombo, increaseComboText, maxComboAnim, startCombo } from "./combo-utils.ts";
import { addConfetti } from "../plugins/confetti.js";
import { curDraggin } from "../plugins/drag.js";
import { cam } from "./gamescene.ts";
import { powerups } from "./powerups.ts";
import { checkForUnlockable, isAchievementUnlocked, unlockAchievement } from "./unlockables.ts";

export let scoreVars = {
	scorePerClick: 1,
	scorePerAutoClick: 0,
	
	autoScorePerSecond: 0, // the score per second you're getting automatically
	scorePerSecond: null, // the total score per second
	
	scoreNeededToAscend: 1000000,
	combo: 1,
}

export let clickVars = {
	clicksPerSecond: 0, // to properly calculate sps
	consecutiveClicks: 0,
	comboDropped: true,
	maxedCombo: false,
	constantlyClicking: false,
}

export const COMBO_MINCLICKS = 25;
export const COMBO_MAXCLICKS = 160;
export const COMBO_MAX = 5

const hoverRotSpeedIncrease = 0.01 * 0.25
let maxRotSpeed = 10

let consecutiveClicksWaiting = null;
let spsUpdaterTimer = 0; // to properly calculate sps

export let hexagon:any;

export function addHexagon() {
	// reset variables
	scoreVars.combo = 1

	clickVars.consecutiveClicks = 0
	clickVars.constantlyClicking = false
	clickVars.comboDropped = true
	clickVars.maxedCombo = false
	spsUpdaterTimer = 0
	maxRotSpeed = 10

	hexagon = add([
		sprite(GameState.settings.panderitoMode ? "panderito" : "hexagon"),
		pos(center().x, center().y + 55),
		anchor("center"),
		rotate(0),
		scale(),
		opacity(1),
		color(arrayToColor(GameState.settings.hexColor)),
		area({
			shape: new Polygon([
				vec2(406, 118),
				vec2(613, 116),
				vec2(711, 292),
				vec2(615, 463),
				vec2(411, 466),
				vec2(315, 293),
			]),
			offset: vec2(-512, -293),
			scale: vec2(1.08), 
		}),		
		z(0),
		layer("hexagon"),
		"hexagon",
		"hoverObj",
		{
			isBeingHovered: false,
			smallestScale: 0.985,
			biggestScale: 1.0015,
			defaultScale: vec2(1),
			scaleIncrease: 1,
			maxScaleIncrease: 1,
			stretchScaleIncrease: 1,
			interactable: true,
			isBeingClicked: false,
			rotationSpeed: 0.01,
			clickPressTween: null,
			stretched: true,
			update() {
				if (this.interactable) {
					if (GameState.settings.panderitoMode) this.area.scale = vec2(0.65, 1.1)
					else this.area.scale = vec2(1.08)
				}
				else this.area.scale = vec2(0)
				
				if (this.isBeingHovered) maxRotSpeed = 4.75
				else maxRotSpeed = 4
				this.rotationSpeed = map(GameState.score, 0, scoreVars.scoreNeededToAscend, 0.01, maxRotSpeed)
				this.rotationSpeed = clamp(this.rotationSpeed, 0.01, maxRotSpeed)
				// this.wave_speed = map(GameState.score, 0, scoreVars.scoreNeededToAscend, 1, 2)
				// this.wave_speed = clamp(this.wave_speed, 1, 2)
				this.angle += this.rotationSpeed
				
				this.scale.x = wave((this.smallestScale * this.scaleIncrease), (this.biggestScale * this.scaleIncrease), time() * 1.15)
				this.scale.y = wave((this.smallestScale * this.scaleIncrease) * this.stretchScaleIncrease, (this.biggestScale * this.scaleIncrease) * this.stretchScaleIncrease, time() * 1.15)

				if (this.angle >= 360) {
					this.angle = 0
				}
			},
			
			clickPress() {
				this.maxScaleIncrease = 0.98
				this.clickPressTween = tween(this.scaleIncrease, this.maxScaleIncrease, 0.35, (p) => this.scaleIncrease = p, easings.easeOutQuint)
				this.isBeingClicked = true
				mouse.grab()
				playSfx("clickPress", {detune: rand(-50, 50)})
			},

			clickRelease() {
				this.maxScaleIncrease = this.isBeingHovered ? 1.05 : 1
				
				this.clickPressTween.cancel()
				tween(this.scaleIncrease, this.maxScaleIncrease, 0.35, (p) => this.scaleIncrease = p, easings.easeOutQuint)
				this.isBeingClicked = false
				clickVars.clicksPerSecond++
				playSfx("clickRelease", {detune: rand(-50, 50)})
				mouse.releaseAndPlay("point")

				// # combo stuff
				clickVars.constantlyClicking = true

				consecutiveClicksWaiting.cancel()
				consecutiveClicksWaiting = wait(1, () => {
					clickVars.constantlyClicking = false
					if (scoreVars.combo < 2) clickVars.consecutiveClicks = 0
				})

				if (GameState.totalScore > 100) {
					// if consecutiveclicks is not combo_maxclicks increase clicks
					if (clickVars.consecutiveClicks != COMBO_MAXCLICKS) {
						clickVars.consecutiveClicks++
					}
	
					// checks for first combo
					if (clickVars.consecutiveClicks == getClicksFromCombo(2) && clickVars.comboDropped == true) {
						startCombo()
					}

					// check for all the other combos
					else if (scoreVars.combo < COMBO_MAX) {
						for (let i = 2; i < COMBO_MAX + 1; i++) {
							if (clickVars.consecutiveClicks == getClicksFromCombo(i)) {
								increaseCombo()
							}
						}
					}
	
					if (scoreVars.combo == COMBO_MAX && clickVars.maxedCombo == false) {
						clickVars.maxedCombo = true
						maxComboAnim()

						addConfetti({ pos: center() })
						tween(-10, 0, 0.5, (p) => cam.rotation = p, easings.easeOutQuint)
						playSfx("fullcombo", {detune: rand(-50, 50)})
					
						if (!isAchievementUnlocked("maxedcombo")) {
							unlockAchievement("maxedcombo")
						}
					}
				}

				// # actual score additions
				addPlusScoreText({
					pos: mousePos(),
					value: scoreVars.scorePerClick * scoreVars.combo,
					cursorRelated: false,
				})
				GameState.addScore((scoreVars.scorePerClick * powerups.clicks.multiplier) * scoreVars.combo)
				tween(scoreText.scaleIncrease, 1.05, 0.2, (p) => scoreText.scaleIncrease = p, easings.easeOutQuint).onEnd(() => {
					tween(scoreText.scaleIncrease, 1, 0.2, (p) => scoreText.scaleIncrease = p, easings.easeOutQuint)
				})

				if (GameState.settings.panderitoMode) {
					let smallpanderito = add([
						sprite("smallpanderito"),
						anchor("center"),
						pos(mouse.pos),
						rotate(rand(0, 360)),
						body(),
						area({ collisionIgnore: ["smallpanderito", "autoCursor"] }),
						opacity(1),
						scale(rand(1, 2.5)),
						layer("ui"),
						color(),
						"smallpanderito",
					])
					smallpanderito.gravityScale = 0.5

					smallpanderito.vel.x = rand(30, 75)
					
					let randomColor = rgb(rand(0, 255), rand(0, 255), rand(0, 255))
					smallpanderito.color = smallpanderito.color.lerp(randomColor, 0.1)
					if (chance(0.5)) {
						tween(smallpanderito.angle, smallpanderito.angle + 90, 1, (p) => smallpanderito.angle = p, )
					}

					else {
						tween(smallpanderito.angle, smallpanderito.angle - 90, 1, (p) => smallpanderito.angle = p, )
						smallpanderito.vel.x *= -1
					}

					wait(0.5, () => {
						tween(smallpanderito.opacity, 0, 0.5, (p) => smallpanderito.opacity = p, easings.easeOutQuint)
					})
				
					// ok you're done
					wait(1, () => {
						destroy(smallpanderito)
					})
				}

				this.trigger("clickrelease")
			},

			autoClick() {
				let autoCursor = add([
					sprite("cursors"),
					pos(),
					scale(0.8),
					rotate(0),
					layer("ui"),
					area({ collisionIgnore: ["autoCursor"] }),
					body(),
					opacity(1),
					anchor("center"),
					"autoCursor",
					{
						update() {
							// debug.log(this.angle)
						}
					}
				])
				autoCursor.gravityScale = 0
			
				// fucking cursor position
				autoCursor.pos.x = rand(
					hexagon.pos.x - 50,
					hexagon.pos.x + 50,
				);
				autoCursor.pos.y = rand(
					hexagon.pos.y - 50,
					hexagon.pos.y + 50,
				);
			
				tween(0, 1, 0.5, (p) => autoCursor.opacity = p, easings.easeOutQuint)
				tween(autoCursor.pos, autoCursor.pos.add(choose([-80, -70, -60, -50, 50, 60, 70, 80])), 0.5, (p) => autoCursor.pos = p, easings.easeOutQuint)
			
				if (
					autoCursor.pos.x > hexagon.pos.x - 50
					&& autoCursor.pos.x < hexagon.pos.x
				) {
					autoCursor.angle = 90;
				} else if (
					autoCursor.pos.x > hexagon.pos.x
					&& autoCursor.pos.x < hexagon.pos.x + 50
				) {
					autoCursor.angle = 270;
				}
			
				if (
					autoCursor.pos.y > hexagon.pos.y - 50
					&& autoCursor.pos.y < hexagon.pos.y
				) {
					autoCursor.angle += 45;
				} else if (
					autoCursor.pos.y > hexagon.pos.y
					&& autoCursor.pos.y < hexagon.pos.y + 50
				) {
					autoCursor.angle -= 45;
				}
				
				wait(0.25, () => {
					autoCursor.play("point")
					wait(0.15, () => {
						autoCursor.play("grab")
						
						// clickPress manual false
						tween(hexagon.scaleIncrease, this.maxScaleIncrease * 0.98, 0.35, (p) => hexagon.scaleIncrease = p, easings.easeOutQuint)
						playSfx("clickPress", {detune: rand(-50, 50)})

						wait(0.15, () => {
							autoCursor.play("point")
			
							// clickRelease manual false
							tween(hexagon.scaleIncrease, hexagon.maxScaleIncrease, 0.35, (p) => hexagon.scaleIncrease = p, easings.easeOutQuint)
							playSfx("clickRelease", {detune: rand(-50, 50)})
							
							addPlusScoreText({
								pos: autoCursor.pos,
								value: scoreVars.scorePerAutoClick,
								cursorRelated: true,
							})
							GameState.addScore(scoreVars.scorePerAutoClick * powerups.cursors.multiplier)
			
							// has done its bidding, time to roll and dissapear
							autoCursor.gravityScale = 1
							autoCursor.jump(300)
			
							wait(0.2, () => {
								// LOL!!!
								let upwards = chance(0.1)
								if (upwards) autoCursor.gravityScale = -1
								
								tween(1, 0, upwards ? 0.4 : 0.25, (p) => autoCursor.opacity = p, easings.linear)
								if (autoCursor.pos.x > hexagon.pos.x) {
									tween(autoCursor.angle, autoCursor.angle + 90, 1, (p) => autoCursor.angle = p, )
									autoCursor.vel.x = rand(25, 50)
								}
								
								if (autoCursor.pos.x < hexagon.pos.x) {
									tween(autoCursor.angle, autoCursor.angle - 90, 1, (p) => autoCursor.angle = p, )
									autoCursor.vel.x = rand(-25, -50)
								}
							
								// ok you're done
								wait(1, () => {
									destroy(autoCursor)
								})
							})
						})
					})
				})
			},

			startHover() {
				if (this.interactable) {
					tween(this.scaleIncrease, 1.05, 0.35, (p) => this.scaleIncrease = p, easings.easeOutCubic);
					this.rotationSpeed += hoverRotSpeedIncrease
					this.isBeingHovered = true
					mouse.play("point")
					this.maxScaleIncrease = 1.05
				}
			},

			endHover() {
				if (this.interactable) {
					tween(this.scaleIncrease, 1, 0.35, (p) => this.scaleIncrease = p, easings.easeOutCubic);
					this.isBeingClicked = false
					this.rotationSpeed = 0
					this.isBeingHovered = false
					mouse.play("cursor")
					this.maxScaleIncrease = 1
				}
			}
		}
	])

	hexagon.on("startAnimEnd", () => {
		hexagon.use(waver({ maxAmplitude: 5, wave_speed: 1 }))
		hexagon.startWave()
	})

	hexagon.onHover(() => {
		if (!isHoveringAWindow && !hexagon.isBeingHovered && !curDraggin) {
			hexagon.startHover()
		}
	})

	hexagon.onHoverEnd(() => {
		if (isDraggingAWindow || isDraggingASlider) return
		if (!isHoveringAWindow && !curDraggin) {
			hexagon.endHover()
		}
	});

	hexagon.onClick(() => {
		if (hexagon.interactable && hexagon.isBeingHovered && !isHoveringAWindow) {
			hexagon.clickPress()
			GameState.stats.timesClicked++
		}
	})
	
	hexagon.onMouseRelease("left", () => {
		if (hexagon.isBeingHovered) {
			if (hexagon.interactable && hexagon.isBeingClicked && !isHoveringAWindow) {
				hexagon.clickRelease()
			}
		}
	})

	hexagon.onMousePress("right", () => {
		if (!GameState.unlockedWindows.includes("hexColorWin")) return;
	
		if (hexagon.isBeingHovered) {
			manageWindow("hexColorWin")
		}
	})

	// # vanilla means clicks and upgrades included but not powerups/combo
	// SPC = Score per Click / SPAC = Score per Auto Click
	function getVanillaSPC() {
		let value:number;
		// clickers start at 0 that's why i have to add 1
		if (GameState.clicksUpgradesValue < 2) {
			value = 1 + GameState.clickers
		}

		else {
			value = (1 + GameState.clickers) * GameState.clicksUpgradesValue
		}
		return value;
	}

	function getFullSPC() {
		if (GameState.clicksUpgradesValue < 2) return ((1 + GameState.clickers) * powerups.clicks.multiplier) * scoreVars.combo
		else return (((1 + GameState.clickers) * GameState.clicksUpgradesValue) * powerups.clicks.multiplier) * scoreVars.combo
	}

	function getVanillaSPAC() {
		// DONT ADD POWERUPS they're not applicable for outside time
		let value:number;
		if (GameState.cursorsUpgradesValue < 2) {
			value = GameState.cursors
		}

		else {
			value = GameState.cursors * GameState.cursorsUpgradesValue
		}
		return value;
	}

	function getFullSPAC() {
		if (GameState.cursorsUpgradesValue < 2) return GameState.cursors * powerups.cursors.multiplier 
		else return (GameState.cursors * GameState.cursorsUpgradesValue) * powerups.cursors.multiplier
	}

	// score setting stuff
	hexagon.onUpdate(() => {
		scoreVars.scorePerClick = getVanillaSPC()
		scoreVars.scorePerAutoClick = getVanillaSPAC()

		// # sps
		// this is for when you leave the game
		scoreVars.autoScorePerSecond = scoreVars.scorePerAutoClick / GameState.timeUntilAutoLoopEnds

		scoreVars.scorePerSecond = ((clickVars.clicksPerSecond * getFullSPC()) + (scoreVars.autoScorePerSecond))
		spsUpdaterTimer += dt();
		if (spsUpdaterTimer > 1) {
			spsUpdaterTimer = 0;
			clickVars.clicksPerSecond = 0;
			spsText.updateValue();
		}
	})

	hexagon.on("clickrelease", () => {
		checkForUnlockable()
	})

	loop(2.5, () => {
		hexagon.stretched = !hexagon.stretched
		if (hexagon.stretched) tween(hexagon.stretchScaleIncrease, 0.98, 2, (p) => hexagon.stretchScaleIncrease = p, easings.linear)
		else tween(hexagon.stretchScaleIncrease, 1.01, 2, (p) => hexagon.stretchScaleIncrease = p, easings.linear)
	})

	// COMBO STUFF
	consecutiveClicksWaiting = wait(0, () => {});
}