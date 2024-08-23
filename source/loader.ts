import { DEBUG } from "./main.js"
import { introscene } from "./game/scenes/introScene.ts";
import { gamescene } from "./game/gamescene.ts";
import { focuscene } from "./game/scenes/focuscene.ts";
import { ngScene } from "./game/scenes/ngScene.ts";
import { achievements } from "./game/unlockables/achievements.ts";
import { getPosInGrid } from "./game/utils.ts";

export function drawSeriousLoadScreen(progress, op = 1) {
	function drawHexagon(opts = {
		pos: center(),
		scale: vec2(1),
		opacity: 1,
		color: WHITE,
	}) {
		const centerX = 0;
		const centerY = 0;
		const radius = 100;
	
		const pts = [];
		const colors = [];
	
		for (let i = 0; i < 6; i++) {
			const angle = Math.PI / 3 * i;
			const x = centerX + radius * Math.cos(angle);
			const y = centerY + radius * Math.sin(angle);
			pts.push(vec2(x, y));
	
			// Generate colors for each vertex
			colors.push(rgb(
				Math.floor(Math.random() * 128 + 128),
				Math.floor(Math.random() * 128 + 128),
				Math.floor(Math.random() * 128 + 128)
			));
		}
	
		drawPolygon({
			pos: opts.pos,
			opacity: opts.opacity,
			scale: opts.scale,
			color: opts.color,
			pts: pts,
		});
	}
	
	drawRect({
		width: width(),
		height: height(),
		color: BLACK,
	})

	drawHexagon({
		pos: vec2(963, 495),
		opacity: op,
		scale: vec2(wave(-0.5, 0.5, time() * 3), 0.5),
		color: WHITE,
	})

	drawText({
		text: `LOADING ${Math.round(progress * 100)}%`,
		size: 40,
		color: WHITE,
		anchor: "right",
		pos: vec2(899, 525),
		opacity: op,
	})

	// bar
	drawRect({
		width: map(progress, 0, 1, 5, width() - 5), 
		radius: 2.5,
		height: 10,
		anchor: "left",
		pos: vec2(5, height() - 10),
		opacity: op,
	})
}

function drawDevkyLoadScreen(progress) {
	drawRect({
		width: width(),
		height: height(),
		color: BLACK,
	})
	
	drawSprite({
		sprite: "devky",
		anchor: "topleft",
		pos: vec2(),
		width: map(progress, 0, 1, 0, width()),
		height: height(),
	})
}

function loadFonts() {
	if (!DEBUG) {load(new Promise<void>((res) => { setTimeout(() => { res() }, 5000) })) }

	loadFont("emulogic", "assets/emulogic.ttf", {
		outline: 10,
		filter: "linear"
	})

	loadFont("lambdao", "assets/Lambda-Regular.ttf", {
		outline: 5,
		filter: "linear"
	})

	loadFont("lambda", "assets/Lambda-Regular.ttf", {
		filter: "linear"
	})
}

function loadAllSprites() {
	loadBean()

	// fonts don't work with loadRoot, fuck
	loadFonts()

	loadRoot("assets/")
	loadSprite("devky", "devky.png")
	loadSprite("hexagon", "sprites/hexagon.png")
	
	if (!DEBUG) {load(new Promise<void>((res) => { setTimeout(() => { res() }, 5000) })) }

	//#region SPRITES
	// cursors
	loadSprite("cursors", "sprites/cursors.png", {
		sliceX: 5,
		sliceY: 1,
		anims: {
			cursor: 0,
			point: 1,
			grab: 2,
			wait: 3,
			check: 4,
		},
	});
	
	loadSprite("saveIcon", "sprites/saveIcon.png")
	loadSprite("welcomeBackIcon", "sprites/welcomeBackIcon.png")

	loadSprite("part_star", "sprites/part_star.png")
	loadSprite("osaka", "sprites/osaka.png")
	loadSprite("panderito", "sprites/panderito.png")
	loadSprite("smallpanderito", "sprites/smallpanderito.png")
	loadSprite("folderObj", "sprites/folderObj.png")
	loadSprite("speakers", "sprites/speakers.png", {
		sliceX: 2,
		sliceY: 1,
		anims: {
			mute: 0,
			sound: 1,
		}
	})

	//#region Windows
	loadSprite("dumbTestWin", "sprites/windows/dumbTestWin.png")
	loadSprite("xButton", "sprites/windows/xButton.png")
	loadSpriteAtlas("sprites/windows/winMinibuttons.png", {
		"icon_about": {
			width: 140,
			height: 70,
			sliceX: 2,
			sliceY: 1,
			x: 0,
			y: 0,
			anims: {
				default: 0,
				hover: 1,
			}
		},
		"icon_medals": {
			width: 140,
			height: 70,
			sliceX: 2,
			sliceY: 1,
			x: 140,
			y: 0,
			anims: {
				default: 0,
				hover: 1,
			}
		},
		"icon_ascend": {
			width: 140,
			height: 70,
			sliceX: 2,
			sliceY: 1,
			x: 280,
			y: 0,
			anims: {
				default: 0,
				hover: 1,
			}
		},
		"icon_settings": {
			width: 140,
			height: 70,
			sliceX: 2,
			sliceY: 1,
			x: 420,
			y: 0,
			anims: {
				default: 0,
				hover: 1,
			}
		},
		"icon_leaderboards": {
			width: 140,
			height: 70,
			sliceX: 2,
			sliceY: 1,
			x: 560,
			y: 0,
			anims: {
				default: 0,
				hover: 1,
			}
		},
		"icon_music": {
			width: 140,
			height: 70,
			sliceX: 2,
			sliceY: 1,
			x: 700,
			y: 0,
			anims: {
				default: 0,
				hover: 1,
			}
		},
		"icon_stats": {
			width: 140,
			height: 70,
			sliceX: 2,
			sliceY: 1,
			x: 0,
			y: 70,
			anims: {
				default: 0,
				hover: 1,
			}
		},
		"icon_store": {
			width: 140,
			height: 70,
			sliceX: 2,
			sliceY: 1,
			x: 140,
			y: 70,
			anims: {
				default: 0,
				hover: 1,
			}
		},
		"icon_bgColor": {
			width: 140,
			height: 70,
			sliceX: 2,
			sliceY: 1,
			x: 280,
			y: 70,
			anims: {
				default: 0,
				hover: 1,
			}
		},
		"icon_hexColor": {
			width: 140,
			height: 70,
			sliceX: 2,
			sliceY: 1,
			x: 420,
			y: 70,
			anims: {
				default: 0,
				hover: 1,
			}
		},
		"icon_credits": {
			width: 140,
			height: 70,
			sliceX: 2,
			sliceY: 1,
			x: 560,
			y: 70,
			anims: {
				default: 0,
				hover: 1,
			}
		},
		"white_noise": {
			width: 140,
			height: 70,
			x: 770,
			y: 70,
		},
		"icon_extra": {
			width: 280,
			height: 70,
			sliceX: 4,
			sliceY: 1,
			x: 0,
			y: 140,
			anims: {
				open_default: 0,
				open_hover: 1,
				shut_default: 2,
				shut_hover: 3,
			}
		},
	})

	//#region Store
	loadSprite("storeWin", "sprites/windows/storeWin/storeWin.png")
	loadSprite("stroeWin", "sprites/windows/storeWin/stroeWin.png")
	loadSpriteAtlas("sprites/windows/storeWin/storeElements.png", {
		"clickersElement": {
			sliceX: 2,
			x: 0,
			y: 254,
			width: 349*2,
			height: 127,
			anims: {
				"up": 0,
				"down": 1,
			}
		},
		"cursorsElement": {
			sliceX: 2,
			x: 0,
			y: 0,
			width: 349*2,
			height: 127,
			anims: {
				"up": 0,
				"down": 1,
			}
		},
		"powerupsElement": {
			sliceX: 3,
			x: 0,
			y: 127,
			width: 349*3,
			height: 127,
			anims: {
				"up": 0,
				"down": 1,
			}
		},
	})
	loadSprite("chains", "sprites/windows/storeWin/chains.png")
	loadSprite("smoke", "sprites/windows/storeWin/smoke.png", {
		sliceX: 3,
		anims: {
			"smoking": {
				from: 0,
				to: 2,
				loop: true,
			}
		}
	})
	loadSprite("upgrade", "sprites/windows/storeWin/upgrade.png")
	loadSprite("upgradelock", "sprites/windows/storeWin/upgradelock.png")

	loadSprite("upgrades", "sprites/upgrades.png", {
		sliceX: 18,
		sliceY: 3,
		anims: {
			"k_0": {
				from: 0,
				to: 2,
				
			},
			"k_1": {
				from: 3,
				to: 5,
			},
			"k_2": {
				from: 6,
				to: 8,
			},
			"k_3": {
				from: 9,
				to: 11,
			},
			"k_4": {
				from: 12,
				to: 14,
			},
			"k_5": {
				from: 15,
				to: 17,
			},
			"c_6": {
				from: 18,
				to: 20,
			},
			"c_7": {
				from: 21,
				to: 23,
			},
			"c_8": {
				from: 24,
				to: 26,
			},
			"c_9": {
				from: 27,
				to: 29,
			},
			"c_10": {
				from: 30,
				to: 32,
			},
			"c_11": {
				from: 33,
				to: 35,
			},
		}
	})

	loadSprite("mupgrades", "sprites/mupgrades.png", {
		sliceX: 12,
		sliceY: 1,
		anims: {
			"u_12": {
				from: 0,
				to: 2,
			},
			"u_13": {
				from: 3,
				to: 5,
			},
			"u_14": {
				from: 6,
				to: 8,
			},
			"u_15": {
				from: 9,
				to: 11,
			},
		}
	})
	//#endregion Store

	//#region Music
	loadSprite("musicWin", "sprites/windows/musicWin/musicWin.png")
	loadSpriteAtlas("sprites/windows/musicWin/discs.png", {
		"discs": {
			"x": 0,
			"y": 0,
			"width": 50 * 6,
			"height": 50,
			"sliceX": 6,
			"sliceY": 1,
			"anims": {
				"wav": 0,
				"ok": 1,
				"bb1": 2,
				"bb2": 3,
				"cat": 4,
				"bb3": 5,
			}
		}
	})
	loadSprite("musicWinButtons", "sprites/windows/musicWin/musicWinButtons.png", {
		sliceX: 4,
		sliceY: 1,
		anims: {
			"pause": 0,
			"play": 1,
			"back": 2,
			"skip": 3,
		}
	})
	loadSprite("mutedButton", "sprites/windows/musicWin/mutedButton.png")
	
	//#endregion

	// #region Settings
	loadSpriteAtlas("sprites/windows/settingsWin/settingsVolbars.png", {
		"plusbutton": {
			"x": 90,
			"y": 0,
			"width": 30,
			"height": 50,
		},
		"minusbutton": {
			"x": 60,
			"y": 0,
			"width": 30,
			"height": 50,
		},
		"volbarbutton": {
			"x": 0,
			"y": 0,
			"width": 60,
			"height": 50,
			"sliceX": 2,
			"sliceY": 1,
			"anims": {
				on: 1,
				off: 0,
			}
		}
	})
	loadSpriteAtlas("sprites/windows/settingsWin/settingsCheckbox.png", {
		"checkbox": {
			"x": 0,
			"y": 0,
			"width": 45 * 2,
			"height": 45,
			"sliceX": 2,
			"anims": {
				"on": 1,
				"off": 0,
			}
		},
		"tick": {
			"x": 90,
			"y": 0,
			"width": 60,
			"height": 54,
		},
	})

	loadSprite("settingsWin", "sprites/windows/settingsWin/settingsWin.png")

	loadSprite("settingsArrow", "sprites/windows/settingsWin/settingsArrow.png")
	loadSprite("settingsDottedHex", "sprites/windows/settingsWin/settingsDottedHex.png")
	loadSprite("settingsHex", "sprites/windows/settingsWin/settingsHex.png")
	loadSprite("settingsFloppy", "sprites/windows/settingsWin/settingsFloppy.png")
	loadSprite("settingsTrashcan", "sprites/windows/settingsWin/settingsTrashcan.png")

	//#endregion Settings

	loadSprite("medalsUnknown", "sprites/windows/medalsWin/medalsUnknown.png")
	loadSprite("medalsUnknown_tap", "sprites/windows/medalsWin/medalsUnknown_tap.png")
	
	const medalsX = 20
	const medalsY = 1
	let medalSprites = {}

	let availableAchievements = achievements.slice(0, 21)

	let row = 0
	let column = -1
	let spacing = vec2(60)

	availableAchievements.map(achievement => achievement.id).forEach((achievementId, index) => {
		if (row >= medalsX) {
			row = 0
			column++
		}

		else {
			column++
		}

		let position = getPosInGrid(vec2(0, 0), row, column, spacing)

		medalSprites[`medals_${achievementId}`] = {
			"x": position.x,
			"y": position.y,
			"width": spacing.x,
			"height": spacing.y,
		}
	})

	loadSpriteAtlas("sprites/windows/medalsWin/medalsMedals.png", medalSprites)
	loadSprite("medalsWin", "sprites/windows/medalsWin/medalsWin.png")
	loadSprite("medalsBg", "sprites/windows/medalsWin/medalsBg.png")

	//#region Other ones huh
	loadSprite("hexColorWin", "sprites/windows/colorWin/hexColorWin.png")
	loadSprite("bgColorWin", "sprites/windows/colorWin/bgColorWin.png")

	loadSprite("hexColorHandle", "sprites/windows/colorWin/hexColorHandle.png")
	loadSprite("defaultButton", "sprites/windows/colorWin/defaultButton.png")
	loadSprite("randomButton", "sprites/windows/colorWin/randomButton.png")
	
	loadSprite("extraWin", "sprites/windows/extraWin/extraWin.png")

	loadSprite("statsWin", "sprites/windows/statsWin/statsWin.png")
	loadSprite("statIcons1", "sprites/windows/statsWin/statIcons1.png")
	loadSprite("statIcons2", "sprites/windows/statsWin/statIcons2.png")
	
	loadSprite("leaderboardsWin", "sprites/windows/leaderboardsWin/leaderboardsWin.png")
	loadSprite("leaderboardsHeader", "sprites/windows/leaderboardsWin/leaderboardsHeader.png")
	loadSprite("leaderboardsTheLine", "sprites/windows/leaderboardsWin/leaderboardsTheLine.png")
	
	loadSprite("creditsWin", "sprites/windows/creditsWin/creditsWin.png")
	loadSprite("creditsHeart", "sprites/windows/creditsWin/creditsHeart.png")
	
	loadSprite("creditsCode", "sprites/windows/creditsWin/creditsCode.png")
	loadSprite("creditsArt", "sprites/windows/creditsWin/creditsArt.png")
	loadSprite("creditsDesign", "sprites/windows/creditsWin/creditsDesign.png")
	loadSprite("creditsShader", "sprites/windows/creditsWin/creditsShader.png")
	loadSprite("creditsPlaytest", "sprites/windows/creditsWin/creditsPlaytest.png")
	loadSprite("creditsDesktop", "sprites/windows/creditsWin/creditsDesktop.png")
	//#endregion

	//#endregion

	if (!DEBUG) {load(new Promise<void>((res) => { setTimeout(() => { res() }, 5000) })) }

	// #region clickerius hernelius  
	loadSpriteAtlas("sprites/ascendscene/hexAgony.png", {
		"mage_body": {
			"x": 1000,
			"y": 0,
			"width": 500,
			"height": 500, 
		},
		"mage_body_lightning": {
			"x": 0,
			"y": 500,
			"width": 500,
			"height": 500, 
		},
		"mage_botarm": {
			"x": 500,
			"y": 0,
			"width": 500,
			"height": 500,
		},
		"mage_botarm_lightning": {
			"x": 0,
			"y": 0,
			"width": 500,
			"height": 500,
		},
		"mage_toparm": {
			"x": 1000,
			"y": 500,
			"width": 500,
			"height": 500,
		},
		"mage_toparm_lightning": {
			"x": 0,
			"y": 1000,
			"width": 500,
			"height": 500,
		},
		"mage_cursors": {
			"x": 500,
			"y": 500,
			"width": 500,
			"height": 500, 
		},
	})
	loadSprite("mage_eye", "sprites/ascendscene/eye.png", {
		sliceX: 4,
		sliceY: 1,
		anims: {
			"blink": {
				from: 1,
				to: 3,
			},
		}
	})
	loadSprite("dialogue", "sprites/ascendscene/dialogue.png")
	loadSprite("hoverDialogue", "sprites/ascendscene/emptyDialogue.png")
	loadSprite("eye_translate", "sprites/ascendscene/translate.png", {
		sliceX: 4,
		sliceY: 1,
		anims: {
			"woke": 3,
			"dumb": 1,
		}
	})
	
	loadSpriteAtlas("sprites/ascendscene/cards.png", {
		// 22 between each card
		"card_clickers": {
			"x": 0,
			"y": 0,
			"width": 123,
			"height": 169,
		},
		"card_cursors": {
			"x": 133 * 1,
			"y": 0,
			"width": 123,
			"height": 169,
		},
		"card_powerups": {
			"x": 133 * 2,
			"y": 0,
			"width": 123,
			"height": 169,
		},
		"card_crits": {
			"x": 133 * 3,
			"y": 0,
			"width": 123,
			"height": 169,
		},
		"card_hexColor": {
			"x": 133 * 4,
			"y": 0,
			"width": 123,
			"height": 169,
		},
		"card_bgColor": {
			"x": 133 * 5,
			"y": 0,
			"width": 123,
			"height": 169,
		},
	})
	loadSprite("backcard", "sprites/ascendscene/backcard.png")
	loadSprite("confirmAscension", "sprites/ascendscene/confirmAscension.png")

	loadSprite("ascendWin", "sprites/windows/ascendWin/ascendWin.png")
	loadSprite("winMage_body", "sprites/windows/ascendWin/winMage_body.png")
	loadSprite("winMage_eye", "sprites/windows/ascendWin/winMage_eye.png")
	loadSprite("winMage_cursors", "sprites/windows/ascendWin/winMage_cursors.png")
	loadSprite("winMage_vignette", "sprites/windows/ascendWin/winMage_vignette.png")

	loadSprite("gnome", "sprites/gnome.png")
	loadSprite("pinch", "sprites/pinch.png")
	//#endregion
	//#endregion SPRITES
}

function loadAllSounds() {
	// #region SOUNDS
	if (!DEBUG) {load(new Promise<void>((res) => { setTimeout(() => { res() }, 5000) })) }

	//#region hexagon-intro
	loadSound("biglight", "sounds/sfx/hexagon-intro/biglight.mp3")
	loadSound("ominus", "sounds/sfx/hexagon-intro/ominus.mp3")

	loadSound("clickPress", "sounds/sfx/hexagon-intro/clickPress.mp3")
	loadSound("clickRelease", "sounds/sfx/hexagon-intro/clickRelease.mp3")
	loadSound("powerup", "sounds/sfx/hexagon-intro/powerup.wav")
	loadSound("fullcombo", "sounds/sfx/hexagon-intro/fullcombo.wav")
	loadSound("combo", "sounds/sfx/hexagon-intro/combo.wav")
	loadSound("punch", "sounds/sfx/hexagon-intro/punch.mp3")
	//#endregion hexagon-intro
	
	//#region ascension
	loadSound("mage_e", "sounds/sfx/ascension/mage_e.mp3")
	loadSound("onecard", "sounds/sfx/ascension/onecard.mp3")
	loadSound("allcards", "sounds/sfx/ascension/allcards.mp3")
	//#endregion ascension

	//#region ui
	loadSound("unlockachievement", "sounds/sfx/ui/unlockachievement.wav")
	loadSound("gamesaved", "sounds/sfx/ui/gamesaved.wav")
	loadSound("clickButton", "sounds/sfx/ui/clickButton.ogg")
	loadSound("kaching", "sounds/sfx/ui/kaching.mp3")
	loadSound("unhoverhex", "sounds/sfx/ui/unhoverhex.wav")
	loadSound("volumeChange", "sounds/sfx/ui/volumeChange.mp3")
	//#endregion ui

	//#region window
	loadSound("fold", "sounds/sfx/window/fold.wav")
	loadSound("hoverMiniButton", "sounds/sfx/window/hoverMiniButton.wav")
	loadSound("plap", "sounds/sfx/window/plap.mp3")
	loadSound("plop", "sounds/sfx/window/plop.mp3")
	loadSound("windowUnlocked", "sounds/sfx/window/windowUnlocked.wav")
	loadSound("openWin", "sounds/sfx/window/openWin.wav")
	loadSound("closeWin", "sounds/sfx/window/closeWin.wav")
	loadSound("progress", "sounds/sfx/window/progress.wav")
	loadSound("wrong", "sounds/sfx/window/wrong.wav")
	loadSound("chainwrong", "sounds/sfx/window/chainwrong.mp3")
	loadSound("chainbreak", "sounds/sfx/window/chainbreak.mp3")
	//#endregion window
	
	loadSound("gnome", "sounds/sfx/gnome.ogg")

	// music
	// don't load as music because then it won't play when the game loads
	// only done on debug to make the game load quicker since im not listening the music really
	if (!DEBUG) {load(new Promise<void>((res) => { setTimeout(() => { res() }, 5000) })) }

	loadSound("clicker.wav", "sounds/music/clicker.ogg")
	loadSound("menu.wav", "sounds/music/menu.ogg")
	loadSound("whatttt.wav", "sounds/music/whatttt.ogg")
	loadSound("simple.wav", "sounds/music/simple.ogg")
	loadSound("jazz.wav", "sounds/music/jazz.ogg")
	loadSound("sweet.wav", "sounds/music/sweet.ogg")
	loadSound("ok_instrumental", "sounds/music/ok_instrumental.ogg")
	loadSound("magic", "sounds/music/magic.ogg")
	loadSound("watchout", "sounds/music/watchout.ogg")
	loadSound("catnip", "sounds/music/catnip.ogg")
	loadSound("project_23", "sounds/music/project_23.wav")

	//#endregion MUSIC
}

function loadAllStuff() {
	// #region OTHER STUFF
	if (!DEBUG) {load(new Promise<void>((res) => { setTimeout(() => { res() }, 5000) })) }
	
	// made by MF
	loadShader("checkeredBg", null, `
	uniform float u_time;
	uniform vec3 u_color1;
	uniform vec3 u_color2;
	uniform vec2 u_speed;
	uniform float u_angle;
	uniform float u_scale;
	uniform float u_aspect;
	
	#define PI 3.14159265359
	vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
		float angle = u_angle * PI / 180.0;
		mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
		vec2 size = vec2(u_scale);
		vec2 p = (pos + vec2(u_time) * u_speed) * vec2(u_aspect, 1.0);
		p = p * rot;
		float total = floor(p.x * size.x) + floor(p.y * size.y);
		bool isEven = mod(total, 2.0) == 0.0;
		vec4 col1 = vec4(u_color1 / 255.0, 1.0);
		vec4 col2 = vec4(u_color2 / 255.0, 1.0);
		return (isEven) ? col1 : col2;
	}
	`)

	// made by MF
	loadShader("saturate", null, `
		uniform float saturation;
		uniform vec2 u_pos;
		uniform vec2 u_size;
		uniform vec3 saturationColor;

		vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
			vec4 c = def_frag();
			vec4 col = vec4(saturationColor/255.0, 1);
			return (c + vec4(mix(vec3(0), vec3(1), saturation), 0)) * col;
		}
	`)

	// made by MF
	loadShader("grayscale", null, `
		vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
			vec4 c = def_frag();
			return vec4(vec3(dot(c.rgb, vec3(0.2125, 0.7154, 0.0721))), c.a);
		}
	`)
}

// Sprite atlas were made with this awesome website
// https://www.finalparsec.com/tools/sprite_sheet_maker
export function loadEverything() {

	loadAllSprites()
	loadAllSounds()
	loadAllStuff()

	if (!DEBUG) {load(new Promise<void>((res) => { setTimeout(() => { res() }, 5000) })) }

	ngScene()
	focuscene()
	introscene()
	gamescene()
	//#endregion OTHER STUFF

	// 20% of getting devky's funny loading screen 
	if (chance(0.2)) onLoading((progress) => drawDevkyLoadScreen(progress))
	else onLoading((progress) => drawSeriousLoadScreen(progress))
}