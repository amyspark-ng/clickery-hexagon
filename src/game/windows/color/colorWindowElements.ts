import { GameObj, Vec2 } from "kaplay"
import { ROOT } from "../../../main"
import { curDraggin, drag, setCurDraggin } from "../../plugins/drag"
import { blendColors, bop, getPositionOfSide } from "../../utils"
import { playSfx } from "../../../sound"
import { saveColor } from "../../../gamestate"
import { drawDamnShadow } from "../../plugins/drawDamnShadow"
import { insideWindowHover } from "../../hovers/insideWindowHover"
import { mouse } from "../../additives"

const SLIDER_HANDLE_LERP = 0.2

export let sliderColors = {
	red: { full: [255, 60, 60], dull: [245, 119, 119] },
	green: { full: [68, 255, 74], dull: [133, 243, 136] },
	blue: { full: [60, 121, 255], dull: [126, 163, 243] },
	alpha: { full: [48, 48, 48], dull: [118, 118, 118] },
}

type rgbaKey = "r" | "g" | "b" | "a"

function keyToName(key: rgbaKey) {
	switch (key) {
		case "r": return "red"
		case "g": return "green"
		case "b": return "blue"
		case "a": return "alpha"
	}
}

type sliderOpts = {
	range: [number, number],
	value: number,
	/**
	 * Has an anchor of left
	 */
	pos: Vec2,
	color: "red" | "green" | "blue" | "alpha",
	parent?: GameObj,
	onValueChange?: (value: number) => void, // Oliver is the goat
}

interface sliderInterface {
	sliderContent: GameObj,
	sliderButton: GameObj,
	value: number,
	setValue: (newValue: number) => void,
	onValueChange?: (value: number) => void,
	range: [number, number],
}

export function addSlider(opts: sliderOpts) : sliderInterface {
	opts.parent = opts.parent || ROOT

	let value = opts.value
	let previousValue = value

	let winParent = opts.parent;
	opts.parent.onUpdate(() => winParent = opts.parent)

	let fullColor = Color.fromArray(sliderColors[opts.color].full)
	let dullColor = Color.fromArray(sliderColors[opts.color].dull)

	const triggerOnValueChange = () => {
		if (opts.onValueChange && value !== previousValue) {
			opts.onValueChange(value)
			previousValue = value
		}
	}

	let content = winParent.add([
		rect(winParent.width - 40, 18, { radius: 10 }),
		color(),
		pos(opts.pos),
		anchor("left"),
		area(),
		drawDamnShadow(2, 2, 0.5),
		{
			update() {
				let blendFactor = map(value, opts.range[0], opts.range[1], 0, 1)
				let color = blendColors(dullColor, fullColor, blendFactor)
				this.color = color
				triggerOnValueChange()
			}
		}
	])

	let leftSideOfContent = content.pos.x
	let rightSideOfContent = content.pos.x + content.width

	let button = winParent.add([
		sprite("hexColorHandle"),
		anchor("center"),
		rotate(0),
		pos(0, content.pos.y),
		area(),
		scale(),
		drag(true),
		insideWindowHover(winParent),
		drawDamnShadow(2, 2, 0.5),
		{
			update() {
				this.pos.y = content.pos.y

				// dragging, changing value
				if (this.dragging === true) {
					value = map(this.pos.x, leftSideOfContent, rightSideOfContent, opts.range[0], opts.range[1])
				}

				// usually when value is set using setValue
				else {
					let mappedPos = map(value, opts.range[0], opts.range[1], leftSideOfContent, rightSideOfContent)
					this.pos.x = lerp(this.pos.x, mappedPos, SLIDER_HANDLE_LERP)
				}

				value = clamp(value, opts.range[0], opts.range[1])
				this.pos.x = clamp(this.pos.x, leftSideOfContent, rightSideOfContent)

				// angle
				let mappedAngle = map(value, opts.range[0], opts.range[1], 0, 360)
				this.angle = lerp(this.angle, mappedAngle, SLIDER_HANDLE_LERP)

				// color
				let mappedColor = content.color.darken(5)
				this.color = mappedColor

				triggerOnValueChange()
			},

			releaseDrop() {
				curDraggin?.trigger("dragEnd")
				setCurDraggin(null)
			},
		}
	])

	button.startingHover(() => {
		tween(vec2(1), vec2(1.2), 0.15, (p) => button.scale = p)
		mouse.play("point")
	})

	button.endingHover(() => {
		tween(vec2(1.2), vec2(1), 0.15, (p) => button.scale = p)
		mouse.play("cursor")
	})

	button.onClick(() => {
		if (!winParent.active) return;
		button.pick()
		mouse.grab()

		winParent.canClose = false
	})

	button.onMouseRelease(() => {
		if (!winParent.active) return;
		if (button.isBeingHovered == false) return
		button.releaseDrop()

		if (button.isHovering() == true) {
			button.startHoverFunction()
			mouse.releaseAndPlay("point")
		}

		else {
			mouse.releaseAndPlay("cursor")
			button.endHoverFunction()
		}

		winParent.canClose = true
	})

	// oh god
	content.onClick(() => {
		if (button.isBeingHovered == true) return;
		
		let mappedValue = map(mousePos().x, content.screenPos().x, content.screenPos().x + content.width, opts.range[0], opts.range[1])
		value = clamp(mappedValue, opts.range[0], opts.range[1])
	})

	return {
		sliderContent: content,
		sliderButton: button,
		value: value,
		range: [opts.range[0], opts.range[1]],
		setValue: (newValue: number) => {
			value = newValue
			triggerOnValueChange()
		},
	}
}

export function playSliderSound(value:number) {
	if (Math.round(value) % 2 == 0) {
		let mappedDetune = map(value, 0, 255, -100, 100)
		playSfx("hoverMiniButton", { detune: mappedDetune })
	}
}

export function addDefaultButton(position: Vec2, parent: GameObj, sliders: sliderInterface[], defaultValues: number[]) {
	parent = parent || ROOT
	
	let winParent = parent.parent;

	let defaultButton = parent.add([
		sprite("defaultButton"),
		pos(position),
		area(),
		color(),
		scale(),
		anchor("center"),
		drawDamnShadow(2, 2, 0.5),
	])

	defaultButton.onClick(() => {
		if (!winParent.active) return

		bop(defaultButton)
		playSfx("clickButton", { detune: rand(-50, 50) })

		for (let i = 0; i < sliders.length; i++) {
			sliders[i].setValue(defaultValues[i])
		}
	})

	return defaultButton;
}

// the parent holds the color it should change  to
export function addRandomButton(position: Vec2, parent: GameObj, sliders: sliderInterface[]) {
	parent = parent || ROOT
	
	let winParent = parent.parent;

	let randomButton = parent.add([
		sprite("randomButton"),
		pos(position),
		area(),
		anchor("center"),
		color(),
		scale(),
		drawDamnShadow(2, 2, 0.5),
	])

	randomButton.onClick(() => {
		if (!winParent.active) return

		bop(randomButton)
		playSfx("clickButton", { detune: rand(-50, 50) })
		
		sliders.forEach(slider => {
			let randomValue = rand(slider.range[0], slider.range[1])
			slider.setValue(randomValue)    
		})
	})

	return randomButton;
}

export function addNumbers(position: Vec2, parent: GameObj, objSaveColor: saveColor) {
	parent = parent || ROOT

	let numberStyles = {}
	
	let names = Object.keys(objSaveColor).map(color => keyToName(color as rgbaKey))
	
	names.forEach(colorName => {
		numberStyles[`${colorName}`] = {
			color: Color.fromArray(sliderColors[colorName].full) 	
		}
	});

	/**
	 * Converts numbers in a way that they show up like this
	 * 33 gets converted to 033, 1 gets converted to 001
	 */
	function formatRgb(value:number) {
		return value.toFixed(0).padStart(3, "0")
	}

	let numbers = parent.add([
		text("000 000 000", {
			styles: numberStyles,
		}),
		pos(position),
		anchor("left"),
		drawDamnShadow(2, 2, 0.5),
		{
			update() {
				let stuff = []

				if (isNaN(objSaveColor.a) == true) delete objSaveColor.a
				
				Object.keys(objSaveColor).forEach((colorKey, index) => {
					if (colorKey == "a") {
						stuff[index] = `[${names[index]}]${formatRgb(objSaveColor[colorKey] * 100)}[/${names[index]}]`
					}

					else {
						stuff[index] = `[${names[index]}]${formatRgb(objSaveColor[colorKey])}[/${names[index]}]`
					}
				});

				this.text = stuff.join(" ")
			}
		}
	])

	return numbers;
}