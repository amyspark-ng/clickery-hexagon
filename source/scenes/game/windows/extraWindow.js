import { GameState } from "../../../gamestate";
import { curDraggin, drag, setCurDraggin } from "../../../plugins/drag";
import { fill } from "../../../plugins/fill";
import { positionSetter } from "../../../plugins/positionSetter";
import { mouse, shrink } from "../utils";
import { addMinibutton, buttonSpacing, folderObj, infoForWindows, miniButtonsArray } from "./windows-api/windowsAPI";
import { updateButtonPositions } from "./windows-api/windowsAPI-utils";

// make a pin icon for the buttons that are pinned
export function extraWinContent(winParent) {
	// makes the grid
	let objsContainer = winParent.add([pos(-154, -192)])
	
	for(let i = 0; i < Object.keys(infoForWindows).length - 1; i++) {
		let buttonPositionX = 0
		let buttonPositionY = 0
		
		// 75 buttonSpacing
		if (i < 6) buttonPositionX = 1 + i * 75;
		else buttonPositionX = (1 + (i - 6) * 75) + 75 / 2

		if (i < 6) buttonPositionY = 0;
		else buttonPositionY = buttonSpacing

		let gridMiniButton = objsContainer.add([
			sprite(`icon_${infoForWindows[Object.keys(infoForWindows)[i]].icon || Object.keys(infoForWindows)[i].replace("Win", "")}`, {
				anim: "default"
			}),
			anchor("center"),
			opacity(1),
			pos(buttonPositionX, buttonPositionY),
			color(WHITE),
			drag(),
			area(),
			{
				// it should get all the minibuttons and move them to the right,
				// trade the old one with the new one
				pin() {
					// // there's less than 4 minibuttons
					// if (miniButtonsArray.length < 4) {
					// 	miniButtonsArray.forEach((miniButton, index) => {
					// 		tween(miniButton.pos.x, miniButton.pos.x - buttonSpacing, (0.32), (p) => miniButton.pos.x = p, easings.easeOutQuint)
					// 	})
					// }

					// else {

					// }
					// // tween(miniButtonsArray[0].pos.x, folderObj.pos.x, (0.32), (p) => miniButtonsArray[0].pos.x = p, easings.easeOutQuint).onEnd(() => {
					// // 	destroy(miniButtonsArray[0])
					// // 	miniButtonsArray[0] = null
					// // 	miniButtonsArray[0] = addMinibutton(i, vec2(folderObj.pos.x - buttonSpacing * 0 - 75, folderObj.pos.y), 1)				
					// // 	GameState.taskbar[0] = miniButtonsArray[0] 
					// // })
				}
			}
		])

		if (!GameState.unlockedWindows.includes(Object.keys(infoForWindows)[i])) {
			gridMiniButton.color = rgb(15, 15, 15)
		}

		gridMiniButton.onMousePress("left", () => {
			if (curDraggin) {
				return
			}

			if (gridMiniButton.isHovering()) {
				mouse.grab()
				destroy(gridMiniButton)
				let globalMinibutton = add([
					sprite(`icon_${infoForWindows[Object.keys(infoForWindows)[i]].icon || Object.keys(infoForWindows)[i].replace("Win", "")}`, {
						anim: "default"
					}),
					anchor("center"),
					opacity(1),
					pos(mousePos()),
					color(WHITE),
					drag(),
					area(),
				])

				globalMinibutton.pick()
				readd(globalMinibutton)
			}
		})

		gridMiniButton.onMouseRelease(() => {
			if (curDraggin) {
				curDraggin.trigger("dragEnd")
				setCurDraggin(null)
				mouse.releaseAndPlay("cursor")
			}
		})

		gridMiniButton.onMousePress("right", () => {
			if (!gridMiniButton.isHovering()) return

			let dropdownbg = gridMiniButton.add([
				rect(100, 50),
				area(),
			])

			dropdownbg.onClick(() => {
				destroy(dropdownbg)
				gridMiniButton.pin()
			})

		})
	}
}