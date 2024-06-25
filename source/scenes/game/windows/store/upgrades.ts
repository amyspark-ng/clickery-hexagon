export let isHoveringUpgrade = false;

export function addUpgrades(elementParent) {
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
			{
				type: elementParent.is("clickersElement") ? "k_" : "c_",
				idx: i,
				value: 0, // is setted below
			}
		])

		if (upgrade.type == "k_") {
			upgrade.value = 2 ** (upgrade.idx + 1)
		}

		else if (upgrade.type == "c_") {
			if (upgrade.idx > 0 && upgrade.idx < 3) {
				switch (upgrade.idx) {
					case 0:
						upgrade.freq = 10
					break;
					case 1:
						upgrade.freq = 5
					break;
					case 2:
						upgrade.freq = 1
					break;
				}
			}

			// is multiplier upgrades
			else {
				switch (upgrade.idx) {
					case 9:
						upgrade.value = 8;
					break;
					case 10:
						upgrade.value = 16;
					break;
					case 11:
						upgrade.value = 36;
					break;
				}
			}
		}

		upgrade.onClick(() => {
			debug.log(upgrade.idx)
		})
	}
}