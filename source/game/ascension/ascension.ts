// # this code is such a mess im sorry
import { GameObj, Vec2 } from "kaplay";
import { GameState, scoreManager } from "../../gamestate";
import { ROOT } from "../../main"
import { waver } from "../../plugins/wave";
import { hexagon } from "../hexagon"
import { bop, getPrice, getVariable, randomPos } from "../utils";
import { playSfx } from "../../sound";
import { folderObj } from "../windows/windows-api/windowsAPI";
import { hexagonIntro } from "../gamescene";
import { isWindowUnlocked, unlockWindow } from "../unlockables";
import { positionSetter } from "../../plugins/positionSetter";
import { mouse } from "../additives";
import { spawnCards } from "./cards";

export let ascension = {
	ascending: false,
	canLeave: false,
}

let activeLetterWaits = []
let currentlySaying = ""

function addMage() {
	let mage_color = rgb(0, 51, 102)
	
	let mage:any;

	mage = add([
		pos(-17, 154),
		waver({ wave_speed: 1, maxAmplitude: 2.5 }),
		layer("ascension"),
		z(1),
		opacity(1),
		anchor("center"),
		"mage",
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
		"ascensionHover",
		{
			timeToBlinkAgain: 8,
			timeUntilBlink: 8,
			update() {
				if (this.isHovering() && isMousePressed("left")) {
					this.play("blink")
					talk("mage", "stop that")
					// currentDialogueIdx = getRandomElementDifferentFrom([1, 2, 3, 4], currentDialogueIdx)
					// mage.say(dialogues[currentDialogueIdx][dialogueEye.woke ? "woke" : "dumb"], dialogues[currentDialogueIdx].speed)
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
		"ascensionHover",
		{
			update() {
				if (this.isHovering() && isMousePressed("left")) {
					bop(this, 0.01)
					talk("mage", "no backsies")
				}
				this.angle += 0.02
			}
		}
	])

	// runs thorugh every object with mage_lightning object and attaches an 
	// onupdate that does the color stuff
	mage.get("mage_lightning").forEach(o => o.onUpdate(() => { 
		o.color = mage_hexagon.color
	}))

	return mage;
}

let dialogue:any;

function addDialogueBox() {
	let box = add([
		sprite("dialogue"),
		pos(623, 144),
		anchor("center"),
		scale(),
		area({ scale: 0.8 }),
		opacity(),
		layer("ascension"),
		z(1),
		"textbox",
		{
			defaultPos: vec2(623, 144),
		}
	])

	box.on("talk", (speaker) => {
		if (speaker == "card") {
			box.use(sprite("hoverDialogue"))
			tween(box.defaultPos.y + 10, box.defaultPos.y, 0.25, (p) => box.pos.y = p, easings.easeOutQuint)
		}
		
		else if (speaker == "mage") {
			box.use(sprite("dialogue"))
			tween(box.defaultPos.x - 10, box.defaultPos.x, 0.25, (p) => box.pos.x = p, easings.easeOutQuint)
		}

		tween(0.75, 1, 0.25, (p) => box.scale.x = p, easings.easeOutQuint)
	})

	box.onClick(() => {
		if (dialogue.textBox.text == currentlySaying) return
		skipTalk()
	})

	tween(0.5, 1, 0.25, (p) => box.scale.x = p, easings.easeOutQuint)
	tween(0, 1, 0.25, (p) => box.opacity = p, easings.easeOutQuint)

	return box
}

function addDialogueText() {
	let textBox = add([
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
		pos(670, 127),
		anchor("center"),
		color(BLACK),
		layer("ascension"),
		opacity(),
		z(dialogue.box.z + 1),
		"textbox",
		"boxText",
	])

	return textBox
}

export function talk(speaker:"mage" | "card", thingToSay:string, speed?:number) {
	dialogue.box.trigger("talk", speaker)

	speaker = speaker || "card"
	thingToSay = thingToSay || "No dialogue, missing a dialogue here"
	speed = speed || 0.025
	
	currentlySaying = thingToSay

	activeLetterWaits.forEach(waitCall => waitCall.cancel());
	activeLetterWaits = [];
	dialogue.textBox.text = ""

	let currentDelay = 0
	Array.from(thingToSay).forEach((letter, index) => {
		let delay = speed;
		if (letter === ',' || letter === "_") {
			delay = speed * 5; // Adjust the multiplier as needed for commas and spaces
		}

		// Increment currentDelay by the calculated delay
		currentDelay += delay;

		const waitCall = wait(currentDelay, () => {
			if (letter !== "_") dialogue.textBox.text += letter;
			// playSfx("mage_e", { detune: rand(-150, 150) });
		});

		activeLetterWaits.push(waitCall);
	});
}

function skipTalk() {
	activeLetterWaits.forEach(waitCall => waitCall.cancel());
	dialogue.textBox.text = currentlySaying
	tween(dialogue.box.defaultPos.y + 10, dialogue.box.defaultPos.y, 0.25, (p) => dialogue.box.pos.y = p, easings.easeOutQuint)
	tween(dialogue.box.defaultPos.x + 10, dialogue.box.defaultPos.x, 0.25, (p) => dialogue.box.pos.x = p, easings.easeOutQuint)
}

export function triggerAscension() {
	// stuff
	ascension.ascending = true

	// the multiplier cool!!!
	GameState.ascension.magicLevel++

	ROOT.trigger("ascension", { score: GameState.score, scoreThisRun: GameState.scoreThisRun })
	
	hexagon.interactable = false
	folderObj.interactable = false
	folderObj.fold()

	get("window").forEach((window) => {
		window.close()
	})

	tween(hexagon.scaleIncrease, 0, 0.35, (p) => hexagon.scaleIncrease = p, easings.easeOutCubic)
	tween(hexagon.stretchScaleIncrease, 0, 0.35, (p) => hexagon.stretchScaleIncrease = p, easings.easeOutCubic)
	tween(hexagon.maxScaleIncrease, 0, 0.35, (p) => hexagon.maxScaleIncrease = p, easings.easeOutCubic)

	let blackBg = add([
		rect(width(), height()),
		color(BLACK),
		fixed(),
		opacity(0.5),
		anchor("center"),
		pos(center()),
		z(0),
		layer("ascension"),
		"ascensionBg"
	])

	let mage = addMage();
	mage.pos.x = -489
	blackBg.fadeIn(0.35).onEnd(() => {
		// ADD THE MAGEEEEE!!!!!!!! so excited
		tween(-489, -17, 0.5, (p) => mage.pos.x = p, easings.easeOutQuart)
		tween(145, 154, 0.5, (p) => mage.pos.y = p, easings.easeOutQuart)
		tween(0.5, 1, 0.5, (p) => mage.opacity = p, easings.easeOutQuart).onEnd(() => {
			dialogue = add([])
			dialogue.box = addDialogueBox()
			dialogue.textBox = addDialogueText()
			
			talk("mage", "welcome to fortnite")
			mage.trigger("endAnimating")
		})

		mage?.onKeyPress("escape", () => {
			endAscension()
		})
	})

	//#region CARD STUFF
	spawnCards()
	// #endregion

	wait(0.1, () => {
		let manaText = add([
			text("", { align: "left", font: "lambdao", size: 38 }),
			pos(4, 19),
			anchor("left"),
			layer("ascension"),
			opacity(1),
			"manaText",
			{
				hiddenXPos: -72,
				update() {
					this.text = `✦${GameState.ascension.mana}`
				}
			}
		])
	
		manaText.fadeIn(0.35)
		tween(manaText.hiddenXPos, 4, 0.5, (p) => manaText.pos.x = p, easings.easeOutQuart)
	})

	// leave button
	ROOT.on("canLeaveAscension", () => {
		let leaveButton = add([
			sprite("confirmAscension"),
			layer("ascension"),
			z(6),
			pos(960, 289),
			layer("ascension"),
			scale(),
			area(),
			anchor("center"),
			positionSetter(),
			opacity(),
			"ascensionHover",
			{
				dscale: vec2(0.8),
				update() {
					if (ascension.canLeave == true) {
						this.area.scale = vec2(1)
					}
	
					else {
						this.area.scale = vec2(0)
					}
				}
			}
		])
		leaveButton.fadeIn(0.1, easings.easeOutQuad)
	
		leaveButton.onHover(() => {
			tween(leaveButton.scale, vec2(1.2), 0.35, (p) => leaveButton.scale = p, easings.easeOutQuint)
		})
		
		leaveButton.onHoverEnd(() => {
			tween(leaveButton.scale, vec2(1), 0.35, (p) => leaveButton.scale = p, easings.easeOutQuint)
		})
	
		mage.on("endAnimating", () => {
			leaveButton.onUpdate(() => {
				if (ascension.canLeave == true) leaveButton.opacity = 1
				else leaveButton.opacity = 0.75
			})
		})
	
		leaveButton.onClick(() => {
			bop(leaveButton)
			leaveButton.area.scale = vec2(0)
			leaveButton.fadeOut(0.25).onEnd(() => destroy(leaveButton))
			playSfx("clickButton")
			mouse.play("point")
			endAscension()
		})
	})

	let startHover = onHover("ascensionHover", () => {
		mouse.play("point")
	})

	let endHover = onHoverEnd("ascensionHover", () => {
		mouse.play("cursor")
	})

	blackBg.onDestroy(() => {
		startHover.cancel()
		endHover.cancel()
	})
}

export function endAscension() {
	folderObj.interactable = true
	
	ROOT.trigger("endAscension")

	get("*", { recursive: true }).filter(obj => obj.layer == "ascension").forEach((obj) => {
		if (obj.is("area")) obj.area.scale = vec2(0)
		
		if (obj.is("mage") || obj.is("manaText")) {
			tween(obj.pos.x, obj.pos.x - obj.width, 0.5, (p) => obj.pos.x = p, easings.easeOutQuart).onEnd(() => destroy(obj))
		}

		else if (obj.is("card")) {
			tween(obj.pos.y, obj.pos.y + obj.height, 0.5, (p) => obj.pos.y = p, easings.easeOutQuart).onEnd(() => destroy(obj))
		}

		else if (obj.is("textbox")) {
			tween(obj.pos.y, -obj.height, 0.5, (p) => obj.pos.y = p, easings.easeOutQuart).onEnd(() => destroy(obj))
		}

		else if (obj.is("ascensionBg")) {
			obj.fadeOut(0.5).onEnd(() => destroy(obj))
		}
	})

	// turn everything back to 0
	scoreManager.resetRun()

	wait(0.25, () => {
		tween(hexagon.scaleIncrease, 1, 0.25, (p) => hexagon.scaleIncrease = p, easings.easeOutQuint)
		tween(hexagon.maxScaleIncrease, 1, 0.25, (p) => hexagon.maxScaleIncrease = p, easings.easeOutQuint)
		tween(hexagon.stretchScaleIncrease, 1, 0.25, (p) => hexagon.stretchScaleIncrease = p, easings.easeOutQuint).onEnd(() => {
			hexagon.interactable = true
		})
		hexagonIntro()
	})

	wait(0.5, () => {
		ascension.canLeave = false
	})
}