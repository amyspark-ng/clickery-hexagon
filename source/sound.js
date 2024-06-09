
import { GameState } from "./gamestate.js"
import { panderitoIndex } from "./scenes/game/gamescene.js";

export let sfxHandler;
export function playSfx(sound = "clickPress", tune = 0) {
	sfxHandler = play(sound, {
		volume: GameState.settings.sfx.volume,
		detune: tune
	})
}

export let musicHandler;
export function playMusic(sound = "clickRelease") {
	musicHandler.stop()
	musicHandler = play(sound, {
		volume: GameState.settings.music.volume,
		detune: 0,
		loop: true,	
	})
}


let volElements;

// takes 1.25 seconds
export function scratchSong() {
	musicHandler.winding = true
	tween(musicHandler.detune, rand(-100, -150), 0.25, (p) => musicHandler.detune = p, easings.easeInQuint).then(() => {
		tween(musicHandler.detune, rand(100, 150), 0.25, (p) => musicHandler.detune = p, easings.easeInQuint)
	})
	tween(musicHandler.speed, rand(0.25, 0.5), 0.25, (p) => musicHandler.speed = p, easings.easeInQuint)
	tween(musicHandler.volume, rand(0.1, 0.5), 0.5, (p) => musicHandler.volume = p, easings.easeInQuint).then(() => {
		musicHandler.stop()
	})
}

export function espMute() {
	tween(musicHandler.volume, 0, 0.25, (p) => musicHandler.volume = p, easings.easeOutQuint).onEnd(() => {
		GameState.settings.music.muted = true
		musicHandler.paused = true
	})
	tween(musicHandler.detune, -100, 0.25, (p) => musicHandler.detune = p, easings.easeOutQuint)
}

export function espUnmute() {
	GameState.settings.music.muted = false
	musicHandler.paused = false
	tween(musicHandler.volume, GameState.settings.music.volume, 0.25, (p) => musicHandler.volume = p, easings.easeOutQuint)
	tween(musicHandler.detune, 0, 0.25, (p) => musicHandler.detune = p, easings.easeOutQuint)
}

export function manageMute() {
	GameState.settings.music.muted = !GameState.settings.music.muted 
	musicHandler.paused = !musicHandler.paused 
	if (GameState.settings.music.muted) {
		get("bpmChange", { recursive: true }).forEach(bpmChange => { bpmChange.stopWave() });
	}
	else {
		get("bpmChange", { recursive: true }).forEach(bpmChange => { bpmChange.startWave() });
	}
}

export let volChangeTune = 0

export function volumeManager() {
	let barXPosition = -110
	let seconds = 0

	sfxHandler = play("clickPress", { volume: 0 })
	musicHandler = play("clickRelease", { volume: 0 })
	musicHandler.winding = true
	musicHandler.currentTime = 0 // time()
	musicHandler.totalTime = 0 // duration()
	
	// for (let i = 0; i < get("volElement").length; i++) {
	// 	destroy(get("volElement")[i])
	// }

	let bg = add([
		rect(width() / 6, 80),
		pos(width() / 2, -80),
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
			font: 'lambda',
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
				GameState.settings.volume = parseFloat(GameState.settings.volume.toFixed(1))
				GameState.settings.sfx.volume = parseFloat(GameState.settings.sfx.volume.toFixed(1))
				GameState.settings.music.volume = parseFloat(GameState.settings.music.volume.toFixed(1))

				volume(GameState.settings.volume)

				volChangeTune = map(GameState.settings.volume, 0, 1, -250, 0)
				
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
					
					if (GameState.settings.volume > 0) {
						GameState.settings.volume -= 0.1
						bars.forEach(element => {
							element.hidden = false
						});
						speaker.hidden = true
					}

					if (GameState.settings.volume == 0) {
						bars.forEach(element => {
							element.hidden = true
						});
						speaker.hidden = false
						speaker.frame = 0
					}

					seconds = 1.5
					play("volumeChange", { detune: volChangeTune })
					volumeText.text = "VOLUME"
				}
				
				else if (isKeyPressed("+")) {
					bg.down()

					if (GameState.settings.volume <= 0.9) {
						GameState.settings.volume += 0.1
						play("volumeChange", { detune: volChangeTune })
					}

					// else play("whistle")
					else play("volumeChange", { detune: volChangeTune, volume: 5 })

					seconds = 1.5
					bars.forEach(element => {
						element.hidden = false
					});
					speaker.hidden = true
					volumeText.text = "VOLUME"
				}

				else if (isKeyPressed("n") && panderitoIndex != 3) {
					bg.down()
					if (!GameState.settings.sfx.muted) {
						GameState.settings.sfx.volume = 0
						GameState.settings.sfx.muted = true
						speaker.frame = 0
					}
					
					// unmuted
					else {
						GameState.settings.sfx.volume = GameState.settings.volume
						GameState.settings.sfx.muted = false
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
					manageMute()
					if (GameState.settings.music.muted) speaker.frame = 0
					else speaker.frame = 1
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
				
				for(let i = 0; i < Math.round(GameState.settings.volume * 10); i++) {
					bars[i].opacity = 1
					bars[i].fullOp = 1
				}

				if (!GameState.settings.sfx.muted) GameState.settings.sfx.volume = GameState.settings.volume; else GameState.settings.sfx.volume = 0
				if (!GameState.settings.music.muted) GameState.settings.music.volume = GameState.settings.volume; else GameState.settings.music.volume = 0
			
				sfxHandler.volume = GameState.settings.sfx.volume
				if (!musicHandler.winding) musicHandler.volume = GameState.settings.music.volume
			}
		}
	])
}