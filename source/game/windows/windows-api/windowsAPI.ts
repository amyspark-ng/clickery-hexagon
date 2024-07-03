import { GameState } from "../../../gamestate.ts";
import { blendColors, bop, getPositionOfSide } from "../../utils.ts";
import { mouse } from "../../additives.ts";
import { drag, curDraggin, setCurDraggin } from "../../../plugins/drag.js";
import { playSfx } from "../../../sound.ts";
import { addMinibutton, getXPosFolder } from "./minibuttons.ts";

// window contents
import { storeWinContent } from "../store/storeWindows.ts";
import { musicWinContent, setTimeSinceSkip, timeSinceSkip } from "../musicWindow.ts";
import { colorWinContent } from "../colorWindow.ts";
import { settingsWinContent } from "../settingsWindow.ts";
import { ascendWinContent } from "../ascendWindow.ts";
import { extraWinContent } from "../extraWindow.ts";
import { creditsWinContent } from "../creditsWin.ts";
import { statsWinContent } from "../statsWin.ts";
import { hasStartedGame } from "../../gamescene.ts";
import { isAchievementUnlocked, unlockAchievement } from "../../unlockables.ts";

export let infoForWindows = {};
export let isGenerallyHoveringAWindow = false;
export let isPreciselyHoveringAWindow = false;
export let isInClickingRangeOfAWindow = false;
export let isDraggingAWindow = false;

export let folderObj;
export let folded = true;
let timeSinceFold = 0;

export const buttonSpacing = 75;

export function deactivateAllWindows() {
	get("active").forEach(element => { element.deactivate() });
}

export function manageWindow(windowKey) {
	if (!infoForWindows.hasOwnProperty(windowKey)) throw new Error("No such window for: " + windowKey);

	let maybeWindow = get(windowKey).filter(obj => !obj.is("minibutton"))[0]
	// if window even exists in the first place (not a button)
	if (maybeWindow) {
		// if it isn't it means that it's being closed
		if (maybeWindow.is("window")) {
			maybeWindow.close()
		}
	}
	else {
		maybeWindow = openWindow(windowKey)
	}

	return maybeWindow
}

export function windowsDefinition() {
	infoForWindows = {
		"storeWin": { idx: 0, content: storeWinContent, lastPos: vec2(818, 280) },
		"musicWin": { idx: 1, content: musicWinContent, lastPos: vec2(208, 96) },
		"ascendWin": { idx: 2, content: ascendWinContent, lastPos: vec2(center().x, center().y) },
		"statsWin": { idx: 3, content: statsWinContent, lastPos: vec2(center().x, center().y) },
		"medalsWin": { idx: 4, content: emptyWinContent, lastPos: vec2(center().x, center().y) },
		"aboutWin": { idx: 5, content: emptyWinContent, lastPos: vec2(center().x, center().y) },
		"creditsWin": { idx: 6, content: creditsWinContent, lastPos: vec2(center().x, center().y) },
		"settingsWin": { idx: 7, content: settingsWinContent, lastPos: vec2(center().x, center().y) },
		"leaderboardsWin": { idx: 8, content: emptyWinContent, lastPos: vec2(center().x, center().y) },
		"hexColorWin": { idx: 9, content: colorWinContent, lastPos: vec2(208, 160) },
		"bgColorWin": { idx: 10, content: colorWinContent, lastPos: vec2(1024 - 200, 200) },
		"extraWin": { idx: 11, icon: "extra", content: extraWinContent, lastPos: center() },
	}
}

export function openWindow(windowKey = "") {
	if (!infoForWindows.hasOwnProperty(windowKey)) throw new Error(`No such window for: ${windowKey}`)
	
	playSfx("openWin")

	let windowObj = add([
		sprite(getSprite(windowKey) ? windowKey : "dumbTestWin"),
		pos(infoForWindows[windowKey].lastPos),
		anchor("center"),
		opacity(1),
		scale(1),
		layer("windows"),
		z(0),
		drag(),
		area({ scale: vec2(1.04, 1) }),
		"window",
		`${windowKey}`,
		{
			idx: infoForWindows[windowKey].idx,
			windowKey: windowKey,
			close() {
				this.trigger("close")
				this.removeAll()
				this.unuse("window")
				this.unuse("active")
				playSfx("closeWin")

				tween(this.scale, vec2(0.9), 0.32, (p) => this.scale = p, easings.easeOutQuint)
				tween(this.opacity, 0, 0.32, (p) => this.opacity = p, easings.easeOutQuint).then(() => {
					// destroying it doesn't trigger onHoverEnd
					destroy(this)
				})

				folderObj.trigger("winClose")

				infoForWindows[windowKey].lastPos = this.pos
			},

			releaseDrop() {
				if (curDraggin && curDraggin == this) {
					curDraggin.trigger("dragEnd")
					setCurDraggin(null)
					mouse.releaseAndPlay("cursor")
				}
			},

			activate() {
				this.use("active")

				if (!this.is("shader")) return
				this.unuse("shader")
				this.get("*", { recursive: true }).forEach((obj) => {
					obj.unuse("shader")
				})
			},

			deactivate() {
				this.unuse("active")

				if (this.is("shader")) return
				this.use(shader("grayscale"))
				this.get("*", { recursive: true }).forEach((obj) => {
					obj.use(shader("grayscale"))
				})
			},

			isMouseInClickingRange() {
				let condition = 
				(mousePos().y >= getPositionOfSide(this).top) &&
				(mousePos().y <= getPositionOfSide(this).top + 25)
				return condition;
			},

			isMouseInPreciseRange() {
				let condition = 
				(mousePos().y >= getPositionOfSide(this).top) && 
				(mousePos().y <= getPositionOfSide(this).bottom) &&
				(mousePos().x <= getPositionOfSide(this).right) &&
				(mousePos().x >= getPositionOfSide(this).left)
				return condition;
			},

			isMouseInGeneralRange() {
				let condition = 
				(mousePos().y >= getPositionOfSide(this).top - 10) && 
				(mousePos().y <= getPositionOfSide(this).bottom + 10) &&
				(mousePos().x <= getPositionOfSide(this).right + 10) &&
				(mousePos().x >= getPositionOfSide(this).left - 10)
				return condition;
			},

			update() {
				this.pos.x = clamp(this.pos.x, -151, 1180)
				this.pos.y = clamp(this.pos.y, this.height / 2, height() + (this.height / 2) - 36)
			},
		}
	])

	infoForWindows[windowKey].lastPos.x = clamp(infoForWindows[windowKey].lastPos.x, 196, 827)
	infoForWindows[windowKey].lastPos.y = clamp(infoForWindows[windowKey].lastPos.y, height() - windowObj.height / 2, -windowObj.height / 2)
	windowObj.pos = infoForWindows[windowKey].lastPos

	let xButton = windowObj.add([
		text("X", {
			font: "lambda",
		}),
		color(WHITE),
		pos(-windowObj.width / 2, -windowObj.height / 2),
		z(windowObj.z + 1),
		area({ scale: vec2(1.8, 1.1), offset: vec2(-5, 0)}),
		"xButton",
		"hover_outsideWindow",
		{
			startHover() {
				this.color = RED
			},
			endHover() {
				this.color = WHITE
			}
		}
	])

	xButton.pos.x += windowObj.width - xButton.width - 5

	xButton.onHover(() => {
		if (isDraggingAWindow) return
		xButton.startHover()
	})

	xButton.onHoverEnd(() => {
		if (isDraggingAWindow) return
		xButton.endHover()
	})

	xButton.onClick(() => {
		if (!isDraggingAWindow) {
			windowObj.close()
		}
	})

	windowObj.onHover(() => {
		get("hoverOutsideWindow", { recursive: true }).forEach((obj) => {
			if (curDraggin) return
			if (obj.isHovering()) obj.endHover()
		})
	})
	
	windowObj.onHoverEnd(() => {
		get("hoverOutsideWindow", { recursive: true }).forEach((obj) => {
			if (curDraggin) return
			if (obj.isHovering()) obj.startHover()
		})
	})

	windowObj.onMousePress(() => {
		// if has been closed don't do anything
		if (!windowObj.is("window")) return

		if (!xButton.isHovering()) {
			if (curDraggin) {
				return
			}

			if (windowObj.isMouseInPreciseRange()) {
				if (windowObj.isMouseInClickingRange()) {
					mouse.grab()
					windowObj.pick()
				}

				if (!windowObj.is("active")) {
					deactivateAllWindows()
					windowObj.activate()
					readd(windowObj)
				}
			}
		}
	})

	windowObj.onMouseRelease(() => {
		windowObj.releaseDrop()
	})

	windowObj.onKeyPress("escape", () => {
		// if window is active and (window isn't an extra window and curDragging isn't gridMinibutton)
		// can't close if is extra window and is dragging a button
		if (windowObj.is("active") && !(windowObj.is("extraWin") && curDraggin?.is("gridMiniButton"))) windowObj.close()
	})

	// activate
	deactivateAllWindows()
	windowObj.activate()

	// add content
	windowObj.add(infoForWindows[windowKey].content(windowObj, windowKey))
	// searches for the key

	// animate it
	tween(0, 1, 0.32, (p) => windowObj.opacity = p, easings.easeOutQuint)
	tween(vec2(0.8), vec2(1), 0.32, (p) => windowObj.scale = p, easings.easeOutQuint)
	
	// manage the minibutton
	let correspondingMinibutton = get("minibutton").filter(minibutton => minibutton["windowKey"] === windowKey)[0]
	if (!correspondingMinibutton) return
	correspondingMinibutton.window = windowObj
	bop(correspondingMinibutton)

	// manage some hovers
	get("hoverOutsideWindow", { recursive: true }).forEach((obj) => {
		if (obj.isHovering() && windowObj.isHovering()) obj.endHover()
	})

	windowObj.on("close", () => {
		correspondingMinibutton.window = null
		bop(correspondingMinibutton)
	
		get("hoverOutsideWindow", { recursive: true }).forEach((obj) => {
			if (obj.isHovering() && !obj.dragging) obj.startHover()
		})
	})

	// check for achievement
	if (GameState.taskbar.length > 3) {
		if (!isAchievementUnlocked("allwindowsontaskbar")) {
			if (get("window").length == GameState.taskbar.length) {
				let windows = []
				get("window").forEach((window) => {
					windows.push(window.windowKey)
				})
				
				let gamestateTaskbarClone = GameState.taskbar.slice()

				// @ts-ignore
				const isEqual = (a, b) => new Set(a).symmetricDifference(new Set(b)).size == 0

				if (isEqual(gamestateTaskbarClone, windows)) {
					unlockAchievement("allwindowsontaskbar")
				}
			}
		}
	}

	return windowObj;
}

let movingMinibuttons:boolean;
export function folderObjManaging() {
	// reset variables
	folded = true
	timeSinceFold = 0
	isGenerallyHoveringAWindow = false;
	isPreciselyHoveringAWindow = false;
	isInClickingRangeOfAWindow = false;
	isDraggingAWindow = false;
	movingMinibuttons = false;

	folderObj = add([
		sprite("folderObj"),
		pos(width() - 40, height() - 40),
		area({ scale: vec2(1.2) }),
		layer("ui"),
		z(0),
		anchor("center"),
		"folderObj",
		"hoverOutsideWindow",
		{
			defaultScale: vec2(1.2),
			editingBar: false,
			unfold() {
				folded = false
				timeSinceFold = 0
				playSfx("fold")

				// if there's no minibutton
				if (get("minibutton").length == 0) {
					GameState.taskbar.forEach((key, taskbarIndex) => {
						let idxForInfo = infoForWindows[key].idx;
						
						let newminibutton = addMinibutton({
							idxForInfo: idxForInfo,
							taskbarIndex: taskbarIndex,
							initialPosition: folderObj.pos,
						})
					});
					
					movingMinibuttons = true
					get("minibutton").forEach((miniButton) => {
						tween(miniButton.pos, miniButton.destinedPosition, 0.32, (p) => miniButton.pos = p, easings.easeOutBack).then(() => {
							movingMinibuttons = false;
						})
					})
				}
			},
			
			fold() {
				folded = true
				
				// return them to folderObj pos
				movingMinibuttons = true
				get("minibutton").forEach(minibutton => {
					tween(minibutton.opacity, 0, 0.32, (p) => minibutton.opacity = p, easings.easeOutQuad)
					tween(minibutton.pos, folderObj.pos, 0.32, (p) => minibutton.pos = p, easings.easeOutBack).then(() => {
						destroy(minibutton)
						movingMinibuttons = false
					})
				});

				playSfx("fold", { detune: -150 })
			},

			manageFold() {
				if (folded) folderObj.unfold()
				else folderObj.fold()
				this.trigger("managefold", folded)
			},

			addSlots() {
				get("minibutton").filter(minibutton => !minibutton.extraMb).forEach((minibutton, index) => {
					// add slots
					add([
						rect(20, 20, { radius: 4 }),
						pos(getXPosFolder(index), folderObj.pos.y),
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

			startHover() {
				mouse.play("point")
			},
			
			endHover() {
				mouse.play("cursor")
			},

			update() {
				this.flipX = folded ? true : false
				
				this.area.scale = hasStartedGame == false ? vec2(0) : vec2(1.2) 
				
				if (curDraggin?.is("gridMiniButton") || curDraggin?.is("minibutton")) return
				if (!movingMinibuttons) {
					if (isKeyPressed("space") || (isMousePressed("left") && this.isHovering())) {
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

	folderObj.onHover(() => {
		folderObj.startHover()
	})

	folderObj.onHoverEnd(() => {
		folderObj.endHover()
	})

	// this can't be attached to the buttons because you won't be able to call the event if the buttons don't exist
	folderObj.onCharInput((key) => {
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
		wait(0.05, () => {
			// gets the topmost window
			let allWindows = get("window", { recursive: true })
			if (allWindows.length > 0) allWindows[clamp(allWindows.length - 1, 0, allWindows.length)].activate()

			isGenerallyHoveringAWindow = get("window", { recursive: true }).some((window) => window.isMouseInGeneralRange())
			isPreciselyHoveringAWindow = get("window", { recursive: true }).some((window) => window.isMouseInPreciseRange())
		})
	})

	folderObj.onUpdate(() => {
		if (!(get("window").length > 0)) return
		// if any window is being hovered on
		get("window").some((window) => {
			isGenerallyHoveringAWindow = window.isMouseInGeneralRange()
			isPreciselyHoveringAWindow = window.isMouseInPreciseRange()
			isInClickingRangeOfAWindow = window.isMouseInClickingRange()
			isDraggingAWindow = window.dragging
		})
	})

	// manages behaviour related tothe closeest minibutton
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

// TODO: Re do unlock window function

export function emptyWinContent(winParent) {
	winParent.add([
		text(`THIS WINDOW IS EMPTY\nThis is the ${winParent.windowKey}`, {
			align: "center"
		}),
		anchor("center"),
	])
}
