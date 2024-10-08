import { AudioPlay, AudioPlayOpt, Key } from "kaplay";
import { GameState } from "./gamestate.ts"
import { panderitoIndex } from "./game/gamescene.ts";
import { bop } from "./game/utils.ts";

let bg:any;
let volumeText:any;
let speaker:any;
let trayVolElements:any;
let volumeBars:any;

export let sfxHandlers = new Set<AudioPlay>();
export function playSfx(sound:string, opts?:AudioPlayOpt) {
	opts = opts || {}
	opts.detune = opts.detune || 0
	opts.speed = opts.speed || 1
	opts.loop = opts.loop || false
	opts.volume = opts.volume || GameState.settings.sfx.muted == true ? 0 : GameState.settings.sfx.volume

	let handle = play(sound, {
		volume: opts.volume,
		detune: opts.detune,
		speed: opts.speed,
		loop: opts.loop,
	})

	sfxHandlers.add(handle)
	handle.onEnd(() => sfxHandlers.delete(handle))

	return handle;
}

export function stopAllSounds() {
	sfxHandlers.forEach((handler) => {
		handler.stop()
	})
}

export let musicHandler:any;
export function playMusic(song:string, opts?:AudioPlayOpt) {
	opts = opts || {}
	
	// IF VOLUME IS NOT SET DO THE SETTING CHECK
	opts.volume = opts.volume || GameState.settings.music.muted == true ? 0 : GameState.settings.music.volume
	
	opts.loop = opts.loop || true
	opts.detune = opts.detune || 0

	musicHandler?.stop()
	musicHandler = play(song, {
		volume: opts.volume,
		loop: opts.loop,	
		detune: opts.detune,
	})
}

export function changeVolume(type: "sfx" | "music", volume:number) {
	if (type == "sfx") {
		sfxHandlers.forEach((handler) => {
			handler.volume = volume
		})
	}

	else if (type == "music") {
		musicHandler.volume = volume
	}
}

export function manageMute(type: "sfx" | "music", mute:boolean) {
	if (type == "sfx") {
		GameState.settings.sfx.muted = mute
		changeVolume("sfx", mute == true ? 0 : GameState.settings.sfx.volume)
	}

	else if (type == "music") {
		GameState.settings.music.muted = mute
		changeVolume("music", mute == true ? 0 : GameState.settings.music.volume)
	}
}

// takes 1.25 seconds
export function scratchSong() {
	musicHandler.winding = true
	tween(musicHandler.detune, rand(-100, -150), 0.25, (p) => musicHandler.detune = p, easings.easeInQuint).then(() => {
		tween(musicHandler.detune, rand(100, 150), 0.25, (p) => musicHandler.detune = p, easings.easeInQuint)
	})
	tween(musicHandler.speed, rand(0.25, 0.5), 0.25, (p) => musicHandler.speed = p, easings.easeInQuint)
	tween(musicHandler.volume, musicHandler.volume * rand(0.1, 0.5), 0.5, (p) => musicHandler.volume = p, easings.easeInQuint).then(() => {
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
		layer("sound"),
		z(0),
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
		layer("sound"),
		z(1),
		"trayVolElement",
	])

	speaker = volumeText.add([
		sprite("speakers"),
		opacity(1),
		pos(0, -64),
		scale(),
		anchor("center"),
		layer("sound"),
		z(1),
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
			layer("sound"),
			z(1),
			scale(),
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
	let waitingTimer = wait(0, function(){})

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
							volumeText.text = `VOLUME: ${(GameState.settings.volume * 100).toFixed(0)}%`
							bop(volumeBars[clamp(Math.floor(GameState.settings.volume * 10 - 1), 0, 10)], 0.05)
						}

						get("trayVolBar", { recursive: true }).forEach(trayVolBar => {
							trayVolBar.hidden = GameState.settings.volume == 0 ? true : false
						})
						speaker.hidden = GameState.settings.volume == 0 ? false : true
						speaker.frame = GameState.settings.volume == 0 ? 0 : 1
					}
				}
				
				else if (isKeyPressed("+" as Key)) {
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
					volumeText.text = `VOLUME: ${(GameState.settings.volume * 100).toFixed(0)}%`
				}

				else if (isKeyPressed("n") && panderitoIndex != 3) {
					// have to trigger this before because else the objects will not exist
					this.trigger("show")
					
					manageMute("sfx", !GameState.settings.sfx.muted)
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
					bop(speaker, 0.05)

					// toggle checkbox in setings window
					if (get("musicCheckbox", { recursive: true })[0]) {
						if (GameState.settings.music.muted) get("musicCheckbox", { recursive: true })[0]?.turnOff()
						else get("musicCheckbox", { recursive: true })[0]?.turnOn()
					}

					manageMute("music", GameState.settings.music.muted)
				}
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