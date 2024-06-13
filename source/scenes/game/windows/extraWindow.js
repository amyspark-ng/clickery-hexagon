import { GameState } from "../../../gamestate";
import { ROOT } from "../../../main";
import { curDraggin, drag, setCurDraggin } from "../../../plugins/drag";
import { playSfx } from "../../../sound";
import { mouse } from "../utils";
import { buttonSpacing, folderObj, infoForWindows, manageWindow, openWindow } from "./windows-api/windowsAPI";
import { addMinibutton } from "./windows-api/windowsAPI-utils";

let gridContainer;

function makeGridMinibutton(idx, shadow, winParent) {
	let gridMiniButton = make([
		sprite(`icon_${infoForWindows[Object.keys(infoForWindows)[idx]].icon || Object.keys(infoForWindows)[idx].replace("Win", "")}`, {
			anim: "default"
		}),
		anchor("center"),
		opacity(1),
		pos(shadow.pos),
		color(WHITE),
		scale(0),
		drag(),
		area(),
		rotate(0),
		"gridMiniButton",
		{
			windowKey: Object.keys(infoForWindows)[idx],
			update() {
				if (this.dragging) this.angle = wave(-8, 8, time() * 3)
			},
			hoverStart() {

			}
		},
	])

	tween(gridMiniButton.scale, vec2(1), 0.32, (p) => gridMiniButton.scale = p, easings.easeOutElastic)

	gridMiniButton.onMousePress("left", (() => {
		if (!gridMiniButton.isHovering()) return

		wait(0.05, () => {
			if (isMouseDown("left")) {
				if (curDraggin) {
					return
				}
		
				// folderObj.openTaskbarEdit()

				// get out of the parent and sends him to the real world (root)
				gridMiniButton.parent.children.splice(gridMiniButton.parent.children.indexOf(gridMiniButton), 1)
				gridMiniButton.parent = ROOT
				ROOT.children.push(gridMiniButton)

				// important
				gridMiniButton.pos = toScreen(mousePos())
				gridMiniButton.z = mouse.z - 1

				mouse.grab()
				gridMiniButton.pick()
				// the reason why the mouse shows up before the gridminibutton SHOULD be this
				// readd(gridMiniButton)
				playSfx("plap")
			}

			else {
				manageWindow(gridMiniButton.windowKey)
			}
		})
	}))

	gridMiniButton.onMouseRelease(() => {
		if (!gridMiniButton.isHovering()) return
		if (curDraggin == gridMiniButton) {
			curDraggin.trigger("dragEnd")
			setCurDraggin(null)
			mouse.releaseAndPlay("cursor")

			let closestMinibutton = null;
			let closestDistance = Infinity;

			// Get all minibuttons
			const minibuttons = get("minibutton").filter(minibutton => !minibutton.is("extraMinibutton"));

			// Check the distance to each minibutton
			minibuttons.forEach(minibutton => {
				const distance = gridMiniButton.screenPos().dist(minibutton.pos);
				if (distance < closestDistance) {
					closestDistance = distance;
					closestMinibutton = minibutton;
				}
			});

			// TODO: Tweak this
			// if the distance from the currentPos to the original position is lesser than 570 (minimum distance to minibuttons)
			if (gridMiniButton.screenPos().dist(toScreen(shadow.pos)) < 570) {
				// get back to parent
				ROOT.children.splice(ROOT.children.indexOf(gridMiniButton), 1)
				gridMiniButton.parent = gridContainer
				gridContainer.children.push(gridMiniButton)
				// convert root position to gridContainer local position
				gridMiniButton.pos = gridContainer.fromScreen(mousePos())
				tween(gridMiniButton.pos, shadow.pos, 0.32, (p) => gridMiniButton.pos = p, easings.easeOutQuint)
			}
			
			else {
				console.log("GO TO CLOSEST MINIBUTTON")

				// cmb => closest minibutton
				let cmbShadow = get(`shadow_${closestMinibutton.idxForInfo}`, { recursive: true })[0]

				// add the new minibutton to the minibutton list
				let newMinibutton = addMinibutton(idx, closestMinibutton.taskbarIndex, gridMiniButton.pos, closestMinibutton.pos)
				GameState.taskbar[closestMinibutton.taskbarIndex] = newMinibutton.windowKey
				
				// Snap the button to the closest minibutton
				tween(gridMiniButton.pos.x, closestMinibutton.pos.x, 0.32, (p) => gridMiniButton.pos.x = p, easings.easeOutQuint);
				tween(gridMiniButton.pos.y, closestMinibutton.pos.y, 0.32, (p) => gridMiniButton.pos.y = p, easings.easeOutQuint);
				
				// destroy closestminibutton and grid minibutton
				tween(closestMinibutton.scale, vec2(0), 0.32, (p) => closestMinibutton.scale = p, easings.easeOutQuint).onEnd(() => {
					destroy(closestMinibutton)
				})
				destroy(gridMiniButton)
				
				// make the new gridminibutton to the one that was just unpinned
				gridContainer.add(makeGridMinibutton(closestMinibutton.idxForInfo, cmbShadow, winParent))
				playSfx("plop")
			}
		}
	})

	let selection;

	gridMiniButton.onHover(() => {
		if (gridMiniButton.dragging) return
		playSfx("hoverMiniButton", 100 * idx / 4)
		gridMiniButton.play("hover")
		
		selection = shadow.add([
			pos(),
			rect(gridMiniButton.width, gridMiniButton.height, { radius: 5 }),
			opacity(0.15),
			anchor("center"),
		])
	})

	gridMiniButton.onHoverEnd(() => {
		if (gridMiniButton.dragging) return

		gridMiniButton.play("default")
		tween(gridMiniButton.angle, 0, 0.32, (p) => gridMiniButton.angle = p, easings.easeOutQuint)
		destroy(selection)
	})

	gridMiniButton.onDrag(() => {
		selection?.destroy()
		gridMiniButton.onUpdate(() => {
			// debug.log(gridMiniButton.pos.dist(gridContainer.toOther(gridContainer, shadow.pos)))
			// debug.log("SHADOW: " + shadow.pos)
		})
	})

	return gridMiniButton
}

// make a pin icon for the buttons that are pinned
export function extraWinContent(winParent) {
	winParent.width += 50
	
	// makes the grid
	gridContainer = winParent.add([pos(-154, -192)])

	for(let i = 0; i < Object.keys(infoForWindows).length - 1; i++) {
		let buttonPositionX = 0
		let buttonPositionY = 0
		
		// 75 buttonSpacing
		if (i < 6) buttonPositionX = 1 + i * 75;
		else buttonPositionX = (1 + (i - 6) * 75) + 75 / 2

		if (i < 6) buttonPositionY = 0;
		else buttonPositionY = buttonSpacing + 10

		// add the shadow/empty-spot one
		let shadowOne = gridContainer.add([
			sprite(`icon_${infoForWindows[Object.keys(infoForWindows)[i]].icon || Object.keys(infoForWindows)[i].replace("Win", "")}`, {
				anim: "default"
			}),
			anchor("center"),
			opacity(0.5),
			pos(buttonPositionX, buttonPositionY),
			color(BLACK),
			area(),
			`shadow_${i}`,
			{
				idx: i,
			}
		])

		// if the button is not pinned
		if (!GameState.taskbar.includes(Object.keys(infoForWindows)[i])) {
			gridContainer.add(makeGridMinibutton(i, shadowOne, winParent))
		}
	}

	winParent.onUpdate(() => {
		// debug.log(GameState.taskbar)
	})
}