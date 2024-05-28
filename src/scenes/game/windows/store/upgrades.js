export let isHoveringUpgrade = false;

export function addRegularUpgrades(elementParent) {
	let initialPos = vec2(-27.5)
	let desiredPos = vec2(initialPos.x, initialPos.y)
	let spacing = vec2(55)

	for (let i = 0; i < 6; i++) {
		// crazy grid placement
		if (i == 3) {desiredPos.y += spacing.y; desiredPos.x = initialPos.x}
		desiredPos.x += spacing.x
		
		let upgrade = elementParent.add([
			pos(desiredPos),
			rect(45, 45, { radius: 10 }),
			color(RED.lighten(rand(100, 150))),
			anchor("center"),
			area(),
		])
	}
}

export function addMiscUpgrades(winParent) {
	let initialPos = vec2(-115, 220)
	let spacing = 78

	for (let i = 0; i < 4; i++) {
		let upgrade = winParent.add([
			pos(initialPos.x + (i * spacing), initialPos.y),
			rect(60, 60, { radius: 10 }),
			color(RED.lighten(rand(100, 150))),
			anchor("center"),
			area(),
		])

		upgrade.onClick(() => {
			debug.log("misc upgrade")
		})
	}
}