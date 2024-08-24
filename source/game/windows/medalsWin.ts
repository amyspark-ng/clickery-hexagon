import { GameObj } from "kaplay";
import { DEBUG } from "../../main";
import { addTooltip } from "../additives";
import { insideWindowHover } from "../hovers/insideWindowHover";
import { achievements, achievementsInfo, getAchievement, isAchievementUnlocked, unlockAchievement } from "../unlockables/achievements";
import { blendColors } from "../utils";

let totalColumns = 5;
let totalRows = 7;

// initialPos of the first element, relative to the medalsContainer that is relative to the window position
let initialPos = { x: -132, y: 42 };
let spacing = { x: 66, y: 65 };

const availableAchievements = achievements.slice(0, 20);

function getPositionInWindow(row:number, column:number) {
	return vec2(initialPos.x + spacing.x * (column), initialPos.y + spacing.y * (row));
}

function indexToGrid(i:number) {
	let newDesiredPos = { row: Math.floor(i / totalColumns) + 1, column: (i % totalColumns) + 1 }
	return newDesiredPos
}

let medalsContainer:any;
export function medalsWinContent(winParent:GameObj) {
	medalsContainer = winParent.add([
		pos(-18, -214),
		rect(350, winParent.height - 35 * 2, { radius: 5 }),
		color(BLACK),
		opacity(0.5),
		anchor("top"),
	])

	// TODO: you know what would be fun?????????????
	
	// make every medal a draw event that draws the sprite, map every row&column to an achievement
	// everytime you scroll that achievements gets updated
	// for hovers you can check the distance to the position the medal will be in
	function addMedal(gridPosition:{ row:number, column:number }, medal_ID:string) {
		const PURPLE = blendColors(RED, BLUE, 0.5)
		
		let medalObj = medalsContainer.add([
			sprite("medalsUnknown"),
			pos(),
			anchor("center"),
			layer("windows"),
			z(winParent.z + 1),
			area(),
			insideWindowHover(winParent),
			color(),
			"medal",
			{
				achievementId: medal_ID,
				row: gridPosition.row,
				column: gridPosition.column,
				
				update() {
					if (isAchievementUnlocked(this.achievementId)) {
						// if (achievement is in the available icon ones)
						if (availableAchievements.map(achievement => achievement.id).includes(medal_ID)) {
							if (this.sprite != medal_ID) this.sprite = "medals_" + medal_ID
						}

						// nope
						else {
							if (this.sprite != "medalsUnknown") this.sprite = "medalsUnknown"
							this.color = GREEN.lighten(100)
						}

						if (!this.is("outline")) {
							this.use(outline(5, BLACK))
						}
					}
					
					// is not unlocked
					else {
						if (medal_ID == "extra.theSlot" && this.sprite != "medalsUnknown_tap") this.sprite = "medalsUnknown_tap"
						
						// has a secret condition
						if (theAchievement.visibleCondition != null) {
							// is not secret anymore
							if (theAchievement.visibleCondition() == true) {
								// its raare
								if (theAchievement.rare == true) this.color = YELLOW
								// its not
								else this.color = RED
							}

							// is still secret, keep it purple
							else {
								this.color = PURPLE
							}
						}

						// doesn't have a secret condition
						else {
							if (theAchievement.rare == true) this.color = YELLOW
							else this.color = RED
						}
					}
				},
			}
		])

		const theAchievement = getAchievement(medal_ID)

		// one less, i don't know why!!
		medalObj.pos = getPositionInWindow(gridPosition.row - 1, gridPosition.column - 1)
		medalObj.achievementIdx = achievements.indexOf(getAchievement(medal_ID))

		medalObj.onPressClick(() => {
			if (medalObj.achievementId == "extra.theSlot") {
				if (!isAchievementUnlocked(medalObj.achievementId)) {
					unlockAchievement(medalObj.achievementId)
				}
			}
		})

		medalObj.startingHover(() => {
			let title = theAchievement.title; // the title of the achievement
			let description = theAchievement.description; // the actual description
			let flavorText = theAchievement.flavorText; // the actual description

			const longerTitle = 50

			title = title.substring(0, longerTitle) + (title.length > longerTitle ? "..." : "")
			description = description.substring(0, longerTitle) + (description.length > longerTitle ? "..." : "")

			if (!isAchievementUnlocked(theAchievement.id)) {
				// is secret and is locked
				if (theAchievement.visibleCondition != null && theAchievement.visibleCondition() == false) {
					title = "???"
					flavorText = ""
					description = "This achievement is secret\nFor now..."
				}

				else {
					title = "???"
					flavorText = ""
					description = theAchievement.description
				}
			}

			let tooltip = addTooltip(medalObj, { 
				text: title + "\n" + `${description}${flavorText.length < longerTitle ? `. ${flavorText}` : ""}`,
				direction: "down",
				lerpValue: 0.75
			})
			tooltip.tooltipText.align = "center"
		})

		medalObj.endingHover(() => {
			medalObj.tooltip.end()
		})
	}

	// add all the medals
	// for (let i = 0; i < 5; i++) {
	for (let i = 0; i < achievements.length; i++) {
		if (i == totalColumns * totalRows) break;

		let medalid = achievements[i].id
		addMedal(indexToGrid(i), medalid)
	}

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
			medal.pos.y = medal.pos.y - spacing.y
		})

		let indexOfLastAchievementInList = achievements.map(achievement => achievement.id).indexOf(medalsContainer.get("medal")[medalsContainer.get("medal").length - 1].achievementId)
		let nextMedals = achievements.map(achievement => achievement.id).slice(indexOfLastAchievementInList + 1, achievements.map(achievement => achievement.id).length)
		nextMedals.length = Math.min(nextMedals.length, totalColumns)

		let medalsInfo = nextMedals.map(medal => getAchievement(medal))

		// adds the new ones
		for (let i = 0; i < nextMedals.length; i++) {
			addMedal({ row: totalRows, column: indexToGrid(indexOfLastAchievementInList + 1 + i).column }, medalsInfo.map(achievement => achievement.id)[i])
		}
	}

	// when doing scroll down it deletes the top 5 ones, delete them, move the 5 ones
	// that are on the bottom of the just deleted ones, grab the
	// last ones and add the next ones
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
			medal.pos.y = medal.pos.y + spacing.y
		})

		// grabs all the next achievements to the last in the list
		let previousMedalsNames = achievementsInfo.ids.slice(0, achievementsInfo.ids.indexOf(medalsContainer.get("medal")[0].achievementId));
		let previousMedalsInfo = previousMedalsNames.map(medal => getAchievement(medal))

		// limit previousmedalsinfo to 4
		previousMedalsInfo = previousMedalsInfo.slice(0, 4)

		// adds the new ones
		for (let i = 0; i < previousMedalsInfo.length; i++) {
			debug.log(i)
			addMedal({ row: 1, column: indexToGrid(i).column }, previousMedalsInfo.map(achievement => achievement.id)[i])
		}
	}

	// winParent.onKeyPress("down", () => {
	// 	if (winParent.active == false) return
	// 	scrollDown()
	// })

	// winParent.onKeyPress("up", () => {
	// 	if (winParent.active == false) return
	// 	scrollUp()
	// })

	winParent.onScroll((delta) => {
		if (winParent.active == false) return
		if (DEBUG == true && isKeyDown("shift")) return
		if (delta.y > 0) scrollDown()
		else if (delta.y < 0) scrollUp()	
	})
}