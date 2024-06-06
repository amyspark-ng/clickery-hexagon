import { gamescene } from "./scenes/game/gamescene.js"
import { introscene } from "./scenes/introScene.js"
import { focuscene } from "./scenes/focuscene.js"
import { drawLoadScreen } from "./scenes/game/utils.js"

// Sprite atlas were made with this awesome website
// https://www.finalparsec.com/tools/sprite_sheet_maker

export function loadAssets() {
	loadRoot("./assets/")
	loadBean()
	
	loadSprite("osaka", "sprites/osaka.png")
	loadSprite("floppy", "sprites/floppy.png")
	loadSprite("hexagon", "sprites/hexagon.png")
	loadSprite("panderito", "sprites/panderito.png")
	loadSprite("folderObj", "sprites/folderObj.png")
	loadSprite("speakers", "sprites/speakers.png", {
		sliceX: 2,
		sliceY: 1,
		anims: {
			mute: 0,
			sound: 1,
		}
	})

	loadSprite("storeWin", "sprites/windows/storeWin/storeWin.png")
	loadSpriteAtlas("sprites/windows/storeWin/storeWinElements.png", {
		"clickersElement": {
			x: 0,
			y: 0,
			width: 349,
			height: 117,
		},
		"cursorsElement": {
			x: 0,
			y: 122, // 117 + 5
			width: 349,
			height: 117,
		},
		"powerupsElement": {
			x: 0,
			y: 242, // 122 + 115 + 5 = 
			width: 349,
			height: (117 * 2) + 5, // height x 2 (rows) + 5 (space between rows)
			sliceX: 1,
			sliceY: 2,
			anims: {
				"locked": 0,
				"unlocked": 1
			}
		},
	})







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
	
	loadSprite("storeElements", "sprites/store/storeElements.png", {
		sliceX: 1,
		sliceY: 2,
		anims: {
			Clicks: 0,
			Cursors: 1,
		}
	})

	loadSprite("powerupElements", "sprites/store/powerupElements.png", {
		sliceX: 1,
		sliceY: 2,
		anims: {
			locked: 0,
			unlocked: 1,
		}
	})

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

	loadSprite("tooltip", "sprites/tooltip.png")

	loadSpriteAtlas("sprites/windows/folderIcons.png", {
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
		"icon_achievements": {
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
			x: 840,
			y: 0,
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
			x: 0,
			y: 70,
			anims: {
				default: 0,
				hover: 1,
			}
		},
	})
	
	loadSprite("musicWin", "sprites/windows/musicWin/musicWin.png")
	loadSpriteAtlas("sprites/windows/musicWin/musicWinElements.png", {
		"discs": {
			"x": 0,
			"y": 0,
			"width": 50 * 3,
			"height": 50,
			"sliceX": 3,
			"sliceY": 1,
			"anims": {
				"defaultCover": 0,
				"catnipCover": 1,
				"okCover": 2,
			}
		}
	})

	loadSprite("aboutWin", "sprites/windows/aboutWin.png")
	loadSprite("settingsWin", "sprites/windows/settingsWin.png")
	loadSprite("hexColorWin", "sprites/windows/colorWin/hexColorWin.png")
	loadSprite("bgColorWin", "sprites/windows/colorWin/bgColorWin.png")
	
	// #REGION SOUNDS
	loadSound("volumeChange", "sounds/volumeChange.mp3")
	loadSound("whistle", "sounds/whistle.mp3")

	loadSound("clickPress", "sounds/click_press.mp3")
	loadSound("clickRelease", "sounds/click_release.mp3")
	loadSound("clickButton", "sounds/sfx/generalClick.ogg")
	loadSound("kaching", "sounds/kaching.mp3")
	loadSound("hoverElement", "sounds/hoverElement.mp3")
	loadSound("hoverMiniButton", "sounds/hoverMiniButton.wav")
	loadSound("openWin", "sounds/win_open.wav")
	loadSound("closeWin", "sounds/win_close.wav")
	loadSound("hoverhex", "sounds/sfx/hoverhex.wav")
	loadSound("unhoverhex", "sounds/sfx/unhoverhex.wav")
	loadSound("fold", "sounds/sfx/fold.wav")

	// music
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

	// # REGION Other stuff
	loadFont("apl386", "https://kaboomjs.com/examples/fonts/apl386.ttf", {
		outline: 4,
		filter: "linear",
	});

	loadFont("apl386_white", "https://kaboomjs.com/examples/fonts/apl386.ttf", {
		outline: 0,
		filter: "linear",
	});
	
	loadFont("emulogic", "./assets/emulogic.ttf", {
		outline: 10,
		filter: "linear"
	})

	loadFont("lambdao", "./assets/Lambda-Regular.ttf", {
		outline: 5,
		filter: "linear"
	})

	loadFont("lambda", "./assets/Lambda-Regular.ttf", {
		filter: "linear"
	})

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
	uniform float whiteness;
	uniform vec2 u_pos;
	uniform vec2 u_size;

	vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
		vec4 c = def_frag();
		return c + vec4(mix(vec3(0), vec3(1), whiteness), 0);
	}
	`)

	// scenes
	focuscene()
	introscene()
	gamescene()
}