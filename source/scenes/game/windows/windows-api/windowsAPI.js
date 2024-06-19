import { GameState } from "../../../../gamestate.js";
import { bop, getSides, mouse } from "../../utils.js";
import { drag, curDraggin, setCurDraggin } from "../../../../plugins/drag.js";
import { playSfx } from "../../../../sound.js";
import { addShockwave } from "../../../../plugins/shockwave.js";

// window contents
import { storeWinContent } from "../store/storeWindows.js";
import { musicWinContent, setTimeSinceSkip, timeSinceSkip } from "../musicWindow.js";
import { colorWinContent } from "../colorWindow.js";
import { settingsWinContent } from "../settingsWindow.js";
import { ascendWinContent } from "../ascendWindow.js";
import { extraWinContent } from "../extraWindow.js";
import { addMinibutton, calculateXButtonPosition } from "./windowsAPI-utils.js";

export let infoForWindows = {};
export let isGenerallyHoveringAWindow = false;
export let isPreciselyHoveringAWindow = false;
export let isInClickingRangeOfAWindow = false;
export let isDraggingAWindow = false;

export let folderObj;
let folded = true;
let timeSinceFold = 0;

export const buttonSpacing = 75;

export function deactivateAllWindows() {
	get("active").forEach(element => { element.deactivate() });
}

export function manageWindow(windowKey) {
	if (!infoForWindows.hasOwnProperty(windowKey)) throw new Error("No such window for: " + windowKey);

	let maybeWindow = get(windowKey)[0]
	// if window even exists in the first place
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
		// horizontal
		"storeWin": { idx: 0, content: storeWinContent, lastPos: vec2(818, 280) },
		// horizontal
		"musicWin": { idx: 1, content: musicWinContent, lastPos: vec2(208, 96) },
		// horizontal
		"ascendWin": { idx: 2, content: ascendWinContent, lastPos: vec2(center().x, center().y) },
		// horizontal
		"statsWin": { idx: 3, content: emptyWinContent, lastPos: vec2(center().x, center().y) },
		// vertical
		"medalsWin": { idx: 4, content: emptyWinContent, lastPos: vec2(center().x, center().y) },
		// vertical
		"aboutWin": { idx: 5, content: emptyWinContent, lastPos: vec2(center().x, center().y) },
		// vertical
		"creditsWin": { idx: 6, content: emptyWinContent, lastPos: vec2(center().x, center().y) },
		// vertical
		"settingsWin": { idx: 7, content: settingsWinContent, lastPos: vec2(center().x, center().y) },
		// vertical
		"leaderboardsWin": { idx: 8, content: emptyWinContent, lastPos: vec2(center().x, center().y) },
		// vertical
		"hexColorWin": { idx: 9, content: colorWinContent, lastPos: vec2(208, 160) },
		// vertical
		"bgColorWin": { idx: 10, content: colorWinContent, lastPos: vec2(1024 - 200, 200) },
		"extraWin": { idx: 11, icon: "extra", content: extraWinContent, lastPos: center(), verticalButton: true, },
	}

	GameState.taskbar = [ "storeWin", "musicWin", "ascendWin", "settingsWin" ]
}

export function openWindow(windowKey = "") {
	if (!infoForWindows.hasOwnProperty(windowKey)) throw new Error(`No such window for: ${windowKey}`)
	
	playSfx("openWin", rand(0.8, 1.2))

	let windowObj = add([
		sprite(getSprite(windowKey) ? windowKey : "dumbTestWin"),
		pos(infoForWindows[windowKey].lastPos),
		anchor("center"),
		opacity(0),
		scale(0.8),
		z(10),
		drag(),
		area(),
		"window",
		`${windowKey}`,
		{
			idx: infoForWindows[windowKey].idx,
			windowKey: windowKey,
			close() {
				this.trigger("close")
				folderObj.trigger("winClose")
				this.removeAll()
				playSfx("closeWin", rand(0.8, 1.2))

				this.unuse("window")
				this.unuse("active")
				tween(this.scale, vec2(0.9), 0.32, (p) => this.scale = p, easings.easeOutQuint)
				tween(this.opacity, 0, 0.32, (p) => this.opacity = p, easings.easeOutQuint).then(() => {
					// destroying it doesn't trigger onHoverEnd
					destroy(this)
				})

				infoForWindows[windowKey].lastPos = this.pos
				if (folded || !GameState.unlockedWindows.includes(windowKey)) return
			},

			activate() {
				this.use("active")
			},

			deactivate() {
				this.unuse("active")
			},

			isMouseInClickingRange() {
				let condition = 
				(mousePos().y >= getSides(this).top) &&
				(mousePos().y <= getSides(this).top + 25)
				return condition;
			},

			isMouseInPreciseRange() {
				let condition = 
				(mousePos().y >= getSides(this).top) && 
				(mousePos().y <= getSides(this).bottom) &&
				(mousePos().x <= getSides(this).right) &&
				(mousePos().x >= getSides(this).left)
				return condition;
			},

			isMouseInGeneralRange() {
				let condition = 
				(mousePos().y >= getSides(this).top - 10) && 
				(mousePos().y <= getSides(this).bottom + 10) &&
				(mousePos().x <= getSides(this).right + 10) &&
				(mousePos().x >= getSides(this).left - 10)
				return condition;
			},

			update() {
				this.pos.x = clamp(this.pos.x, -151, 1180)
				// debug.log(isPreciselyHoveringWindow)
			},
		}
	])

	infoForWindows[windowKey].lastPos.x = clamp(infoForWindows[windowKey].lastPos.x, 196, 827)
	infoForWindows[windowKey].lastPos.y = clamp(infoForWindows[windowKey].lastPos.y, height() - windowObj.height / 2, -windowObj.height / 2)
	windowObj.pos = infoForWindows[windowKey].lastPos

	let xButton = windowObj.add([
		text("X"),
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
		get("hover_outsideWindow").forEach(hoverObj => {
			if (hoverObj.isHovering() && hoverObj.endHover) {
				if (!curDraggin == hoverObj) hoverObj.endHover()
			}
		})

		// check if hovering any window button, if it it's not start pointing, if yes don't point
		if (!isDraggingAWindow && !xButton.isHovering()) mouse.play("cursor")
	})

	windowObj.onHoverEnd(() => {
		get("hover_outsideWindow").forEach(hoverObj => {
			if (hoverObj.isHovering() && hoverObj.startHover) {
				if (!curDraggin == hoverObj) {
					hoverObj.endHover()
					mouse.play("point")
				}
			}
		})
	})

	windowObj.onMousePress(() => {
		// if has been closed don't do anything
		if (!windowObj.is("window")) return

		if (!xButton.isHovering()) {
			if (curDraggin) {
				return
			}

			if (windowObj.isMouseInGeneralRange()) {
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
		if (curDraggin && curDraggin == windowObj) {
			curDraggin.trigger("dragEnd")
			setCurDraggin(null)
			mouse.releaseAndPlay("cursor")
		}
	})

	windowObj.onKeyPress("escape", () => {
		if (windowObj.is("active") && !(windowObj.is("extraWin") && curDraggin?.is("gridMiniButton"))) windowObj.close()
	})

	// activate
	deactivateAllWindows()
	windowObj.activate()

	// add content
	windowObj.add(infoForWindows[windowKey].content(windowObj, windowKey))
	// searches for the key

	// animate it
	tween(windowObj.opacity, 1, 0.32, (p) => windowObj.opacity = p, easings.easeOutQuint)
	tween(windowObj.scale, vec2(1), 0.32, (p) => windowObj.scale = p, easings.easeOutQuint)
	
	// manage the minibutton
	let correspondingMinibutton = get("minibutton").filter(minibutton => minibutton["windowKey"] === windowKey)[0]
	if (!correspondingMinibutton) return
	correspondingMinibutton.window = windowObj
	bop(correspondingMinibutton)

	windowObj.on("close", () => {
		correspondingMinibutton.window = null
		bop(correspondingMinibutton)
	})

	return windowObj;
}

export function folderObjManaging() {
	GameState.unlockedWindows = GameState.taskbar

	folderObj = add([
		sprite("folderObj"),
		pos(width() - 40, height() - 40),
		area({ scale: vec2(1.2) }),
		z(4),
		anchor("center"),
		"hover_outsideWindow",
		"folderObj",
		{
			defaultScale: vec2(1.2),
			editingBar: false,
			unfold() {
				folded = false
				timeSinceFold = 0
				playSfx("fold", rand(-50, 50))

				// Initial x position for the buttons
				let initialX = folderObj.pos.x;
				let initialY = folderObj.pos.y;
				
				// Iterate over the sorted taskbar array to create buttons
				// There are already minibuttons
				if (get("minibutton").length > 0) {
					get("miniButton").forEach((miniButton, index) => {
						let xPos = initialX - buttonSpacing * index - 75;
						let yPos = initialY - buttonSpacing * index - 75;

						tween(miniButton.pos.x, xPos, 0.32, (p) => miniButton.pos.x = p, easings.easeOutQuint)
						if (infoForWindows[miniButton.windowKey].verticalButton == true) {
							tween(miniButton.pos.y, yPos, 0.32, (p) => miniButton.pos.y = p, easings.easeOutQuint)
						}
					})
				}

				// There are not, create them
				else {
					GameState.taskbar.forEach((key, taskbarIndex) => {
						let i = infoForWindows[key].idx;
						addMinibutton(i, taskbarIndex, folderObj.pos, vec2(calculateXButtonPosition(taskbarIndex), folderObj.pos.y));
					});
				
					// adds the extra minibutton
					addMinibutton(11, 1, folderObj.pos, vec2(folderObj.pos.x, folderObj.pos.y - buttonSpacing));
				}
			},
			
			fold() {
				folded = true
				
				// return them to folderObj pos
				get("minibutton").forEach(miniButtonFoldTween => {
					tween(miniButtonFoldTween.pos, folderObj.pos, 0.32, (p) => miniButtonFoldTween.pos = p, easings.easeOutQuint).then(() => {
						destroy(miniButtonFoldTween)
					})
				});

				playSfx("fold", rand(-75, -100))
			},

			manageFold() {
				if (folded) folderObj.unfold()
				else folderObj.fold()
			},

			openTaskbarEdit() {
				let taskbaredit = add([
					pos(this.pos.x, this.pos.y),
					rect(0, this.height - 5, { radius: 5 }),
					anchor("right"),
					z(this.z - 2),
					color(BLACK),
					"taskbaredit",
				])

				tween(taskbaredit.width, buttonSpacing * 4, 0.32, (p) => taskbaredit.width = p, easings.easeOutQuint)
			},

			closeTaskbarEdit() {
				get("taskbaredit")[0]?.destroy()
			},

			update() {
				if (isKeyPressed("space") || (isMousePressed("left") && this.isHovering())) {
					this.manageFold()
					bop(this)
				}

				if (timeSinceFold < 0.25) timeSinceFold += dt()
				if (timeSinceSkip < 5) setTimeSinceSkip(timeSinceSkip + dt())
			}
		}
	])

	// this HAS to exist because if not how can you tell the hotkey was being pressed if the object doesn't exist
	// tf you mean by exist?
	folderObj.onCharInput((key) => {
		// Parse the key input to get the number pressed
		const numberPressed = parseInt(key);
		if (isNaN(numberPressed)) return; // If the key is not a number, return
	
		// Adjust for 1-based index (e.g., pressing '1' should access the first element)
		const index = numberPressed - 1;
	
		// Ensure the number is within the range of GameState.taskbar indices
		if (index >= 0 && index < GameState.taskbar.length) {
			const windowKey = GameState.taskbar[index];
	
			// Check if the window is unlocked
			// if (GameState.unlockedWindows.includes(windowKey)) {
				// Open the window and handle UI updates
				if (folded) folderObj.unfold();
				manageWindow(windowKey);
			// }
		}
	});

	folderObj.on("winClose", () => {
		let anyHovered = false
		for (const hoverObj of get("hover_outsideWindow")) {
			if (hoverObj.isHovering()) {
				if (hoverObj.startHover) hoverObj.startHover()
				anyHovered = true;
				break;
			}
		}

		if (anyHovered) mouse.play("point")
		else mouse.play("cursor")

		wait(0.05, () => {
			// gets the topmost window
			let allWindows = get("window", { recursive: true })
			if (allWindows.length > 0) allWindows[clamp(allWindows.length - 1, 0, allWindows.length)].activate()

			isGenerallyHoveringAWindow = get("window", { recursive: true }).some((window) => window.isMouseInGeneralRange())
			isPreciselyHoveringAWindow = get("window", { recursive: true }).some((window) => window.isMouseInPreciseRange())
		})
	})

	folderObj.onUpdate(() => {
		if (!get("window").length > 0) return
		// if any window is being hovered on
		get("window").some((window) => {
			isGenerallyHoveringAWindow = window.isMouseInGeneralRange()
			isPreciselyHoveringAWindow = window.isMouseInPreciseRange()
			isInClickingRangeOfAWindow = window.isMouseInClickingRange()
			isDraggingAWindow = window.dragging
		})
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