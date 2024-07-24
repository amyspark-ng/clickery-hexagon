import { addTooltip } from "../additives";
import { allAchivementsNames, getAchievementFor, getIndexForAchievement, isAchievementUnlocked, unlockables, unlockAchievement } from "../unlockables";
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

	function addMedal(gridPosition:{ row:number, column:number }, medalInfo:any) {
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
				achievementId: getAchievementFor(medalInfo.name).name,
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
		medalObj.achievementIdx = getIndexForAchievement(medalObj.achievementId)

		parseAnimation(medalObj, `${medalInfo.icon}`)

		medalObj.width = 60
		medalObj.height = 60
	
		medalObj.onClick(() => {
			if (medalObj.achievementId == "tapachievementslot") {
				if (!isAchievementUnlocked(medalObj.achievementId)) unlockAchievement(medalObj.achievementId)
			}
		})

		medalObj.onHover(() => {
			let tooltip = addTooltip(medalObj, { 
				text: getAchievementFor(medalObj.achievementId).text,
				direction: "down",
			})
		})

		medalObj.onHoverEnd(() => {
			medalObj.tooltips[0].end()
		}) 
	}

	// add all the medals
	// for (let i = 0; i < 5; i++) {
	for (let i = 0; i < Object.keys(unlockables["achievements"]).length; i++) {
		if (i == totalColumns * totalRows) break;

		let medalInfo = unlockables.achievements[i]
		addMedal(indexToGrid(i), medalInfo)
	}

	function scrollDown() {
		// if the idx of last medal is the same as the last medal in the unlockables.achievements
		let allMedals = medalsContainer.get("medal") // have to reverse the one before idk why
		let sortedMedals = allMedals.sort((a, b) => b.achievementIdx - a.achievementIdx).reverse();		
		if (sortedMedals[sortedMedals.length - 1].achievementIdx == Object.keys(unlockables.achievements).length - 1) return

		medalsContainer.get("medal").filter(medal => medal.row == 1).forEach(medal => {
			destroy(medal)
		})

		medalsContainer.get("medal").forEach(medal => {
			medal.row--
			tween(medal.pos.y, medal.pos.y - spacing.y, 0.2, (p) => medal.pos.y = p, easings.easeInOutSine)
		})

		wait(0.2 / 2, () => {
			let indexOfLastAchievementInList = allAchivementsNames().indexOf(medalsContainer.get("medal")[medalsContainer.get("medal").length - 1].achievementId)
			let nextMedals = allAchivementsNames().slice(indexOfLastAchievementInList + 1, allAchivementsNames().length)
			nextMedals.length = Math.min(nextMedals.length, totalColumns)

			let medalsInfo = nextMedals.map(medal => unlockables.achievements[getIndexForAchievement(medal)])

			// adds the new ones
			for (let i = 0; i < nextMedals.length; i++) {
				addMedal({ row: totalRows, column: indexToGrid(indexOfLastAchievementInList + 1 + i).column }, medalsInfo[i])
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
			tween(medal.pos.y, medal.pos.y + spacing.y, 0.2, (p) => medal.pos.y = p, easings.easeInOutSine)
		})

		wait(0.2 / 2, () => {
			// grabs all the next achievements to the last in the list
			let previousMedalsNames = allAchivementsNames().slice(0, allAchivementsNames().indexOf(medalsContainer.get("medal")[0].achievementId));
			let previousMedalsInfo = previousMedalsNames.map(medal => getAchievementFor(medal))

			// adds the new ones
			for (let i = 0; i < previousMedalsInfo.length; i++) {
				addMedal({ row: 1, column: indexToGrid(i).column }, previousMedalsInfo[i])
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