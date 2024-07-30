import { mouse } from "./game/additives";
import { positionSetter } from "./plugins/positionSetter";

export let debugConsole = {
	activated: false
}

let consoleManagerObj = null;
export function consoleManager() {

	const addConsole = () => {
		let console = add([
			pos(15, 269),
			layer("mouse"),
			z(mouse.z - 1),
			fixed(),
			"DEBUG_console",
		])

		let consolebg = console.add([
			rect(300, 300, { radius: 5 }),
			color(BLACK),
			opacity(0.8),
		])

		let consoleTyping = console.add([
			text("|", {
				size: 20,
				align: "left",
			}),
			pos(9, 272),
			positionSetter(),
		])

		console.onCharInput((key) => {
			consoleTyping.text += key
		})

		console.onKeyPressRepeat("backspace", () => {
			consoleTyping.text = consoleTyping.text.slice(0, -1)
		})
	}

	const removeConsole = () => {
		get("DEBUG_console")[0].destroy()
	}

	consoleManagerObj = add([
		stay(),
		{
			update() {
				if (isKeyPressed("/")) {
					debugConsole.activated = !debugConsole.activated
					if (debugConsole.activated) addConsole()
					else removeConsole()
				}
			},
		}
	])
}