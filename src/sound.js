
import { GameState } from "./GameState.js"
import { gamescene, panderitoIndex } from "./scenes/game/gamescene.js";

export let sfx;
export function playSfx(sound = "clickPress", tune = 0) {
	sfx = play(sound, {
		volume: GameState.sfxVolindex.volume,
		detune: tune
	})
}

export let music;
export function playMusic(sound = "clickRelease", tune = 0, looping = true) {
	music = play(sound, {
		volume: GameState.musicVolIndex.volume,
		detune: tune,
		loop: looping,
	})
}

let bars;

export function volumeManager() {
	let barXPosition = -110
	let seconds = 0
	let tune = 0

	sfx = play("")
	music = play("")
	
	for (let i = 0; i < get("volElement").length; i++) {
		destroy(get("volElement")[i])
	}

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
			verPosition: 0,
			isUp: true,
			up() {
				if (this.isUp == false) {
					this.isUp = true
					tween(this.pos.y, -this.height, 0.35, (p) => this.pos.y = p, easings.easeInQuint)
				
					wait(2, () => {
						if (this.isUp == true) bg.hidden = true
					})
				}
			},
			down() {
				this.isUp = false
				tween(this.pos.y, this.verPosition, 0.35, (p) => this.pos.y = p, easings.easeOutQuint)
			
				wait(2, () => {
					if (seconds < 0) this.up()
				})
			},
		}
	])

	bg.pos.y = -bg.height

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
			// stay(),
			z(99999999999),
			"volElement",
			"bar",
		])
	}

	bars = volumeText.get("bar", { recursive: true })

	let speaker = volumeText.add([
		sprite("speakers"),
		opacity(1),
		pos(-40, -110)
	])

	speaker.frame = 1

	// bg.hidden = true
	let gameManager = add([
		stay(),
		{
			canChange: true,
			update() {
				GameState.volumeIndex.volume = parseFloat(GameState.volumeIndex.volume.toFixed(1))
				GameState.sfxVolindex.volume = parseFloat(GameState.sfxVolindex.volume.toFixed(1))
				GameState.musicVolIndex = parseFloat(GameState.musicVolIndex.toFixed(1))

				volume(GameState.volumeIndex)

				if (seconds > 0) {
					seconds -= dt()
				}
				
				else {
					bg.up()
				}

				if (isKeyPressed("-")) {
					bg.down()
					
					if (GameState.volumeIndex > 0) {
						GameState.volumeIndex -= 0.1
						tune -= 25
						bars.forEach(element => {
							element.hidden = false
						});
						speaker.hidden = true
					}

					if (GameState.volumeIndex == 0) {
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
					if (GameState.volumeIndex <= 0.9) {
						GameState.volumeIndex += 0.1
						tune += 25
						play("volumeChange", { detune: tune })
					}

					// else play("whistle")
					else play("volumeChange", { detune: tune })

					seconds = 1.5
					bars.forEach(element => {
						element.hidden = false
					});
					speaker.hidden = true
					volumeText.text = "VOLUME"
				}

				else if (isKeyPressed("n") && panderitoIndex != 3) {
					bg.down()
					if (!GameState.sfxVolindex.muted) {
						GameState.sfxVolindex.volume = 0
						GameState.sfxVolindex.muted = true
						speaker.frame = 0
					}
					
					else {
						GameState.sfxVolindex.volume = GameState.volumeIndex
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
					if (!GameState.volumeIndex.muted) {
						GameState.musicVolIndex = -0
						speaker.frame = 0
					}
					
					else {
						GameState.musicVolIndex = GameState.volumeIndex
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
				}
			
				for(let i = 0; i < GameState.volumeIndex * 10; i++) {
					bars[i].opacity = 1
				}

				if (GameState.sfxVolindex != 0) GameState.sfxVolindex = GameState.volumeIndex
				if (Object.is(GameState.musicVolIndex, -0) == false) GameState.musicVolIndex = GameState.volumeIndex
			
				sfx.volume = GameState.sfxVolindex
				music.volume = GameState.musicVolIndex
			}
		}
	])
}