import { positionSetter } from "../../../plugins/positionSetter"

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
		"Enysmo": "Music & SFX",
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
}