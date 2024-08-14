// # this code is such a mess im sorry
import { GameObj, Vec2 } from "kaplay";
import { GameState, scoreManager } from "../../gamestate";
import { ROOT } from "../../main"
import { hexagon } from "../hexagon"
import { bop, getPrice, getVariable, randomPos } from "../utils";
import { playSfx } from "../../sound";
import { hexagonIntro } from "../gamescene";
import { mouse } from "../additives";
import { spawnCards } from "./cards";
import { folderObj } from "../windows/windows-api/folderObj";
import { waver } from "../plugins/wave";
import { positionSetter } from "../plugins/positionSetter";
import { allPowerupsInfo } from "../powerups";
import { addMage } from "./mage";
import { isAchievementUnlocked, unlockAchievement } from "../unlockables/achievements";

export let ascension = {
	ascending: false,
	canLeave: false,
}

let activeLetterWaits = []
let currentlySaying = ""

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
	
	if (currentlySaying == thingToSay) speed /= 2
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

export function startAscending() {
	// stuff
	ascension.ascending = true
	allPowerupsInfo.canSpawnPowerups = false

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
	let canLeaveAscensionCheck = ROOT.on("canLeaveAscension", () => {
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
			"leaveButton",
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
			leaveButton.area.scale = vec2(0)
			bop(leaveButton)
			playSfx("clickButton")
			mouse.play("point")
			endAscension()
		})

		canLeaveAscensionCheck.cancel()
	})
}

export function endAscension() {
	folderObj.interactable = true
	ROOT.trigger("endAscension")
	allPowerupsInfo.canSpawnPowerups = true
	ascension.ascending = false

	// the multiplier cool!!!
	GameState.ascension.magicLevel++

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

		else if (obj.is("ascensionBg") || obj.is("leave}tton")) {
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
		if (!isAchievementUnlocked("ascend1time")) unlockAchievement("ascend1time")
	})
}