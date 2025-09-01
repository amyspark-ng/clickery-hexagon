import { bop, getPositionOfSide, swap } from "../../utils.ts";
import { mouse } from "../../additives.ts";
import { curDraggin, drag, setCurDraggin } from "../.././plugins/drag.ts";
import { playSfx } from "../../../sound.ts";
import { folderObj } from "./folderObj.ts";

// window contents
import { storeWinContent } from "../store/storeWin.ts";
import { musicWinContent } from "../musicWindow.ts";
import { settingsWinContent } from "../settings/settingsWin.ts";
import { ascendWinContent } from "../ascendWin.ts";
import { extraWinContent } from "../extraWin.ts";
import { creditsWinContent } from "../creditsWin.ts";
import { statsWinContent } from "../statsWin.ts";
import { medalsWinContent } from "../medalsWin.ts";
import { hexColorWinContent } from "../color/hexColorWin.ts";
import { bgColorWinContent } from "../color/bgColorWin.ts";
import { leaderboardsWinContent } from "../leaderboardsWin.ts";
import { hoverController } from "../../../hoverManaging.ts";

export let infoForWindows = {};

export let allObjWindows = {
	isHoveringAWindow: false,
	isDraggingAWindow: false,
};

export const buttonSpacing = 75;

export function deactivateAllWindows() {
	get("window").filter(window => window.active == true).forEach(element => {
		element.deactivate();
	});
}

export function manageWindow(windowKey) {
	if (!infoForWindows.hasOwnProperty(windowKey)) throw new Error("No such window for: " + windowKey);

	let maybeWindow = get(windowKey).filter(obj => !obj.is("minibutton"))[0];
	// if window even exists in the first place (not a button)
	if (maybeWindow) {
		// if it isn't it means that it's being closed
		if (maybeWindow.is("window")) {
			maybeWindow.close();
		}
	}
	else {
		maybeWindow = openWindow(windowKey);
	}

	return maybeWindow;
}

export function windowsDefinition() {
	infoForWindows = {
		"storeWin": { idx: 0, content: storeWinContent, lastPos: vec2(264, 285) },
		"musicWin": { idx: 1, content: musicWinContent, lastPos: vec2(208, 96) },
		"ascendWin": { idx: 2, content: ascendWinContent, lastPos: vec2(center().x, center().y) },
		"statsWin": { idx: 3, content: statsWinContent, lastPos: vec2(center().x, center().y) },
		"medalsWin": { idx: 4, content: medalsWinContent, lastPos: vec2(center().x, center().y) },
		"creditsWin": { idx: 5, content: creditsWinContent, lastPos: vec2(center().x, center().y) },
		"settingsWin": { idx: 6, content: settingsWinContent, lastPos: vec2(center().x, center().y) },
		"leaderboardsWin": { idx: 7, content: leaderboardsWinContent, lastPos: vec2(center().x, center().y) },
		"hexColorWin": { idx: 8, content: hexColorWinContent, lastPos: vec2(208, 160) },
		"bgColorWin": { idx: 9, content: bgColorWinContent, lastPos: vec2(width() - 200, 200) },
		"extraWin": { idx: 10, icon: "extra", content: extraWinContent, lastPos: vec2(750, 392) },
	};

	return infoForWindows;
}

export type windowKey =
	| "storeWin"
	| "musicWin"
	| "ascendWin"
	| "statsWin"
	| "medalsWin"
	| "aboutWin"
	| "creditsWin"
	| "settingsWin"
	| "leaderboardsWin"
	| "hexColorWin"
	| "bgColorWin"
	| "extraWin";

export function isWindowOpen(windowKey: windowKey) {
	return get(windowKey).filter(obj => obj.is("window")).length > 0;
}

/**
 * Creates a new property in the windowObj that holds this
 */
export function addXButton(windowParent: WindowGameObj) {
	let xButton = windowParent.add([
		sprite("xButton"),
		color(WHITE),
		pos(),
		anchor("center"),
		hoverController(),
		z(windowParent.z + 1),
		area({ scale: vec2(1.8, 1.1) }),
		"xButton",
		"ignorepoint",
		{
			add() {
				// can't use getPositionOfSide because it will be root and not relative to windowParent
				let offset = vec2(-18, 23);
				this.pos.x += windowParent.width / 2;
				this.pos.y -= windowParent.height / 2;
				this.pos = this.pos.add(offset);
			},
		},
	]);

	xButton.onHover(() => {
		xButton.color = RED;
	});

	xButton.onHoverEnd(() => {
		xButton.color = WHITE;
	});

	xButton.onClick(() => {
		if (!windowParent.active) {
			// if it's not dragging a window AND a window that is not this one is being hovered
			if (!get("window").some(window => window.isHovering() && window != windowParent)) {
				windowParent.close();
			}
		}
		else windowParent.close();
	});

	return xButton;
}

export function openWindow(windowKey: windowKey) {
	if (!infoForWindows.hasOwnProperty(windowKey)) throw new Error(`No such window for: ${windowKey}`);

	playSfx("openWin");

	let windowObj = add([
		sprite(getSprite(windowKey) ? windowKey : "dumbTestWin"),
		pos(infoForWindows[windowKey].lastPos),
		anchor("center"),
		opacity(1),
		scale(1),
		layer("windows"),
		z(0),
		drag(),
		area({ scale: vec2(1, 1) }),
		timer(),
		color(),
		hoverController(10),
		"window",
		"ignorepoint",
		`${windowKey}`,
		{
			idx: infoForWindows[windowKey].idx as number,
			windowKey: windowKey,
			active: true,
			xButton: null,
			canClose: true,
			close() {
				this.trigger("close");
				this.removeAll();
				this.unuse("window");
				this.active = false;
				playSfx("closeWin");

				tween(this.scale, vec2(0.9), 0.32, (p) => this.scale = p, easings.easeOutQuint);
				tween(this.opacity, 0, 0.32, (p) => this.opacity = p, easings.easeOutQuint).then(() => {
					// destroying it doesn't trigger onHoverEnd
					destroy(this);
				});

				folderObj.trigger("winClose");

				infoForWindows[windowKey].lastPos = this.pos;
			},

			releaseDrop() {
				if (curDraggin && curDraggin == this) {
					curDraggin.drop();
				}
			},

			activate() {
				this.active = true;
				this.trigger("activate");

				const highestWindow = get("window").sort((a, b) => b.z - a.z)[0];
				swap(this, "z", highestWindow, "z");

				if (this.is("shader")) {
					this.unuse("shader");
					this.get("*", { recursive: true }).forEach((obj) => {
						obj.unuse("shader");
					});
				}
			},

			deactivate() {
				this.active = false;
				this.trigger("deactivate");

				if (!this.is("shader")) {
					this.use(shader("grayscale"));
					this.get("*", { recursive: true }).forEach((obj) => {
						obj.use(shader("grayscale"));
					});
				}
			},

			isMouseInClickingRange() {
				let condition = (mouse.pos.y >= getPositionOfSide(this).top)
					&& (mouse.pos.y <= getPositionOfSide(this).top + 35);
				return condition;
			},

			isMouseInRange() {
				return this.hasPoint(mouse.pos);
			},
		},
	]);

	// sets highestnest and priority
	const highestWindow = get("window").sort((a, b) => b.z - a.z)[0] ?? { z: 0 };
	windowObj.z = highestWindow.z + 1;
	windowObj.clickIndex = 10 + windowObj.z;

	infoForWindows[windowKey].lastPos.x = clamp(infoForWindows[windowKey].lastPos.x, 196, 827);
	infoForWindows[windowKey].lastPos.y = clamp(infoForWindows[windowKey].lastPos.y, height() - windowObj.height / 2, -windowObj.height / 2);
	windowObj.pos = infoForWindows[windowKey].lastPos;

	windowObj.xButton = addXButton(windowObj);

	windowObj.onUpdate(() => {
		windowObj.pos.x = clamp(windowObj.pos.x, -151, 1180);
		windowObj.pos.y = clamp(windowObj.pos.y, windowObj.height / 2, height() + (windowObj.height / 2) - 36);
	});

	windowObj.onClick(() => {
		// if has been closed don't do anything
		if (!windowObj.is("window")) return;

		if (!windowObj.xButton.isHovering()) {
			if (curDraggin) {
				return;
			}

			for (const window of get("window").reverse()) {
				// If mouse is pressed and mouse position is inside, we pick
				if (window.isMouseInRange()) {
					if (window.isMouseInClickingRange()) {
						window.pick();
					}

					if (window.active == false) {
						wait(0.01, () => {
							deactivateAllWindows();
							window.activate();
						});
					}

					break;
				}
			}
		}
	});

	windowObj.onMouseRelease(() => {
		if (windowObj.dragging) windowObj.releaseDrop();
	});

	windowObj.onKeyPress("escape", () => {
		// if window is active and (window isn't an extra window and curDragging isn't gridMinibutton)
		// can't close if is extra window and is dragging a button
		if (windowObj.canClose == true && windowObj.active && curDraggin != windowObj && !(windowObj.is("extraWin") && curDraggin?.is("gridMiniButton"))) windowObj.close();
	});

	// activate
	deactivateAllWindows();
	windowObj.activate();

	// add content
	infoForWindows[windowKey].content(windowObj, windowKey);

	// animate it
	tween(0, 1, 0.32, (p) => windowObj.opacity = p, easings.easeOutQuint);
	tween(vec2(0.8), vec2(1), 0.32, (p) => windowObj.scale = p, easings.easeOutQuint);

	// manage the minibutton
	let correspondingMinibutton = get("minibutton").filter(minibutton => minibutton.windowKey === windowKey)[0];

	if (correspondingMinibutton != null) {
		correspondingMinibutton.window = windowObj;
		if (!correspondingMinibutton.isHovering()) bop(correspondingMinibutton);
	}

	windowObj.on("close", () => {
		if (correspondingMinibutton != null) {
			correspondingMinibutton.window = null;
			if (!correspondingMinibutton.isHovering()) bop(correspondingMinibutton);
		}
	});

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
		});
	});

	windowObj.on("close", () => {
		drawShadowEvent.cancel();
	});

	getTreeRoot().trigger("winOpen", windowKey as windowKey);

	return windowObj;
}

export type WindowGameObj = ReturnType<typeof openWindow>;

export function emptyWinContent(winParent: WindowGameObj) {
	winParent.add([
		text(`THIS WINDOW IS EMPTY\nThis is the ${winParent.windowKey}`, {
			align: "center",
		}),
		anchor("center"),
	]);
}
