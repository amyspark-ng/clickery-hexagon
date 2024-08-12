import { GameState } from "../../../gamestate";
import { curDraggin } from "../.././plugins/drag";
import { playSfx } from "../../../sound";
import { mouse } from "../../additives";
import { ascension } from "../../ascension/ascension";
import { blendColors, bop } from "../../utils";
import { setTimeSinceSkip, timeSinceSkip } from "../musicWindow";
import { addMinibutton, getMinibuttonPos,  } from "./minibuttons";
import { manageWindow, allObjWindows } from "./windowManaging";
import { outsideWindowHover } from "../../hovers/outsideWindowHover";

export let folderObj;
export let folded = true;
let timeSinceFold = 0;

let movingMinibuttons:boolean;
export function folderObjManaging() {
	// reset variables
	folded = true
	timeSinceFold = 0
	
	allObjWindows.isHoveringAWindow = false;
	allObjWindows.isDraggingAWindow = false;
	
	movingMinibuttons = false;

	folderObj = add([
		sprite("folderObj"),
		pos(width() - 40, height() - 40),
		area({ scale: vec2(1.2) }),
		layer("ui"),
		z(0),
		scale(),
		anchor("center"),
		outsideWindowHover(),
		"folderObj",
		{
			defaultScale: vec2(1.2),
			interactable: true, 
			unfold() {
				folded = false
				timeSinceFold = 0
				playSfx("fold")

				// if there's no minibutton
				if (get("minibutton").length == 0) {
					GameState.taskbar.forEach((key, taskbarIndex) => {
						let newminibutton = addMinibutton({
							windowKey: key,
							taskbarIndex: taskbarIndex,
							initialPosition: folderObj.pos,
						})
						newminibutton.area.scale = vec2(0)
					});
					
					movingMinibuttons = true
					get("minibutton").forEach((miniButton) => {
						tween(miniButton.pos, miniButton.destinedPosition, 0.32, (p) => miniButton.pos = p, easings.easeOutBack).then(() => {
							movingMinibuttons = false;
							miniButton.area.scale = vec2(0.75)
						})
					})
				}

				this.trigger("unfold")
			},
			
			fold() {
				folded = true
				
				// return them to folderObj pos
				movingMinibuttons = true
				get("minibutton").forEach(minibutton => {
					minibutton.area.scale = vec2(0)
					tween(minibutton.opacity, 0, 0.32, (p) => minibutton.opacity = p, easings.easeOutQuint)
					tween(minibutton.pos, folderObj.pos, 0.32, (p) => minibutton.pos = p, easings.easeOutQuint).then(() => {
						destroy(minibutton)
						movingMinibuttons = false
					})
				});

				playSfx("fold", { detune: -150 })
				this.trigger("fold")
			},

			manageFold() {
				if (folded) folderObj.unfold()
				else folderObj.fold()
			},

			addSlots() {
				get("minibutton").filter(minibutton => !minibutton.extraMb).forEach((minibutton, index) => {
					// add slots
					add([
						rect(20, 20, { radius: 4 }),
						pos(getMinibuttonPos(index)),
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
			},

			deleteSlots() {
				let minibuttonsslots = get("minibuttonslot")
				minibuttonsslots?.forEach((minibuttonslot) => {
					destroy(minibuttonslot)
				})
			},

			update() {
				if (this.interactable == false) this.area.scale = vec2(0)
				else this.area.scale = vec2(1.2) 

				this.flipX = folded ? true : false
				
				if (curDraggin?.is("gridMiniButton") || curDraggin?.is("minibutton")) return
				if (!movingMinibuttons) {
					if (this.interactable == true && isKeyPressed("space") || (isMousePressed("left") && this.isHovering())) {
						this.manageFold()
						this.deleteSlots()
						bop(this)
					}
				}

				if (timeSinceFold < 0.25) timeSinceFold += dt()
				if (timeSinceSkip < 5) setTimeSinceSkip(timeSinceSkip + dt())
			}
		}
	])

	folderObj.startingHover(() => {
		mouse.play("point")
	})

	folderObj.endingHover(() => {
		mouse.play("cursor")
	})

	// this can't be attached to the buttons because you won't be able to call the event if the buttons don't exist
	folderObj.onCharInput((key) => {
		if (ascension.ascending == true) return;
		if (isKeyDown("control")) return
		if (curDraggin) return

		// parse the key to number
		const numberPressed = parseInt(key);
		if (isNaN(numberPressed)) return; // If the key is not a number, return
	
		// adjust it to 0, 1, 2, 3
		const index = numberPressed - 1;

		// // if the window you're trying to open is the same as the minibutton that is being dragged don't open it!!
		// if (curDraggin?.is("minibutton") && curDraggin?.idxForInfo == infoForWindows[curDraggin?.windowKey].idx) return

		// silly
		if (numberPressed == 0) {
			if (folded) folderObj.unfold();
			manageWindow("extraWin")
		}

		else if (index >= 0 && index < GameState.taskbar.length) {
			const windowKey = GameState.taskbar[index];
	
			if (GameState.unlockedWindows.includes(windowKey)) {
				if (folded) folderObj.unfold();
				
				let minibutton = get(windowKey)?.filter(obj => obj.is("minibutton"))[0]
				if (minibutton) minibutton.click()
				else manageWindow(windowKey)
			}
		}
	});

	folderObj.on("winClose", () => {
		// wait(0.05, () => {
			// gets the topmost window
			let allWindows = get("window")
			if (allWindows.length > 0) allWindows.reverse()[0].activate()
		// })

		let isAnyObjGettingHovered = get("outsideHover", { recursive: true }).some((outsideHover) => outsideHover.isHovering() == true && outsideHover.isBeingHovered == false)
		if (isAnyObjGettingHovered == true) {
			// get all the objs that are being hovered
			let allHoveredObjs = get("outsideHover", { recursive: true }).filter((outsideHover) => outsideHover.isHovering() == true && outsideHover.isBeingHovered == false)
			allHoveredObjs.forEach((obj) => obj.startHoverFunction())
		}
	})

	folderObj.onUpdate(() => {
		if ((get("window").length > 0)) {
			// if any window is being hovered on
			allObjWindows.isHoveringAWindow = get("window").some((window) => window.isMouseInRange())
			allObjWindows.isDraggingAWindow = get("window").some((window) => window.dragging)
		}

		else {
			allObjWindows.isHoveringAWindow = false
			allObjWindows.isDraggingAWindow = false
		}
	})

	// manages behaviour related to the closeest minibutton
	onUpdate("closestMinibuttonToDrag", (minibutton) => {
		if (!curDraggin?.is("gridMiniButton")) return
		if (curDraggin?.screenPos().dist(minibutton.screenPos()) > 120) return
		let distanceToCurDragging = curDraggin?.screenPos().dist(minibutton.screenPos())

		minibutton.nervousSpinSpeed = 14
		let blackness = map(distanceToCurDragging, 20, 120, 1, 0.25)
		minibutton.opacity = map(distanceToCurDragging, 20, 120, 0.5, 1)
		minibutton.scale.x = map(distanceToCurDragging, 20, 120, 0.8, 1)
		minibutton.scale.y = map(distanceToCurDragging, 20, 120, 0.8, 1)
		minibutton.scale.y = map(distanceToCurDragging, 20, 120, 0.8, 1)
		minibutton.color = blendColors(WHITE, BLACK, blackness)
	})
}