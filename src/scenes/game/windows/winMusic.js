import { GameState } from "../../../GameState";
import { espMute, espUnmute, musicHandler, playMusic, scratchSong } from "../../../sound";
import { bop, formatMusicTime, isCloserTo0Or360 } from "../utils";

export let songs = {
	"clicker.wav": { name: "clicker.wav", idx: 0, speed: 2.5, coverIdx: 0, duration: 61},
	"menu.wav": { name: "menu.wav", idx: 1, speed: 1.6, coverIdx: 0, duration: 36 },
	"whatttt.wav": { name: "whatttt.wav", idx: 2, speed: 2, coverIdx: 0, duration: 51},
	"simple.wav": { name: "simple.wav", idx: 3, speed: 1.3, coverIdx: 0, duration: 99},
	"jazz.wav": { name: "jazz.wav", idx: 4, speed: 2.1, coverIdx: 0, duration: 43},
	"sweet.wav": { name: "sweet.wav", idx: 5, speed: 2.5, coverIdx: 0, duration: 46},
	"ok_instrumental": { name: "ok (Inst)", idx: 6, speed: 2, coverIdx: 2, duration: 102},
	"magic": { name: "magic.", idx: 7, speed: 1, coverIdx: 0, duration: 46},
	"watchout": { name: "Watch out!", idx: 8, speed: 2.4, coverIdx: 0, duration: 49,},
	"catnip": { name: "catnip", idx: 9, speed: 2.1, coverIdx: 1, duration: 67},
}

export let currentSongIdx = 0

export let progressBar;
export let timeText;

let timeSinceSkip = 0;
let skipping = false;

function startWave() {
    get("wave", { recursive: true }).forEach(obj => tween(0, 2.5, 1, v => obj.amplitude = v))
}

function stopWave() {
    get("wave", { recursive: true }).forEach(obj => tween(2.5, 0, 1, v => obj.amplitude = v))
}

export function musicWinContent(winParent) {
	currentSongIdx = GameState.music.favoriteIdx == null ? 0 : GameState.music.favoriteIdx
	let disc = winParent.add([
		sprite("musicWinElements"),
		pos(-150, -20),
		rotate(),
		area(),
		anchor("center"),
		scale(),
		"hoverObj",
		"wave",
		"musicButton",
		{
			defScale: vec2(1),
			amplitude: 0,
			verPosition: -20,
			update() {
				if (musicHandler.winding || GameState.music.muted || skipping) return
				this.angle += songs[Object.keys(songs)[currentSongIdx]].speed
				if (Math.floor(this.angle % 360 == 0)) this.angle = 0
			}
		}
	])

	disc.frame = 0

	disc.onClick(() => {
		bop(disc)
		
		if (!GameState.music.muted) {espMute(); stopWave()}
		else {espUnmute(); startWave()}
	})

	let nowPlaying = winParent.add([
		pos(-50, -25),
		text(Object.keys(songs)[0], {
			size: 20,
			styles: {
				"small": {
					scale: vec2(0.8)
				}
			}
		}),
		anchor("left"),
		{
			update() {
				if (timeSinceSkip < 5) timeSinceSkip += dt()
				this.text = `${songs[Object.keys(songs)[currentSongIdx]].idx + 1}. ${songs[Object.keys(songs)[currentSongIdx]].name} ${GameState.music.muted ? "(MUTED)" : ""}\nby Enysmo`
			}
		}
	])

	let theOneBehind = winParent.add([
		rect(winParent.width - 50, 10),
		pos(0, 25),
		area(),
		color(rgb(100, 100, 100)),
		area(),
		anchor("center"),
	])

	timeText = winParent.add([
		text("0:00", {
			size: 20,
		}),
		pos(-120, 50),
		anchor("center"),
		"bpmChange",
		"wave",
		{
			verPosition: 50,
			update() {
				this.text = `${formatMusicTime(musicHandler.currentTime === undefined ? 0 : musicHandler.currentTime)}/${formatMusicTime(musicHandler.totalTime === undefined ? musicHandler.duration() : musicHandler.totalTime)}`
				if (!musicHandler.winding || !GameState.music.muted) musicHandler.currentTime = musicHandler.time()
				if (!musicHandler.winding || !GameState.music.muted) musicHandler.totalTime = songs[Object.keys(songs)[currentSongIdx]].duration
			},
		}
	])

	theOneBehind.onClick(() => {
		if (theOneBehind.isHovering()) {
			// calculation stuff
			let objectRect = theOneBehind.screenArea().bbox();
			let distanceFromCenter = mousePos().x - objectRect.pos.x - (objectRect.width / 2);
			let relativePosition = distanceFromCenter / (objectRect.width / 2);
			relativePosition = (relativePosition + 0.9) / 1.8;
			let timeInSeconds = relativePosition * musicHandler.duration()
			timeInSeconds = clamp(timeInSeconds, 0, musicHandler.duration())
			musicHandler.seek(timeInSeconds)
		}
	})

	// theOneBehind.onHover(() => {
	// 	mouse.anchor = "topleft"
	// })

	// theOneBehind.onHoverEnd(() => {
	// 	mouse.anchor = "center"
	// })

	progressBar = winParent.add([
		rect(1, 10),
		pos(theOneBehind.pos.x - theOneBehind.width / 2, theOneBehind.pos.y),
		color(WHITE),
		anchor("left"),
		{
			update() {
				if (musicHandler.winding || GameState.music.muted ) return
				this.width = musicHandler.time() / musicHandler.duration() * theOneBehind.width
			},

			draw() {
				drawCircle({
					pos: vec2(this.width, 0),
					radius: 8,
					color: this.color,
					anchor: "center",
					opacity: this.opacity
				})
			}
		}
	])

	let skipButton = winParent.add([
		text(">", {
			size: 40
		}),
		pos(30, 30),
		area(),
		scale(),
		"hoverObj",
		"musicButton",
		"playlist",
		{
			defScale: vec2(1),
		}
	])

	let backButton = winParent.add([
		text("<", {
			size: 40
		}),
		pos(-30, 30),
		area(),
		scale(),
		"hoverObj",
		"musicButton",
		"playlist",
		{
			defScale: vec2(1),
		}
	])

	// each tim you click it waits one seonc, if the time since the skip is greater than 1 it plays the song
	// if the time since the skip is less than 1 it does nothing
	get("playlist", { recursive: true }).forEach(mBtn => mBtn.onClick(() => {
		if (skipping == false) {
			skipping = true
			stopWave()
		}
		scratchSong()
		tween(progressBar.width, 0, 0.5, (p) => progressBar.width = p, easings.easeOutQuint)
		tween(musicHandler.currentTime, 0, 0.5, (p) => musicHandler.currentTime = p, easings.easeOutQuint)

		if (mBtn.text == "<") {
			currentSongIdx--
			tween(disc.angle, disc.angle - rand(75, 100), 0.5, (p) => disc.angle = p, easings.easeOutQuint)
			if (currentSongIdx < 0) currentSongIdx = Object.keys(songs).length - 1
		}
		
		else {
			currentSongIdx++
			tween(disc.angle, disc.angle + rand(75, 100), 0.5, (p) => disc.angle = p, easings.easeOutQuint)
			if (currentSongIdx >= Object.keys(songs).length) currentSongIdx = 0
		}

		tween(musicHandler.totalTime, songs[Object.keys(songs)[currentSongIdx]].duration, 0.5, (p) => musicHandler.totalTime = p, easings.easeOutQuint)
		disc.frame = songs[Object.keys(songs)[currentSongIdx]].coverIdx
		GameState.music.favoriteIdx = currentSongIdx
		bop(mBtn)

		timeSinceSkip = 0

		wait(1, () => {
			if (timeSinceSkip > 1) {
				if (disc.angle > 360) {
					// returns true if closer to 0
					// if (isCloserTo0Or360(disc.angle)) {
					// 	tween(disc.angle, 0, 0.25, (p) => disc.angle = p, easings.easeOutQuint)
					// 	musicHandler.detune = 100
					// 	tween(musicHandler.detune, 0, 0.25, (p) => musicHandler.detune = p, easings.easeOutQuint)
					// }

					// else {
					// 	tween(disc.angle, 360, 0.25, (p) => disc.angle = p, easings.easeOutQuint)
					// 	musicHandler.detune = -100
					// 	tween(musicHandler.detune, 0, 0.25, (p) => musicHandler.detune = p, easings.easeOutQuint)
					// }
				}
				playMusic(Object.keys(songs)[currentSongIdx])
				skipping = false
				musicHandler.winding = false
				if (GameState.music.muted) musicHandler.paused = true
				startWave()
			}
		})
	}))
	
	get("wave", { recursive: true }).forEach(waveObj => {
		waveObj.amplitude = 0
		waveObj.onUpdate(() => {
			if (GameState.music.muted) return
			const t = time() * songs[Object.keys(songs)[currentSongIdx]].speed
			waveObj.pos.y = waveObj.verPosition + waveObj.amplitude * Math.cos(t * songs[Object.keys(songs)[currentSongIdx]].speed)
		})
	});

	startWave()

	return;
}