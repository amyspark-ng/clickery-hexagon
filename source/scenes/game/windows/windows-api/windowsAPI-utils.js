import { GameState } from "../../../../gamestate";
import { curDraggin, drag, setCurDraggin } from "../../../../plugins/drag";
import { playSfx } from "../../../../sound";
import { bop, mouse } from "../../utils";
import { folderObj, infoForWindows, miniButtonsArray, buttonSpacing, isGenerallyHoveringAWindow, isDraggingAWindow, isPreciselyHoveringAWindow, manageWindow } from "./windowsAPI";

export function calculateXButtonPosition(index, buttonSpacing = 75) {
    return folderObj.pos.x - buttonSpacing * (index) - buttonSpacing;
}

function resetSwapFlags() {
	get("minibutton").forEach(button => {
        button.swapPerformed = false;
    });
}

function swapButtonPositions(button1, button2) {
    const tempPos = button1.pos.clone();
    button1.pos = button2.pos;
    button2.pos = tempPos;

    // Add tweening or any other animation if needed
    tween(button1.pos.x, tempPos.x, 0.32, (p) => button1.pos.x = p, easings.easeOutQuint);
    tween(button2.pos.x, button1.pos.x, 0.32, (p) => button2.pos.x = p, easings.easeOutQuint);
}

export function updateButtonPositions() {
    // Define the base position and spacing for the buttons
    const baseXPos = folderObj.pos.x;
    const buttonSpacing = 75; // Adjust this value as needed

    // Iterate through the taskbar array to update button positions
    GameState.taskbar.forEach((key, index) => {
        // Calculate the new x position for the button based on the index
        const newXPos = baseXPos - (index * buttonSpacing);

        // Retrieve the button directly using the index from the taskbar
		const button = miniButtonsArray[index];

		// Animate existing button to the new position
		tween(button.pos.x, newXPos, 0.32, (p) => button.pos.x = p, easings.easeOutQuint);
    });
}

export function addMinibutton(idxForInfo, taskbarIndex, posToAdd = vec2(), destinedPosition = vec2()) {
	let quad;
	getSprite("bean").then(quady => {
		quad = quady
	})
	
	let currentMinibutton = add([
		sprite(`icon_${infoForWindows[Object.keys(infoForWindows)[idxForInfo]].icon || Object.keys(infoForWindows)[idxForInfo].replace("Win", "")}`, {
			anim: "default"
		}),
		pos(posToAdd),
		anchor("center"),
		area({ scale: vec2(0) }),
		scale(1),
		rotate(0),
		drag(),
		z(folderObj.z - 1),
		"hover_outsideWindow",
		"minibutton",
		infoForWindows[Object.keys(infoForWindows)[idxForInfo]].icon == "extra" ? "extraMinibutton" : "",
		{
			idxForInfo: idxForInfo,
			taskbarIndex: taskbarIndex,
			window: get(`${Object.keys(infoForWindows)[idxForInfo]}`, { recursive: true })[0] ?? null,
			windowInfo: infoForWindows[Object.keys(infoForWindows)[idxForInfo]],
			windowKey: Object.keys(infoForWindows)[idxForInfo],
			whiteness: 0,
			defaultScale: vec2(1),
			dragHasSurpassed: false,
			startHover() {
				if (isDraggingAWindow) return
				tween(currentMinibutton.pos.y, destinedPosition.y - 5, 0.32, (p) => currentMinibutton.pos.y = p, easings.easeOutQuint)
				tween(currentMinibutton.scale, vec2(1.05), 0.32, (p) => currentMinibutton.scale = p, easings.easeOutQuint)
				this.defaultScale = vec2(1.05)
				this.play("hover")
			},

			endHover() {
				if (isDraggingAWindow) return
				tween(currentMinibutton.pos.y, destinedPosition.y, 0.32, (p) => currentMinibutton.pos.y = p, easings.easeOutQuint)
				tween(currentMinibutton.angle, 0, 0.32, (p) => currentMinibutton.angle = p, easings.easeOutQuint)
				tween(currentMinibutton.scale, vec2(1), 0.32, (p) => currentMinibutton.scale = p, easings.easeOutQuint)
				currentMinibutton.defaultScale = vec2(1.05)
				this.play("default")
			},
			
			update() {
				if (this.window != null) {
					this.whiteness = wave(0.01, 0.1, (time() * 3))
				}

				else {
					this.whiteness = 0
				}

				if (this.isHovering()) {
					this.angle = wave(-8, 8, time () * 3)
				}

                else {
                    // this.angle = map(minDistance, 0, 65, 0, 8)
                }

                // sets hitbox
				if (!this.dragging) {
					if (this.pos.dist(folderObj.pos) > 65) {
						this.area.scale = vec2(0.75, 1.1)
						this.area.offset = vec2(2, 4)
					}
						
					else {
						this.area.scale = vec2(0)
					}
				}

				// curdragging stuff
				if (this.is("extraMinibutton")) return
				
				if (curDraggin?.is("minibutton")) {
					
					if (this.pos.x - curDraggin.pos.x < 15) {
						// i have to move it to the right, therefore left will be false
						if (curDraggin.pos.x < this.pos.x && !this.dragHasSurpassed) {
							this.trigger("dragHasSurpassed", true)
						}

						if (curDraggin.pos.x > this.pos.x && !this.dragHasSurpassed) {
							this.trigger("dragHasSurpassed", false)
						}
					}

					else {
						this.dragHasSurpassed = false
					}
				}
			},

			draw() {
				if (debug.inspect && !this.is("extraMinibutton")) {
					drawText({
						text: this.taskbarIndex,
						pos: vec2(0, -this.height),
						anchor: "center",
						size: 25,
						color: WHITE
					})
				}
			}
		}
	])

	// it maintins the correct taskbar index but goes to a position that is not the one
	// because of the "foolproof" thing where when you release it goes to the nearest slot

	// animate them
    tween(currentMinibutton.pos.x, destinedPosition.x, 0.32, (p) => currentMinibutton.pos.x = p, easings.easeOutQuint)
    tween(currentMinibutton.pos.y, destinedPosition.y, 0.32, (p) => currentMinibutton.pos.y = p, easings.easeOutQuint)

	// currentMinibutton is the one being swapped to met the curDragging wish
	currentMinibutton.on("dragHasSurpassed", (left) => {
		currentMinibutton.dragHasSurpassed = true

		// the bigger the index the more to the ACTUAL left it will be
		// -- to the right / ++ to the left
		// since i have to move to the left
		debug.log(left ? "LEFT" : "RIGHT")
		let newTaskbarIndex = currentMinibutton.taskbarIndex
		
		function swap(sourceObj, sourceKey, targetObj, targetKey) {
			var temp = sourceObj[sourceKey];
			sourceObj[sourceKey] = targetObj[targetKey];
			targetObj[targetKey] = temp;
		}
		
		swap(curDraggin, "taskbarIndex", currentMinibutton, "taskbarIndex")
		
		if (curDraggin?.is("minibutton")) curDraggin.taskbarIndex = newTaskbarIndex

		tween(currentMinibutton.pos.x, calculateXButtonPosition(currentMinibutton.taskbarIndex), 0.32, (p) => currentMinibutton.pos.x = p, easings.easeOutQuint)
	})

	currentMinibutton.onHover(() => {
		// debug.log(currentMinibutton.taskbarIndex)
	})

	currentMinibutton.use(shader("saturate", () => ({
		"whiteness": currentMinibutton.whiteness,
		"u_pos": vec2(quad.x, quad.y),
		"u_size": vec2(quad.w, quad.h),
	})))

	currentMinibutton.onHover(() => {
		if (curDraggin) return
		if (!isGenerallyHoveringAWindow && !isDraggingAWindow) {
			currentMinibutton.startHover()
			playSfx("hoverMiniButton", 100 * currentMinibutton.windowInfo.idx / 4)
			
			// animate it spinning it

		}
	})

	currentMinibutton.onHoverEnd(() => {
		if (curDraggin) return
		if (isDraggingAWindow) return
		if (!isPreciselyHoveringAWindow) {
			currentMinibutton.endHover()
		}
	})

	let timerForPressing = wait(0, () => {})

	currentMinibutton.onMousePress("left", (() => {
		if (!currentMinibutton.isHovering()) return

		timerForPressing.cancel()
		timerForPressing = wait(0.01, () => {
			if (isMouseDown("left") && !currentMinibutton.is("extraMinibutton")) {
				// is holding left
				// pick it what the fuck
	
				if (curDraggin) {
					return
				}
		
				mouse.grab()
				currentMinibutton.pick()

				currentMinibutton.z += 1
				get("minibutton").filter(minibutton => !minibutton.is("extraMinibutton")).forEach((minibutton, index) => {
					add([
						rect(20, 20, { radius: 1 }),
						pos(calculateXButtonPosition(index), folderObj.pos.y),
						color(BLACK),
						z(minibutton.z - 1),
						anchor("center"),
						opacity(0.5),
						"minibuttonslot",
						"slot_" + index,
						{
							taskbarIndex: index
						}
					])
				})
				playSfx("plap")
				bop(currentMinibutton)
			}

			else {
				if (isPreciselyHoveringAWindow || isDraggingAWindow) return
				manageWindow(currentMinibutton.windowKey)
				bop(currentMinibutton)
				// addShockwave(miniButton.pos, 50)
			}
		})
	}))

	currentMinibutton.onMouseRelease(() => {
		if (!currentMinibutton.isHovering()) return
		if (curDraggin == currentMinibutton) {
			curDraggin.trigger("dragEnd")
			setCurDraggin(null)
			mouse.releaseAndPlay("cursor")

			let closestSlot = null;
			let closestDistance = Infinity;

			// get("minibuttonslot").forEach(minibuttonslot => {
			// 	destroy(minibuttonslot)
			// })

			// Get all minibuttons
			const minibuttons = get("minibuttonslot");
			
			// Check the distance to each minibutton
			minibuttons.forEach(foreachminibutton => {
				const distance = currentMinibutton.screenPos().dist(foreachminibutton.pos);
				if (distance < closestDistance) {
					closestDistance = distance;
					closestSlot = foreachminibutton;
				}
			});

			if (currentMinibutton.taskbarIndex != closestSlot.taskbarIndex) tween(currentMinibutton.pos, get("slot_" + currentMinibutton.taskbarIndex)[0].pos, 0.32, (p) => currentMinibutton.pos = p, easings.easeOutQuint)
			if (currentMinibutton.taskbarIndex == closestSlot.taskbarIndex) tween(currentMinibutton.pos, closestSlot.pos, 0.32, (p) => currentMinibutton.pos = p, easings.easeOutQuint)
			get("minibuttonslot").forEach(minibuttonslot => {
				destroy(minibuttonslot)
			})
		}
	})

	return currentMinibutton;
}
