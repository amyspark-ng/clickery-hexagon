import { GameState } from "../../gamestate"
import { drag } from "../../plugins/drag"
import { positionSetter } from "../../plugins/positionSetter"
import { waver } from "../../plugins/wave"
import { playSfx } from "../../sound"
import { addBackground, addMouse, blendColors, bop, gameBg, getRandomElementDifferentFrom, mouse } from "./utils"
import { manageWindow, openWindow, windowsDefinition } from "./windows/windows-api/windowsAPI"

let cameraScale = 1
let mage;

let dialogueBox;
let dialogueText;
let dialogueEye;
let activeWaits = []
let currentDialogueIdx = 0

let dialogues = {
	0: { 
		"woke": "Thy hexagon is palmy, giveth t to me and i'll giveth thee anoth'r one, f'r one of these",
		"dumb": "Your hexagon is mighty, give it to me, and i'll give you another one, for one of these",
		"speed": 0.05
	},
	// #region eye picking ones
	1: { 
		"woke": "THOU SHALL STOP",
		"dumb": "STOP",
		"speed": 0.01
	},
	2: { 
		"woke": "STOP IN THIS INSTANT",
		"dumb": "STOP NOW!!",
		"speed": 0.01
	},
	3: { 
		"woke": "I SHALL CAST YOU TO HELL",
		"dumb": "fuck you dumbass!",
		"speed": 0.01
	},
	//#endregion eye picking ones
}

let trophies;

function makeTrophy(opts = {trophycolor: WHITE, score: 10000, index: 0}) {
	let trophy = make([
		sprite("hexagon"),
		pos(0, 0),
		scale(0.3),
		color(opts.trophycolor),
		area({ scale: 0.8 }),
		anchor("center"),
		waver({ wave_speed: rand(0.8, 1), maxAmplitude: rand(5, 7.5) }),
		z(gameBg.z + 1)
	])
	trophy.startWave()

	let initialPos = -25;
	trophy.pos.x = initialPos + (opts.index * 135)

	trophy.onHover(() => {
		debug.log(trophy.pos.x)
		let tooltiprect = add([
			rect(100, 50, { radius: 5 }),
			opacity(0.8),
			pos(mousePos().x + 25, mousePos().y),
			color(BLACK),
			opacity(1),
			z(trophy.z + 1),
			"trophy_tooltip",
		])
		
		let tooltiptext = add([
			text(`You ascended with\n${opts.score}`, {
				size: 20,
				align: "left",
			}),
			color(WHITE),
			pos(tooltiprect.pos.x + 6.5, tooltiprect.pos.y + 5),
			z(10),
			opacity(1),
			z(tooltiprect.z + 1),
			"trophy_tooltip",
		])

		tooltiprect.width = tooltiptext.width + 15
	})

	trophy.onHoverEnd(() => {
		// if there's no tooltip don't do anything
		if (get("trophy_tooltip").length < 1) return
		get("trophy_tooltip", { recursive: true }).forEach((tooltip) => {
			destroy(tooltip)
		})
	})

	return trophy;
}

function addMage() {
	let mage_color = rgb(0, 51, 102)
	
	mage = add([
		pos(-17, 154),
		waver({ wave_speed: 1, maxAmplitude: 2.5 }),
		{
			say(thingToSay = "Hello world", speed = 0.1) {
				tween(0.5, 1, 0.25, (p) => dialogueBox.scale.x = p, easings.easeOutQuint)
				activeWaits.forEach(waitCall => waitCall.cancel());
				activeWaits = [];
				dialogueText.text = ""

				let currentDelay = 0
				Array.from(thingToSay).forEach((letter, index) => {
					let delay = speed;
					if (letter === ',' || letter === "_") {
						delay = speed * 5; // Adjust the multiplier as needed for commas and spaces
					}

					// Increment currentDelay by the calculated delay
					currentDelay += delay;

					const waitCall = wait(currentDelay, () => {
						if (letter !== "_") dialogueText.text += letter;
						// playSfx("mage_e", rand(-150, 150));
					});

					activeWaits.push(waitCall);
				});
			},
		}
	]);	
	mage.startWave()

	let mage_body = mage.add([
		pos(),
		sprite("mage_body"),
		z(2),
		"mage_body",
	])

	let mage_body_lightning = mage.add([
		pos(),
		sprite("mage_body_lightning"),
		z(3),
		opacity(0.25),
		"mage_lightning",
	])

	let mage_cursors = mage.add([
		pos(0, -7),
		sprite("mage_cursors"),
		z(0),
		waver({ wave_speed: 1, maxAmplitude: 5 }),
		opacity(1),
		color(WHITE.darken(50)),
	])
	mage_cursors.startWave()

	let mage_eye = mage.add([
		pos(117, 120),
		sprite("mage_eye"),
		area({ scale: 0.8 }),
		z(2),
		{
			timeToBlinkAgain: 8,
			timeUntilBlink: 8,
			update() {
				if (this.isHovering() && isMousePressed("left")) {
					this.play("blink")
					currentDialogueIdx = getRandomElementDifferentFrom([1, 2, 3], currentDialogueIdx)
					mage.say(dialogues[currentDialogueIdx][dialogueEye.woke ? "woke" : "dumb"], dialogues[currentDialogueIdx].speed)
				}
				
				this.timeToBlinkAgain -= dt()
				if (this.timeToBlinkAgain < 0) {
					this.timeToBlinkAgain = rand(5, 8)
					this.timeToBlinkAgain = this.timeToBlinkAgain
					if (chance(0.75)) this.play("blink")
				}
			}
		}
	])
	mage_eye.onAnimEnd((anim) => {
		// if (anim != "blink") return
		// if (chance(0.25)) mage_eye.play("blink") 
	});

	let mage_toparm = mage.add([
		pos(0, 0),
		sprite("mage_toparm"),
		z(1),
		{
			update() {
				this.angle = wave(-0.5, 0.5, time())
			}
		}			
	])

	let mage_toparm_lightning = mage.add([
		pos(0, 0),
		sprite("mage_toparm_lightning"),
		z(4),
		opacity(0.25),
		"mage_lightning",
	{
			update() {
				this.angle = wave(-0.5, 0.5, time())
			}
		}			
	])

	let mage_botarm = mage.add([
		pos(5, 240),
		sprite("mage_botarm"),
		z(7),
		anchor("left"),
		{
			update() {
				this.angle = wave(-1, 1, time())
			}
		}			
	])

	let mage_botarm_lightning = mage.add([
		pos(5, 240),
		sprite("mage_botarm_lightning"),
		z(8),
		anchor("left"),
		opacity(0.25),
		"mage_lightning",
	{
			update() {
				this.angle = wave(-1, 1, time())
			}
		}			
	])

	let mage_hexagon = mage.add([
		pos(GameState.settings.panderitoMode ? vec2(231, 250): vec2(231, 244)),
		sprite(GameState.settings.panderitoMode ? "panderito" : "hexagon"),
		scale(0.35),
		waver({ wave_speed: 1, maxAmplitude: 10 }),
		rotate(0),
		anchor("center"),
		color(WHITE),
		z(5),
		area({ scale: 0.8 }),
		"hexagon",
		{
			update() {
				if (this.isHovering() && isMousePressed("left")) {
					bop(this, 0.01)
				}
				this.angle += 0.02
			}
		}
	])

	mage_hexagon.onHover(() => {
		let tooltiprect = add([
			rect(100, 50, { radius: 5 }),
			opacity(0.8),
			pos(mage_hexagon.x + 25, mage_hexagon.y),
			color(BLACK),
			opacity(1),
			"mage_tooltip",
		])
		
		let tooltiptext = add([
			text("You ascended with\n100.000", {
				size: 20,
				align: "left",
			}),
			color(WHITE),
			pos(tooltiprect.pos.x + 6.5, tooltiprect.pos.y + 5),
			z(10),
			opacity(1),
			"mage_tooltip",
		])

		tooltiprect.width = tooltiptext.width + 15
	})

	mage_hexagon.onHoverEnd(() => {
		// if there's no tooltip don't do anything
		if (get("mage_tooltip").length < 1) return
		get("mage_tooltip", { recursive: true }).forEach((tooltip) => {
			destroy(tooltip)
		})
	})

	onUpdate("mage_lightning", (light) => {
		light.color = mage_hexagon.color
	})

	// dumb
	onKeyPress("escape", () => {
		go("gamescene")
	})
}

export function ascendscene() {
	return scene("ascendscene", () => {
		addBackground()
		addMouse()
		addMage()

		let dummyBg = add([
			rect(width() / 2 + width() / 4, height() / 2 - 150),
			pos(361, 506),
			anchor("left"),
			opacity(0),
			z(1)
		])

		let anotherBg = add([
			rect(width() / 2 + width() / 4, height() / 2 - 150),
			pos(361, 506),
			anchor("left"),
			mask("intersect"),
			z(1)
		])

		trophies = anotherBg.add([
			pos(0),
			rect(100, 100),
			opacity(0),
			z(1)
		])

		// for(let i = 0; i < 10; i++) {
		// 	trophies.add(makeTrophy({ trophycolor: rand(rgb()), score: 100000, index: i + 1 }))
		// }

		dialogueBox = add([
			sprite("dialogue"),
			pos(621, 142),
			area(),
			anchor("center"),
			scale(),
		])

		dialogueText = dialogueBox.add([
			text("", {
				styles: {
					"wavy": (idx) => ({
						pos: vec2(0, wave(-4, 4, time() * 6 + idx * 0.5)),
					}),
				},
				width: 606, // width without tail
				align: "center",
				size: 25,
			}),
			positionSetter(),
			pos(43, -22),
			anchor("center"),
			color(BLACK),
		])

		dialogueEye = add([
			sprite("eye_translate", {
				anim: "woke"
			}),
			pos(980, 250),
			area(),
			scale(),
			anchor("center"),
			{
				woke: true,
				update() {
					if (this.isHovering() && isMousePressed("left")) {
						this.woke = !this.woke
						if (this.woke == true) this.play("woke")
						else this.play("dumb")

						tween(this.scale.x, 0.85, 0.15, (p) => this.scale.x = p, easings.easeOutQuad).onEnd(() => {
							tween(this.scale.x, 1, 0.15, (p) => this.scale.x = p, easings.easeOutQuint)
						})

						mage.say(dialogues[currentDialogueIdx][this.woke ? "woke" : "dumb"], dialogues[currentDialogueIdx].speed)
					}
				}
			}
		]),

		onScroll((delta)=>{
			if (isKeyDown("control")) {
				cameraScale = cameraScale * (1 - 0.1 * Math.sign(delta.y))
				camScale(cameraScale)
			}

			if (mousePos().y > height() / 2 + 50) {
				trophies.pos.x += delta.y / 4
			}

			// find how to clamp it based on how much of them are
			trophies.pos.x = clamp(trophies.pos.x, Infinity, -100)
		})

		if (GameState.settings.panderitoMode) {
			Object.keys(dialogues).forEach(dialogueKey => {
				dialogues[dialogueKey].woke = dialogues[dialogueKey].woke.replaceAll("hexagon", "panderito")
				dialogues[dialogueKey].dumb = dialogues[dialogueKey].dumb.replaceAll("hexagon", "panderito")
			});
		}

		mage.say(dialogues[currentDialogueIdx][dialogueEye.woke ? "woke" : "dumb"], dialogues[currentDialogueIdx].speed)
	})
}