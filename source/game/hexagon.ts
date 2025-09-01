import { GameState, scoreManager } from "../gamestate.ts";
import { scoreText, spsText } from "./uicounters.ts";
import { blendColors, getRandomDirection, saveColorToColor } from "./utils.ts";
import { playSfx } from "../sound.ts";
import { manageWindow } from "./windows/windows-api/windowManaging.ts";
import { waver } from "./plugins/wave.js";
import { addPlusScoreText, getClicksFromCombo, increaseCombo, maxComboAnim, startCombo } from "./combo-utils.ts";
import { addConfetti } from "./plugins/confetti.js";
import { cam } from "./gamescene.ts";
import { checkForUnlockable, isAchievementUnlocked, unlockAchievement } from "./unlockables/achievements.ts";
import { mouse } from "./additives.ts";
import { isWindowUnlocked } from "./unlockables/windowUnlocks.ts";
import { hoverController } from "../hoverManaging.ts";
import { AreaCompOpt, GameObj } from "kaplay";

export let clickVars = {
	clicksPerSecond: 0, // to properly calculate sps
	consecutiveClicks: 0,
	comboDropped: true,
	maxedCombo: false,
	constantlyClicking: false,
};

export const COMBO_MINCLICKS = 25;
export const COMBO_MAXCLICKS = 160;
export const COMBO_MAX = 5;

let consecutiveClicksWaiting = null;
let spsUpdaterTimer = 0; // to properly calculate sps

export let hexagon: ReturnType<typeof createHexagon>;

function playClickSound() {
	return playSfx("clickPress", { detune: rand(-75, 75) });
}
function playClickReleaseSound() {
	return playSfx("clickRelease", { detune: rand(-75, 75) });
}

export function addHexagon() {
	hexagon = createHexagon();
}

function createHexagon() {
	// reset variables
	scoreManager.combo = 1;

	clickVars.consecutiveClicks = 0;
	clickVars.constantlyClicking = false;
	clickVars.comboDropped = true;
	clickVars.maxedCombo = false;
	spsUpdaterTimer = 0;

	const hexagon = add([
		sprite(GameState.settings.panderitoMode ? "panderito" : "hexagon"),
		pos(center().x, center().y + 55),
		anchor("center"),
		rotate(0),
		scale(),
		opacity(1),
		color(saveColorToColor(GameState.settings.hexColor)),
		area(),
		area(),
		hoverController(1),
		z(0),
		layer("hexagon"),
		"hexagon",
		{
			partyHat: null as GameObj,
			interactable: true,
			isBeingClicked: false,
			isBeingFakeClicked: false,

			clickPress() {
				playClickSound();
				this.isBeingClicked = true;
				GameState.stats.timesClicked++;
			},

			clickReleaseAnim() {
				this.isBeingClicked = false;

				playClickReleaseSound();

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
					]);
					smallpanderito.gravityScale = 0.5;

					smallpanderito.vel.x = rand(30, 75);

					let randomColor = rgb(rand(0, 255), rand(0, 255), rand(0, 255));
					smallpanderito.color = blendColors(smallpanderito.color, randomColor, 0.1);
					if (chance(0.5)) {
						tween(smallpanderito.angle, smallpanderito.angle + 90, 1, (p) => smallpanderito.angle = p);
					}
					else {
						tween(smallpanderito.angle, smallpanderito.angle - 90, 1, (p) => smallpanderito.angle = p);
						smallpanderito.vel.x *= -1;
					}

					wait(0.5, () => {
						tween(smallpanderito.opacity, 0, 0.5, (p) => smallpanderito.opacity = p, easings.easeOutQuint);
					});

					// ok you're done
					wait(1, () => {
						destroy(smallpanderito);
					});
				}

				this.trigger("clickrelease");
			},

			clickRelease() {
				this.clickReleaseAnim();
				clickVars.clicksPerSecond++;

				// # combo stuff
				clickVars.constantlyClicking = true;

				consecutiveClicksWaiting.cancel();
				consecutiveClicksWaiting = wait(1, () => {
					clickVars.constantlyClicking = false;
					if (scoreManager.combo < 2) clickVars.consecutiveClicks = 0;
				});

				if (GameState.scoreThisRun > 100) {
					// if consecutiveclicks is not combo_maxclicks increase clicks
					if (clickVars.consecutiveClicks != COMBO_MAXCLICKS) {
						clickVars.consecutiveClicks++;
					}

					// checks for first combo
					if (clickVars.consecutiveClicks == getClicksFromCombo(2) && clickVars.comboDropped == true) {
						startCombo();
					}
					// check for all the other combos
					else if (scoreManager.combo < COMBO_MAX) {
						for (let i = 2; i < COMBO_MAX + 1; i++) {
							if (clickVars.consecutiveClicks == getClicksFromCombo(i)) {
								increaseCombo();
							}
						}
					}

					if (scoreManager.combo == COMBO_MAX && clickVars.maxedCombo == false) {
						clickVars.maxedCombo = true;
						maxComboAnim();

						addConfetti({ pos: center() });
						tween(-10, 0, 0.5, (p) => cam.rotation = p, easings.easeOutQuint);
						playSfx("fullcombo", { detune: rand(-50, 50) });

						if (!isAchievementUnlocked("extra.maxedcombo")) {
							unlockAchievement("extra.maxedcombo");
						}
					}
				}

				// # actual score additions
				let scoreObtained = 0;
				let isCritical = chance(rand(0.02, 0.08));
				let isBigCrit: boolean;

				if (isCritical == true) {
					if (chance(0.2)) isBigCrit = true;
					else isBigCrit = false;
				}

				if (GameState.critPower > 1 && isCritical == true) {
					// it's a critical hit
					scoreObtained = scoreManager.scorePerClick(true);
					if (isBigCrit == true) scoreObtained *= rand(1.05, 1.1);
				}
				else {
					scoreObtained = scoreManager.scorePerClick(false);
				}

				scoreObtained = Math.round(scoreObtained);

				let plusScoreText = addPlusScoreText({
					pos: mousePos(),
					value: scoreObtained,
					cursorRelated: false,
				});

				// actually adds the score
				scoreManager.addScore(scoreObtained);

				const addCriticalParticles = (big: boolean) => {
					let redcritcolor = RED.lighten(rand(110, 130));
					let bluecritcolor = BLUE.lighten(rand(110, 130));

					let theColor = big ? bluecritcolor : redcritcolor;

					let starparticle = add([
						layer("ui"),
						pos(mousePos()),
						opacity(),
						particles({
							max: 8,
							texture: getSprite("part_star").data.tex,
							quads: [getSprite("part_star").data.frames[0]],

							speed: [100, 250],
							angle: [0, 0],
							colors: [theColor.lighten(50), theColor.darken(50)],
							scales: [1, 1.1],
							lifeTime: [0.35, 0.5],
							opacities: [1, 0],
							acceleration: [vec2(50), vec2(-50)],
							angularVelocity: [30, 60],
						}, {
							lifetime: 1.5,
							rate: 100,
							direction: 180,
							spread: -90,
						}),
					]);
					starparticle.fadeIn(0.1);

					starparticle.emit(4);
				};

				// do crit anim stuff
				// if was critical and there was actually an increase
				if (scoreObtained > scoreManager.scorePerClick()) {
					if (isCritical == true && isBigCrit == false) {
						// add particles
						plusScoreText.color = blendColors(plusScoreText.color, RED, 0.1);
						plusScoreText.text += "!";

						let randomDir = getRandomDirection(center(), false, 2.5);
						tween(randomDir, center(), 0.35, (p) => cam.pos = p, easings.easeOutQuint);

						let tone = rand(-60, 45);
						playSfx("punch", { detune: tone });
						addCriticalParticles(isBigCrit);
					}

					if (isCritical == true && isBigCrit == true) {
						plusScoreText.color = blendColors(plusScoreText.color, BLUE, 0.1);
						plusScoreText.text += "!!";

						let randomDir = getRandomDirection(center(), false, 2.5);
						tween(randomDir, center(), 0.35, (p) => cam.pos = p, easings.easeOutQuint);
						tween(choose([-1, 1]), 0, 0.35, (p) => cam.rotation = p, easings.easeOutQuint);

						let tone = rand(35, 80);
						playSfx("punch", { detune: tone });
						addCriticalParticles(isBigCrit);
					}
				}
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
						},
					},
				]);
				autoCursor.gravityScale = 0;

				// fucking cursor position
				autoCursor.pos.x = rand(
					hexagon.pos.x - 50,
					hexagon.pos.x + 50,
				);
				autoCursor.pos.y = rand(
					hexagon.pos.y - 50,
					hexagon.pos.y + 50,
				);

				tween(0, 1, 0.5, (p) => autoCursor.opacity = p, easings.easeOutQuint);
				tween(autoCursor.pos, autoCursor.pos.add(choose([-80, -70, -60, -50, 50, 60, 70, 80])), 0.5, (p) => autoCursor.pos = p, easings.easeOutQuint);

				if (
					autoCursor.pos.x > hexagon.pos.x - 50
					&& autoCursor.pos.x < hexagon.pos.x
				) {
					autoCursor.angle = 90;
				}
				else if (
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
				}
				else if (
					autoCursor.pos.y > hexagon.pos.y
					&& autoCursor.pos.y < hexagon.pos.y + 50
				) {
					autoCursor.angle -= 45;
				}

				wait(0.25, () => {
					autoCursor.play("point");
					wait(0.15, () => {
						autoCursor.play("grab");

						// clickPress manual false
						// this is for the animation thing
						this.isBeingFakeClicked = true;
						playClickSound();

						wait(0.15, () => {
							autoCursor.play("point");

							this.isBeingFakeClicked = false;
							playClickReleaseSound();

							addPlusScoreText({
								pos: autoCursor.pos,
								value: scoreManager.scorePerAutoClick(),
								cursorRelated: true,
							});

							scoreManager.addScore(scoreManager.scorePerAutoClick());

							// has done its bidding, time to roll and dissapear
							autoCursor.gravityScale = 1;
							autoCursor.jump(300);

							wait(0.2, () => {
								// LOL!!!
								let upwards = chance(0.1);
								if (upwards) autoCursor.gravityScale = -1;

								tween(1, 0, upwards ? 0.4 : 0.25, (p) => autoCursor.opacity = p, easings.linear);
								if (autoCursor.pos.x > hexagon.pos.x) {
									tween(autoCursor.angle, autoCursor.angle + 90, 1, (p) => autoCursor.angle = p);
									autoCursor.vel.x = rand(25, 50);
								}

								if (autoCursor.pos.x < hexagon.pos.x) {
									tween(autoCursor.angle, autoCursor.angle - 90, 1, (p) => autoCursor.angle = p);
									autoCursor.vel.x = rand(-25, -50);
								}

								// ok you're done
								wait(1, () => {
									destroy(autoCursor);
								});
							});
						});
					});
				});
			},
		},
	]);

	const hexagonArea: AreaCompOpt = {
		// must have at least 3 vertices
		shape: new Polygon([vec2(0), vec2(0), vec2(0)]),
		offset: vec2(0),
	};

	// some cool math
	const pts = [];
	for (let i = 0; i < 6; i++) {
		const angle = Math.PI / 3 * i;
		const x = -221 * Math.cos(angle);
		const y = -221 * Math.sin(angle);
		pts.push(vec2(x, y));
	}
	hexagonArea.shape = new Polygon(pts);

	const panderitoArea: AreaCompOpt = {
		// must have at least 3 vertices
		shape: new Polygon([
			// they have to be clockwise or counter clockwise
			vec2((-hexagon.width / 2) + 15, 35), // centerleft
			vec2((-hexagon.width / 2) + 50, -hexagon.height / 4 - 30), // cornerthing
			vec2(-20, -hexagon.height / 2), // topcenter
			vec2((hexagon.width / 2) - 20, -hexagon.height / 4), // centerright
			vec2(20, hexagon.height / 2), // botcenter
		]),
		offset: vec2(0),
	};

	let maxRotationSpeed = 4;
	let rotationSpeed = 0;
	/** How much scale is increased on hover */
	let scaleHoverIncrease = vec2(1.1);

	hexagon.onUpdate(() => {
		if (hexagon.interactable) hexagon.customHoverScale = vec2(1);
		else hexagon.customHoverScale = vec2(0);

		// spinning stuff
		if (hexagon.angle >= 360) {
			hexagon.angle = 0;
		}
		rotationSpeed = mapc(GameState.score, 0, scoreManager.scoreYouGetNextManaAt(), 0.01, maxRotationSpeed);
		hexagon.angle += rotationSpeed;

		// some hover stuff
		if (hexagon.isHovering()) {
			hexagon.isBeingClicked = isMouseDown("left");

			if (hexagon.isBeingFakeClicked && scaleHoverIncrease != vec2(1)) {
				scaleHoverIncrease = vec2(1);
			}
			else {
				scaleHoverIncrease = vec2(1.1);
			}

			if (hexagon.isBeingClicked) {
				hexagon.scale = lerp(hexagon.scale, scaleHoverIncrease.scale(0.9), 0.25);
			}
			else {
				hexagon.scale = lerp(hexagon.scale, scaleHoverIncrease, 0.25);
			}

			maxRotationSpeed = 4.75;
		}
		else {
			if (hexagon.isBeingClicked) hexagon.isBeingClicked = false;
			maxRotationSpeed = 4;
			hexagon.scale.x = lerp(hexagon.scale.x, 1, 0.25);
			hexagon.scale.y = lerp(hexagon.scale.y, 1, 0.25);
		}

		// panderito
		if (!GameState.settings.panderitoMode) {
			hexagon.sprite = "hexagon";
			hexagon.area.shape = hexagonArea.shape;
			hexagon.area.offset = hexagonArea.offset;
		}
		else {
			hexagon.sprite = "panderito";
			hexagon.area.shape = panderitoArea.shape;
			hexagon.area.offset = panderitoArea.offset;
			if (hexagon.partyHat) {
				hexagon.partyHat;
			}
		}
	});

	hexagon.on("startAnimEnd", () => {
		hexagon.use(waver({ maxAmplitude: 5, wave_speed: 1 }));
	});

	hexagon.onClick(() => {
		if (hexagon.isHovering()) {
			hexagon.clickPress();
		}
	});

	hexagon.onMouseRelease("left", () => {
		if (hexagon.isHovering()) {
			hexagon.clickRelease();
		}
	});

	hexagon.onMousePress("right", () => {
		if (isWindowUnlocked("hexColorWin") && hexagon.isHovering()) manageWindow("hexColorWin");
	});

	// score setting stuff
	hexagon.onUpdate(() => {
		spsUpdaterTimer += dt();
		if (spsUpdaterTimer > 1) {
			spsUpdaterTimer = 0;
			spsText.updateValue(); // update it before it gets to 0
			clickVars.clicksPerSecond = 0;
		}
	});

	getTreeRoot().on("scoreGained", (amount) => {
		checkForUnlockable();
	});

	// COMBO STUFF
	consecutiveClicksWaiting = wait(0, () => {});

	return hexagon;
}
