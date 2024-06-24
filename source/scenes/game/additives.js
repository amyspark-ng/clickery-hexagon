import { GameState } from "../../gamestate"
import { curDraggin } from "../../plugins/drag"
import { playSfx } from "../../sound"
import { hexagon } from "./hexagon"
import { scoreText } from "./uicounters"
import { arrayToColor, blendColors, getPositionOfSide, getZBetween } from "./utils"
import { isDraggingAWindow, isPreciselyHoveringAWindow, manageWindow } from "./windows/windows-api/windowsAPI"

export let gameBg;
export function addBackground() {
	gameBg = add([
		rect(width(), height()),
		pos(center()),
		anchor("center"),
		scale(8),
		color(arrayToColor(GameState.settings.bgColor)),
		z(-1),
		stay(),
		{
			speed: 0.1,
			movAngle: 5,
			uScale: 2,
			col1D: rgb(128, 128, 128),
			col2D: rgb(190, 190, 190),
			update() {
				if (isMousePressed("right")) {
					// doesn't check for hovering this because you will always be hovering it lol
					if (!hexagon?.isHovering() && !get("folderObj")[0]?.isHovering() && !get("minibutton")[0]?.isHovering() && !get("window")[0]?.isHovering() && !isDraggingAWindow) {
						manageWindow("bgColorWin")
					}
				}
			}
		}
	])

	gameBg.color.a = GameState.settings.bgColor[3]
	gameBg.use(shader("checkeredBg", () => ({
		"u_time": time() / 10,
		"u_color1": blendColors(gameBg.col1D, gameBg.color, gameBg.color.a),
		"u_color2": blendColors(gameBg.col2D, gameBg.color, gameBg.color.a),
		"u_speed": vec2(-1, 2).scale(gameBg.speed),
		"u_angle": gameBg.movAngle,
		"u_scale": gameBg.uScale,
		"u_aspect": width() / height()
	})))
}

export let mouse;
export function addMouse() {
	mouse = add([
		sprite("cursors"),
		pos(mousePos()),
		scale(0.8),
		color(WHITE),
		stay(),
		anchor(vec2(-0.5, -0.65)),
		fixed(),
		z(100),
		{
			intro: false,
			speed: 5000, // 5000 is the optimal for actual mouse movement
			grabbing: false,
			grab() {
				this.grabbing = true
				mouse.play("grab")
			},

			releaseAndPlay(newAnim = "cursor") {
				this.grabbing = false
				mouse.play(newAnim)
			},

			pinch() {
				// debug.log("pinch")
				// for (let i = 0; i < 1; i++) {
				// 	let circ = add([
				// 		circle(1),
				// 		scale(0),
				// 		anchor("center"),
				// 		pos(this.pos),
				// 		// rotate(90 * (i + 1)),
				// 	])
				// 	tween(circ.radius, 20, 0.1, (p) => circ.radius = p, easings.easeOutQuint)
				// }
			},
			
			update() {
				this.pos = mousePos()
			}
		}
	])

	onHover("xButton", () => {
		mouse.play("point")
	})

	onHoverEnd("xButton", () => {
		mouse.play("cursor")
	})

	onHover("hover_outsideWindow", () => {
		if (!isPreciselyHoveringAWindow && !isDraggingAWindow && !curDraggin?.is("minibutton")) {
			mouse.play("point")
		}
	})

	onHoverEnd("hover_outsideWindow", () => {
		if (!isPreciselyHoveringAWindow && !isDraggingAWindow && !curDraggin?.is("minibutton")) {
			mouse.play("cursor")
		}
	})

	onHover("hover_insideWindow", () => {
		mouse.play("point")
	})

	onHoverEnd("hover_insideWindow", () => {
		mouse.play("cursor")
	})
}

let maxLogs = 100;
let toastQueue = [];
const initialYPosition = 50;

export function addToast(opts = { time: 1, icon: "none", title: "Title", body: "Body", color: WHITE }) {
	function actuallyAddToast(idx, opt) {
		let logs = get("toast", { recursive: true });
		let yOffset = initialYPosition;
		for (let i = 0; i < idx; i++) {
			yOffset += logs[i].height + 10; // Add spacing between logs
		}

		let toastBg = add([
			rect(0, 0, { radius: [0, 10, 10, 0] }),
			pos(-200, yOffset),
			anchor("top"),
			color(WHITE.darken(50)),
			z(getZBetween(hexagon.z, scoreText.z)),
			area(),
			"toast",
			{
				index: idx,
				type: "",
				add() {
					if (opts.title.includes("unlocked")) {
						if (opts.title.includes("window")) this.type = "window"
						else this.type = "achievement"
					}
					else if (opts.title.includes("saved")) this.type = "save"
				},
				close() {
					tween(toastBg.pos.x, -toastBg.width, 0.8, (p) => (toastBg.pos.x = p), easings.easeOutQuint).onEnd(() => {
						// updateLogPositions();
						destroy(toastBg);
						processQueue();
					});
				},
			},
		]);

		let drawShadow = onDraw(() => {
			drawRect({
				pos: vec2(toastBg.pos.x, toastBg.pos.y + 5),
				width: toastBg.width,
				anchor: toastBg.anchor,
				height: toastBg.height,
				radius: toastBg.radius,
				z: 1,
				opacity: 0.5,
				color: BLACK,
			})
		});

		toastBg.height = opts.icon ? 80 : 100;

		toastBg.onMousePress("left", () => {
			if (!toastBg.isHovering()) return;
			toastBg.close();
		});

		let spriteName = !opts.icon.includes(".") ? opts.icon : [opts.icon.split(".")[0], opts.icon.split(".")[1]];
		let icon = add([
			sprite(typeof spriteName == "string" ? spriteName : spriteName[0]),
			anchor("center"),
			pos(toastBg.pos.x - toastBg.width / 2 + 50, toastBg.pos.y),
			z(toastBg.z + 1),
			{
				update() {
					this.pos.x = toastBg.pos.x - toastBg.width / 2 + 50;
					this.pos.y = toastBg.pos.y + toastBg.height / 2;
				}
			}
		]);

		typeof spriteName == "string" ?? icon.play(spriteName[1]);

		icon.width = 60;
		icon.height = 60;

		let titleText = add([
			text(opts.title, {
				font: "lambda",
				size: 40,
				align: "left",
				width: 500,
			}),
			pos(icon.pos.x + icon.width / 2 + 10, 0, toastBg.pos.y - toastBg.height / 2),
			color(BLACK),
			z(toastBg.z + 1),
			{
				update() {
					this.pos.x = icon.pos.x + icon.width / 2 + 10;
					this.pos.y = toastBg.pos.y + 5;
				}
			}
		]);

		let bodyText = add([
			text(opts.body, {
				font: "lambda",
				size: 20,
				align: "left",
				width: 500,
			}),
			pos(titleText.pos.x, titleText.pos.y + titleText.height),
			color(BLACK),
			z(toastBg.z + 1),
			{
				update() {
					this.pos.x = titleText.pos.x;
					this.pos.y = titleText.pos.y + titleText.height;
				}
			}
		]);

		let toastProgressBar = toastBg.add([
			rect(toastBg.width, 10),
			pos(0, toastBg.height),
			color(opt.color),
			opacity(0),
		]);

		toastBg.width = icon.width + 20;
		toastBg.height = icon.height + 20;

		let titleTextWidth = formatText({ text: titleText.text, size: titleText.textSize }).width
		let bodyTextWidth = formatText({ text: bodyText.text, size: bodyText.textSize }).width

		titleTextWidth = clamp(titleTextWidth, 0, 500)
		bodyTextWidth = clamp(bodyTextWidth, 0, 500)

		if (titleTextWidth > bodyTextWidth) toastBg.width += titleTextWidth + 25;
		else if (bodyTextWidth > titleTextWidth) toastBg.width += bodyTextWidth + 25;

		// height
		if (titleText.height > bodyText.height) toastBg.height = titleText.height + bodyText.height + 15;
		else toastBg.height += bodyText.height - titleText.height + 15;

		tween(-toastBg.width, toastBg.width / 2, 0.5, (p) => toastBg.pos.x = p, easings.easeOutQuint);

		wait(opts.time ?? 3, () => {
			toastBg.close();
		});

		toastBg.onDestroy(() => {
			drawShadow.cancel();
			icon.destroy()
			titleText.destroy();
			bodyText.destroy();
		});

		if (toastBg.type == "save") playSfx("gamesaved")
		else if (toastBg.type == "achievement" || toastBg.type == "window") playSfx("unlockachievement", { tune: toastBg.index * 100 })
	}

	// function updateLogPositions() {
	// 	let logs = get("toast", { recursive: true });
	// 	let yOffset = initialYPosition;

	// 	logs.forEach((log, idx) => {
	// 		tween(log.pos.y, yOffset, 0.5, (p) => log.pos.y = p, easings.easeOutQuint);
	// 		yOffset += log.height + 10;
	// 	});
	// }

	function processQueue() {
		let logs = get("toast", { recursive: true });
		let totalHeight = logs.reduce((sum, log) => sum + log.height + 10, 0); // Calculate total height of logs

		maxLogs = Math.floor(height() / totalHeight); // Update maxLogs based on total height

		while (toastQueue.length > 0 && logs.length < maxLogs) {
			let nextToast = toastQueue.shift();
			let availableIndex = getAvailableIndex(logs);
			if (availableIndex !== -1) {
				actuallyAddToast(availableIndex, nextToast);
				logs = get("toast", { recursive: true }); // update logs after adding a toast
			}
		}
	}

	function getAvailableIndex(logs) {
		let occupiedIndices = logs.map(log => log.index);
		for (let i = 0; i < maxLogs; i++) {
			if (!occupiedIndices.includes(i)) {
				return i;
			}
		}
		return -1;
	}

	let logs = get("toast", { recursive: true }); // Update logs

	if (logs.length >= maxLogs) {
		toastQueue.push(opts);
	} 
	
	else {
		let availableIndex = getAvailableIndex(logs);
		if (availableIndex !== -1) {
			actuallyAddToast(availableIndex, opts);
		}
	}

	processQueue(); // Ensure the queue is processed if there are available slots
}