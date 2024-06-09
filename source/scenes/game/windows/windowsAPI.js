import { GameState } from "../../../gamestate.js";
import { bop, getSides, mouse } from "../utils.js";
import { drag, curDraggin, setCurDraggin } from "../../../plugins/drag.js";
import { playSfx } from "../../../sound.js";
// window contents
import { storeWinContent } from "./store/storeWindows.js";
import { musicWinContent, setTimeSinceSkip, timeSinceSkip } from "./musicWindow.js";
import { colorWinContent } from "./colorWindow.js";
import { settingsWinContent } from "./settingsWindow.js";
import { ascendWinContent } from "./ascendWindow.js";

let infoForWindows = {};
export let isGenerallyHoveringAWindow = false;
export let isPreciselyHoveringAWindow = false;
export let isInClickingRangeOfAWindow = false;
export let isDraggingAWindow = false;

let folderObj;
let folded = true;
let timeSinceFold = 0;

let miniButtons = [];
let buttonSpacing = 75;

export function deactivateAllWindows() {
	get("active").forEach(element => { element.deactivate() });
}

export function manageWindow(windowKey) {
	if (infoForWindows.hasOwnProperty(windowKey)) {
		let maybeWindow = get(windowKey)[0]
		// if window even exists in the first place
		if (maybeWindow) {
			// if it isn't it means that it's being closed
			if (maybeWindow.is("window")) {
				maybeWindow.close()
			}
		}
		else {
			openWindow(windowKey)
		}
	}
	else throw new Error("Window not found: " + windowKey);
}

export function windowsStuff() {
	// spriteName is the actual window it will open
	// hotkey should be the one in taskbar corresponding to the placement
	infoForWindows = {
		"storeWin": { idx: 0, spriteName: "storeWin", icon: "store", content: storeWinContent, lastPos: vec2(818, 280), hotkey: "1", color: rgb(24, 38, 94), showable: true, },
		"musicWin": { idx: 1, spriteName: "musicWin", icon: "music", content: musicWinContent, lastPos: vec2(208, 96), hotkey: "2", color: rgb(90, 33, 128), showable: true },
		"ascendWin": { idx: 2, spriteName: "ascendWin", icon: "ascend", content: ascendWinContent, lastPos: vec2(center().x, center().y), hotkey: "3", color: WHITE, showable: true },
		"statsWin": { idx: 3, spriteName: "storeWin", icon: "stats", content: emtpyWinContent, lastPos: vec2(center().x, center().y), hotkey: "4", color: WHITE, showable: true },
		"medalsWin": { idx: 4, spriteName: "storeWin", icon: "achievements", content: emtpyWinContent, lastPos: vec2(center().x, center().y), hotkey: "5", color: WHITE, showable: true },
		"aboutWin": { idx: 5, spriteName: "aboutWin", icon: "about", content: emtpyWinContent, lastPos: vec2(center().x, center().y), hotkey: "6", color: RED, showable: true },
		"creditsWin": { idx: 6, spriteName: "creditsWin", icon: "about", content: emtpyWinContent, lastPos: vec2(center().x, center().y), hotkey: "6", color: RED, showable: true },
		"settingsWin": { idx: 7, spriteName: "settingsWin", icon: "settings", content: settingsWinContent, lastPos: vec2(center().x, center().y), hotkey: "6", color: RED, showable: true },
		"hexColorWin": { idx: 8, spriteName: "hexColorWin", icon: "store", content: colorWinContent, lastPos: vec2(208, 160), hotkey: null, color: WHITE, showable: false },
		"bgColorWin": { idx: 9, spriteName: "bgColorWin", icon: "store", content: colorWinContent, lastPos: vec2(1024 - 200, 200), hotkey: null, color: WHITE, showable: false },
	}
}

export function addMinibutton(i, xPosition) {
	let quad;
	getSprite("bean").then(quady => {
		quad = quady
	})
	
	let miniButton = add([
		sprite(`icon_${infoForWindows[Object.keys(infoForWindows)[i]].icon}`, {
			anim: "default"
		}),
		pos(folderObj.pos.x, folderObj.pos.y),
		anchor("center"),
		area({ scale: vec2(0) }),
		scale(1),
		rotate(0),
		z(folderObj.z - 1),
		"hover_outsideWindow",
		"minibutton",
		{
			idx: i,
			verPosition: folderObj.pos.y,
			defaultScale: vec2(1),
			window: get(`${Object.keys(infoForWindows)[i]}`, { recursive: true })[0],
			windowInfo: infoForWindows[Object.keys(infoForWindows)[i]],
			whiteness: 0,
			// for these 2 it will do yPos even if locked
			startHover() {
				if (isDraggingAWindow) return
				tween(miniButton.pos.y, miniButton.verPosition - 5, 0.32, (p) => miniButton.pos.y = p, easings.easeOutQuint)
				tween(miniButton.scale, vec2(1.05), 0.32, (p) => miniButton.scale = p, easings.easeOutQuint)
				this.defaultScale = vec2(1.05)
				this.play("hover")
			},

			endHover() {
				if (isDraggingAWindow) return
				tween(miniButton.pos.y, miniButton.verPosition, 0.32, (p) => miniButton.pos.y = p, easings.easeOutQuint)
				tween(miniButton.angle, 0, 0.32, (p) => miniButton.angle = p, easings.easeOutQuint)
				tween(miniButton.scale, vec2(1), 0.32, (p) => miniButton.scale = p, easings.easeOutQuint)
				miniButton.defaultScale = vec2(1.05)
				this.play("default")
			},
			
			manageRespectiveWindow(button = this) {
				// has a window already opened
				if (button.window != null) {
					button.window.close()
					button.window = null
				}

				// will have window 
				else {
					// hasn't open it
					let theWindow = openWindow(button.windowInfo.spriteName)
					button.window = theWindow
				}
			},

			update() {
				if (this.isHovering() && !isPreciselyHoveringAWindow && !isDraggingAWindow && !folded) {
					// animate it spinning it
					this.angle = wave(-9, 9, time() * 3)
				}

				if (this.window != null) {
					this.whiteness = wave(0.01, 0.1, (time() * 3))
				}

				else {
					this.whiteness = 0
				}

				if (miniButton.pos.x < folderObj.pos.x - buttonSpacing + 10) {
					miniButton.area.scale = vec2(0.75, 1)
					miniButton.area.offset = vec2(2, 4)
				}
				
				else {
					miniButton.area.scale = vec2(0)
				}
			}
		}
	])

	// animate them
	tween(miniButton.pos.x, xPosition, 0.32, (p) => miniButton.pos.x = p, easings.easeOutQuint).then(() => {
		if (timeSinceFold < 0.25) return
	})

	miniButton.use(shader("saturate", () => ({
		"whiteness": miniButton.whiteness,
		"u_pos": vec2(quad.x, quad.y),
		"u_size": vec2(quad.w, quad.h),
	})))

	miniButton.onHover(() => {
		if (!isGenerallyHoveringAWindow && !isDraggingAWindow) {
			miniButton.startHover()
			playSfx("hoverMiniButton", 100 * miniButton.windowInfo.idx / 4)
		}
	})

	miniButton.onHoverEnd(() => {
		if (isDraggingAWindow) return
		if (!isPreciselyHoveringAWindow) {
			miniButton.endHover()
		}
	})

	miniButton.onClick(() => {
		if (isPreciselyHoveringAWindow || isDraggingAWindow) return
		miniButton.manageRespectiveWindow(miniButton)
		bop(miniButton)
	})

	miniButtons[i] = miniButton
	return miniButton;
}

export function openWindow(windowKey = "") {
	playSfx("openWin", rand(0.8, 1.2))

	let windowObj = add([
		sprite(windowKey ? windowKey : "storeWin"),
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
			miniButton: infoForWindows[windowKey].showable ? miniButtons[infoForWindows[windowKey].idx] : null,
			showable: infoForWindows[windowKey].showable,
			close() {
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
				if (!this.showable || folded || !GameState.unlockedWindows.includes(windowKey)) return
				this.miniButton.window = null
			},

			activate() {
				this.use("active")

				this.color = this.defColor
				windowObj.get("*", { recursive: true }).forEach((element) => {
					element.color = element.defColor
				});
			},

			deactivate() {
				this.unuse("active")

				this.color = this.defColor.darken(150)
				windowObj.get("*", { recursive: true }).forEach((element) => {
					element.color = element.defColor.darken(150)
				});
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
			if (windowObj.showable) {
				if (get("window").length == 0) {
					folderObj.fold()
				}
			}
		}
	})

	windowObj.onHover(() => {
		get("hover_outsideWindow").forEach(hoverObj => {
			if (hoverObj.isHovering() && hoverObj.endHover) {
				hoverObj.endHover()
			}
		})

		// check if hovering any window button, if it it's not start pointing, if yes don't point
		if (!isDraggingAWindow && !xButton.isHovering()) mouse.play("cursor")
	})

	windowObj.onHoverEnd(() => {
		get("hover_outsideWindow").forEach(hoverObj => {
			if (hoverObj.isHovering() && hoverObj.startHover) {
				hoverObj.startHover()
				mouse.play("point")
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
		if (curDraggin) {
			curDraggin.trigger("dragEnd")
			setCurDraggin(null)
			mouse.releaseAndPlay("cursor")
		}
	})

	windowObj.onKeyPress("escape", () => {
		if (windowObj.is("active")) windowObj.close()
	})

	// activate
	deactivateAllWindows()
	windowObj.activate()

	// add content
	windowObj.add(infoForWindows[windowKey].content(windowObj, windowKey))
	// searches for the key

	windowObj.defColor = WHITE
	windowObj.get("*", { recursive: true }).forEach((element) => {
		if (!element.color) element.use(color())
		element.defColor = element.color
	})

	// animate it
	tween(windowObj.opacity, 1, 0.32, (p) => windowObj.opacity = p, easings.easeOutQuint)
	tween(windowObj.scale, vec2(1), 0.32, (p) => windowObj.scale = p, easings.easeOutQuint)
	
	return windowObj;
}

export function folderObjManaging() {
	// onMousePress("middle", () => {
	// 	unlockWindow("storeWin")
	// })
	onKeyPress("h", () => {
		unlockWindow("musicWin")
	})

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
			unfold() {
				GameState.unlockedWindows = ["settingsWin", "aboutWin", "storeWin", "musicWin", "ascendWin", "statsWin"],
				folded = false
				timeSinceFold = 0
				playSfx("fold", rand(-50, 50))

				// Sort the unlockedWindows array based on the order in infoForWindows
				GameState.unlockedWindows.sort((a, b) => infoForWindows[a].idx - infoForWindows[b].idx);

				// Initial x position for the buttons
				let initialX = folderObj.pos.x;
				
				// Iterate over the sorted unlockedWindows array to create buttons
				// There are already minibutto
				if (get("minibutton").length > 0) {
					get("miniButton").forEach((miniButton, index) => {
						let xPos = initialX - buttonSpacing * index - 75;
						tween(miniButton.pos.x, xPos, 0.32, (p) => miniButton.pos.x = p, easings.easeOutQuint)
					})
				}

				// There are not, create them
				else {
					GameState.unlockedWindows.forEach((key, index) => {
						if (!infoForWindows[key].showable) return;
						let xPos = initialX - buttonSpacing * index - 75;
						let i = infoForWindows[key].idx;
						addMinibutton(i, xPos);
					});
				}
			},
			
			fold() {
				folded = true
				
				get("minibutton").forEach(miniButtonFoldTween => {
					miniButtonFoldTween.area.scale = vec2(0)
					tween(miniButtonFoldTween.pos.x, folderObj.pos.x, 0.32, (p) => miniButtonFoldTween.pos.x = p, easings.easeOutQuint).then(() => {
						destroy(miniButtonFoldTween)
					})
				});

				playSfx("fold", rand(-75, -100))
			},

			manageFold() {
				if (folded) {
					folderObj.unfold()
				}
				else {
					folderObj.fold()
				}
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
	folderObj.onCharInput((key) => {
		// checks for all windowsinfo if the key pressed coincides with any of the hotkeys
		Object.keys(infoForWindows).forEach(hotWindowInfo => {
			// coincides to one	of the hotkeys
			if (key == infoForWindows[hotWindowInfo].hotkey) {
				// if unlockedwindows contains that window corresponding to the hotkey
				if (GameState.unlockedWindows.includes(hotWindowInfo)) {
				if (folded) folderObj.unfold()
					if (get("window").length == 1) {
						if (infoForWindows[Object.keys(infoForWindows)[get("window")[0].idx]].showable) {
							if (key == get("window")[0].miniButton.windowInfo.hotkey) {
								if (!folded) folderObj.fold()
							}
						}
					}
					
					// manages the window and boops the button
					miniButtons[infoForWindows[hotWindowInfo].idx].manageRespectiveWindow(miniButtons[infoForWindows[hotWindowInfo].idx])
					bop(miniButtons[infoForWindows[hotWindowInfo].idx])
				}
			}
		});
	})

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

export function emtpyWinContent() {

}

function calculateButtonPosition(index, folderObjX, buttonSpacing = 75) {
    return folderObjX - buttonSpacing * (index + 1);
}

export function unlockWindow(key) {
	// if already unlocked
	if (GameState.unlockedWindows.includes(key)) return
	
	// hasn't
	GameState.unlockedWindows.push(key)
	folderObj.trigger("winUnlock")
	play("hoverhex")

	// if valid key
	if (infoForWindows.hasOwnProperty(key)) {
		// if unfolded do cool animation, i hate you player/perfectionism
		if (!folded) {
			// Check if the windowKey exists in the infoForWindows object
			// Sort the unlocked windows based on their idx values
			GameState.unlockedWindows.sort((a, b) => infoForWindows[a].idx - infoForWindows[b].idx);
	
			// Calculate positions and animate buttons
			GameState.unlockedWindows.forEach((key, index) => {
				let buttonIdx = infoForWindows[key].idx;
				let newXPos = calculateButtonPosition(index, folderObj.pos.x, buttonSpacing);
	
				// If the button already exists, move it to the new position
				if (miniButtons[buttonIdx]) {
					let button = miniButtons[buttonIdx];
					tween(button.pos.x, newXPos, 0.32, (p) => button.pos.x = p, easings.easeOutQuint);
				} 
				
				else {
					// Add the new minibutton
					addMinibutton(buttonIdx, newXPos);
				}
			});
		}
	}

	// dummy
	else {
		throw new Error("Window not found: " + key);
	}
}
