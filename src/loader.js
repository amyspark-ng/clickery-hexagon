import { gamescene } from "./scenes/game/gamescene.js"
import { introscene } from "./introScene.js"
import { focuscene } from "./scenes/focuscene.js"

export function loadAssets() {
	loadRoot("./assets/")
	loadBean()
	
	loadSound("volumeChange", "sounds/volumeChange.wav")
	loadSound("whistle", "sounds/whistle.mp3")
	
	loadSprite("bg", "sprites/bg.png")
	loadSprite("hexagon", "sprites/hexagon.png")
	loadSprite("floppy", "sprites/floppy.png")

	loadSprite("panderito", "sprites/panderito.png")
	
	loadSprite("storebg", "sprites/store/storebg.png")
	loadSprite("speakers", "sprites/speakers.png", {
		sliceX: 2,
		sliceY: 1,
		anims: {
			mute: 0,
			sound: 1,
		}
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

	loadSprite("pinch", "sprites/pinch.png")

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

	loadSprite("osaka", "sprites/osaka.png")

	loadSound("clickPress", "sounds/click_press.mp3")
	loadSound("clickRelease", "sounds/click_release.mp3")

	loadSound("kaching", "sounds/kaching.mp3")
	
	loadSound("hoverElement", "sounds/hoverElement.mp3")

	loadSound("clickerTheme", "sounds/clicker.wav")
	loadSound("menuTheme", "sounds/menu.wav")

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

	loadFont("lambda", "./assets/Lambda-Regular.ttf", {
		outline: 5,
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
	
	// scenes
	focuscene()
	introscene()
	gamescene()
}