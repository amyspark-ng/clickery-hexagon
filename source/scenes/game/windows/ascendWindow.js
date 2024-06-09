export function ascendWinContent(winParent) {
	let button = winParent.add([
		text("go to ascendscene", {
			size: 20,
			align: "left",
		}),
		color(WHITE),
		pos(0, 0),
		z(10),
		opacity(1),
		area(),
	])

	button.onClick(() => {
		go("ascendscene")
	})
	
}