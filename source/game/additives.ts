import { GameObj } from "kaplay"
import { GameState } from "../gamestate"
import { playSfx } from "../sound"
import { hexagon } from "./hexagon"
import { blendColors, parseAnimation, saveColorToColor } from "./utils"
import { allObjWindows, manageWindow } from "./windows/windows-api/windowManaging"
import { isWindowUnlocked } from "./unlockables/unlockablewindows"

export let gameBg:GameObj;
export function addBackground() {
	gameBg = add([
		rect(width(), height()),
		pos(center()),
		anchor("center"),
		scale(8),
		color(saveColorToColor(GameState.settings.bgColor)),
		layer("background"),
		stay(),
		{
			speed: 0.1,
			movAngle: 5,
			uScale: 2,
			col1D: rgb(128, 128, 128),
			col2D: rgb(190, 190, 190),
			update() {
				if (getSceneName() != "gamescene") return
				if (!isWindowUnlocked("bgColorWin")) return

				if (isMousePressed("right")) {
					// doesn't check for hovering this because you will always be hovering it lol
					if (!hexagon?.isHovering() && !get("folderObj")[0]?.isHovering() && !get("minibutton")[0]?.isHovering() && !get("window")[0]?.isHovering() && !allObjWindows.isDraggingAWindow) {
						manageWindow("bgColorWin")
					}
				}
			}
		}
	])
	gameBg.color.a = GameState.settings.bgColor.a

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

export let mouse:any;
export function addMouse() {
	mouse = add([
		sprite("cursors"),
		pos(mousePos()),
		color(WHITE),
		stay(),
		anchor(vec2(-0.5, -0.65)),
		fixed(),
		layer("mouse"),
		z(0),
		{
			intro: false,
			speed: 5000, // 5000 is the optimal for actual mouse movement
			grabbing: false,
			grab() {
				this.grabbing = true
				mouse.play("grab")
			},

			releaseAndPlay(newAnim:string) {
				this.grabbing = false
				mouse.play(newAnim)
			},

			update() {
				this.pos = mousePos()
			}
		}
	])
} 

let maxLogs = 100;
export let toastQueue = [];
const initialYPosition = 50;

export type toastOpts = {
	title: string,
	body: string,
	icon: string,
	duration?: number,
	type?: string,
}

export function addToast(opts:toastOpts) {
	function actuallyAddToast(idx, opt) {
		let logs = get("toast", { recursive: true });
		let yOffset = initialYPosition;
		for (let i = 0; i < idx; i++) {
			yOffset += logs[i].height + 10; // Add spacing between logs
		}

		let toastBg = add([
			rect(0, 0, { radius: [0, 10, 10, 0] as any }),
			pos(-200, yOffset),
			anchor("top"),
			color(WHITE.darken(50)),
			fixed(),
			layer("logs"),
			z(0),
			timer(),
			"toast",
			{
				index: idx,
				type: opts.type,
				add() {
					if (this.type == "achievement") {
						playSfx("unlockachievement", { detune: this.index * 100 })
					}

					else if (this.type == "gamesaved") {
						playSfx("gamesaved", { detune: rand(0, 30) })
					}
				},
				close() {
					wait(0.7).onEnd(() => this.trigger("closed"))
					tween(toastBg.pos.x, -toastBg.width, 0.8, (p) => toastBg.pos.x = p, easings.easeOutQuint).onEnd(() => {
						// updateLogPositions();
						destroy(toastBg);
						processQueue();
					});
				},
			},
		]);

		let drawToastShadow = onDraw(() => {
			drawRect({
				pos: vec2(toastBg.pos.x, toastBg.pos.y + 5),
				width: toastBg.width,
				anchor: toastBg.anchor,
				height: toastBg.height,
				radius: toastBg.radius,
				opacity: 0.5,
				fixed: true,
				color: BLACK,
			})
		});

		toastBg.height = opts.icon ? 80 : 100;

		let icon = add([
			sprite("white_noise"),
			anchor("center"),
			pos(toastBg.pos.x - toastBg.width / 2 + 50, toastBg.pos.y),
			fixed(),
			layer("logs"),
			z(toastBg.z + 1),
			{
				update() {
					this.pos.x = toastBg.pos.x - toastBg.width / 2 + 50;
					this.pos.y = toastBg.pos.y + toastBg.height / 2;
				}
			}
		]);

		parseAnimation(icon, opts.icon)

		icon.width = 60;
		icon.height = 60;

		let titleText = add([
			text(opts.title, {
				font: "lambda",
				size: 40,
				align: "left",
				width: 500,
			}),
			pos(icon.pos.x + icon.width / 2 + 10, toastBg.pos.y - toastBg.height / 2),
			fixed(),
			color(BLACK),
			layer("logs"),
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
			fixed(),
			color(BLACK),
			layer("logs"),
			z(toastBg.z + 1),
			{
				update() {
					this.pos.x = titleText.pos.x;
					this.pos.y = titleText.pos.y + titleText.height;
				}
			}
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

		toastBg.wait(opts.duration ?? 3, () => {
			toastBg.close();
		});

		toastBg.onDestroy(() => {
			drawToastShadow.cancel();
			icon.destroy()
			titleText.destroy();
			bodyText.destroy();
		});

		if (toastBg.type == "save") playSfx("gamesaved")
		else if (toastBg.type == "achievement" || toastBg.type == "window") playSfx("unlockachievement", { detune: toastBg.index * 100 })
	
		return toastBg;
	}

	let toastObj:any;

	function processQueue() {
		let logs = get("toast", { recursive: true });
		let totalHeight = logs.reduce((sum, log) => sum + log.height + 10, 0); // Calculate total height of logs

		maxLogs = Math.floor(height() / totalHeight); // Update maxLogs based on total height

		while (toastQueue.length > 0 && logs.length < maxLogs) {
			let nextToast = toastQueue.shift();
			let availableIndex = getAvailableIndex(logs);
			if (availableIndex !== -1) {
				toastObj = actuallyAddToast(availableIndex, nextToast);
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
			toastObj = actuallyAddToast(availableIndex, opts);
		}
	}

	processQueue(); // Ensure the queue is processed if there are available slots

	return toastObj;
}

type tooltipOpts = {
	text:string;
	direction?: "up" | "down" | "left" | "right",
	/**
	 * How "closely" will the tooltip follow the object, from 0 to 1
	 */
	lerpValue?:number,
	textSize?:number,
	type?:string,
	layer?:string,
	z?:number,
}

/**
 * Adds a tooltip to an object and pushes itself to a tooltips array
 * @returns An object that contains the bg, text and an end() function 
 */
export function addTooltip(obj:GameObj, opts?:tooltipOpts) {
	if (opts == undefined) opts = {} as tooltipOpts 
	opts.direction = opts.direction ?? "up";
	opts.lerpValue = opts.lerpValue ?? 1;
	opts.textSize = opts.textSize ?? 20;

	opts.layer = opts.layer ?? "windows"
	opts.z = opts.z ?? 0

	let sizeOfText = { x: 0, y: 0 };

	let offset = 10
	let bgPos = vec2(obj.worldPos().x, obj.worldPos().y)
	let padding = 10;

	let tooltipBg = add([
		rect(sizeOfText.x, sizeOfText.y, { radius: 5 }),
		z(0),
		pos(obj.worldPos()),
		color(BLACK),
		opacity(0.95),
		opacity(),
		anchor("center"),
		layer(opts.layer),
		z(opts.z),
		"tooltip",
		{
			end: null,
			type: opts.type,
			update() {
				switch (opts.direction) {
					case "up":
						bgPos.y = (obj.worldPos().y - obj.height / 2) - offset
						bgPos.x = obj.worldPos().x
					break;
			
					case "down":
						bgPos.y = (obj.worldPos().y + obj.height / 2) + offset
						bgPos.x = obj.worldPos().x
					break;
			
					case "left":
						this.anchor = "right"	
						bgPos.x = (obj.worldPos().x - obj.width / 2) - offset
						bgPos.y = obj.worldPos().y
					break;
			
					case "right":
						this.anchor = "left"	
						bgPos.x = (obj.worldPos().x + obj.width / 2) + offset
						bgPos.y = obj.worldPos().y
					break;
				}
				
				this.width = lerp(this.width, sizeOfText.x + padding, opts.lerpValue)
				this.height = lerp(this.height, sizeOfText.y + padding, opts.lerpValue)

				this.pos.x = lerp(this.pos.x, bgPos.x, opts.lerpValue)
				this.pos.y = lerp(this.pos.y, bgPos.y, opts.lerpValue)
			},
		}
	])

	let tooltipText = add([
		text(opts.text, {
			font: "lambda",
			size: opts.textSize,
			styles: {
				"red": {
					color: RED,
				},
				"green": {
					color: GREEN,
				}
			}
		}),
		color(WHITE),
		anchor(tooltipBg.anchor),
		opacity(),
		pos(tooltipBg.pos),
		layer(opts.layer),
		z(opts.z + 1),
		"tooltip",
		{
			bg: tooltipBg,
			update() {
				sizeOfText.x = formatText({ text: tooltipText.text, size: tooltipText.textSize }).width
				sizeOfText.y = formatText({ text: tooltipText.text, size: tooltipText.textSize }).height
			
				this.anchor = tooltipBg.anchor
				this.layer = tooltipBg.layer
				this.z = tooltipBg.z
				let xPos:number;

				if (opts.direction == "right") xPos = tooltipBg.pos.x + padding / 2
				else if (opts.direction == "left") xPos = tooltipBg.pos.x - padding / 2
				else xPos = tooltipBg.pos.x

				this.pos.x = xPos
				this.pos.y = tooltipBg.pos.y
			}
		}
	])

	let tooltipinfo = { tooltipBg, tooltipText, end, type: opts.type }
	if (obj.tooltip == null) obj.tooltip = tooltipinfo
	
	function end() {
		destroy(tooltipBg)
		destroy(tooltipText)

		obj.tooltip = null
	}

	obj.onDestroy(() => {
		end()
	})

	tooltipBg.end = end

	return tooltipinfo
}
