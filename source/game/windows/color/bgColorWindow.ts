import { GameState } from "../../../gamestate"
import { gameBg } from "../../additives"
import { blendColors } from "../../utils"
import { addDefaultButton, addNumbers, addRandomButton, addSlider, playSliderSound } from "./colorWindowElements"

export function bgColorWinContent(winParent) {
	let redslider = addSlider({
		parent: winParent,
		pos: vec2(-180, -98),
		value: GameState.settings.bgColor.r,
		range: [0, 255],
		color: "red",
		onValueChange: (value) => {
			gameBg.color.r = value
			GameState.settings.bgColor.r = value
			playSliderSound(value)
		}
	})
	
	let greenslider = addSlider({
		parent: winParent,
		pos: vec2(-180, redslider.sliderContent.pos.y + 55),
		value: GameState.settings.bgColor.g,
		range: [0, 255],
		color: "green",
		onValueChange: (value) => {
			gameBg.color.g = value
			GameState.settings.bgColor.g = value

			let mappedValue = map(value, 0, 1, 0, 255)

			playSliderSound(mappedValue)
		}
	})

	let blueslider = addSlider({
		parent: winParent,
		pos: vec2(-180, greenslider.sliderContent.pos.y + 55),
		value: GameState.settings.bgColor.b,
		range: [0, 255],
		color: "blue",
		onValueChange: (value) => {
			gameBg.color.b = value
			GameState.settings.bgColor.b = value
			playSliderSound(value)
		}
	})

	let alphaslider = addSlider({
		parent: winParent,
		pos: vec2(-180, blueslider.sliderContent.pos.y + 55),
		value: GameState.settings.bgColor.a,
		range: [0, 1],
		color: "alpha",
		onValueChange: (value) => {
			gameBg.color.a = value
			GameState.settings.bgColor.a = value
			playSliderSound(value)
		}
	})

	let sliders = [redslider, greenslider, blueslider, alphaslider]

	// buttons
	let controlBar = winParent.add([
		rect(winParent.width - 20, 60, { radius: 10}),
		anchor("left"),
		pos(-winParent.width / 2 + 10, 125),
		color(BLACK),
		opacity(0.25),
	])
	
	let defaultButton = addDefaultButton(vec2(38, 0), controlBar, sliders, [0, 0, 0, 0.84])
	let randomButton = addRandomButton(vec2(98, 0), controlBar, sliders)
	let rgbaNumbers = addNumbers(vec2(130, 0), controlBar, GameState.settings.bgColor)

	// setting the color and other stuff
	winParent.onUpdate(() => {
		winParent.color = blendColors(WHITE, gameBg.color.lighten(50), gameBg.color.a)
	})
}