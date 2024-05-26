import { GameState } from "../../../GameState";
import { waver } from "../../../plugins/wave";
import { espMute, espUnmute, musicHandler, playMusic, playSfx, scratchSong } from "../../../sound";
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
}

export let currentSongIdx = 0

export let progressBar;
export let timeText;

export let timeSinceSkip = 0;
let skipping = false;

export function setTimeSinceSkip(value) {
	timeSinceSkip = value
}

export function musicWinContent(winParent) {
	currentSongIdx = GameState.music.favoriteIdx == null ? 0 : GameState.music.favoriteIdx
	let disc = winParent.add([
		sprite("discs", {
			anim: "defaultCover"
		}),
		pos(-150, -20),
		rotate(),
		anchor("center"),
		scale(),
		"bpmChange",
		{
			verPosition: -20,
			update() {
				if (musicHandler.winding || GameState.music.muted || skipping) return
				this.angle += songs[Object.keys(songs)[currentSongIdx]].speed
				if (Math.floor(this.angle % 360 == 0)) this.angle = 0
			}
		}
	])

	disc.play(songs[Object.keys(songs)[currentSongIdx]].cover)

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
				this.text = `${songs[Object.keys(songs)[currentSongIdx]].idx + 1}. ${songs[Object.keys(songs)[currentSongIdx]].name} ${GameState.music.muted ? "(PAUSED)" : ""}\nby Enysmo`
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
				if (!musicHandler.winding || !GameState.music.muted) musicHandler.currentTime = musicHandler.time()
				if (!musicHandler.winding || !GameState.music.muted) musicHandler.totalTime = songs[Object.keys(songs)[currentSongIdx]].duration
			},
		}
	])

	theOneBehind.onClick(() => {
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
	])

	let pauseButton = winParent.add([
		text("||", {
			size: 40
		}),
		pos(15, 60),
		area(),
		scale(),
		anchor("center"),
		"hoverObj",
		"musicButton",
		"windowButton",
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
	])

	// each tim you click it waits one seonc, if the time since the skip is greater than 1 it plays the song
	// if the time since the skip is less than 1 it does nothing
	get("musicButton", { recursive: true }).forEach(mBtn => mBtn.onClick(() => {
		if (mBtn.text != "||") {
			if (skipping == false) {
				skipping = true
				get("bpmChange", { recursive: true }).forEach(element => { element.stopWave() });
			}
			scratchSong()
			tween(progressBar.width, 0, 0.5, (p) => progressBar.width = p, easings.easeOutQuint)
			tween(musicHandler.currentTime, 0, 0.5, (p) => musicHandler.currentTime = p, easings.easeOutQuint)
			musicHandler.winding = true
	
			if (mBtn.text == "<") {
				if (musicHandler.currentTime > 2) {
					musicHandler.seek(0)
					musicHandler.winding = true
					tween(progressBar.width, 0, 0.2, p => progressBar.width = p, easings.easeOutQuint)
				}
				
				else {
					currentSongIdx--
					tween(disc.angle, disc.angle - rand(75, 100), 0.5, (p) => disc.angle = p, easings.easeOutQuint)
					if (currentSongIdx < 0) currentSongIdx = Object.keys(songs).length - 1
				}
	
				playSfx("clickButton", rand(-50, 150))
			}
			
			else if (mBtn.text == ">") {
				currentSongIdx++
				tween(disc.angle, disc.angle + rand(75, 100), 0.5, (p) => disc.angle = p, easings.easeOutQuint)
				if (currentSongIdx >= Object.keys(songs).length) currentSongIdx = 0
				playSfx("clickButton", rand(-150, 50))
			}
	
			tween(musicHandler.totalTime, songs[Object.keys(songs)[currentSongIdx]].duration, 0.5, (p) => musicHandler.totalTime = p, easings.easeOutQuint)
			disc.play(songs[Object.keys(songs)[currentSongIdx]].cover)
			GameState.music.favoriteIdx = currentSongIdx
			timeSinceSkip = 0
	
			wait(1, () => {
				if (timeSinceSkip > 1) {
					playMusic(Object.keys(songs)[currentSongIdx])
					skipping = false
					musicHandler.winding = false
					if (GameState.music.muted) {
						musicHandler.paused = true
						get("bpmChange", { recursive: true }).forEach(element => { element.stopWave() });
					}
					else {
						get("bpmChange", { recursive: true }).forEach(element => { element.startWave() });
					}
				}
			})
		}

		else {
			if (!GameState.music.muted) {
				espMute()
				get("bpmChange", { recursive: true }).forEach(element => {
					element.stopWave()
				})
			}
	
			else {
				espUnmute()
				get("bpmChange", { recursive: true }).forEach(element => {
					element.startWave()
				})
			}
	
			playSfx("clickButton", rand(-100, 100))
		}
		
		bop(mBtn)
	}))

	get("bpmChange", { recursive: true }).forEach(bpmChange => {
		if (!bpmChange.is("wave")) bpmChange.use(waver({ maxAmplitude: 5, wave_speed: songs[Object.keys(songs)[currentSongIdx]].speed, wave_tweenSpeed: 0.2 }))
		if (!GameState.music.muted) bpmChange.startWave()
	})
	
	return;
}