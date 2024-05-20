
import { GameState } from "../../GameState.js";
import { scorePerAutoClick, scorePerClick } from "./gamescene.js";
import { scoreText, spsText } from "./uiCounter.js";
import { addPlusScoreText, mouse, formatNumber, changeValueBasedOnAnother, gameBg, bop, arrayToColor } from "./utils.js";
import { playSfx } from "../../sound.js";
import { isDraggingWindow, isHoveringWindow, manageWindow, openWindow } from "./windows/WindowsMenu.js";

let hoverRotSpeedIncrease = 0.01 * 0.25
let maxRotSpeed = 10

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
			
			hexagon.clickPress(false)

			wait(0.15, () => {
				autoCursor.play("point")

				hexagon.clickRelease(false)
				addPlusScoreText(autoCursor.pos, scorePerAutoClick, [32.5, 40])
				GameState.addScore(scorePerAutoClick)

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
		color(arrayToColor(GameState.hexColor)),
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
		"hexagon",
		"hoverObj",
		{
			defScale: vec2(1),
			verPosition: center().y + 55,
			canClick: true,
			isBeingClicked: false,
			rotationSpeed: 0.01,
			update() {
				if (this.isHovering()) maxRotSpeed = 13
				else maxRotSpeed = 10
				hexagon.rotationSpeed = changeValueBasedOnAnother(hexagon.rotationSpeed, maxRotSpeed, GameState.score, 1000000, 0.01)
				this.angle += this.rotationSpeed
			
				if (this.angle >= 360) {
					this.angle = 0
				}

				// sps
				secondTimerForClicks += dt();
				if (secondTimerForClicks > 1) {
					secondTimerForClicks = 0;
					spsText.text = actualScorePerSecond + "/s"
					clicksPerSecond = 0;
				}
				// this is for when you leave the game
				autoScorePerSecond = GameState.cursors / GameState.timeUntilAutoLoopEnds
				// the other stuff
				actualScorePerSecond = (clicksPerSecond * scorePerClick) + autoScorePerSecond
				actualScorePerSecond = actualScorePerSecond.toFixed(1);
				actualScorePerSecond = formatNumber(actualScorePerSecond, true, false)

				if (timeTilClick > 0) {
					timeTilClick -= dt()
				}
				else if (isWaitingToClick) {
					isWaitingToClick = false
				}
			},
			
			clickPress(manual = true) {
				tween(
					vec2(1.01),
					vec2(0.97),
					0.35,
					(p) => this.scale = p,
					easings.easeOutBounce,
				);
				
				if (manual) {
					this.isBeingClicked = true
					mouse.clicking = true
				
					mouse.grab()
					// add([
					// 	sprite("pinch"),
					// 	pos(mouse.pos.x, mouse.pos.y - 35),
					// 	anchor("center"),
					// 	color(BLACK),
					// 	z(101),
					// ])
				}

				playSfx("clickPress", rand(-50, 50))
				tween(scoreText.scale, vec2(1.025), 0.32, (p) => scoreText.scale = p, easings.easeOutBounce)
			},

			clickRelease(manual = true) {
				tween(
					vec2(0.97),
					vec2(1.01),
					0.35,
					(p) => this.scale = p,
					easings.easeOutBounce,
				);
				
				// manual is true, so this is if it isn't manual
				if (manual) {
					mouse.clicking = false
					this.isBeingClicked = false 
					isWaitingToClick = true
					timeTilClick = constTimeTilClick
					
					clicksPerSecond++
					mouse.release()
				}

				// debug.log("CPS: " + clicksPerSecond)
				// debug.log("SPS: " + scorePerSecond)
				// debug.log("SPC: " + scorePerClick)
				playSfx("clickRelease", rand(-50, 50))
			
				tween(scoreText.scale, vec2(1), 0.32, (p) => scoreText.scale = p, easings.easeOutBounce)
			
				tween(scoreText.angle, choose([scoreText.angle - 1, scoreText.angle + 1]), 0.32, (p) => scoreText.angle = p, easings.easeOutQuad)
				
				wait(0.32, () => {
					tween(scoreText.angle, 0, 0.1, (p) => scoreText.angle = p, easings.easeOutBounce)
				})
			},

			startHover() {
				if (hexagon.canClick) {
					tween(
						hexagon.pos.y,
						hexagon.verPosition - 10,
						0.35,
						(p) => hexagon.pos.y = p,
						easings.easeOutCubic,
					);
					tween(
						hexagon.scale,
						vec2(1.01, 1.01),
						0.35,
						(p) => hexagon.scale = p,
						easings.easeOutBounce,
					);
		
					hexagon.rotationSpeed += hoverRotSpeedIncrease
					mouse.play("point")
					// playSfx("hoverhex", rand(-10, 10))
				}
			},

			endHover() {
				if (hexagon.canClick) {
					tween(
						hexagon.pos.y,
						hexagon.verPosition,
						0.35,
						(p) => hexagon.pos.y = p,
						easings.easeOutCubic,
					);

					hexagon.isBeingClicked = false
					hexagon.rotationSpeed = 0
					if ((!isHoveringWindow && !isDraggingWindow)) mouse.play("cursor")
					// playSfx("unhoverhex", rand(-10, 10))
				}
			}
		}
	])

	hexagon.onHover(() => {
		// if no window has a mouse in precise range
		if (!get("window").some(window => window.isMouseInPreciseRange()) && !isDraggingWindow) {
			hexagon.startHover()
		}
	})

	hexagon.onHoverEnd(() => {
		if (!get("window").some(window => window.isMouseInPreciseRange()) && !isDraggingWindow)
		hexagon.endHover()
	});

	hexagon.onMousePress("left", () => {
		if (hexagon.isHovering()) {
			if (hexagon.canClick && timeTilClick < 0 && (!isHoveringWindow && !isDraggingWindow)) {
				hexagon.clickPress(true)
			}
		}
	})
	
	hexagon.onMouseRelease("left", () => {
		if (hexagon.isHovering()) {
			if (hexagon.canClick && hexagon.isBeingClicked && !isWaitingToClick && (!isHoveringWindow && !isDraggingWindow)) {
				hexagon.clickRelease(true)
				addPlusScoreText(mouse.pos, scorePerClick)
				GameState.addScore(scorePerClick)
			}
		}
	})

	hexagon.onMousePress("right", () => {
		if (hexagon.isHovering()) {
			manageWindow("hexColorWin")
		}
	})

	hexagon.onUpdate(() => {
		// if (isKeyDown("left")) {
		// 	gameBg.blendFactor -= 0.01
		// }
		
		// else if (isKeyDown("right")) {
		// 	gameBg.blendFactor += 0.01
		// }
	})
}