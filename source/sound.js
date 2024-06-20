
import { GameState } from "./gamestate.js"
import { positionSetter } from "./plugins/positionSetter.js";
import { panderitoIndex } from "./scenes/game/gamescene.js";
import { bop } from "./scenes/game/utils.js";

let bg;
let volumeText;
let speaker;
let trayVolElements;
let volumeBars;

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

export let volChangeTune = 0
let showTween = null;

export function addSoundElements() {
	bg = add([
		rect(width() / 6, 80, { radius: 2.5 }),
		pos(width() / 2, 0),
		anchor("top"),
		color(BLACK),
		stay(),
		opacity(0.75),
		z(999999999),
		"trayVolElement",
		{
			upYPos: -80,
			downYPos: 0,
		}
	])

	bg.pos.y = bg.upYPos
	
	volumeText = bg.add([
		text("VOLUME"),
		pos(0, bg.height - 12),
		anchor("center"),
		scale(0.6),
		z(9999999999),
		"trayVolElement",
	])

	speaker = volumeText.add([
		sprite("speakers"),
		opacity(1),
		pos(0, -64),
		positionSetter(),
		anchor("center"),
		"trayVolElement",
	])

	// frame 1 is sound / frame 0 is muted
	speaker.frame = 0
	speaker.hidden = true

	// bars
	for (let i = 0; i < 10; i++) {
		bg.add([
			pos(-67 + i * 15, 30),
			rect(10, bg.height - 40, { radius: 1 }),
			opacity(0),
			anchor("center"),
			z(99999999999),
			"trayVolElement",
			"trayVolBar",
			{
				volume: 0.1 * (i + 1),
				update() {
					if (GameState.settings.volume.toFixed(1) < this.volume.toFixed(1)) this.opacity = 0.1
					else this.opacity = 1
				}
			}
		])
	}

	trayVolElements = get("trayVolElement", { recursive: true })
	volumeBars = get("trayVolBar", { recursive: true })
}

export function volumeManager() {
	showTween = tween(GameState.settings.volume, GameState.settings.volume , 0, (p) => GameState.settings.volume = p, easings.linear)
	volume(GameState.settings.volume)

	let changeVolTune = 0
	let waitingTimer = wait()

	sfxHandler = play("clickPress", { volume: 0 })
	musicHandler = play("clickRelease", { volume: 0 })
	musicHandler.winding = true
	musicHandler.currentTime = 0 // time()
	musicHandler.totalTime = 0 // duration()
	
	trayVolElements = get("trayVolElement", { recursive: true }) 

	let soundManager = add([
		stay(),
		{
			update() {
				GameState.settings.volume = parseFloat(GameState.settings.volume.toFixed(1))
				GameState.settings.sfx.volume = parseFloat(GameState.settings.sfx.volume.toFixed(1))
				GameState.settings.music.volume = parseFloat(GameState.settings.music.volume.toFixed(1))
				volChangeTune = map(GameState.settings.volume, 0, 1, -250, 0)

				if (isKeyPressed("-")) {
					// have to trigger this before because else the objects will not exist
					this.trigger("show")
					if (GameState.settings.volume > 0) {
						GameState.settings.volume -= 0.1
						volume(GameState.settings.volume)

						// would mute
						if (GameState.settings.volume == 0) {
							// mute everything
							volumeText.text = "SOUND OFF"
							// no need to mute other things because their volume 
							// is being managed by the volume() function globally lol!
						}
							
						else {
							volumeText.text = `VOLUME: ${GameState.settings.volume.toFixed(1) * 100}%`
							bop(volumeBars[clamp(Math.floor(GameState.settings.volume * 10 - 1), 0, 10)], 0.05)
						}

						get("trayVolBar", { recursive: true }).forEach(trayVolBar => {
							trayVolBar.hidden = GameState.settings.volume == 0 ? true : false
						})
						speaker.hidden = GameState.settings.volume == 0 ? false : true
						speaker.frame = GameState.settings.volume == 0 ? 0 : 1
					}
				}
				
				else if (isKeyPressed("+")) {
					// have to trigger this before because else the objects will not exist
					this.trigger("show")
					get("trayVolBar", { recursive: true }).forEach(trayVolBar => {
						trayVolBar.hidden = false
					})
					speaker.hidden = true
					speaker.frame = 1

					if (GameState.settings.volume <= 0.9) {
						GameState.settings.volume += 0.1
						volume(GameState.settings.volume)
					}

					else {
						// // this is too loud
						// play("whistle")
					}

					bop(volumeBars[clamp(Math.floor(GameState.settings.volume * 10 - 1), 0, 10)], 0.05)
					volumeText.text = `VOLUME ${GameState.settings.volume.toFixed(1) * 100}%`
				}

				else if (isKeyPressed("n") && panderitoIndex != 3) {
					// have to trigger this before because else the objects will not exist
					this.trigger("show")
					
					GameState.settings.sfx.muted = !GameState.settings.sfx.muted
					volumeText.text = `SFX: ${GameState.settings.sfx.muted ? "OFF" : "ON"}`
					
					get("trayVolBar", { recursive: true }).forEach(trayVolBar => {
						trayVolBar.hidden = true
					})
					speaker.hidden = false
					speaker.frame = GameState.settings.sfx.muted ? 0 : 1
					bop(speaker, 0.05)

					// toggle checkbox in setings window
					if (get("sfxCheckbox", { recursive: true })[0]) {
						if (GameState.settings.sfx.muted) get("sfxCheckbox", { recursive: true })[0]?.turnOff()
						else get("sfxCheckbox", { recursive: true })[0]?.turnOn()
					}
				}

				else if (isKeyPressed("m")) {
					// have to trigger this before because else the objects will not exist
					this.trigger("show")
					
					GameState.settings.music.muted = !GameState.settings.music.muted
					volumeText.text = `MUSIC: ${GameState.settings.music.muted ? "OFF" : "ON"}`
					
					get("trayVolBar", { recursive: true }).forEach(trayVolBar => {
						trayVolBar.hidden = true
					})
					speaker.hidden = false
					speaker.frame = GameState.settings.music.muted ? 0 : 1
					get("bpmChange", { recursive: true }).forEach((bpmChange) => {
						GameState.settings.music.muted ? bpmChange.stopWave() : bpmChange.startWave()
					})
					bop(speaker, 0.05)

					// toggle checkbox in setings window
					if (get("musicCheckbox", { recursive: true })[0]) {
						if (GameState.settings.music.muted) get("musicCheckbox", { recursive: true })[0]?.turnOff()
						else get("musicCheckbox", { recursive: true })[0]?.turnOn()
					}
				}

				if (!GameState.settings.sfx.muted) GameState.settings.sfx.volume = GameState.settings.volume; 
				else GameState.settings.sfx.volume = 0
				
				if (!GameState.settings.music.muted) GameState.settings.music.volume = GameState.settings.volume; 
				else GameState.settings.music.volume = 0
			
				sfxHandler.volume = GameState.settings.sfx.volume
				if (!musicHandler.winding) musicHandler.volume = GameState.settings.music.volume
			}
		}
	])

	soundManager.on("hide", () => {
		if (get("trayVolElement").length === 0) return

		showTween.cancel()
		showTween = tween(bg.pos.y, bg.upYPos, 0.32, (p) => bg.pos.y = p, easings.easeOutQuad).then(() => {
			waitingTimer.cancel()
			waitingTimer = wait(0.5, () => {
				trayVolElements.forEach(soundElement => {
					destroy(soundElement)
				});
			})
		})
	})

	soundManager.on("show", () => {
		if (get("trayVolElement").length === 0) addSoundElements()

		if (showTween) {
			showTween.cancel()
		}
		showTween = tween(bg.pos.y, bg.downYPos, 0.32, (p) => bg.pos.y = p, easings.easeOutQuad)

		waitingTimer.cancel()
		waitingTimer = wait(1, () => {
			soundManager.trigger("hide")
		})

		if (GameState.settings.volume < 10)	play("volumeChange", { detune: changeVolTune })
	})

	// DON'T ADD ONCHARINPUT BECAUSE THE NUMBERS ARE EXCLUSIVE FOR THE WINDOWS BUTTONS!!!!

	return soundManager;
}