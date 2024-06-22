import { curDraggin, drag, setCurDraggin } from "../../../../plugins/drag";
import { dummyShadow } from "../../../../plugins/dummyShadow";
import { playSfx } from "../../../../sound";
import { bop } from "../../utils";
import { mouse } from "../../additives";
import { folderObj, infoForWindows, isGenerallyHoveringAWindow, isDraggingAWindow, isPreciselyHoveringAWindow, manageWindow } from "./windowsAPI";
import { GameState } from "../../../../gamestate";

export function calculateXButtonPosition(index, buttonSpacing = 75) {
    return folderObj.pos.x - buttonSpacing * (index) - buttonSpacing;
}

export function addMinibutton(idxForInfo, taskbarIndex, posToAdd = vec2(), initialDestPosition = vec2()) {
	let quad;
	getSprite("bean").then(quady => {
		quad = quady
	})
	
	let currentMinibutton = add([
		sprite("white_noise"),
		pos(posToAdd),
		anchor("center"),
		area({ scale: vec2(0) }),
		scale(1),
		opacity(1),
		rotate(0),
		timer(),
		drag(),
		color(),
		z(folderObj.z - 1),
		"hoverOutsideWindow",
		"minibutton",
		infoForWindows[Object.keys(infoForWindows)[idxForInfo]].icon == "extra" ? "extraMinibutton" : "",
		{
			idxForInfo: idxForInfo,
			taskbarIndex: taskbarIndex,
			window: get(`${Object.keys(infoForWindows)[idxForInfo]}`, { recursive: true })[0] ?? null,
			windowInfo: infoForWindows[Object.keys(infoForWindows)[idxForInfo]],
			windowKey: Object.keys(infoForWindows)[idxForInfo],
			nervousSpinSpeed: 10,
			saturation: 0,
			saturationColor: WHITE,
			defaultScale: vec2(1),
			dragHasSurpassed: false,
			destinedPosition: initialDestPosition,
			beingHeld: false,
			holdTimer: 0,
			extraMb: infoForWindows[Object.keys(infoForWindows)[idxForInfo]].icon == "extra" ? true : null,
			shut: get("extraWin")[0] ? false : true,
			startHover() {
				if (isDraggingAWindow) return
				tween(currentMinibutton.pos.y, initialDestPosition.y - 5, 0.32, (p) => currentMinibutton.pos.y = p, easings.easeOutQuint)
				tween(currentMinibutton.scale, vec2(1.05), 0.32, (p) => currentMinibutton.scale = p, easings.easeOutQuint)
				
				if (this.extraMb) this.shut ? this.play("shut_hover") : this.play("open_hover")
				else this.play("hover")
				mouse.play("point")

				if (this.extraMb || this.dragging) return
				tween(currentMinibutton.pos.x, calculateXButtonPosition(this.taskbarIndex), 0.32, (p) => currentMinibutton.pos.x = p, easings.easeOutQuint)
			},

			endHover() {
				if (isDraggingAWindow) return
				tween(currentMinibutton.pos.y, initialDestPosition.y, 0.32, (p) => currentMinibutton.pos.y = p, easings.easeOutQuint)
				tween(currentMinibutton.angle, 0, 0.32, (p) => currentMinibutton.angle = p, easings.easeOutQuint)
				tween(currentMinibutton.scale, vec2(1), 0.32, (p) => currentMinibutton.scale = p, easings.easeOutQuint)
				currentMinibutton.defaultScale = vec2(1.05)
				
				if (this.extraMb) this.shut ? this.play("shut_default") : this.play("open_default")
				else this.play("default")
				mouse.play("cursor")

				// reset some stuff
				this.holdTimer = 0
				this.beingHeld = false
				
				if (this.extraMb || this.dragging) return
				tween(currentMinibutton.pos.x, calculateXButtonPosition(this.taskbarIndex), 0.32, (p) => currentMinibutton.pos.x = p, easings.easeOutQuint)
			},
			
			update() {
				// dragging is minibutton
				if (this.dragging) {
					// do tilt towards direction stuff
					if (isMouseMoved()) {
						let mappedAngle = map(mouseDeltaPos().x, -50, 50, -40, 40)
						this.angle = mappedAngle
					}
	
					else {
						this.angle = lerp(this.angle, 0, 1.1)
					}
				}

				else {
					if (curDraggin?.is("minibutton") && !this.extraMb) {
						// spinning
						// if it's waiting to be swapped
						this.angle = wave(-8, 8, time () * 3)
						this.saturation = wave(0.005, 0.05, (time() * 3))

						// swapping behaviour
						// if the distance is less than 15
						if (Math.abs(curDraggin?.pos.sub(this.pos).x) < 15) {
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

					// curDragging is gridMinibutton, this is waiting to be replaced, nervous, panic!!
					else if (curDraggin?.is("gridMiniButton") && !this.extraMb) {
						this.angle = wave(-4, 4, time () * this.nervousSpinSpeed)
						this.saturation = wave(0.01, 0.1, (time() * 3))
					}

					// no curdragging
					else if (curDraggin == null) {
						// this.opacity = lerp(this.opacity, 1, 0.1)
						if (this.isHovering()) {
							this.angle = wave(-8, 8, time () * 3)
						}
						
						else {
							this.angle = lerp(this.angle, 0, 1.1)
						}

						// saturation
						if (this.window != null) {
							this.saturation = wave(0.01, 0.1, (time() * 3))
						}

						else {
							this.saturation = 0
						}
					}

					// sets hitbox
					if (this.pos.dist(folderObj.pos) > 65) {
						this.area.scale = vec2(0.75, 1.1)
						this.area.offset = vec2(2, 4)
					}
						
					else {
						this.area.scale = vec2(0)
					}
				}
			},

			draw() {
				if (debug.inspect && !this.extraMb) {
					drawText({
						text: this.taskbarIndex,
						pos: vec2(0, -this.height),
						anchor: "center",
						size: 25,
						color: WHITE
					})
				}
			},

			pickFromTaskbar() {
				if (curDraggin) {
					return
				}
		
				mouse.grab()
				this.pick()

				this.z = mouse.z - 1
				get("minibutton").filter(minibutton => !minibutton.extraMb).forEach((minibutton, index) => {
					// add slots
					add([
						rect(20, 20, { radius: 4 }),
						pos(calculateXButtonPosition(index), folderObj.pos.y),
						color(BLACK),
						anchor("center"),
						opacity(0.5),
						"minibuttonslot",
						"slot_" + index,
						{
							taskbarIndex: index,
						}
					])
				})
				playSfx("plap")
				bop(this, 0.1)
			},

			releaseDrop() {
				curDraggin.trigger("dragEnd")
				setCurDraggin(null)
				mouse.releaseAndPlay("cursor")
	
				let closestSlot = null;
				let closestDistance = Infinity;
				
				// Get all minibutton slots
				const minibuttons = get("minibuttonslot");
				
				// Check the distance to each minibutton
				minibuttons.forEach(foreachminibutton => {
					const distance = currentMinibutton.screenPos().dist(foreachminibutton.pos);
					if (distance < closestDistance) {
						closestDistance = distance;
						closestSlot = foreachminibutton;
					}
				});
				
				let movingTween = null;

				// if the taskbarindexes don't coincide
				// goes back to the slot corresponding to its taskbar index
				if (this.taskbarIndex != closestSlot.taskbarIndex) movingTween = tween(this.pos, get(`slot_${this.taskbarIndex}`)[0].pos, 0.32, (p) => this.pos = p, easings.easeOutQuint)
				// if the taskbar indexes do coincide
				// goes to the slot that coincides with its taskbar index 
				if (this.taskbarIndex == closestSlot.taskbarIndex) movingTween = tween(this.pos, closestSlot.pos, 0.32, (p) => this.pos = p, easings.easeOutQuint)
				
				playSfx("plop", 100 * this.windowInfo.idx / 4)
				this.z = folderObj.z - 1
				
				// destroys all slots except the current one
				get("minibuttonslot").filter(minibuttonslot => minibuttonslot.taskbarIndex != this.taskbarIndex).forEach((minibuttonslot) => {
					destroy(minibuttonslot)
				})

				// when it ends it destroys its slot
				movingTween.onEnd(() => {
					let currentSlot = get(`slot_${this.taskbarIndex}`)[0]
					currentSlot.fadeOut(0.32)
					wait(0.32, () => {
						destroy(currentSlot)
					})
				})

				// reset their angles
				get("minibutton").forEach(element => {
					tween(element.angle, 0, 0.32, (p) => element.angle = p, easings.easeOutQuint)
				});
			}
		}
	])

	// SPRITE
	currentMinibutton.use(sprite(`icon_${infoForWindows[Object.keys(infoForWindows)[idxForInfo]].icon || Object.keys(infoForWindows)[idxForInfo].replace("Win", "")}`))
	if (currentMinibutton.extraMb) {
		if (currentMinibutton.shut) currentMinibutton.play("shut_default")
		else currentMinibutton.play("open_default")
	}
	else currentMinibutton.play("default")

	// animate them
    tween(currentMinibutton.pos.x, initialDestPosition.x, 0.32, (p) => currentMinibutton.pos.x = p, easings.easeOutQuint)
    tween(currentMinibutton.pos.y, initialDestPosition.y, 0.32, (p) => currentMinibutton.pos.y = p, easings.easeOutQuint)

	// currentMinibutton is the one being swapped to met the curDragging wish
	currentMinibutton.on("dragHasSurpassed", (left) => {
		currentMinibutton.dragHasSurpassed = true

		// the bigger the index the more to the ACTUAL left it will be
		// -- to the right / ++ to the left

		// will i use this function again?
		function swap(sourceObj, sourceKey, targetObj, targetKey) {
			let temp = sourceObj[sourceKey];
			sourceObj[sourceKey] = targetObj[targetKey];
			targetObj[targetKey] = temp;
		}
		// probably not
		
		// change it before they're swapped
		GameState.taskbar[curDraggin.taskbarIndex] = currentMinibutton.windowKey
		GameState.taskbar[currentMinibutton.taskbarIndex] = curDraggin.windowKey

		swap(curDraggin, "taskbarIndex", currentMinibutton, "taskbarIndex")
		curDraggin.destinedPosition = calculateXButtonPosition(curDraggin.taskbarIndex)
		currentMinibutton.destinedPosition = calculateXButtonPosition(currentMinibutton.taskbarIndex)

		// sets to the new position based on taskbarindex
		tween(currentMinibutton.pos.x, calculateXButtonPosition(currentMinibutton.taskbarIndex), 0.32, (p) => currentMinibutton.pos.x = p, easings.easeOutBack)
	})

	currentMinibutton.use(shader("saturate", () => ({
		"saturation": currentMinibutton.saturation,
		"saturationColor": currentMinibutton.saturationColor,
		"u_pos": vec2(quad.x, quad.y),
		"u_size": vec2(quad.w, quad.h),
	})))

	currentMinibutton.onHover(() => {
		if (curDraggin) return
		if (!isPreciselyHoveringAWindow && !isDraggingAWindow) {
			currentMinibutton.startHover()
			playSfx("hoverMiniButton", 100 * currentMinibutton.windowInfo.idx / 4)
		}
	})

	currentMinibutton.onHoverEnd(() => {
		if (curDraggin) return
		if (isDraggingAWindow) return
		if (!isPreciselyHoveringAWindow) {
			currentMinibutton.endHover()  
		}
	})

	let holdWaiting = wait();
	currentMinibutton.onMousePress("left", () => {
		if (!currentMinibutton.isHovering()) return
		if (currentMinibutton.extraMb) return

		holdWaiting.cancel()
		holdWaiting = wait(0.1, () => {
			currentMinibutton.pickFromTaskbar()
		})
	})

	currentMinibutton.onMouseRelease((button) => {
		if (!currentMinibutton.isHovering()) return
		if (button != "left") return
		holdWaiting.cancel()

		// wasn't dragggin
		if (!currentMinibutton.dragging) {
			if (curDraggin) return
			
			// click function
			if (isPreciselyHoveringAWindow || isDraggingAWindow) return
			manageWindow(currentMinibutton.windowKey)
			bop(currentMinibutton)
		}

		// was dragging
		else if (currentMinibutton.dragging) {
			// release hold function
			if (curDraggin == currentMinibutton) {
				currentMinibutton.releaseDrop()
			}
		}
	})

	currentMinibutton.onDrag(() => {
		currentMinibutton.use(dummyShadow())
	})

	return currentMinibutton;
}
