
import { GameState } from "../../gamestate.js";
import { scoreText, spsText } from "./uicounters.js";
import { formatNumber, arrayToColor } from "./utils.js";
import { mouse } from "./additives.js";
import { playSfx } from "../../sound.js";
import { isDraggingAWindow, isGenerallyHoveringAWindow, isPreciselyHoveringAWindow, manageWindow } from "./windows/windows-api/windowsAPI.js";
import { waver } from "../../plugins/wave.js";
import { isDraggingASlider } from "./windows/colorWindow.js";
import { addPlusScoreText, comboBarContent, getClicksFromCombo, increaseCombo, maxBarWidth, startCombo } from "./combo-utils.js";
import { addConfetti } from "../../plugins/confetti.js";
import { curDraggin } from "../../plugins/drag.js";
import { cam } from "./gamescene.js";

export let scoreVars = {
	scorePerClick: 1,
	scorePerAutoClick: 0,
	autoScorePerSecond: 0, // the score per second you're getting automatically
	actualScorePerSecond: 0, // the actual and current score per second - used in the ui
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

export const COMBO_MINCLICKS = 25; // 25
export const COMBO_MAXCLICKS = 160; // 160
export const COMBO_MAX = 10
const hoverRotSpeedIncrease = 0.01 * 0.25

let consecutiveClicksWaiting = null;
let spsUpdaterTimer = 0; // to properly calculate sps

export let hexagon;

let maxRotSpeed = 10
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
			scale: GameState.settings.panderitoMode ? vec2(0.5, 1) : vec2(1.08, 1.08) 
		}),		
		z(2),
		"hexagon",
		"hoverOutsideWindow",
		{
			isBeingHoveredOn: false,
			smallestScale: 0.985,
			biggestScale: 1.0015,
			defaultScale: vec2(1),
			scaleIncrease: 1,
			stretchScaleIncrease: 1,
			canClick: true,
			isBeingClicked: false,
			rotationSpeed: 0.01,
			clickPressTween: null,
			stretched: true,
			update() {
				if (this.isHovering()) maxRotSpeed = 13
				else maxRotSpeed = 10
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
				this.clickPressTween = tween(this.scaleIncrease, 0.98, 0.35, (p) => this.scaleIncrease = p, easings.easeOutQuint)
				this.isBeingClicked = true
				mouse.grab()
				playSfx("clickPress", rand(-50, 50))
			},

			clickRelease() {
				this.clickPressTween.cancel()
				tween(this.scaleIncrease, this.isHovering() ? 1.05: 1, 0.35, (p) => this.scaleIncrease = p, easings.easeOutQuint)
				this.isBeingClicked = false 
				clickVars.clicksPerSecond++
				playSfx("clickRelease", rand(-50, 50))
				mouse.releaseAndPlay("point")

				// # combo stuff
				clickVars.constantlyClicking = true

				consecutiveClicksWaiting.cancel()
				consecutiveClicksWaiting = wait(1, () => {
					clickVars.constantlyClicking = false
					if (scoreVars.combo < 2) clickVars.consecutiveClicks = 0
				})

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

				if (scoreVars.combo == 10 && clickVars.maxedCombo == false) {
					clickVars.maxedCombo = true
					addConfetti({ pos: center() })
					tween(-10, 0, 0.5, (p) => cam.rotation = p, easings.easeOutQuint)
					playSfx("fullcombo", rand(-50, 50))
				}

				// debug.log(`${clickVars.consecutiveClicks} / ${COMBO_MAXCLICKS}`)

				// # actual score additions
				addPlusScoreText({posToAdd: mousePos(), amount: scoreVars.scorePerClick, manual: true})
				GameState.addScore(scoreVars.scorePerClick * scoreVars.combo)
				tween(scoreText.scaleIncrease, 1.05, 0.2, (p) => scoreText.scaleIncrease = p, easings.easeOutQuint).onEnd(() => {
					tween(scoreText.scaleIncrease, 1, 0.2, (p) => scoreText.scaleIncrease = p, easings.easeOutQuint)
				})
			},

			autoClick() {
				let autoCursor = add([
					sprite("cursors"),
					pos(),
					scale(0.8),
					z(2.1),
					rotate(0),
					z(4),
					anchor("center"),
					"cursor",
					{
						update() {
							// debug.log(this.angle)
						}
					}
				])
			
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
						tween(hexagon.scaleIncrease, 0.98, 0.35, (p) => hexagon.scaleIncrease = p, easings.easeOutQuint)
						playSfx("clickPress", rand(-50, 50))
			
						wait(0.15, () => {
							autoCursor.play("point")
			
							// clickRelease manual false
							tween(hexagon.scaleIncrease, hexagon.isHovering() ? 1.05: 1, 0.35, (p) => hexagon.scaleIncrease = p, easings.easeOutQuint)
							playSfx("clickRelease", rand(-50, 50))
							
							addPlusScoreText({posToAdd: autoCursor.pos, amount: scoreVars.scorePerAutoClick, manual: false})
							GameState.addScore(scoreVars.scorePerAutoClick)
			
							// has done its bidding, time to roll and dissapear
							autoCursor.use(area({ collisionIgnore: ["cursor"] }))
							autoCursor.use(body())
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
				if (this.canClick) {
					tween(this.scaleIncrease, 1.05, 0.35, (p) => this.scaleIncrease = p, easings.easeOutCubic);
					this.rotationSpeed += hoverRotSpeedIncrease
					this.isBeingHoveredOn = true
					mouse.play("point")
				}
			},

			endHover() {
				if (this.canClick) {
					tween(this.scaleIncrease, 1, 0.35, (p) => this.scaleIncrease = p, easings.easeOutCubic);
					this.isBeingClicked = false
					this.rotationSpeed = 0
					this.isBeingHoveredOn = false
					mouse.play("cursor")
				}
			}
		}
	])

	hexagon.on("startAnimEnd", () => {
		hexagon.use(waver({ maxAmplitude: 5, wave_speed: 1 }))
		hexagon.startWave()
	})

	hexagon.onHoverUpdate(() => {
		if (!isGenerallyHoveringAWindow && !isDraggingAWindow && !hexagon.isBeingHoveredOn && !curDraggin?.is("minibutton")) {
			hexagon.startHover()
		}
	})

	hexagon.onHoverEnd(() => {
		if (isDraggingAWindow || isDraggingASlider) return
		if (!isPreciselyHoveringAWindow && !curDraggin?.is("minibutton")) {
			hexagon.endHover()
		}
	});

	hexagon.onMousePress("left", () => {
		if (hexagon.isBeingHoveredOn) {
			if (!isPreciselyHoveringAWindow && !isDraggingAWindow) {
				hexagon.clickPress()
			}
		}
	})
	
	hexagon.onMouseRelease("left", () => {
		if (hexagon.isBeingHoveredOn) {
			if (hexagon.canClick && hexagon.isBeingClicked && !isPreciselyHoveringAWindow&& !isDraggingAWindow) {
				hexagon.clickRelease()
			}
		}
	})

	hexagon.onMousePress("right", () => {
		if (hexagon.isHovering()) {
			manageWindow("hexColorWin")
		}
	})

	// score setting stuff
	hexagon.onUpdate(() => {
		scoreVars.scorePerClick = GameState.clickers + 1
		scoreVars.scorePerAutoClick = GameState.cursors

		// scorePerClick = GameState.clicksUpgrades > 0 ? GameState.clickers * GameState.clicksUpgrades : GameState.clickers
		// scorePerClick += Math.round(percentage(scorePerClick, GameState.clickPercentage))
		// scorePerAutoClick = GameState.cursorUpgrades > 0 ? GameState.cursors * GameState.cursorUpgrades : GameState.cursors
		// scorePerAutoClick += Math.round(percentage(scorePerAutoClick, GameState.cursorsPercentage))

		// sps
		spsUpdaterTimer += dt();
		if (spsUpdaterTimer > 1) {
			spsUpdaterTimer = 0;

			// shoutout to Candy&Carmel
			let divideValue = GameState.settings.spsText ? Math.pow(60, GameState.settings.spsTextMode-1) : 1;
			spsText.value = (Number(scoreVars.actualScorePerSecond) / divideValue)
			clickVars.clicksPerSecond = 0;
		}

		// this is for when you leave the game
		scoreVars.autoScorePerSecond = GameState.cursors / GameState.timeUntilAutoLoopEnds
		// the other stuff
		scoreVars.actualScorePerSecond = (clickVars.clicksPerSecond * scoreVars.scorePerClick) + scoreVars.autoScorePerSecond
		scoreVars.actualScorePerSecond = scoreVars.actualScorePerSecond.toFixed(1);
		scoreVars.actualScorePerSecond = formatNumber(scoreVars.actualScorePerSecond, true, false)
	})

	loop(2.5, () => {
		hexagon.stretched = !hexagon.stretched
		if (hexagon.stretched) tween(hexagon.stretchScaleIncrease, 0.98, 2, (p) => hexagon.stretchScaleIncrease = p, easings.linear)
		else tween(hexagon.stretchScaleIncrease, 1.01, 2, (p) => hexagon.stretchScaleIncrease = p, easings.linear)
	})

	// COMBO STUFF
	consecutiveClicksWaiting = wait();
}