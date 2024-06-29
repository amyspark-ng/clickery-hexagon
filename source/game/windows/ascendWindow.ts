export function ascendWinContent(winParent) {
	debug.log("alexa play ascend ominus")

	let button = winParent.add([
		text("go to ascendscene", {
			size: 20,
			align: "left",
		}),
		color(WHITE),
		pos(0, 0),
		opacity(1),
		area(),
	])

	button.onClick(() => {
		go("ascendscene")
	})
	
	winParent.on("close", () => {
		debug.log("goodbye")
	})
}