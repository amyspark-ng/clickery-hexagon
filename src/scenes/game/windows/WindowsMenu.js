import { playSfx } from "../../../sound.js";
import { drag, curDraggin, setCurDraggin } from "../../../plugins/drag.js";
import { bop, mouse, percentage } from "../utils.js";
import { storeWinContent } from "./winStore.js";
import { hexagon } from "../addHexagon.js";
import { musicWinContent } from "./winMusic.js";
import { GameState } from "../../../GameState.js";

let infoForWindows = {};
export let isDragginWindow = false;
export let isHoveringWindow = false;

let folderObj;
let folded = true;

let miniButtons = [];
let buttonSpacing = 75;

export function deactivateAllWindows() {
	get("active").forEach(element => { element.deactivate() });
}

export function windowsDefinition() {
	infoForWindows = {
		"storeWin": { idx: 0, name: "storeWin", assetSize: vec2(384, 540), content: storeWinContent, lastPos: vec2(818, 280), hotkey: "1", color: rgb(24, 38, 94) },
		"musicWin": { idx: 1, name: "musicWin", assetSize: vec2(384, 540), content: musicWinContent, lastPos: vec2(208, 96), hotkey: "2", color: rgb(90, 33, 128) },
		"ascendWin": { idx: 2, name: "storeWin", assetSize: vec2(384, 540), content: emtpyWinContent, lastPos: vec2(center().x, center().y), hotkey: "3", color: WHITE },
		"statsWin": { idx: 3, name: "storeWin", assetSize: vec2(384, 540), content: emtpyWinContent, lastPos: vec2(center().x, center().y), hotkey: "4", color: WHITE },
		"medalsWin": { idx: 4, name: "storeWin", assetSize: vec2(384, 540), content: emtpyWinContent, lastPos: vec2(center().x, center().y), hotkey: "5", color: WHITE },
		"aboutWin": { idx: 5, name: "aboutWin", assetSize: vec2(384, 540), content: emtpyWinContent, lastPos: vec2(center().x, center().y), hotkey: "6", color: RED },
	}
}

export function addMinibutton(i, xPosition) {
	let unlocked = true
	let quad;
	getSprite("bean").then(quady => {
		quad = quady
	})
	
	let miniButton = add([
		sprite("bean"),
		pos(folderObj.pos.x, folderObj.pos.y),
		anchor("center"),
		color(unlocked ? infoForWindows[Object.keys(infoForWindows)[i]].color : WHITE),
		area({ scale: vec2(0) }),
		scale(),
		z(folderObj.z - 1),
		unlocked ? "hoverObj" : "",
		"minibutton",
		{
			idx: i,
			verPosition: folderObj.pos.y,
			defScale: vec2(1),
			window: unlocked ? get(`${Object.keys(infoForWindows)[i]}`, { recursive: true })[0] ? get(`${Object.keys(infoForWindows)[i]}`, { recursive: true })[0] : null : undefined,
			windowInfo: infoForWindows[Object.keys(infoForWindows)[i]],
			whiteness: 0,
			// for these 2 it will do yPos even if locked
			startHover() {
				if (isHoveringWindow) return
				tween(miniButton.pos.y, miniButton.verPosition - 5, 0.32, (p) => miniButton.pos.y = p, easings.easeOutQuint)
				if (!unlocked) return
				playSfx("hoverMiniButton", 100 * miniButton.windowInfo.idx / 4)
				tween(miniButton.scale, vec2(1.05), 0.32, (p) => miniButton.scale = p, easings.easeOutQuint)
				miniButton.defScale = vec2(1.05)
			},

			endHover() {
				if (isHoveringWindow) return
				tween(miniButton.pos.y, miniButton.verPosition, 0.32, (p) => miniButton.pos.y = p, easings.easeOutQuint)
				if (!unlocked) return
				tween(miniButton.angle, 0, 0.32, (p) => miniButton.angle = p, easings.easeOutQuint)
				tween(miniButton.scale, vec2(1), 0.32, (p) => miniButton.scale = p, easings.easeOutQuint)
				miniButton.defScale = vec2(1.05)
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
					let theWindow = openWindow(button.windowInfo.name)
					button.window = theWindow
				}
			},

			update() {
				if (!unlocked) return
				if (this.isHovering() && !isHoveringWindow && !folded) {
					// animate it spinning it
					this.angle = wave(-9, 9, time() * 3)
				}

				if (this.window != null) this.whiteness = wave(0.01, 0.1, (time() * 3))
				else this.whiteness = 0
			}
		}
	])

	// animate them
	tween(miniButton.pos.x, xPosition, 0.32, (p) => miniButton.pos.x = p, easings.easeOutQuint).then(() => {
		miniButton.area.scale = vec2(1.2)
	})

	miniButton.use(shader("saturate", () => ({
		"whiteness": miniButton.whiteness,
		"u_pos": vec2(quad.x, quad.y),
		"u_size": vec2(quad.w, quad.h),
	})))

	miniButton.onHover(() => {
		// if unfolded will nto run
		if (!folded) {
			miniButton.startHover()
		}
	})
	
	miniButton.onHoverEnd(() => {
		// if unfolded will nto run
		if (!folded) {
			miniButton.endHover()
		}
	})

	miniButton.onClick(() => {
		if(!unlocked) return
		miniButton.manageRespectiveWindow(miniButton)
		bop(miniButton)
	})

	miniButtons[i] = miniButton
	return miniButton;
}

export function openWindow(name = "") {
	playSfx("openWin", rand(0.8, 1.2))

	let windowObj = add([
		sprite(name),
		pos(infoForWindows[name].lastPos),
		anchor("center"),
		opacity(0),
		scale(0.8),
		z(10),
		drag(),
		area(),
		"window",
		`${name}`,
		{
			idx: infoForWindows[name].idx,
			miniButton: miniButtons[infoForWindows[name].idx],
			dragging: false,
			close() {
				this.unuse("window")
				this.unuse("active")
				tween(this.scale, vec2(0.9), 0.32, (p) => this.scale = p, easings.easeOutQuint)
				tween(this.opacity, 0, 0.32, (p) => this.opacity = p, easings.easeOutQuint).then(() => {
					// destroying it doesn't trigger onHoverEnd
					destroy(this)
				})

				folderObj.trigger("winClose")
				this.removeAll()
				playSfx("closeWin", rand(0.8, 1.2))

				infoForWindows[name].lastPos = this.pos
				this.miniButton.window = null	
			},

			activate() {
				this.use("active")

				this.opacity = 1
				this.children.forEach(element => {
					element.opacity = 1
				});
			},

			deactivate() {
				this.unuse("active")
				
				this.opacity = 0.8
				this.children.forEach(element => {
					element.opacity = 0.8
				});
			},

			isMouseInClickingRange() {
				return (mousePos().y >= windowObj.pos.y - windowObj.height / 2) && mousePos().y <= (windowObj.pos.y - windowObj.height / 2) + 30
			},

			update() {
				if (isMousePressed("left") && !xButton.isHovering()) {
					if (curDraggin) {
						return
					}
	
					// Loop all "bean"s in reverse, so we pick the topmost one
					for (const pickedWindow of get("drag").reverse()) {
						if (pickedWindow.isHovering()) {
							// grab it!
							if (pickedWindow.isMouseInClickingRange()) {
								mouse.grab()
								pickedWindow.pick()
								deactivateAllWindows()
								pickedWindow.activate()
								break
							}

							// since the code above has a break, this below won't run if that is true
							// if it's not in range, makes it actie, but doesn't grab it
							deactivateAllWindows()
							pickedWindow.activate()
						}
					}
				}

				else if (isMouseReleased("left")) {
					if (curDraggin) {
						curDraggin.trigger("dragEnd")
						setCurDraggin(null)
						mouse.release()
					}
				}
			}
		}
	])

	let xButton = windowObj.add([
		text("X"),
		color(WHITE),
		pos(-windowObj.width / 2, -windowObj.height / 2),
		z(windowObj.z + 1),
		area({ scale: vec2(1.2) }),
		"xButton",
		"hoverObj",
	])

	xButton.pos.x += windowObj.width - xButton.width - 5

	xButton.onHover(() => {
		xButton.color = RED
	})

	xButton.onHoverEnd(() => {
		xButton.color = WHITE
	})

	xButton.onClick(() => {
		if (get("window").length == 1) {
			folderObj.fold()
		}
		windowObj.close()
		mouse.play("cursor")
	})

	windowObj.onHover(() => {
		if (hexagon.isHovering()) {
			hexagon.endHover()
		}

		get("minibutton").forEach(minibuttonHoverEndCheck => {
			if (minibuttonHoverEndCheck.isHovering()) {
				minibuttonHoverEndCheck.endHover()
			}
		});

		mouse.play("cursor")
	})

	windowObj.onHoverEnd(() => {
		if (hexagon.isHovering()) {
			hexagon.startHover()
		}

		get("minibutton").forEach(minibuttonHoverEndCheck => {
			if (minibuttonHoverEndCheck.isHovering()) {
				minibuttonHoverEndCheck.startHover()
			}
		});
	})

	windowObj.onDrag(() => {
		// Remove the object and re-add it, so it'll be drawn on top
		readd(windowObj)
		windowObj.dragging = true
	})
	
	windowObj.onDragEnd(() => {
		mouse.play("cursor")
		windowObj.dragging = false
	})

	// activate
	deactivateAllWindows()
	windowObj.activate()

	// add content
	windowObj.add(infoForWindows[name].content(windowObj)) // searches for name storeWin and adds storeWinContent

	// animate it
	tween(windowObj.opacity, 1, 0.32, (p) => windowObj.opacity = p, easings.easeOutQuint)
	tween(windowObj.scale, vec2(1), 0.32, (p) => windowObj.scale = p, easings.easeOutQuint)
	
	return windowObj;
}

export function folderObjManaging() {
	onMousePress("middle", () => {
		unlockWindow("storeWin")
	})

	onKeyPress("h", () => {
		unlockWindow("musicWin")
	})

	folderObj = add([
		text("<"),
		pos(width() - 25, height() - 50),
		scale(2),
		area({ scale: vec2(2) }),
		z(4),
		anchor("center"),
		"hoverObj",
		"foldButton",
		{
			defScale: vec2(2),
			unfold() {
				folded = false

				// Sort the unlockedWindows array based on the order in infoForWindows
				GameState.unlockedWindows.sort((a, b) => infoForWindows[a].idx - infoForWindows[b].idx);

				// Initial x position for the buttons
				let initialX = folderObj.pos.x;

				// Iterate over the sorted unlockedWindows array to create buttons
				GameState.unlockedWindows.forEach((key, index) => {
					let xPos = initialX - buttonSpacing * index - 75;
					let i = infoForWindows[key].idx;
					addMinibutton(i, xPos);
				});
				
				playSfx("fold", rand(-50, 50))
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
				// is folded, should unfold
				if (folded) {
					folderObj.unfold()
				}
				// is unfolded, should fold
				else {
					folderObj.fold()
				}
			},

			update() {
				if (isKeyPressed("space") || (isMousePressed("left") && this.isHovering())) {
					if (isHoveringWindow) return
					this.manageFold()
					bop(this)
				}
			}
		}
	])

	// this HAS to exist because if not how can you tell the hotkey was being pressed if the object doesn't exist
	folderObj.onCharInput((key) => {
		// checks for all windowsinfo if the key pressed coincides with any of the hotkeys
		Object.keys(infoForWindows).forEach(hotWindowInfo => {
			// coincides to one	of the hotkeys
			if (key == infoForWindows[hotWindowInfo].hotkey) {
				// there's only one window open
				if (folded) folderObj.unfold()
				if (get("window").length == 1 && key == get("window")[0].miniButton.windowInfo.hotkey) {
					// if the key is the same as the window open, i should fold it
					if (!folded) folderObj.fold()
				}

				// manages the window and boops the button
				miniButtons[infoForWindows[hotWindowInfo].idx].manageRespectiveWindow(miniButtons[infoForWindows[hotWindowInfo].idx])
				bop(miniButtons[infoForWindows[hotWindowInfo].idx])
			}
		});
	})

	folderObj.on("winClose", () => {
		isHoveringWindow = get("window", { recursive: true }).some((window) => window.isHovering())
		wait(0.05, () => {
			// gets the topmost window
			let allWindows = get("window", { recursive: true })
			if (allWindows.length > 0) allWindows[clamp(allWindows.length - 1, 0, allWindows.length)].activate()
		})
	})

	folderObj.on("winUnlock", () => {
		// folderObj.fold()
	})

	// folderObj.onHover(() => {
	// 	debug.log(folderObj.folded)
	// })
	
	folderObj.onUpdate(() => {
		if (!get("window").length > 0) return
		// if any window is being hovered on
		get("window").some((window) => {
			isHoveringWindow = window.isHovering()
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
		debug.log("PASS A VALID KEY, DUH")
	}
}
