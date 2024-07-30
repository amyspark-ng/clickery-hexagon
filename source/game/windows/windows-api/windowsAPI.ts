import { GameState } from "../../../gamestate.ts";
import { bop, getPositionOfSide } from "../../utils.ts";
import { mouse } from "../../additives.ts";
import { drag, curDraggin, setCurDraggin } from "../../../plugins/drag.ts";
import { playSfx } from "../../../sound.ts";

// window contents
import { storeWinContent } from "../store/storeWindows.ts";
import { musicWinContent, setTimeSinceSkip, timeSinceSkip } from "../musicWindow.ts";
import { colorWinContent } from "../colorWindow.ts";
import { settingsWinContent } from "../settingsWindow.ts";
import { ascendWinContent } from "../ascendWindow.ts";
import { extraWinContent } from "../extraWindow.ts";
import { creditsWinContent } from "../creditsWin.ts";
import { statsWinContent } from "../statsWin.ts";
import { isAchievementUnlocked, unlockAchievement } from "../../unlockables.ts";
import { medalsWinContent } from "../medalsWin.ts";
import { ROOT } from "../../../main.ts";
import { folderObj } from "./folderObj.ts";

export let infoForWindows = {};

export let allObjWindows = {
	isHoveringAWindow: false,
	isDraggingAWindow: false,
}

export const buttonSpacing = 75;

export function deactivateAllWindows() {
	get("window").filter(window => window.active == true).forEach(element => { element.deactivate() });
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
		"storeWin": { idx: 0, content: storeWinContent, lastPos: vec2(264, 285) },
		"musicWin": { idx: 1, content: musicWinContent, lastPos: vec2(208, 96) },
		"ascendWin": { idx: 2, content: ascendWinContent, lastPos: vec2(center().x, center().y) },
		"statsWin": { idx: 3, content: statsWinContent, lastPos: vec2(center().x, center().y) },
		"medalsWin": { idx: 4, content: medalsWinContent, lastPos: vec2(center().x, center().y) },
		"aboutWin": { idx: 5, content: emptyWinContent, lastPos: vec2(center().x, center().y) },
		"creditsWin": { idx: 6, content: creditsWinContent, lastPos: vec2(center().x, center().y) },
		"settingsWin": { idx: 7, content: settingsWinContent, lastPos: vec2(center().x, center().y) },
		"leaderboardsWin": { idx: 8, content: emptyWinContent, lastPos: vec2(center().x, center().y) },
		"hexColorWin": { idx: 9, content: colorWinContent, lastPos: vec2(208, 160) },
		"bgColorWin": { idx: 10, content: colorWinContent, lastPos: vec2(width() - 200, 200) },
		"extraWin": { idx: 11, icon: "extra", content: extraWinContent, lastPos: center() },
	}
}

export type windowKey = "storeWin" | "musicWin" | "ascendWin" | "statsWin" | "medalsWin" | "aboutWin" | "creditsWin" | "settingsWin" | "leaderboardsWin" | "hexColorWin" | "bgColorWin" | "extraWin"

export function isWindowOpen(windowKey:windowKey) {
	return get(windowKey).filter(obj => obj.is("window")).length > 0
}

export function openWindow(windowKey:windowKey) {
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
			active: true,
			close() {
				this.trigger("close")
				this.removeAll()
				this.unuse("window")
				this.active = false
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
				this.active = true
				this.trigger("activate")
				
				if (!this.is("shader")) return
				this.unuse("shader")
				this.get("*", { recursive: true }).forEach((obj) => {
					obj.unuse("shader")
				})
			},

			deactivate() {
				this.active = false
				this.trigger("deactivate")

				if (this.is("shader")) return
				this.use(shader("grayscale"))
				this.get("*", { recursive: true }).forEach((obj) => {
					obj.use(shader("grayscale"))
				})
			},

			isMouseInClickingRange() {
				let condition = 
				(mouse.pos.y >= getPositionOfSide(this).top) &&
				(mouse.pos.y <= getPositionOfSide(this).top + 25)
				return condition;
			},

			isMouseInRange() {
				return this.hasPoint(mouse.pos);
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
		if (allObjWindows.isDraggingAWindow) return
		xButton.startHover()
	})

	xButton.onHoverEnd(() => {
		if (allObjWindows.isDraggingAWindow) return
		xButton.endHover()
	})

	xButton.onClick(() => {
		if (!windowObj.active) {
			// if it's not dragging a window AND a window that is not this one is being hovered
			if (!allObjWindows.isDraggingAWindow && !get("window").some(window => window.isHovering() && window != windowObj)) {
				windowObj.close()
			}
		}

		else windowObj.close()
	})

	windowObj.onHover(() => {
		get("outsideHover", { recursive: true }).forEach(obj => {
			obj.trigger("cursorEnterWindow")
		})

		// get("insideHover", { recursive: true }).forEach(obj => {
		// 	obj.trigger("cursorEnterWindow")
		// })
	})
	
	windowObj.onHoverEnd(() => {
		get("outsideHover", { recursive: true }).forEach(obj => {
			obj.trigger("cursorExitWindow")
		})
		// get("insideHover", { recursive: true }).forEach(obj => {
		// 	obj.trigger("cursorExitWindow")
		// })
	})

	windowObj.onMousePress(() => {
		// if has been closed don't do anything
		if (!windowObj.is("window")) return

		if (!xButton.isHovering()) {
			if (curDraggin) {
				return
			}

			for (const window of get("window").reverse()) {
				// If mouse is pressed and mouse position is inside, we pick
				if (window.isMouseInRange()) {
					
					if (window.isMouseInClickingRange()) {
						mouse.grab();
						window.pick();
					}
					
					if (window.active == false) {
						wait(0.01, () => {
							deactivateAllWindows()
							window.activate()
						})
					}
					
					break;
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
		if (windowObj.active && curDraggin != windowObj && !(windowObj.is("extraWin") && curDraggin?.is("gridMiniButton"))) windowObj.close()
	})

	// activate
	deactivateAllWindows()
	windowObj.activate()

	// add content
	infoForWindows[windowKey].content(windowObj, windowKey)

	// animate it
	tween(0, 1, 0.32, (p) => windowObj.opacity = p, easings.easeOutQuint)
	tween(vec2(0.8), vec2(1), 0.32, (p) => windowObj.scale = p, easings.easeOutQuint)
	
	// manage the minibutton
	let correspondingMinibutton = get("minibutton").filter(minibutton => minibutton.windowKey === windowKey)[0]
	
	if (correspondingMinibutton != null) {
		correspondingMinibutton.window = windowObj
		if (!correspondingMinibutton.isHovering()) bop(correspondingMinibutton)
	}

	windowObj.on("close", () => {
		if (correspondingMinibutton != null) {
			correspondingMinibutton.window = null
			if (!correspondingMinibutton.isHovering()) bop(correspondingMinibutton)
		}
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

	// drawShadow() 
	let drawShadowEvent = onDraw(() => {
		drawSprite({
			sprite: windowObj.sprite,
			// width: windowObj.width,
			// height: windowObj.height,
			pos: vec2(windowObj.pos.x, windowObj.pos.y + 4),
			scale: windowObj.scale,
			anchor: windowObj.anchor,
			color: BLACK,
			opacity: 0.5,
		})
	})

	windowObj.on("close", () => {
		drawShadowEvent.cancel()
	})

	ROOT.trigger("winOpen", windowKey as windowKey)

	return windowObj;
}

export function emptyWinContent(winParent) {
	winParent.add([
		text(`THIS WINDOW IS EMPTY\nThis is the ${winParent.windowKey}`, {
			align: "center"
		}),
		anchor("center"),
	])
}
