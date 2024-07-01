import { positionSetter } from "../../plugins/positionSetter"

export function creditsWinContent(winParent) {
	winParent.add([
		pos(0, -190),
		text("Clickery Hexagon\nwas made by", {
			align: "center",
		}),
		anchor("center"),
	])

	let credits = {
		"amyspark-ng": "Code",
		"DevkyRD": "Art & Design",
		"MF": "Code & Shaders",
		"lajbel": "Game Design",
		"Khriz28": "Playtesting & Support",
	}

	function createCredits() {
		let text = ""

		for (const [key, value] of Object.entries(credits)) {
			text += `${key} - [small]${value}[/small]\n`
		}

		return text;
	}

	winParent.add([
		text(createCredits(), {
			align: "left",
			styles: {
				"small": {
					scale: 0.8,
				}
			}
		}),
		pos(-183, -134),
	])

	// ------------SPECIAL CREDITS------------

	winParent.add([
		pos(0, 120),
		text("Special thanks to", {
			align: "center",
		}),
		anchor("center"),
	])

	let specialCredits = {
		"GGBotNet": "Lambda font",
		"niceEli": "Desktop support",
		"Webadazzz": "[heart]<3[/heart]",
	}

	function createSpecialCredits() {
		let text = ""
		for (const [key, value] of Object.entries(specialCredits)) {
			text += `${key} - ${value.includes("heart") ? value : `[small]${value}[/small]`}\n`
		}
		return text;
	}

	winParent.add([
		text(createSpecialCredits(), {
			align: "left",
			styles: {
				"small": {
					scale: 0.8,
				},
				"heart": {
					scale: 0.8,
					color: RED,
				}
			}
		}),
		pos(-183, 146),
		positionSetter(),
	])
}