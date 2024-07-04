import { Vec2 } from "kaplay";
import { GameState } from "../../gamestate";
import { positionSetter } from "../../plugins/positionSetter";
import { isAchievementUnlocked, unlockables, unlockAchievement } from "../unlockables";
import { parseAnimation } from "../utils";

function getRowPosition(row:number) {
	return -245 - (row * 65)
}

let medalsContainer:any;
export function medalsWinContent(winParent) {
	// when doing scroll down it deletes the top 5 ones, delete them, move the 5 ones
	// that are on the bottom of the just deleted ones, grab the
	// last ones and add the next ones
	
	let timesWidth = 5
	let timesHeight = 7

	medalsContainer = winParent.add([
		pos(-72, -245),
	])

	let initialPosition = vec2(-148, -155)
	let desiredPos = vec2()
	let spacing = vec2(65, 65)
	
	function addMedal(desiredPos:Vec2, medalInfo:any, i:number) {
		let medalObj = medalsContainer.add([
			sprite("white_noise"),
			pos(desiredPos),
			anchor("center"),
			layer("windows"),
			z(winParent.z + 1),
			area(),
			"medal",
			{
				idxForInfo: i,
				achievementId: Object.keys(unlockables["achievements"])[i],
				row: Math.floor(i / 5) + 1,
				update() {
					if (!isAchievementUnlocked(this.achievementId)) {
						this.opacity = 0.25
					}

					else {
						this.opacity = 1
					}
					// this.area.scale = vec2(1 / this.scale.x, 1 / this.scale.y)
				},
			}
		])

		parseAnimation(medalObj, `${medalInfo.icon}`)

		medalObj.width = 60
		medalObj.height = 60
	
		medalObj.onClick(() => {
			if (medalObj.achievementId == "tapachievementslot") {
				if (!isAchievementUnlocked("tapachievementslot")) unlockAchievement("tapachievementslot")
			}
		})

		medalObj.onHover(() => {
			debug.log(medalObj.row)
		})
	}

	for (let i = 0; i < Object.keys(unlockables["achievements"]).length; i++) {
		if (i == timesWidth * timesHeight) break;

		let medalInfo = unlockables["achievements"][Object.keys(unlockables["achievements"])[i]]

		if (i % 5 == 0) {desiredPos.y += spacing.y; desiredPos.x = initialPosition.x}
		desiredPos.x += spacing.x

		addMedal(desiredPos, medalInfo, i)
	}

	winParent.onKeyPress("down", () => {
		medalsContainer.get("medal").filter(medal => medal.row == 1).forEach(medal => {
			destroy(medal)
		})

		medalsContainer.get("medal").forEach(medal => {
			medal.row--
			tween(medal.pos.y, medal.pos.y - spacing.y, 0.2, (p) => medal.pos.y = p, easings.easeInOutSine)
		})
	})

	winParent.onKeyPress("up", () => {
		medalsContainer.get("medal").filter(medal => medal.row == timesHeight).forEach(medal => {
			destroy(medal)
		})

		medalsContainer.get("medal").forEach(medal => {
			medal.row++
			tween(medal.pos.y, medal.pos.y + spacing.y, 0.2, (p) => medal.pos.y = p, easings.easeInOutSine)
		})
	})
}