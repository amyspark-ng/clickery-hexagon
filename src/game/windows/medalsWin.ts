import { ROOT } from "../../main";
import { addTooltip } from "../additives";
import { achievements, achievementsInfo, getAchievement, isAchievementUnlocked, unlockAchievement } from "../unlockables/achievements";
import { parseAnimation } from "../utils";

let totalColumns = 5;
let totalRows = 7;

// initialPos of the first element, relative to the medalsContainer that is relative to the window position
let initialPos = { x: -137, y: 46 }; 
let spacing = { x: 65, y: 65 };

// 3 columns means 3 objects laid horizontally, 3 rows is 3 objects laid vertically
// from top to bottom
//   ccc
//  r...
//  r...
// this means 3 columns and 2 rows
function getPositionInWindow(row:number, column:number) {
	return vec2(initialPos.x + spacing.x * (column), initialPos.y + spacing.y * (row));
}

function indexToGrid(i:number) {
	let newDesiredPos = { row: Math.floor(i / totalColumns) + 1, column: (i % totalColumns) + 1 }
	return newDesiredPos
}

let medalsContainer:any;
export function medalsWinContent(winParent) {
	// when doing scroll down it deletes the top 5 ones, delete them, move the 5 ones
	// that are on the bottom of the just deleted ones, grab the
	// last ones and add the next ones
	
	medalsContainer = winParent.add([
		pos(0, -222),
		rect(winParent.width - 25, winParent.height - 35 * 2, { radius: 5 }),
		color(BLACK),
		opacity(0.5),
		anchor("top"),
	])

	function addMedal(gridPosition:{ row:number, column:number }, medalid:string) {
		let achievementInfo = getAchievement(medalid)
		
		let medalObj = medalsContainer.add([
			sprite("white_noise"),
			pos(),
			anchor("center"),
			layer("windows"),
			z(winParent.z + 1),
			// positionSetter(),
			area(),
			"medal",
			{
				achievementIdx: 0,
				achievementId: medalid,
				row: gridPosition.row,
				column: gridPosition.column,
				
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

		// one less, i don't know why!!
		medalObj.pos = getPositionInWindow(gridPosition.row - 1, gridPosition.column - 1)
		medalObj.achievementIdx = achievements.indexOf(getAchievement(medalid))

		if (isAchievementUnlocked(medalid)) {
			parseAnimation(medalObj, getAchievement(medalid).icon)
			medalObj.width = 60
			medalObj.height = 60
		}

		else {
			parseAnimation(medalObj, "medals.unknown")
		}

		medalObj.onClick(() => {
			if (medalObj.achievementId == "tapachievementslot") {
				if (!isAchievementUnlocked(medalObj.achievementId)) unlockAchievement(medalObj.achievementId)
			}
		})

		medalObj.onHover(() => {
			let achievement = getAchievement(medalObj.achievementId)
			let texting:string;

			if (!isAchievementUnlocked(achievement.id)) {
				// is not secret
				if (achievement.secretCondition == null) texting = achievement.description
				// is secret
				else texting = "This achievement is secret\nFor now..."
			}

			// is unlocked
			else {
				texting = achievement.description
			}
			
			let tooltip = addTooltip(medalObj, { 
				text: texting,
				direction: "down",
				lerpValue: 1, // TODO: make this just appear, it looks ugly 
			})
		})

		medalObj.onHoverEnd(() => {
			medalObj.tooltip.end()
		})

		let checkforunlock = ROOT.on("achivementUnlock", (id) => {
			if (id == medalid) {
				parseAnimation(medalObj, getAchievement(id).icon)
				medalObj.width = 60
				medalObj.height = 60
			}
		})

		medalObj.onDestroy(() => {
			checkforunlock.cancel()
		})
	}

	// add all the medals
	// for (let i = 0; i < 5; i++) {
	for (let i = 0; i < achievements.length; i++) {
		if (i == totalColumns * totalRows) break;

		let medalid = achievements[i].id
		addMedal(indexToGrid(i), medalid)
	}

	let scrollSpeed = 0

	function scrollDown() {
		// if the idx of last medal is the same as the last medal in the unlockables.achievements
		let allMedals = medalsContainer.get("medal") // have to reverse the one before idk why
		let sortedMedals = allMedals.sort((a, b) => b.achievementIdx - a.achievementIdx).reverse();
		// if the idx of the last medal is the same as the last medal don't scroll
		if (sortedMedals[sortedMedals.length - 1].achievementIdx == achievements.length - 1) return

		medalsContainer.get("medal").filter(medal => medal.row == 1).forEach(medal => {
			destroy(medal)
		})

		medalsContainer.get("medal").forEach(medal => {
			medal.row--
			tween(medal.pos.y, medal.pos.y - spacing.y, scrollSpeed, (p) => medal.pos.y = p, easings.easeInOutSine)
		})

		wait(scrollSpeed / 2, () => {
			let indexOfLastAchievementInList = achievements.map(achievement => achievement.id).indexOf(medalsContainer.get("medal")[medalsContainer.get("medal").length - 1].achievementId)
			let nextMedals = achievements.map(achievement => achievement.id).slice(indexOfLastAchievementInList + 1, achievements.map(achievement => achievement.id).length)
			nextMedals.length = Math.min(nextMedals.length, totalColumns)

			let medalsInfo = nextMedals.map(medal => getAchievement(medal))

			// adds the new ones
			for (let i = 0; i < nextMedals.length; i++) {
				addMedal({ row: totalRows, column: indexToGrid(indexOfLastAchievementInList + 1 + i).column }, medalsInfo.map(achievement => achievement.id)[i])
			}
		})
	}

	function scrollUp() {
		let allMedals = medalsContainer.get("medal") // have to reverse the one before idk why
		let sortedMedals = allMedals.sort((a, b) => b.achievementIdx - a.achievementIdx).reverse();		
		if (sortedMedals[0].achievementIdx == 0) return

		// get the last ones
		medalsContainer.get("medal").filter(medal => medal.row == totalRows).forEach(medal => {
			destroy(medal)
		})

		medalsContainer.get("medal").forEach(medal => {
			medal.row++
			tween(medal.pos.y, medal.pos.y + spacing.y, scrollSpeed, (p) => medal.pos.y = p, easings.easeInOutSine)
		})

		wait(scrollSpeed / 2, () => {
			// grabs all the next achievements to the last in the list
			let previousMedalsNames = achievementsInfo.ids.slice(0, achievementsInfo.ids.indexOf(medalsContainer.get("medal")[0].achievementId));
			let previousMedalsInfo = previousMedalsNames.map(medal => getAchievement(medal))

			// adds the new ones
			for (let i = 0; i < previousMedalsInfo.length; i++) {
				addMedal({ row: 1, column: indexToGrid(i).column }, previousMedalsInfo.map(achievement => achievement.id)[i])
			}
		})
	}

	winParent.onKeyPress("down", () => {
		scrollDown()
	})

	winParent.onKeyPress("up", () => {
		scrollUp()
	})

	winParent.onScroll((delta) => {
		if (delta.y > 0) scrollDown()
		else if (delta.y < 0) scrollUp()	
	})
}