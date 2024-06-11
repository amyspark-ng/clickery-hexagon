import { GameState } from "../../../gamestate";
import { waver } from "../../../plugins/wave";
import { musicHandler, playMusic, playSfx, scratchSong } from "../../../sound";
import { bop, formatMusicTime } from "../utils";

export let songs = {
	"clicker.wav": { name: "clicker.wav", idx: 0, speed: 2.5, cover: "defaultCover", duration: 61},
	"menu.wav": { name: "menu.wav", idx: 1, speed: 1.6, cover: "defaultCover", duration: 36 },
	"whatttt.wav": { name: "whatttt.wav", idx: 2, speed: 2, cover: "defaultCover", duration: 51},
	"simple.wav": { name: "simple.wav", idx: 3, speed: 1.3, cover: "defaultCover", duration: 99},
	"jazz.wav": { name: "jazz.wav", idx: 4, speed: 2.1, cover: "defaultCover", duration: 43},
	"sweet.wav": { name: "sweet.wav", idx: 5, speed: 2.5, cover: "defaultCover", duration: 46},
	"ok_instrumental": { name: "ok (Inst)", idx: 6, speed: 2, cover: "okCover", duration: 102},
	"magic": { name: "magic.", idx: 7, speed: 1, cover: "defaultCover", duration: 46},
	"watchout": { name: "Watch out!", idx: 8, speed: 2.4, cover: "defaultCover", duration: 49,},
	"catnip": { name: "catnip", idx: 9, speed: 2.1, cover: "catnipCover", duration: 67},
	"project_23": { name: "Project_23", idx: 10, speed: 2.1, cover: "defaultCover", duration: 45},
}

export let currentSongIdx = 0

export let progressBar;
export let timeText;

export let timeSinceSkip = 0;
let skipping = false;

// important don't delete
export function setTimeSinceSkip(value = 0) {
	timeSinceSkip = value
}

export function musicWinContent(winParent) {
	currentSongIdx = GameState.settings.music.favoriteIdx == null ? 0 : GameState.settings.music.favoriteIdx
	let disc = winParent.add([
		sprite("discs", {
			anim: `${songs[Object.keys(songs)[currentSongIdx]].cover}`
		}),
		pos(-150, -20),
		rotate(),
		anchor("center"),
		scale(),
		area(),
		"bpmChange",
		"hoverObj",
		"pauseButton",
		"musicButton",
		"windowButton",
		{
			verPosition: -20,
			update() {
				if (musicHandler.winding || GameState.settings.music.muted || skipping || musicHandler.paused) return
				this.angle += songs[Object.keys(songs)[currentSongIdx]].speed
				if (Math.floor(this.angle % 360 == 0)) this.angle = 0
			}
		}
	])

	let nowPlaying = winParent.add([
		pos(-50, -25),
		text(Object.keys(songs)[0], {
			size: 20,
			styles: {
				"small": {
					scale: vec2(0.8),
					pos: vec2(0, 4)
				}
			}
		}),
		anchor("left"),
		{
			update() {
				this.text = `${songs[Object.keys(songs)[currentSongIdx]].idx + 1}. ${songs[Object.keys(songs)[currentSongIdx]].name} ${musicHandler.paused && !musicHandler.winding? "(PAUSED)" : ""}\nby Enysmo`
			}
		}
	])

	let theOneBehind = winParent.add([
		rect(winParent.width - 50, 10, { radius: 20 }),
		pos(0, 25),
		area(),
		color(),
		area({ scale: vec2(1, 1.25) }),
		opacity(1),
		anchor("center"),
		{
			update() {
				this.color = progressBar.color.darken(150)
			}
		}
	])

	timeText = winParent.add([
		text("0:00", {
			size: 20,
		}),
		pos(-120, 50),
		anchor("center"),
		"bpmChange",
		{
			verPosition: 50,
			update() {
				this.text = `${formatMusicTime(musicHandler.currentTime === undefined ? 0 : musicHandler.currentTime)}/${formatMusicTime(musicHandler.totalTime === undefined ? musicHandler.duration() : musicHandler.totalTime)}`
				if (!musicHandler.winding) musicHandler.currentTime = map(progressBar.width, 0, theOneBehind.width, 0, musicHandler.duration())
				if (!musicHandler.winding) musicHandler.totalTime = songs[Object.keys(songs)[currentSongIdx]].duration
			},
		}
	])

	theOneBehind.onClick(() => {
		if (!winParent.is("active")) return
		if (!skipping) {
			if (theOneBehind.isHovering()) {
				// calculation stuff
				let objectRect = theOneBehind.screenArea().bbox();
				let distanceFromCenter = mousePos().x - objectRect.pos.x - (objectRect.width / 2);
				let relativePosition = distanceFromCenter / (objectRect.width / 2);
				relativePosition = (relativePosition + 0.9) / 1.8;
				let timeInSeconds = relativePosition * musicHandler.duration()
				timeInSeconds = clamp(timeInSeconds, 0, musicHandler.duration())
	
				musicHandler.winding = true
				musicHandler.seek(timeInSeconds)
				tween(progressBar.width, relativePosition * theOneBehind.width, 0.2, p => progressBar.width = p, easings.easeOutQuint).onEnd(() => {
					musicHandler.winding = false
				})
			}
		}
	})

	progressBar = winParent.add([
		rect(1, 10, { radius: 10 }),
		pos(theOneBehind.pos.x - theOneBehind.width / 2, theOneBehind.pos.y),
		color(WHITE),
		anchor("left"),
		{
			update() {
				if (musicHandler.winding) return
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

	// theOneBehind.color = progressBar.color

	let backButton = winParent.add([
		text("<", {
			size: 40
		}),
		pos(-30, 60),
		area(),
		scale(),
		anchor("center"),
		"hoverObj",
		"musicButton",
		"windowButton",
		"backButton",
	])

	let pauseButton = winParent.add([
		text(GameState.settings.music.muted ? ">" : "||", {
			size: 40
		}),
		pos(15, 60),
		area(),
		scale(),
		anchor("center"),
		"hoverObj",
		"musicButton",
		"windowButton",
		"pauseButton"
	])

	let skipButton = winParent.add([
		text(">", {
			size: 40
		}),
		pos(60, 60),
		area(),
		scale(),
		anchor("center"),
		"hoverObj",
		"musicButton",
		"windowButton",
		"skipButton",
	])

	function backButtonAction() {
		// has been over 2 seconds so you might want to go back to the start of the song
		if (musicHandler.currentTime > 2) {
			musicHandler.seek(0)
			musicHandler.winding = true
		}
		
		else {
			currentSongIdx--
			tween(disc.angle, disc.angle - rand(75, 100), 0.5, (p) => disc.angle = p, easings.easeOutQuint)
			if (currentSongIdx < 0) currentSongIdx = Object.keys(songs).length - 1
		}
	}

	function skipButtonAction() {
		currentSongIdx++
		tween(disc.angle, disc.angle + rand(75, 100), 0.5, (p) => disc.angle = p, easings.easeOutQuint)
		if (currentSongIdx >= Object.keys(songs).length) currentSongIdx = 0
		playSfx("clickButton", rand(-150, 50))
	}

	function pauseButtonAction() {
		musicHandler.paused = !musicHandler.paused

		// ^ only manages pause, do the other stuff below
		pauseButton.text = musicHandler.paused ? ">" : "||"
		get("bpmChange", { recursive: true }).forEach(bpmChange => {
			musicHandler.paused ? bpmChange.stopWave() : bpmChange.startWave()
		})
		playSfx("clickButton", rand(-100, 100))
	}

	function generalBackSkipButtonAction() {
		if (skipping == false) {
			skipping = true
			get("bpmChange", { recursive: true }).forEach(element => { element.stopWave() });
		}
		scratchSong()
		tween(progressBar.width, 0, 0.5, (p) => progressBar.width = p, easings.easeOutQuint)
		tween(musicHandler.currentTime, 0, 0.5, (p) => musicHandler.currentTime = p, easings.easeOutQuint)
		musicHandler.winding = true

		tween(musicHandler.totalTime, songs[Object.keys(songs)[currentSongIdx]].duration, 0.5, (p) => musicHandler.totalTime = p, easings.easeOutQuint)
		disc.play(songs[Object.keys(songs)[currentSongIdx]].cover)
		GameState.settings.music.favoriteIdx = currentSongIdx
		timeSinceSkip = 0

		wait(1, () => {
			if (timeSinceSkip > 1) {
				playMusic(Object.keys(songs)[currentSongIdx])
				skipping = false
				musicHandler.winding = false

				get("bpmChange", { recursive: true }).forEach(element => { musicHandler.paused ? true : element.startWave() });
			}
		})
	}

	// each tim you click it waits one seonc, if the time since the skip is greater than 1 it plays the song
	// if the time since the skip is less than 1 it does nothing
	get("musicButton", { recursive: true }).forEach(mBtn => mBtn.onClick(() => {
		if (mBtn.is("backButton") || mBtn.is("skipButton")) {
			generalBackSkipButtonAction()

			if (mBtn.is("backButton")) {
				backButtonAction()
			}
			
			else if (mBtn.is("skipButton")) {
				skipButtonAction()
			}
		}

		else if (mBtn.is("pauseButton")) {
			pauseButtonAction()
		}

		bop(mBtn)
	}))
	
	get("bpmChange", { recursive: true }).forEach(bpmChange => {
		if (!bpmChange.is("wave")) bpmChange.use(waver({ maxAmplitude: 5, wave_speed: songs[Object.keys(songs)[currentSongIdx]].speed, wave_tweenSpeed: 0.2 }))
		if (!GameState.settings.music.muted || !musicHandler.paused ) bpmChange.startWave()
	})
	onUpdate("bpmChange", (bpmChange) => {
		bpmChange.wave_speed = songs[Object.keys(songs)[currentSongIdx]].speed
	})
	
	// support for keys let's gooooo
	winParent.onKeyPress("right", () => {
		generalBackSkipButtonAction()
		skipButtonAction()
	})

	winParent.onKeyPress("left", () => {
		generalBackSkipButtonAction()
		backButtonAction()
	}) 

	winParent.onKeyPress("up", () => {
		pauseButtonAction()
	}) 

	return;
}