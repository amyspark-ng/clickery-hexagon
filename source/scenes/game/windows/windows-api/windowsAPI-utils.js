import { GameState } from "../../../../gamestate";
import { curDraggin, drag, setCurDraggin } from "../../../../plugins/drag";
import { playSfx } from "../../../../sound";
import { bop, mouse } from "../../utils";
import { gridContainer, makeGridMinibutton } from "../extraWindow";
import { folderObj, infoForWindows, buttonSpacing, isGenerallyHoveringAWindow, isDraggingAWindow, isPreciselyHoveringAWindow, manageWindow } from "./windowsAPI";

export function calculateXButtonPosition(index, buttonSpacing = 75) {
    return folderObj.pos.x - buttonSpacing * (index) - buttonSpacing;
}

export function addMinibutton(idxForInfo, taskbarIndex, posToAdd = vec2(), initialDestPosition = vec2()) {
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
			destinedPosition: initialDestPosition,
			beingHeld: false,
			holdTimer: 0,
			startHover() {
				if (isDraggingAWindow) return
				tween(currentMinibutton.pos.y, initialDestPosition.y - 5, 0.32, (p) => currentMinibutton.pos.y = p, easings.easeOutQuint)
				tween(currentMinibutton.scale, vec2(1.05), 0.32, (p) => currentMinibutton.scale = p, easings.easeOutQuint)
				this.defaultScale = vec2(1.05)
				this.play("hover")
				if (this.is("extraMinibutton") || this.dragging) return
				tween(currentMinibutton.pos.x, calculateXButtonPosition(this.taskbarIndex), 0.32, (p) => currentMinibutton.pos.x = p, easings.easeOutQuint)
			},

			endHover() {
				if (isDraggingAWindow) return
				tween(currentMinibutton.pos.y, initialDestPosition.y, 0.32, (p) => currentMinibutton.pos.y = p, easings.easeOutQuint)
				tween(currentMinibutton.angle, 0, 0.32, (p) => currentMinibutton.angle = p, easings.easeOutQuint)
				tween(currentMinibutton.scale, vec2(1), 0.32, (p) => currentMinibutton.scale = p, easings.easeOutQuint)
				currentMinibutton.defaultScale = vec2(1.05)
				this.play("default")
				// if (this.is("extraMinibutton") || this.dragging) return
				// tween(currentMinibutton.pos.x, calculateXButtonPosition(this.taskbarIndex), 0.32, (p) => currentMinibutton.pos.x = p, easings.easeOutQuint)
			},
			
			update() {
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
					// spinning
					// if it's waiting to be swapped
					if (curDraggin?.is("minibutton") && !this.is("extraMinibutton")) {
						this.angle = wave(-8, 8, time () * 3)
						this.whiteness = 1
					}

					// if curDragging is not a button
					else {
						if (this.isHovering()) {
							this.angle = wave(-8, 8, time () * 3)
						}
					}

					// debug.log(distToCurDragging)

					// whitenesss
					if (this.window != null && !curDraggin?.is("minibutton")) {
						this.whiteness = wave(0.01, 0.1, (time() * 3))
					}

					else {
						this.whiteness = 0
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

				// swapping behaviour
				if (this.is("extraMinibutton")) return
				
				if (curDraggin?.is("minibutton")) {
					
					// if the distance is less than 15
					if (Math.abs(curDraggin.pos.sub(this.pos).x) < 15) {
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
			},

			pickFromTaskbar() {
				if (curDraggin) {
					return
				}
		
				mouse.grab()
				this.pick()

				this.z = mouse.z - 1
				get("minibutton").filter(minibutton => !minibutton.is("extraMinibutton")).forEach((minibutton, index) => {
					// add slots
					add([
						rect(20, 20, { radius: 4 }),
						pos(calculateXButtonPosition(index), folderObj.pos.y),
						color(BLACK),
						anchor("center"),
						opacity(1),
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

			drop() {
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

	// animate them
    tween(currentMinibutton.pos.x, initialDestPosition.x, 0.32, (p) => currentMinibutton.pos.x = p, easings.easeOutQuint)
    tween(currentMinibutton.pos.y, initialDestPosition.y, 0.32, (p) => currentMinibutton.pos.y = p, easings.easeOutQuint)

	// currentMinibutton is the one being swapped to met the curDragging wish
	currentMinibutton.on("dragHasSurpassed", (left) => {
		currentMinibutton.dragHasSurpassed = true

		// the bigger the index the more to the ACTUAL left it will be
		// -- to the right / ++ to the left
		// since i have to move to the left
		// debug.log(left ? "LEFT" : "RIGHT")

		// will i use this function again?
		function swap(sourceObj, sourceKey, targetObj, targetKey) {
			var temp = sourceObj[sourceKey];
			sourceObj[sourceKey] = targetObj[targetKey];
			targetObj[targetKey] = temp;
		}
		// probably not
		
		swap(curDraggin, "taskbarIndex", currentMinibutton, "taskbarIndex")
		curDraggin.destinedPosition = calculateXButtonPosition(curDraggin.taskbarIndex)
		currentMinibutton.destinedPosition = calculateXButtonPosition(currentMinibutton.taskbarIndex)
		// tween(currentMinibutton.angle, left ? -8 : 8, 0.32, (p) => currentMinibutton.angle = p, easings.easeOutQuint).onEnd(() => {
		// 	tween(currentMinibutton.angle, 0, 0.5, (p) => currentMinibutton.angle = p, easings.easeOutBounce)
		// })

		// sets to the new position based on taskbarindex
		tween(currentMinibutton.pos.x, calculateXButtonPosition(currentMinibutton.taskbarIndex), 0.32, (p) => currentMinibutton.pos.x = p, easings.easeOutQuint)
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

	currentMinibutton.onMouseDown((button) => {
		if (!currentMinibutton.isHovering()) return
		if (button != "left") return
		if (currentMinibutton.is("extraMinibutton")) return
		if (currentMinibutton.beingHeld == false) {
			currentMinibutton.holdTimer += dt()
		}
		
		if (currentMinibutton.holdTimer > 0.1 && currentMinibutton.beingHeld == false) {
			currentMinibutton.beingHeld = true
			
			// hold function
			currentMinibutton.pickFromTaskbar()
		}
	})

	currentMinibutton.onMouseRelease((button) => {
		if (!currentMinibutton.isHovering()) return
		if (button != "left") return
		// was holding
		if (currentMinibutton.beingHeld == false) {
			currentMinibutton.holdTimer = 0
			currentMinibutton.beingHeld = false

			// click function
			if (isPreciselyHoveringAWindow || isDraggingAWindow) return
			manageWindow(currentMinibutton.windowKey)
			bop(currentMinibutton)
		}
	
		else if (currentMinibutton.beingHeld == true) {
			currentMinibutton.holdTimer = 0
			currentMinibutton.beingHeld = false

			// release hold function
			if (!currentMinibutton.isHovering()) return
			if (curDraggin == currentMinibutton) {
				currentMinibutton.drop()
			}
		}
	})

	let shadow;
	currentMinibutton.onDrag(() => {
		shadow = add([
			pos(currentMinibutton.pos),
			sprite(`icon_${infoForWindows[Object.keys(infoForWindows)[currentMinibutton.windowInfo.idx]].icon || Object.keys(infoForWindows)[currentMinibutton.windowInfo.idx].replace("Win", "")}`),
			z(currentMinibutton.z - 1),
			rotate(),
			color(BLACK),
			opacity(0.8),
			anchor("center"),
			{
				update() {
					let xPos = map(currentMinibutton.pos.x, 0, width(), currentMinibutton.pos.x + 8, currentMinibutton.pos.x - 8)
					this.pos.x = lerp(this.pos.x, xPos, 1.1)
					this.pos.y = lerp(this.pos.y, currentMinibutton.pos.y + 8, 1.1)
					this.angle = currentMinibutton.angle
				}
			}
		])
	})

	currentMinibutton.onDragEnd(() => {
		shadow?.destroy()
	})

	currentMinibutton.onDestroy(() => {
		shadow?.destroy()
	})

	return currentMinibutton;
}
