import { GameState } from "../../gamestate";
import { waver } from ".././plugins/wave";
import { musicHandler, playMusic, playSfx, scratchSong } from "../../sound";
import { isAchievementUnlocked } from "../unlockables/achievements";
import { bop, formatTime } from "../utils";

export let songs = {
	"clicker.wav": { name: "clicker.wav", idx: 0, speed: 2.5, cover: "wav", duration: 61},
	"menu.wav": { name: "menu.wav", idx: 1, speed: 1.6, cover: "wav", duration: 36 },
	"whatttt.wav": { name: "whatttt.wav", idx: 2, speed: 2, cover: "wav", duration: 51},
	"simple.wav": { name: "simple.wav", idx: 3, speed: 1.3, cover: "wav", duration: 99},
	"jazz.wav": { name: "jazz.wav", idx: 4, speed: 2.1, cover: "wav", duration: 43},
	"sweet.wav": { name: "sweet.wav", idx: 5, speed: 2.5, cover: "wav", duration: 46},
	"ok_instrumental": { name: "ok (Inst)", idx: 6, speed: 2, cover: "ok", duration: 102},
	"magic": { name: "magic.", idx: 7, speed: 1, cover: "bb1", duration: 46},
	"watchout": { name: "Watch out!", idx: 8, speed: 2.4, cover: "bb2", duration: 49,},
	"catnip": { name: "catnip", idx: 9, speed: 2.1, cover: "cat", duration: 67},
	"project_23": { name: "Project_23", idx: 10, speed: 2.1, cover: "bb3", duration: 45},
}

export let songsListened = [];
export let currentSongIdx = 0

export let progressBar;
export let timeText;

// don't mess up with timeSinceSkip, don't reset when window enter
export let timeSinceSkip = 0;
let skipping = false;

// important don't delete
export function setTimeSinceSkip(value = 0) {
	timeSinceSkip = value
}

// such a nitpick! :/
let angleOfDisc = 0
export function musicWinContent(winParent) {
	currentSongIdx = GameState.settings.music.favoriteIdx == null ? 0 : GameState.settings.music.favoriteIdx
	
	let currentSong = songs[Object.keys(songs)[currentSongIdx]]

	function checkForSongListen(songIdx) {
		if (songsListened.includes(songIdx) == false) songsListened.push(songIdx)
	}

	if (!isAchievementUnlocked("allsongs")) {
		checkForSongListen(currentSongIdx)
	}

	let disc = winParent.add([
		sprite("discs", {
			anim: `${songs[Object.keys(songs)[currentSongIdx]].cover}`
		}),
		pos(-150, -20),
		rotate(angleOfDisc),
		anchor("center"),
		scale(1),
		area(),
		"bpmChange",
		"pauseButton",
		"musicButton",
		"windowButton",
		{
			verPosition: -20,
			spinSpeed: musicHandler.paused ? 0 : songs[Object.keys(songs)[currentSongIdx]].speed,
			update() {
				if (musicHandler.winding || skipping) return
				this.angle += this.spinSpeed
				if (Math.floor(this.angle) % 360 == 0) this.angle = 0
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
				this.text = `${songs[Object.keys(songs)[currentSongIdx]].idx + 1}. ${songs[Object.keys(songs)[currentSongIdx]].name} ${musicHandler.paused && !musicHandler.winding? "(PAUSED)" : ""}`
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
				let time = `${formatTime(musicHandler.currentTime, false)}/${formatTime(musicHandler.totalTime === undefined ? musicHandler.duration() : musicHandler.totalTime, false)}`
				this.text = time;
				if (!musicHandler.winding) musicHandler.currentTime = map(progressBar.width, 0, theOneBehind.width, 0, musicHandler.duration())
				if (!musicHandler.winding) musicHandler.totalTime = songs[Object.keys(songs)[currentSongIdx]].duration
			},
		}
	])

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
		"musicButton",
		"windowButton",
		"backButton",
	])

	let pauseButton = winParent.add([
		text("", {
			size: 40
		}),
		pos(15, 60),
		area(),
		scale(),
		anchor("center"),
		"musicButton",
		"windowButton",
		"pauseButton",
		{
			update() {
				if (musicHandler.paused && !musicHandler.winding) this.text = ">"
				else this.text = "||"
			}
		}
	])

	let skipButton = winParent.add([
		text(">", {
			size: 40
		}),
		pos(60, 60),
		area(),
		scale(),
		anchor("center"),
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
			if (currentSongIdx < 0) currentSongIdx = Object.keys(songs).length - 1
			currentSong = songs[Object.keys(songs)[currentSongIdx]]
		}

		playSfx("clickButton", {detune: rand(-150, 50)})
		bop(backButton)
	}

	function skipButtonAction() {
		currentSongIdx++
		if (currentSongIdx >= Object.keys(songs).length) currentSongIdx = 0
		currentSong = songs[Object.keys(songs)[currentSongIdx]]

		playSfx("clickButton", {detune: rand(-50, 150)})
		bop(skipButton)
	}

	function pauseButtonAction() {
		if (musicHandler.winding) return
		musicHandler.paused = !musicHandler.paused

		// ^ only manages pause, do the other stuff below
		pauseButton.text = musicHandler.paused ? ">" : "||"
		get("bpmChange", { recursive: true }).forEach(bpmChange => {
			musicHandler.paused ? bpmChange.stopWave() : bpmChange.startWave()
		})
		tween(disc.spinSpeed, musicHandler.paused ? 0 : songs[Object.keys(songs)[currentSongIdx]].speed, 1, (p) => disc.spinSpeed = p, easings.easeOutQuint)
		
		playSfx("clickButton", {detune: rand(-100, 100)})
		bop(pauseButton)
	}

	function generalBackSkipButtonAction(action) {
		if (skipping == false) {
			skipping = true
			get("bpmChange", { recursive: true }).forEach(element => { element.stopWave() });
		}
		scratchSong()
		tween(progressBar.width, 0, 0.5, (p) => progressBar.width = p, easings.easeOutQuint)
		
		musicHandler.currentTime = musicHandler.time()
		musicHandler.totalTime = musicHandler.duration()
		tween(musicHandler.currentTime, 0, 0.5, (p) => musicHandler.currentTime = p, easings.easeOutQuint)
		tween(musicHandler.totalTime, songs[Object.keys(songs)[currentSongIdx]].duration, 0.5, (p) => musicHandler.totalTime = p, easings.easeOutQuint)
		
		// is a different song
		let idxOfNewSong = (action == 0 ? currentSongIdx + 1 : currentSongIdx - 1) // that's crazy
		if (idxOfNewSong < 0) idxOfNewSong = Object.keys(songs).length - 1
		if (idxOfNewSong >= Object.keys(songs).length) idxOfNewSong = 0

		if (songs[Object.keys(songs)[idxOfNewSong]].cover != songs[Object.keys(songs)[currentSongIdx]].cover) {
			tween(disc.angle, 0, 0.5, (p) => disc.angle = p, easings.easeOutQuint)
			// goes back
			if (action == 0) tween(1, -1, 0.5, (p) => disc.scale.x = p, easings.easeOutQuint)
			// goes skip
			else if (action == 1) tween(-1, 1, 0.5, (p) => disc.scale.x = p, easings.easeOutQuint)
		}
	
		else {
			if (action == 0) tween(disc.angle, disc.angle - rand(75, 100), 0.5, (p) => disc.angle = p, easings.easeOutQuint)
			else tween(disc.angle, disc.angle + rand(75, 100), 0.5, (p) => disc.angle = p, easings.easeOutQuint)
		}
		
		disc.play(songs[Object.keys(songs)[currentSongIdx]].cover)
		GameState.settings.music.favoriteIdx = currentSongIdx
		timeSinceSkip = 0

		if (!isAchievementUnlocked("allsongs")) {
			checkForSongListen(currentSongIdx)
		}

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
			let action;
			if (mBtn.is("backButton")) {backButtonAction(); action = 0}
			else if (mBtn.is("skipButton")) {skipButtonAction(); action = 1}
			
			generalBackSkipButtonAction(action) // goes after
		}

		else if (mBtn.is("pauseButton")) {
			pauseButtonAction()
		}
	}))
	
	get("bpmChange", { recursive: true }).forEach(bpmChange => {
		if (!bpmChange.is("wave")) bpmChange.use(waver({ 
			maxAmplitude: 5,
			wave_speed: currentSong.speed,
			wave_tweenSpeed: 0.2
		}))

		if (!musicHandler.paused ) bpmChange.startWave()
	})

	onUpdate("bpmChange", (bpmChangeObj) => {
		bpmChangeObj.wave_speed = currentSong.speed
	})
	
	// support for keys let's gooooo
	winParent.onKeyPress((key) => {
		let action;
		if (key == "left") {backButtonAction(); action = 0}
		else if (key == "right") {skipButtonAction(); action = 1}
		if (key == "left" || key == "right") generalBackSkipButtonAction(action)

		else if (key == "up") pauseButtonAction()
	})

	winParent.on("close", () => {
		angleOfDisc = disc.angle
	})

	// fuck my small penis life
	theOneBehind.onClick(() => {
		if (!winParent.active) return
		
		let leftSideOfTheOneBehind = theOneBehind.screenPos().x - theOneBehind.width * 0.5
		let rightSideOfTheOneBehind = theOneBehind.screenPos().x + theOneBehind.width * 0.5

		let mappedSeconds = map(mousePos().x, leftSideOfTheOneBehind, rightSideOfTheOneBehind, 0, musicHandler.duration())
		mappedSeconds = clamp(mappedSeconds, 0, musicHandler.duration())

		if (!skipping) {
			musicHandler.winding = true
			musicHandler.seek(mappedSeconds)

			let mappedWidth = map(mappedSeconds, 0, currentSong.duration, 0, theOneBehind.width)
			tween(progressBar.width, mappedWidth, 0.2, p => progressBar.width = p, easings.easeOutQuint).onEnd(() => {
				musicHandler.winding = false
			})
		}
	})

	return;
}