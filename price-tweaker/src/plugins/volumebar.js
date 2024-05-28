
import { GameState } from "../main.js"

export function volumeManager() {
	let barXPosition = -110
	let seconds = 0
	let tune = 0

	volume(GameState.volumeIndex / 10)

	for (let i = 0; i < get("volElement").length; i++) {
		destroy(get("volElement")[i])
	}

	let bg = add([
		rect(width() / 6, 80),
		pos(width() / 2, 0),
		anchor("top"),
		color(BLACK),
		opacity(0),
		stay(),
		z(999999999),
		"volElement",
	])
	
	let volumeText = bg.add([
		text("VOLUME"),
		pos(0, bg.height - 12),
		anchor("center"),
		scale(0.6),
		opacity(0),
		// stay(),
		z(9999999999),
		"volElement",
	])
	
	let bars;
	
	for (let i = 0; i < 10; i++) {
		barXPosition += 20
		
		volumeText.add([
			pos(barXPosition, -65),
			rect(10, bg.height - 10),
			opacity(0),
			anchor("center"),
			// stay(),
			z(99999999999),
			"volElement",
		])
	}

	bars = volumeText.get("*", { recursive: true })
	

	let gameManager = add([
		stay(),
		{
			update() {
				if (isKeyPressed("-")) {
					if (GameState.volumeIndex > 0) {
						bars[GameState.volumeIndex - 1].opacity = 0.1
						GameState.volumeIndex--
						volume(GameState.volumeIndex / 10)
						tune -= 25
					}
					
					play("volumeChange", { detune: tune })
					seconds = 0
					bg.opacity = 0.5
					volumeText.opacity = 1
					for(let i = 0; i < 10; i++) {
						bars[i].opacity = 0.1
					}
			
					for(let i = 0; i < GameState.volumeIndex; i++) {
						bars[i].opacity = 1
					}
				}

				else if (isKeyPressed("+")) {
					if (GameState.volumeIndex <= 9) {
						bars[GameState.volumeIndex].opacity = 1
						GameState.volumeIndex++
						volume(GameState.volumeIndex / 10)
						tune += 25
					}
					
					play("volumeChange", { detune: tune })
					
					seconds = 0
					bg.opacity = 0.5
					volumeText.opacity = 1
					for(let i = 0; i < 10; i++) {
						bars[i].opacity = 0.1
					}
			
					for(let i = 0; i < GameState.volumeIndex; i++) {
						bars[i].opacity = 1
					}
				}
			
				seconds += dt()

				// makes it so everything dissapears
				if (seconds > 0.8) {
					bg.opacity = 0
					volumeText.opacity = 0
					bars.forEach(element => {
						element.opacity = 0
					});
				}
			}
		}
	])

	return gameManager;
}