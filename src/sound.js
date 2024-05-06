
import { GameState } from "./GameState.js"
import { panderitoIndex } from "./scenes/game/gamescene.js";

export let sfx;
export function playSfx(sound = "clickPress", tune = 0) {
	sfx = play(sound, {
		volume: GameState.sfx.volume,
		detune: tune
	})
}

export let music;
export function playMusic(sound = "clickRelease", tune = 0, looping = true) {
	music = play(sound, {
		volume: GameState.music.volume,
		detune: tune,
		loop: looping,
	})
}

let volElements;

export function volumeManager() {
	let barXPosition = -110
	let seconds = 0
	let tune = 0

	sfx = play("")
	music = play("")
	
	// for (let i = 0; i < get("volElement").length; i++) {
	// 	destroy(get("volElement")[i])
	// }

	let bg = add([
		rect(width() / 6, 80),
		pos(width() / 2, 0),
		anchor("top"),
		color(BLACK),
		opacity(0.5),
		stay(),
		z(999999999),
		"volElement",
		{
			isUp: true,
			isActuallyUp: true,
			up() {
				if (!this.isUp) {
					this.isUp = true
					tween(this.pos.y, -this.height, 0.35, (p) => this.pos.y = p, easings.easeInQuint)
					wait(0.36, () => {
						this.isActuallyUp = true
					})
				}
			},
			down() {
				if (this.isUp) {
					this.isUp = false
					this.isActuallyUp = false
					get("volElement", { recursive: true }).forEach(element => {
						element.hidden = false
					});
					tween(this.pos.y, 0, 0.35, (p) => this.pos.y = p, easings.easeOutQuint)
				}
			},
		}
	])

	bg.up()
	
	let volumeText = bg.add([
		text("VOLUME", {
			font: 'emulogic',
			size: 26
		}),
		pos(0, bg.height - 16),
		anchor("center"),
		scale(0.6),
		opacity(1),
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
			opacity(1),
			anchor("center"),
			z(99999999999),
			"volElement",
			"bar",
		])
	}

	bars = volumeText.get("bar", { recursive: true })
	let speaker = volumeText.add([
		sprite("speakers"),
		opacity(1),
		pos(-40, -110),
		"volElement",
	])

	speaker.frame = 1

	volElements = get("volElement", { recursive: true }) 

	let gameManager = add([
		stay(),
		{
			canChange: true,
			update() {
				GameState.volume = parseFloat(GameState.volume.toFixed(1))
				GameState.sfx.volume = parseFloat(GameState.sfx.volume.toFixed(1))
				GameState.music.volume = parseFloat(GameState.music.volume.toFixed(1))

				volume(GameState.volume)

				if (seconds > 0) seconds -= dt()

				else {
					bg.up()
					if (bg.isActuallyUp) {
						volElements.forEach(element => {
							element.hidden = true
						});
					}
				}
				
				if (isKeyPressed("-")) {
					bg.down()
					
					if (GameState.volume > 0) {
						GameState.volume -= 0.1
						tune -= 25
						bars.forEach(element => {
							element.hidden = false
						});
						speaker.hidden = true
					}

					if (GameState.volume == 0) {
						bars.forEach(element => {
							element.hidden = true
						});
						speaker.hidden = false
						speaker.frame = 0
					}

					seconds = 1.5
					play("volumeChange", { detune: tune })
					volumeText.text = "VOLUME"
				}
				
				else if (isKeyPressed("+")) {
					bg.down()
					if (GameState.volume <= 0.9) {
						GameState.volume += 0.1
						tune += 25
						play("volumeChange", { detune: tune })
					}

					// else play("whistle")
					else play("volumeChange", { detune: tune, volume: 5 })

					seconds = 1.5
					bars.forEach(element => {
						element.hidden = false
					});
					speaker.hidden = true
					volumeText.text = "VOLUME"
				}

				else if (isKeyPressed("n") && panderitoIndex != 3) {
					bg.down()
					if (!GameState.sfx.muted) {
						GameState.sfx.volume = 0
						GameState.sfx.muted = true
						speaker.frame = 0
					}
					
					// unmuted
					else {
						GameState.sfx.volume = GameState.volume
						GameState.sfx.muted = false
						speaker.frame = 1
					} 

					bars.forEach(element => {
						element.hidden = true
					});
					speaker.hidden = false
					seconds = 1.55
					volumeText.text = "SFX"
				}

				else if (isKeyPressed("m")) {
					bg.down()
					if (!GameState.music.muted) {
						GameState.music.volume = 0
						GameState.music.muted = true
						speaker.frame = 0
					}
					
					// unmuted
					else {
						GameState.music.volume = GameState.volume
						GameState.music.muted = false
						speaker.frame = 1
					}

					bars.forEach(element => {
						element.hidden = true
					});
					speaker.hidden = false
					seconds = 1.55
					volumeText.text = "MUSIC"
				}

				for(let i = 0; i < bars.length; i++) {
					bars[i].opacity = 0.1
					bars[i].fullOp = 0.1
				}
				
				for(let i = 0; i < Math.round(GameState.volume * 10); i++) {
					bars[i].opacity = 1
					bars[i].fullOp = 1
				}

				if (!GameState.sfx.muted) GameState.sfx.volume = GameState.volume; else GameState.sfx.volume = 0
				if (!GameState.music.muted) GameState.music.volume = GameState.volume; else GameState.music.volume = 0
			
				sfx.volume = GameState.sfx.volume
				music.volume = GameState.music.volume
			}
		}
	])
}