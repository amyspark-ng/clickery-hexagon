// # this code is such a mess im sorry
import { GameState, scoreManager } from "../../gamestate";
import { ROOT } from "../../main"
import { hexagon } from "../hexagon"
import { hexagonIntro } from "../gamescene";
import { folderObj } from "../windows/windows-api/folderObj";
import { allPowerupsInfo } from "../powerups";
import { addMage } from "./mage";
import { isAchievementUnlocked, unlockAchievement } from "../unlockables/achievements";
import { mageDialogues, startDialoguing, talk } from "./dialogues";

export let ascension = {
	ascending: false,
	canLeave: false,
	currentDialoguekey: ""
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
	tween(hexagon.opacity, 0, 0.35, (p) => hexagon.opacity = p, easings.easeOutCubic)

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
			startDialoguing()
			mage.trigger("endAnimating")
		})
	})

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

	function startTheTalking() {
		if (GameState.stats.timesAscended < 1) {
			let dialogues = mageDialogues.tutorial1
			ascension.currentDialoguekey = "tutorial1"
			talk("mage", dialogues.text, dialogues.speed)
		}

		else {
			let dialogues = mageDialogues.back1
			ascension.currentDialoguekey = "back1"
			talk("mage", dialogues.text, dialogues.speed)
		}
	}

	mage.on("endAnimating", () => {
		startTheTalking()
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