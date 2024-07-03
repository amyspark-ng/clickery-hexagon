import { GameState } from "../../gamestate";
import { ROOT } from "../../main";
import { curDraggin, drag, setCurDraggin } from "../../plugins/drag";
import { dummyShadow } from "../../plugins/dummyShadow";
import { playSfx } from "../../sound";
import { bop } from "../utils";
import { mouse } from "../additives";
import { buttonSpacing, folderObj, infoForWindows, manageWindow, openWindow } from "./windows-api/windowsAPI";
import { addMinibutton } from "./windows-api/minibuttons";

export let gridContainer;

let currentClosest;

// Function to update the closest minibutton
function updateClosestMinibuttonToDrag() {
    // Get all minibuttons
    const minibuttons = get("minibutton").filter(minibutton => !minibutton.extraMb);

    // Initialize variables to track the closest minibutton
    let closestDistance = Infinity;
    let closestMinibutton = null;

    // Check the distance to each minibutton
    minibuttons.forEach(minibutton => {
		const dist = curDraggin?.screenPos().dist(minibutton.screenPos());
        if (dist < closestDistance) {
            closestDistance = dist;
            closestMinibutton = minibutton;
        }
    });

	// dettach
    // If the closest minibutton has changed
    if (closestMinibutton !== currentClosest) {
        // Detach the onUpdate event from the previous closest minibutton
        if (currentClosest) {
			if (currentClosest.is("closestMinibuttonToDrag")) {
				currentClosest.unuse("closestMinibuttonToDrag")
				currentClosest.opacity = 1
				currentClosest.scale = vec2(1)
				currentClosest.color = WHITE
				currentClosest.nervousSpinSpeed = 10
			}
		}
		
		// Update the current closest minibutton
        currentClosest = closestMinibutton;
		
        // Attach the onUpdate event to the new closest minibutton
        if (currentClosest) {
			if (!currentClosest.is("closestMinibuttonToDrag")) currentClosest.use("closestMinibuttonToDrag")
        }
    }
}

export function makeGridMinibutton(idx, gridSlot, winParent) {
	let selection;
	let distanceToSlot
	let distanceToClosestMinibutton;
	let minibuttons;
	let closestMinibutton = null;
	let closestDistance = Infinity;

	let gridMiniButton = make([
		sprite(`icon_${infoForWindows[Object.keys(infoForWindows)[idx]].icon || Object.keys(infoForWindows)[idx].replace("Win", "")}`, {
			anim: "default"
		}),
		anchor("center"),
		opacity(1),
		pos(gridSlot.pos),
		color(WHITE),
		scale(0),
		drag(),
		layer("windows"),
		z(winParent.z + 1),
		area(),
		rotate(0),
		"gridMiniButton",
		{
			windowKey: Object.keys(infoForWindows)[idx],
			beingHeld: false,
			update() {
				if (this.dragging) {
					// do tilt towards direction stuff
					if (isMouseMoved()) {
						let mappedAngle = map(mouseDeltaPos().x, -50, 50, -40, 40)
						this.angle = mappedAngle
					}
				}
			},

			startHover() {
				playSfx("hoverMiniButton", {detune: 100 * idx / 4})
				this.play("hover")
				
				selection = gridSlot.add([
					pos(),
					rect(this.width, this.height, { radius: 5 }),
					opacity(0.15),
					anchor("center"),
					"gridMinibuttonSelection",
				])
			},

			endHover() {
				this.play("default")
				tween(this.angle, 0, 0.32, (p) => this.angle = p, easings.easeOutQuint)
				selection?.destroy()
			},

			releaseDrop(defaultShadow = true) {
				if (curDraggin == this) {
					curDraggin.trigger("dragEnd")
					setCurDraggin(null)
					mouse.releaseAndPlay("cursor")
					gridMiniButton.layer = "windows"

					// wtf???
					let thisThing = this;

					const goToShadowSlot = function() {
						// GO BACK TO SLOT
						let gridMinibuttonIdx = infoForWindows[thisThing.windowKey].idx
						destroy(thisThing)
						gridContainer.add(makeGridMinibutton(gridMinibuttonIdx, get(`gridShadow_${gridMinibuttonIdx}`, { recursive: true })[0], winParent))
						playSfx("plop")
						
						// reset their properties
						get("minibutton").forEach(element => {
							tween(element.angle, 0, 0.32, (p) => element.angle = p, easings.easeOutQuint)
							element.color = WHITE
							element.opacity = 1
							element.scale = vec2(1)
						});

						get("gridMiniButton", { recursive: true }).forEach(element => {
							if (element.isHovering()) element.startHover()
						})
					}

					const goToTaskbar = function() {
						// add the new minibutton to the minibutton list
						
						let newMinibutton = addMinibutton({
							idxForInfo: idx,
							taskbarIndex: closestMinibutton.taskbarIndex,
							initialPosition: thisThing.pos,
							destPosition: closestMinibutton.pos
						})

						GameState.taskbar[closestMinibutton.taskbarIndex] = newMinibutton.windowKey
						
						// Snap the button to the closest minibutton
						tween(thisThing.pos.x, closestMinibutton.pos.x, 0.32, (p) => thisThing.pos.x = p, easings.easeOutQuint);
						tween(thisThing.pos.y, closestMinibutton.pos.y, 0.32, (p) => thisThing.pos.y = p, easings.easeOutQuint);
						
						// destroy closestminibutton and grid minibutton
						tween(closestMinibutton.opacity, 0, 0.32, (p) => closestMinibutton.opacity = p, easings.easeOutQuint)
						tween(closestMinibutton.scale, vec2(0), 0.32, (p) => closestMinibutton.scale = p, easings.easeOutQuint).onEnd(() => {
							destroy(closestMinibutton)
						})
						destroy(thisThing)
						
						// cmb => closest minibutton
						let cmbShadow = get(`gridShadow_${closestMinibutton.idxForInfo}`, { recursive: true })[0]
		
						// make the new gridminibutton to the one that was just unpinned
						gridContainer.add(makeGridMinibutton(closestMinibutton.idxForInfo, cmbShadow, winParent))
						playSfx("plop")
	
						get("minibutton").forEach(minibutton => {
							tween(minibutton.angle, 0, 0.15, (p) => minibutton.angle = p, easings.easeOutQuint)
						})
					}

					if ((distanceToSlot < distanceToClosestMinibutton) || defaultShadow == true) goToShadowSlot()
					else goToTaskbar()
				}
			}
		},
	])

	tween(gridMiniButton.scale, vec2(1), 0.32, (p) => gridMiniButton.scale = p, easings.easeOutElastic)
	
	let lastPosClicked;
	let waitingHold = wait(0, () => {});
	gridMiniButton.onMousePress("left", () => {
		lastPosClicked = mousePos()
		if (!gridMiniButton.isHovering()) return
		
		waitingHold.cancel()
		waitingHold = wait(0.08, () => {
			if (!gridMiniButton.isHovering()) return
			// hold function
			if (curDraggin) {
				return
			}

			// get out of the parent and sends him to the real world (root)
			gridMiniButton.parent.children.splice(gridMiniButton.parent.children.indexOf(gridMiniButton), 1)
			gridMiniButton.parent = ROOT
			ROOT.children.push(gridMiniButton)

			// important
			gridMiniButton.pos = toScreen(mousePos())
			gridMiniButton.z = mouse.z - 1

			gridMiniButton.layer = "mouse"
			mouse.grab()
			gridMiniButton.pick()
			playSfx("plap")
		})
	})

	// click/release hold functions
	gridMiniButton.onUpdate(() => {
		if (gridMiniButton.dragging) {
			closestMinibutton = null;
			closestDistance = Infinity;
	
			// Get all minibuttons
			minibuttons = get("minibutton").filter(minibutton => !minibutton.extraMb);
			
			// Check the distance to each minibutton
			minibuttons.forEach(minibutton => {
				const distance = gridMiniButton.screenPos().dist(minibutton.pos);
				if (distance < closestDistance) {
					closestDistance = distance;
					closestMinibutton = minibutton;
				}
			});
	
			distanceToSlot = gridMiniButton.screenPos().dist(gridSlot.screenPos())
			distanceToClosestMinibutton = gridMiniButton.screenPos().dist(closestMinibutton.screenPos())
		
			// was being draggrd and got released
			if (isMouseReleased("left")) {
				// release hold function
				gridMiniButton.releaseDrop(false)
			}
		}

		// was not being dragged
		else {
			if (isMouseReleased("left")) {
				waitingHold.cancel()
				// if last posclicked is inside gridminibutton
				if (!gridMiniButton.isHovering()) return
				if (!gridMiniButton.hasPoint(lastPosClicked)) return
				if (curDraggin) return

				// click function
				if (get(gridMiniButton.windowKey)[0]) winParent.close()
				else {openWindow(gridMiniButton.windowKey); winParent.close()}
				bop(gridMiniButton)
			}
		}
	})

	gridMiniButton.onHover(() => {
		if (curDraggin) return
		gridMiniButton.startHover()
	})
	
	gridMiniButton.onHoverEnd(() => {
		if (curDraggin) return
		gridMiniButton.endHover()
	})

	gridMiniButton.onDrag(() => {
		get("gridMinibuttonSelection", { recursive: true }).forEach(selection => {
			selection?.destroy()
		})

		gridMiniButton.use(dummyShadow())
	})

	return gridMiniButton
}

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
			`gridShadow_${i}`,
			"gridShadow",
			{
				idx: i,
			}
		])

		// if the button is not on the taskbar
		if (!GameState.taskbar.includes(Object.keys(infoForWindows)[i])) {
			// if the button is unlocked
			if (GameState.unlockedWindows.includes(Object.keys(infoForWindows)[i])) {
				gridContainer.add(makeGridMinibutton(i, shadowOne, winParent))
			}
		}
	}

	winParent.onUpdate(() => {
		if (curDraggin == null || !curDraggin.is("gridMiniButton")) return
		updateClosestMinibuttonToDrag()
	})

	// # manages open closed animation
	// winParent.on("open")
	let extraMinibutton = get("extraMinibutton")[0]
	if (extraMinibutton) {
		extraMinibutton.shut = false
		extraMinibutton.play(`open_${extraMinibutton.isHovering() ? "hover" : "default"}`)
	}
	
	winParent.on("close", () => {
		let extraMinibutton = get("extraMinibutton")[0]
		if (extraMinibutton) {
			extraMinibutton.shut = true
			extraMinibutton.play(`shut_${extraMinibutton.isHovering() ? "hover" : "default"}`)
		}
	})
}