import { GameState } from "../../../gamestate";
import { hexagon } from "../../hexagon";
import { positionSetter } from "../../plugins/positionSetter";
import { addDefaultButton, addNumbers, addRandomButton, addSlider, playSliderSound, sliderColors } from "./colorWindowElements";

export function hexColorWinContent(winParent) {
	
	let redslider = addSlider({
		parent: winParent,
		pos: vec2(-180, -66),
		value: GameState.settings.hexColor.r,
		range: [0, 255],
		color: "red",
		onValueChange: (value) => {
			hexagon.color.r = value
			GameState.settings.hexColor.r = value
			playSliderSound(value)
		}
	})

	let greenslider = addSlider({
		parent: winParent,
		pos: vec2(-180, -15),
		value: GameState.settings.hexColor.g,
		range: [0, 255],
		color: "green",
		onValueChange: (value) => {
			hexagon.color.g = value
			GameState.settings.hexColor.g = value
			playSliderSound(value)
		}
	})

	let blueslider = addSlider({
		parent: winParent,
		pos: vec2(-180, 38),
		value: GameState.settings.hexColor.b,
		range: [0, 255],
		color: "blue",
		onValueChange: (value) => {
			hexagon.color.b = value
			GameState.settings.hexColor.b = value
			playSliderSound(value)
		}
	})

	let sliders = [redslider, greenslider, blueslider]

	// buttons
	let controlBar = winParent.add([
		rect(winParent.width - 40, 60, { radius: 10}),
		anchor("top"),
		pos(0, 70),
		color(BLACK),
		opacity(0.25),
	])
	
	let defaultButton = addDefaultButton(vec2(-135, 29), controlBar, sliders, [255, 255 ,255])
	let randomButton = addRandomButton(vec2(-66, 29), controlBar, sliders)
	let rgbaNumbers = addNumbers(vec2(-18, 29), controlBar, GameState.settings.hexColor)

	// setting the color and other stuff
	winParent.onUpdate(() => {
		winParent.color = hexagon.color.lighten(50)
	})

	// winParent.onDraw(() => {
	// 	drawSprite({
	// 		sprite: "icon_hexColor",
	// 		scale: vec2(0.8),
	// 		pos: positioner.pos,
	// 		anchor: "center",
	// 	})

	// 	drawText({
	// 		text: "| Hex Color",
	// 		anchor: "left",
	// 		align: "left",
	// 		font: "lambda",
	// 		size: 20,
	// 		pos: positioner.pos
	// 	})
	// })
}