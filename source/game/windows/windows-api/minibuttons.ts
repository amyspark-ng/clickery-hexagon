import { curDraggin, drag, setCurDraggin } from "../../../plugins/drag";
import { dummyShadow } from "../../../plugins/dummyShadow";
import { playSfx } from "../../../sound";
import { bop } from "../../utils";
import { mouse } from "../../additives";
import { infoForWindows, manageWindow, buttonSpacing, openWindow, allObjWindows, windowKey, } from "./windowsAPI";
import { GameState } from "../../../gamestate";
import { destroyExclamation } from "../../unlockables";
import { Vec2 } from "kaplay";
import { openWindowButton } from "./windowButtonClass";
import { folded, folderObj } from "./folderObj";
import { outsideWindowHover } from "../../hovers";

export function getMinibuttonXPos(index, buttonSpacing = 75) {
    return folderObj.pos.x - buttonSpacing * (index) - buttonSpacing;
}

type minibuttonOpt = {
	windowKey:windowKey
	taskbarIndex:number;
	initialPosition:Vec2,
	destPosition?:Vec2;
	/**
	 * Wheter to move to the destined position when added
	 */
	moveToPosition?:boolean;
}

export function addMinibutton(opts:minibuttonOpt) {
	let quad;

	getSprite("bean")?.then(quady => {
		quad = quady
	})

	let idxForInfo = infoForWindows[opts.windowKey].idx

	let destinedPosition:Vec2;
	if (opts.destPosition) destinedPosition = opts.destPosition
	else {
		let extraMb = infoForWindows[Object.keys(infoForWindows)[idxForInfo]].icon ? true : false
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
		openWindowButton(),
		outsideWindowHover(),
		`${opts.windowKey}`,
		"minibutton",
		infoForWindows[opts.windowKey].icon == "extra" ? "extraMinibutton" : "",
		{
			idxForInfo: idxForInfo,
			taskbarIndex: opts.taskbarIndex,
			window: get(`${opts.windowKey}`, { recursive: true })[0] ?? null,
			windowInfo: infoForWindows[opts.windowKey],
			windowKey: opts.windowKey,
			nervousSpinSpeed: 10,
			saturation: 0,
			saturationColor: WHITE,
			defaultScale: vec2(1),
			dragHasSurpassed: false,
			destinedPosition: destinedPosition,
			extraMb: infoForWindows[opts.windowKey].icon == "extra" ? true : null,
			shut: get("extraWin")[0] ? false : true,
			update() {
				if (this.dragging == false) {
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
				
				// when it ends it destroys its slot
				movingTween.onEnd(() => {
					let currentSlot = get(`slot_${this.taskbarIndex}`)[0]
					currentSlot?.fadeOut(0.32).onEnd(() => currentSlot?.destroy())
					if (this.isHovering() && !allObjWindows.isHoveringAWindow) this.startHover()
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
	currentMinibutton.use(sprite(`icon_${infoForWindows[opts.windowKey].icon || opts.windowKey.replace("Win", "")}`))
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

	currentMinibutton.startingHover(() => {
		if (folded) return
		playSfx("hoverMiniButton", {detune: 100 * currentMinibutton.windowInfo.idx / 4})
		tween(currentMinibutton.pos.y, currentMinibutton.destinedPosition.y - 5, 0.32, (p) => currentMinibutton.pos.y = p, easings.easeOutQuint)
		tween(currentMinibutton.scale, vec2(1.05), 0.32, (p) => currentMinibutton.scale = p, easings.easeOutQuint)

		if (currentMinibutton.extraMb) currentMinibutton.shut ? currentMinibutton.play("shut_hover") : currentMinibutton.play("open_hover")
		else currentMinibutton.play("hover")

		if (currentMinibutton.extraMb || currentMinibutton.dragging) return
		tween(currentMinibutton.pos.x, getMinibuttonXPos(currentMinibutton.taskbarIndex), 0.32, (p) => currentMinibutton.pos.x = p, easings.easeOutQuint)
	})

	currentMinibutton.endingHover(() => {
		if (folded) return
		if (allObjWindows.isDraggingAWindow) return
		tween(currentMinibutton.pos.y, currentMinibutton.destinedPosition.y, 0.32, (p) => currentMinibutton.pos.y = p, easings.easeOutQuint)
		tween(currentMinibutton.angle, 0, 0.32, (p) => currentMinibutton.angle = p, easings.easeOutQuint)
		tween(currentMinibutton.scale, vec2(1), 0.32, (p) => currentMinibutton.scale = p, easings.easeOutQuint)
		currentMinibutton.defaultScale = vec2(1.05)
		
		if (currentMinibutton.extraMb) currentMinibutton.shut ? currentMinibutton.play("shut_default") : currentMinibutton.play("open_default")
		else currentMinibutton.play("default")
		mouse.play("cursor")

		if (currentMinibutton.extraMb || currentMinibutton.dragging) return
		tween(currentMinibutton.pos.x, getMinibuttonXPos(currentMinibutton.taskbarIndex), 0.32, (p) => currentMinibutton.pos.x = p, easings.easeOutQuint)
	})

	currentMinibutton.onPress(() => {
		if (allObjWindows.isHoveringAWindow || allObjWindows.isDraggingAWindow) return
		currentMinibutton.click()
	})

	currentMinibutton.onHold(() => {
		currentMinibutton.pickFromTaskbar()
		
		// unlocking stuff
		destroyExclamation(currentMinibutton)
	})

	currentMinibutton.onHoldRelease(() => {
		if (curDraggin == currentMinibutton) {
			currentMinibutton.releaseDrop()
		}
	})

	return currentMinibutton;
}
