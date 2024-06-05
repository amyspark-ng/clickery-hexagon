
import { GameState } from "../../gamestate.js";
import { scoreText, spsText } from "./uicounters.js";
import { addPlusScoreText, mouse, formatNumber, arrayToColor } from "./utils.js";
import { playSfx } from "../../sound.js";
import { isDraggingAWindow, isGenerallyHoveringAWindow, isPreciselyHoveringAWindow, manageWindow } from "./windows/windowsAPI.js";
import { waver } from "../../plugins/wave.js";
import { isDraggingASlider } from "./windows/colorWindow.js";

export let scoreVars = {
	scorePerClick: 1,
	scorePerAutoClick: 0,
	autoScorePerSecond: 0, // the score per second you're getting automatically
	actualScorePerSecond: 0, // the actual and current score per second - used in the ui
	scoreNeededToAscend: 1000000
}

export let clickVars = {
	clicksPerSecond: 0, // to properly calculate sps
}

export let autoScorePerSecond = 0; // the score per second you're getting automatically
export let actualScorePerSecond = 0; // the actual and current score per second
let clicksPerSecond = 0; // to properly calculate sps
let secondTimerForClicks = 0; // to properly calculate sps

// totally not anti cheat
// let constTimeTilClick = 37/1000
let constTimeTilClick = 32/1000
let timeTilClick = constTimeTilClick
let isWaitingToClick = false

export let hexagon;

let hoverRotSpeedIncrease = 0.01 * 0.25
let maxRotSpeed = 10

export function autoClick() {
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
				
				addPlusScoreText(autoCursor.pos, scoreVars.scorePerAutoClick, [32.5, 40])
				GameState.addScore(scoreVars.scorePerAutoClick)

				// has done its bidding, time to roll and dissapear
				autoCursor.use(area({ collisionIgnore: ["cursor"] }))
				autoCursor.use(body())
				autoCursor.jump(300)

				wait(0.2, () => {
					tween(1, 0, 0.25, (p) => autoCursor.opacity = p, )
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
}

export function addHexagon() {
	hexagon = add([
		sprite(GameState.personalization.panderitoMode ? "panderito" : "hexagon"),
		pos(center().x, center().y + 55),
		anchor("center"),
		rotate(0),
		scale(),
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
			scale: GameState.personalization.panderitoMode ? vec2(0.5, 1) : vec2(1.08, 1.08) 
		}),		
		z(2),
		waver({ maxAmplitude: 5, wave_speed: 1 }),
		"hexagon",
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
				this.wave_speed = map(GameState.score, 0, scoreVars.scoreNeededToAscend, 1, 2)
				this.wave_speed = clamp(this.wave_speed, 1, 2)
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
				mouse.clicking = true
				mouse.grab()
				playSfx("clickPress", rand(-50, 50))
			},

			clickRelease() {
				this.clickPressTween.cancel()
				tween(this.scaleIncrease, this.isHovering() ? 1.05: 1, 0.35, (p) => this.scaleIncrease = p, easings.easeOutQuint)
				mouse.clicking = false
				this.isBeingClicked = false 
				isWaitingToClick = true
				timeTilClick = constTimeTilClick
				clickVars.clicksPerSecond++
				mouse.release("point")
				playSfx("clickRelease", rand(-50, 50))
			},

			autoClick() {
				
			},

			startHover() {
				if (this.canClick) {
					tween(this.scaleIncrease, 1.05, 0.35, (p) => this.scaleIncrease = p, easings.easeOutCubic);
					this.rotationSpeed += hoverRotSpeedIncrease
					if (!isDraggingASlider) mouse.play("point")
					this.isBeingHoveredOn = true
				}
			},

			endHover() {
				if (this.canClick) {
					tween(this.scaleIncrease, 1, 0.35, (p) => this.scaleIncrease = p, easings.easeOutCubic);
					this.isBeingClicked = false
					this.rotationSpeed = 0
					if (!isDraggingASlider) mouse.play("cursor")
					this.isBeingHoveredOn = false
				}
			}
		}
	])

	hexagon.startWave()

	hexagon.onHoverUpdate(() => {
		if (!isGenerallyHoveringAWindow && !isDraggingAWindow && !hexagon.isBeingHoveredOn) {
			hexagon.startHover()
		}
	})

	hexagon.onHoverEnd(() => {
		if (isDraggingAWindow || isDraggingASlider) return
		if (!isPreciselyHoveringAWindow) {
			hexagon.endHover()
		}
	});

	hexagon.onMousePress("left", () => {
		if (hexagon.isBeingHoveredOn) {
			if (!isWaitingToClick && (!get("window").some(w => w.isMouseInPreciseRange()) && !isDraggingAWindow)) {
				hexagon.clickPress()
			}
		}
	})
	
	hexagon.onMouseRelease("left", () => {
		if (hexagon.isBeingHoveredOn) {
			if (hexagon.canClick && hexagon.isBeingClicked && !isWaitingToClick && (!get("window").some(w => w.isMouseInPreciseRange()) && !isDraggingAWindow)) {
				hexagon.clickRelease()
				
				//actual score additions
				addPlusScoreText(mouse.pos, scoreVars.scorePerClick)
				GameState.addScore(scoreVars.scorePerClick)
				tween(scoreText.scaleIncrease, 1.05, 0.2, (p) => scoreText.scaleIncrease = p, easings.easeOutQuint).onEnd(() => {
					tween(scoreText.scaleIncrease, 1, 0.2, (p) => scoreText.scaleIncrease = p, easings.easeOutQuint)
				})
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
		secondTimerForClicks += dt();
		if (secondTimerForClicks > 1) {
			secondTimerForClicks = 0;
			spsText.text = scoreVars.actualScorePerSecond + "/s"
			clickVars.clicksPerSecond = 0;
		}

		// this is for when you leave the game
		scoreVars.autoScorePerSecond = GameState.cursors / GameState.timeUntilAutoLoopEnds
		// the other stuff
		scoreVars.actualScorePerSecond = (clickVars.clicksPerSecond * scoreVars.scorePerClick) + scoreVars.autoScorePerSecond
		scoreVars.actualScorePerSecond = scoreVars.actualScorePerSecond.toFixed(1);
		scoreVars.actualScorePerSecond = formatNumber(scoreVars.actualScorePerSecond, true, false)

		if (timeTilClick > 0) {
			timeTilClick -= dt()
		}

		else if (isWaitingToClick) {
			isWaitingToClick = false
		}
	})

	loop(2.5, () => {
		hexagon.stretched = !hexagon.stretched
		if (hexagon.stretched) tween(hexagon.stretchScaleIncrease, 0.98, 2, (p) => hexagon.stretchScaleIncrease = p, easings.linear)
		else tween(hexagon.stretchScaleIncrease, 1.01, 2, (p) => hexagon.stretchScaleIncrease = p, easings.linear)
	})
}