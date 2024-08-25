import { Anchor, GameObj, KAPLAYCtx, RectComp, TextComp, Vec2 } from "kaplay"
import { GameState } from "../gamestate"
import { playSfx } from "../sound"
import { hexagon } from "./hexagon"
import { blendColors, getPosInGrid, getPositionOfSide, parseAnimation, saveColorToColor } from "./utils"
import { allObjWindows, manageWindow } from "./windows/windows-api/windowManaging"
import { isWindowUnlocked } from "./unlockables/windowUnlocks"
import { k } from "../main"
import { drawDumbOutline } from "./plugins/drawThings"

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

const initialYPosition = 50;

export type toastOpts = {
	title: string,
	body: string,
	icon: string,
	duration?: number,
	type?: string,
	/**
	 * Will run when the toast is actually added
	 */
	whenAdded?:(toastObj:GameObj) => void;
}

let allToasts:GameObj[] = []
export function addToast(opts:toastOpts) {
	opts = opts || {} as toastOpts

	let toasts = get("toast", { recursive: true });
	
	function getAvailableIndex(toasts:GameObj[]) {
		let occupiedIndices = toasts.map(log => log.index);
		for (let i = 0; i < Infinity; i++) {
			if (!occupiedIndices.includes(i)) {
				return i;
			}
		}
	}

	let idx = getAvailableIndex(toasts);

	let yOffset = initialYPosition;
	for (let i = 0; i < idx; i++) {
		yOffset += toasts[i].height + 10; // Add spacing between
	}

	const LERP_VALUE = 0.1
	let toastPosition = vec2();
	toastPosition.x = -200
	toastPosition.y = yOffset

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

			icon: null,
			title: null,
			body: null,

			getPosition() {
				return toastPosition
			},
			setPosition(posi:Vec2) {
				toastPosition = posi
			},
			close() {
				this.unuse("toast")
				
				toastPosition.x = -this.width
				wait(1.5).onEnd(() => {
					this.trigger("closed")
					this.destroy()
				})
			},

			update() {
				this.pos = lerp(this.pos, toastPosition, LERP_VALUE);
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
			fixed: toastBg.is("fixed") ?? true,
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

	// the medal exists
	if (opts.icon.includes("medals_")) {
		icon.sprite = opts.icon
		icon.use(drawDumbOutline(5, BLACK))
	}
	
	else {
		parseAnimation(icon, opts.icon)
	}

	if (icon.width >= 70) icon.width = 60
	if (icon.height >= 70) icon.height = 60

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
	else if (bodyTextWidth == titleTextWidth) toastBg.width += titleTextWidth + 25;

	// height
	if (titleText.height > bodyText.height) toastBg.height = titleText.height + bodyText.height + 15;
	else if (bodyText.height > titleText.height) toastBg.height += bodyText.height - titleText.height + 15;
	else if (bodyText.height == titleText.height) toastBg.height = titleText.height + bodyText.height + 15;

	toastPosition.x = toastBg.width / 2
	
	if (opts.whenAdded) opts.whenAdded(toastBg)

	toastBg.wait(opts.duration ?? 3, () => {
		toastBg.close();
	});

	toastBg.onDestroy(() => {
		drawToastShadow.cancel();
		icon.destroy()
		titleText.destroy();
		bodyText.destroy();
	});

	const Ycenter = toastBg.pos.y + toastBg.height * 0.5

	if (Ycenter >= height()) {
		// move it to a proper position
		const newYPos = height() - toastBg.height - 10
		toastBg.setPosition(vec2(toastBg.getPosition().x, newYPos))
		
		// move the other ones up
		const allTosts = get("toast")
		allTosts.filter(toast => toast != toastBg).forEach((toast) => {
			const newYPos = toast.getPosition().y - toastBg.height - 10
			toast.setPosition(vec2(toast.getPosition().x, newYPos))
		})
	}

	if (Ycenter < -10) toastBg.close()

	toastBg.icon = icon
	toastBg.title = titleText
	toastBg.body = bodyText

	return toastBg;
}

type tooltipOpts = {
	text:string;
	direction?: "up" | "down" | "left" | "right",
	/**
	 * How smooth the tooltip will be
	 */
	lerpValue?:number,
	textSize?:number,
	type?:string,
	layer?:string,
	z?:number,
}

export type tooltipInfo = { tooltipBg:GameObj<RectComp>, tooltipText:GameObj<TextComp>, end: () => void, type: string, }

/**
 * Adds a tooltip to an object and pushes itself to a tooltips array
 * @returns An object that contains the bg, text and an end() function 
 */
export function addTooltip(obj:GameObj, opts?:tooltipOpts) : tooltipInfo {
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

	let ending = false
	let theOpacity = 0.95

	let tooltipBg = add([
		rect(sizeOfText.x, sizeOfText.y, { radius: 5 }),
		z(0),
		pos(obj.worldPos()),
		color(BLACK),
		opacity(theOpacity),
		anchor("center"),
		layer(opts.layer),
		z(opts.z),
		"tooltip",
		{
			end: null,
			type: opts.type,
			update() {
				if (ending == false) {
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
				}
				
				this.width = lerp(this.width, sizeOfText.x + padding, opts.lerpValue)
				this.height = lerp(this.height, sizeOfText.y + padding, opts.lerpValue)

				this.pos.x = lerp(this.pos.x, bgPos.x, opts.lerpValue)
				this.pos.y = lerp(this.pos.y, bgPos.y, opts.lerpValue)

				this.opacity = lerp(this.opacity, theOpacity, opts.lerpValue)
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
		opacity(0),
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
			
				this.opacity = lerp(this.opacity, theOpacity > 0 ? 1 : theOpacity, opts.lerpValue)
			}
		}
	])

	let tooltipinfo = { tooltipBg, tooltipText, end, type: opts.type } as tooltipInfo
	if (obj.tooltip == null) obj.tooltip = tooltipinfo
	
	function end() {
		ending = true
		theOpacity = 0
		bgPos = obj.worldPos()

		wait(1 - opts.lerpValue, () => {
			destroy(tooltipBg)
			destroy(tooltipText)
		})

		obj.tooltip = null
	}

	obj.onDestroy(() => {
		end()
	})

	tooltipBg.end = end

	return tooltipinfo
}