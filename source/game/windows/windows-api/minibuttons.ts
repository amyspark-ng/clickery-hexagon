import { curDraggin, drag, setCurDraggin } from "../../../plugins/drag";
import { dummyShadow } from "../../../plugins/dummyShadow";
import { playSfx } from "../../../sound";
import { bop } from "../../utils";
import { mouse } from "../../additives";
import { folderObj, infoForWindows, isDraggingAWindow, isHoveringAWindow, manageWindow, folded, buttonSpacing } from "./windowsAPI";
import { GameState } from "../../../gamestate";
import { destroyExclamation } from "../../unlockables";
import { Vec2 } from "kaplay";

export function getMinibuttonXPos(index, buttonSpacing = 75) {
    return folderObj.pos.x - buttonSpacing * (index) - buttonSpacing;
}

type minibuttonOpt = {
	idxForInfo:number;
	taskbarIndex:number;
	initialPosition:Vec2,
	destPosition?:Vec2;
	moveToPosition?:boolean;
}

export function addMinibutton(opts:minibuttonOpt) {
	let quad;

	// @ts-ignore
	getSprite("bean")?.then(quady => {
		quad = quady
	})
	
	let destinedPosition:Vec2;
	if (opts.destPosition) destinedPosition = opts.destPosition
	else {
		let extraMb = infoForWindows[Object.keys(infoForWindows)[opts.idxForInfo]].icon ? true : false
		if (extraMb) destinedPosition = vec2(folderObj.pos.x, folderObj.pos.y - buttonSpacing)  
		else destinedPosition = vec2(getMinibuttonXPos(opts.taskbarIndex), folderObj.pos.y) 
	}

	let currentMinibutton = add([
		sprite("white_noise"),
		pos(opts.initialPosition),
		anchor("center"),
		area({ scale: vec2(0) }),
		scale(1),
		opacity(1),
		rotate(0),
		drag(),
		color(),
		layer("ui"),
		z(folderObj.z - 1),
		dummyShadow(),
		`${Object.keys(infoForWindows)[opts.idxForInfo]}`,
		"hoverObj",
		"minibutton",
		infoForWindows[Object.keys(infoForWindows)[opts.idxForInfo]].icon == "extra" ? "extraMinibutton" : "",
		{
			idxForInfo: opts.idxForInfo,
			taskbarIndex: opts.taskbarIndex,
			window: get(`${Object.keys(infoForWindows)[opts.idxForInfo]}`, { recursive: true })[0] ?? null,
			windowInfo: infoForWindows[Object.keys(infoForWindows)[opts.idxForInfo]],
			windowKey: Object.keys(infoForWindows)[opts.idxForInfo],
			nervousSpinSpeed: 10,
			saturation: 0,
			saturationColor: WHITE,
			defaultScale: vec2(1),
			dragHasSurpassed: false,
			destinedPosition: destinedPosition,
			isBeingHovered: false,
			extraMb: infoForWindows[Object.keys(infoForWindows)[opts.idxForInfo]].icon == "extra" ? true : null,
			shut: get("extraWin")[0] ? false : true,
			startHover() {
				if (folded) return
				if (isDraggingAWindow) return
				tween(this.pos.y, this.destinedPosition.y - 5, 0.32, (p) => this.pos.y = p, easings.easeOutQuint)
				tween(this.scale, vec2(1.05), 0.32, (p) => this.scale = p, easings.easeOutQuint)

				if (this.extraMb) this.shut ? this.play("shut_hover") : this.play("open_hover")
				else this.play("hover")
				mouse.play("point")
				this.isBeingHovered = true

				if (this.extraMb || this.dragging) return
				tween(this.pos.x, getMinibuttonXPos(this.taskbarIndex), 0.32, (p) => this.pos.x = p, easings.easeOutQuint)
			},

			endHover() {
				if (folded) return
				if (isDraggingAWindow) return
				tween(this.pos.y, this.destinedPosition.y, 0.32, (p) => this.pos.y = p, easings.easeOutQuint)
				tween(this.angle, 0, 0.32, (p) => this.angle = p, easings.easeOutQuint)
				tween(this.scale, vec2(1), 0.32, (p) => this.scale = p, easings.easeOutQuint)
				this.defaultScale = vec2(1.05)
				
				if (this.extraMb) this.shut ? this.play("shut_default") : this.play("open_default")
				else this.play("default")
				mouse.play("cursor")

				// reset some stuff
				this.isBeingHovered = false

				if (this.extraMb || this.dragging) return
				tween(this.pos.x, getMinibuttonXPos(this.taskbarIndex), 0.32, (p) => this.pos.x = p, easings.easeOutQuint)
			},
			
			update() {
				// dragging is minibutton
				if (this.dragging) {
					// tilting towards direction
					if (isMouseMoved()) this.angle = lerp(this.angle, mouseDeltaPos().x, 0.25)
					else this.angle = lerp(this.angle, 0, 0.25)
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
						if (this.isBeingHovered) {
							this.angle = wave(-8, 8, time () * 3)
						}
						
						else {
							this.angle = lerp(this.angle, 0, 0.25)
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
						this.area.scale = !this.extraMb ? vec2(0.75, 1.1) : vec2(0.75, 0.8)
						this.area.offset = vec2(2, 4)
					}
						
					else {
						this.area.scale = vec2(0)
					}
				}

				if (this.extraMb) {
					this.destinedPosition = vec2(folderObj.pos.x, folderObj.pos.y - buttonSpacing)
				}

				else {
					this.destinedPosition = vec2(getMinibuttonXPos(this.taskbarindex), folderObj.pos.y)
				}
			},

			drawInspect() {
				if (this.extraMb) return
				drawText({
					text: this.taskbarIndex,
					pos: vec2(0, -this.height),
					anchor: "center",
					size: 25,
					color: WHITE
				})
			},

			click() {
				// click function
				manageWindow(currentMinibutton.windowKey)
				bop(currentMinibutton)

				// unlocking stuff
				destroyExclamation(currentMinibutton)
			},

			pickFromTaskbar() {
				if (curDraggin) {
					return
				}
		
				mouse.grab()
				this.pick()

				this.layer = "mouse"
				this.z = mouse.z - 1
				folderObj.addSlots()
				playSfx("plap", {detune: 100 * this.windowInfo.idx / 4})
				bop(this, 0.1)

				if (this.window) this.window.close()
			},

			releaseDrop() {
				curDraggin.trigger("dragEnd")
				setCurDraggin(null)
				mouse.releaseAndPlay("cursor")
				this.layer = "ui"
				this.z = folderObj.z - 1

				let closestSlot = null;
				let closestDistance = Infinity;
				
				// Get all minibutton slots
				const minibuttonSlots = get("minibuttonslot");
				
				// Check the distance to each minibutton
				minibuttonSlots.forEach(slot => {
					const distance = currentMinibutton.screenPos().dist(slot.screenPos());
					if (distance < closestDistance) {
						closestDistance = distance;
						closestSlot = slot;
					}
				});
				
				let movingTween = null;

				// if the taskbarindexes don't coincide
				// goes back to the slot corresponding to its taskbar index
				if (this.taskbarIndex != closestSlot.taskbarIndex) movingTween = tween(this.pos, get(`slot_${this.taskbarIndex}`)[0].pos, 0.32, (p) => this.pos = p, easings.easeOutQuint)
				// if the taskbar indexes do coincide
				// goes to the slot that coincides with its taskbar index 
				if (this.taskbarIndex == closestSlot.taskbarIndex) movingTween = tween(this.pos, closestSlot.pos, 0.32, (p) => this.pos = p, easings.easeOutQuint)
				
				playSfx("plop", {detune: 100 * this.windowInfo.idx / 4})
				this.z = folderObj.z - 1
				
				// destroys all slots except the current one
				get("minibuttonslot").filter(minibuttonslot => minibuttonslot.taskbarIndex != this.taskbarIndex).forEach((minibuttonslot) => {
					destroy(minibuttonslot)
				})
				
				this.isBeingHovered = false
				// when it ends it destroys its slot
				movingTween.onEnd(() => {
					let currentSlot = get(`slot_${this.taskbarIndex}`)[0]
					currentSlot?.fadeOut(0.32).onEnd(() => currentSlot?.destroy())
					// isBeingHoveredOn doesn't work
					if (this.isHovering() && !isHoveringAWindow) this.startHover()
					else this.endHover()
				})

				// reset their angles
				get("minibutton").forEach(element => {
					tween(element.angle, 0, 0.32, (p) => element.angle = p, easings.easeOutQuint)
				});
			}
		}
	])

	// SPRITE
	currentMinibutton.use(sprite(`icon_${infoForWindows[Object.keys(infoForWindows)[opts.idxForInfo]].icon || Object.keys(infoForWindows)[opts.idxForInfo].replace("Win", "")}`))
	if (currentMinibutton.extraMb) {
		if (currentMinibutton.shut) currentMinibutton.play("shut_default")
		else currentMinibutton.play("open_default")
	}
	else currentMinibutton.play("default")

	// animate them
	currentMinibutton.opacity = 0
    tween(currentMinibutton.opacity, 1, 0.32, (p) => currentMinibutton.opacity = p, easings.easeOutQuad)
	
	if (opts.moveToPosition == true) {
		tween(currentMinibutton.pos, currentMinibutton.destinedPosition, 0.32, (p) => currentMinibutton.pos = p, easings.easeOutBack)
	}
	
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

		// sets position based on the new taskbarindex
		tween(currentMinibutton.pos.x, getMinibuttonXPos(currentMinibutton.taskbarIndex), 0.32, (p) => currentMinibutton.pos.x = p, easings.easeOutBack)
	})

	currentMinibutton.use(shader("saturate", () => ({
		"saturation": currentMinibutton.saturation,
		"saturationColor": currentMinibutton.saturationColor,
		"u_pos": vec2(quad.x, quad.y),
		"u_size": vec2(quad.w, quad.h),
	})))

	currentMinibutton.onHover(() => {
		if (curDraggin) return
		if (!isHoveringAWindow && !isDraggingAWindow) {
			currentMinibutton.startHover() // don't add the sound here because then it gets called whenever a window is closed
			playSfx("hoverMiniButton", {detune: 100 * currentMinibutton.windowInfo.idx / 4})
		}
	})

	currentMinibutton.onHoverEnd(() => {
		if (curDraggin) return
		if (isDraggingAWindow) return
		if (!isHoveringAWindow) {
			currentMinibutton.endHover()  
		}
	})

	let holdWaiting = wait(0, () => {});
	currentMinibutton.onMousePress("left", () => {
		if (!currentMinibutton.isBeingHovered) return
		if (currentMinibutton.extraMb) return

		holdWaiting.cancel()
		holdWaiting = wait(0.185, () => {
			if (!currentMinibutton.isBeingHovered) return;
			currentMinibutton.pickFromTaskbar()
		
			// unlocking stuff
			destroyExclamation(currentMinibutton)
		})
	})

	currentMinibutton.onMouseRelease((button) => {
		if (!currentMinibutton.isBeingHovered) return
		if (button != "left") return
		holdWaiting.cancel()

		// wasn't dragggin
		if (!currentMinibutton.dragging) {
			if (curDraggin) return
			
			if (isHoveringAWindow || isDraggingAWindow) return
			currentMinibutton.click()
		}

		// was dragging
		else if (currentMinibutton.dragging) {
			// release hold function
			if (curDraggin == currentMinibutton) {
				currentMinibutton.releaseDrop()
			}
		}
	})

	return currentMinibutton;
}
