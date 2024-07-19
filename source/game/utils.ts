import { Color } from "kaplay";
import { GameState } from "../gamestate";
import { addToast, mouse } from "./additives";
import { autoLoopTime, cam, triggerGnome } from "./gamescene";
import { hexagon } from "./hexagon";
import { checkForUnlockable } from "./unlockables";
import { isHoveringAWindow } from "./windows/windows-api/windowsAPI";
import { triggerAscension } from "./ascension";
import { powerups, spawnPowerup } from "./powerups";

// definetely not stack overflow
// dots are always for thousands, leave it like this
export function simpleNumberFormatting(value) {
	let integerStr = value.toString()
	var len = integerStr.length;
	var formatted = "";
	
	var breakpoint = (len-1) % 3; // after which index to place the dot
	
	for(let i = 0; i < len; i++){
		formatted += integerStr.charAt(i);
		if(i % 3 === breakpoint){
		if(i < len-1) // don't add dot for last digit
			formatted += ".";
		}
	}

	return formatted;
}

// candy&Carmel helped here, pretty genius stuff!!!!
type formatNumberOpts = {
	fixAmount?:number,
	price?:boolean,
	letterSuffixes?:boolean,
}

let numTypes = {
	n: { small: "", large: "" }, // just for offset apparently
	K: { small: "K", large: "Thousands" },
	M: { small: "M", large: "Millions" },
	B: { small: "B", large: "Billions" },
	T: { small: "T", large: "Trillions" },
	Qa: { small: "Qa", large: "Quadrillions" },
	Qt: { small: "Qi", large: "Quintillions" },
	St: { small: "Sx", large: "Sextillions" },
	Sp: { small: "Sp", large: "Septillions" },
	Oc: { small: "Oc", large: "Octillions" },
	Nn: { small: "No", large: "Nonillions" },
	Dc: { small: "Dc", large: "Decillions" },
	Un: { small: "Und", large: "Undecillions" },
	Du: { small: "DoD", large: "Duodecillions" },
	Te: { small: "TrD", large: "Tredecillions" },
	Qd: { small: "QaD", large: "Quattuordecillion" },
	Qu: { small: "QiD", large: "Quindecillions" },
	Sd: { small: "SxD", large: "Sexdecillions" },
	Su: { small: "SpD", large: "Septemdecillion" },
	Oe: { small: "OcD", large: "Octodecillion" },
	No: { small: "NoD", large: "Novemdecillion" },
	Ve: { small: "VgT", large: "Vigintillion" },
}

// do check for decimals here
export function formatNumber(value:number, opts?:formatNumberOpts):string {
	let fixAmount = opts?.fixAmount || 3
	let isPrice = opts?.price || false
	let letterSuffixes = opts?.letterSuffixes || true

	let returnValue = ""

	if (value < 1000) {
		returnValue = value.toString();
	}

	// if number is inside the limits (will always try to be)
	else if (value < Math.pow(1000, Object.keys(numTypes).length) && value > 999) {
		// run until it finds the numType
		for (let i = 1; value >= Math.pow(1000, i); i++) {
			// turn it into a smaller version
			let numberValue = (value / Math.pow(1000, i)).toFixed(fixAmount) 
			let suffix = (letterSuffixes == true ? "" : " ") + numTypes[Object.keys(numTypes)[i]][letterSuffixes ? "small" : "large"];
			returnValue = numberValue + suffix
		}
	}

	// very big number
	else {
		returnValue = value.toExponential(2);
	}

	if (isPrice == true) returnValue = returnValue.replace (/^/,'$');
	if (GameState.settings.commaInsteadOfDot == true) returnValue = returnValue.replaceAll(".", ",");

	return returnValue
}

export function formatMusicTime(timeInSeconds) {
	return `${Math.floor(timeInSeconds / 60)}:${Math.floor(timeInSeconds % 60) < 10 ? '0' + Math.floor(timeInSeconds % 60) : Math.floor(timeInSeconds % 60)}`
}

export function toHHMMSS(timeInSeconds) {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    const formattedHours = hours > 0 ? `${hours}:` : '';
    const formattedMinutes = hours > 0 ? `${minutes < 10 ? '0' + minutes : minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;

    return `${formattedHours}${formattedMinutes}:${formattedSeconds}`;
}

export function percentage(number, percentageTo) {
	return Math.round((number * percentageTo) / 100)
}

export function getPrice(basePrice, percentageIncrease, objectAmount, amountToBuy) {
    let priceToReturn = 0;

    for (let i = 0; i < amountToBuy; i++) {
		// let currentPrice = (basePrice * (1 + percentageIncrease / 100)) ** objectAmount + 1
		// priceToReturn += Math.round(currentPrice)
		let currentPrice = basePrice * Math.pow(1 + percentageIncrease / 100, objectAmount + i);
        priceToReturn += Math.round(currentPrice);
    }

    return priceToReturn;
}

export function getCompletedAchievementPercentage(unlockeds, total) {
	return Math.round((unlockeds * 100) / total)
}

export function changeValueBasedOnAnother(value, maxValue, determiningValue, maxDetValue, rate) {
	value = rate + (determiningValue / (maxDetValue / maxValue))
	value = Math.min(value, maxValue)
	return value;
}

export function getRandomElementDifferentFrom(arr, element) {
    // Step 1: Filter the array to exclude the specified element
    const filteredArray = arr.filter(item => item !== element);

    // Step 2: Select a random element from the filtered array
    if (filteredArray.length === 0) {
        throw new Error('No different elements available');
    }
    const randomIndex = Math.floor(Math.random() * filteredArray.length);
    return filteredArray[randomIndex];
}

export function getZBetween(a, b) {
	return Math.floor(a + b / 2)
}

export function blendColors(color1:Color, color2:Color, blendFactor:number) {
    return color1.lerp(color2, blendFactor);
}

export function arrayToColor(arr) {
	return rgb(arr[0], arr[1], arr[2])
}

export function colorToArray(color) {
	return [color.r, color.g, color.b]
}

export function getPositionOfSide(obj) {
	return {
		get left() {
		  return obj.pos.x - obj.width * 0.5 
		},
		get right() {
		  return obj.pos.x + obj.width * 0.5 
		},
		get top() {
		  return obj.pos.y - obj.height * 0.5 
		},
		get bottom() {
		  return obj.pos.y + obj.height * 0.5 
		}
	}
}

// TODO: add support for frames cursors.anim/10
export function parseAnimation(obj, anim) {
	let spriteName = !anim.includes(".") ? anim : [anim.split(".")[0], anim.split(".")[1]];
	obj.unuse("sprite")
	obj.use(sprite(typeof spriteName == "string" ? spriteName : spriteName[0]))
	if (typeof spriteName == "string") return; 
	if (spriteName[1] && typeof spriteName != "string") obj.play(spriteName[1]);
}

export function getVariable(obj, path) {
	const parts = path.split(".")
	const target = parts.slice(0, -1).reduce((o, p) => o[p], obj)
	return target[parts[parts.length-1]]
}

export function setVariable(obj, path, value) {
	const parts = path.split(".")
	const target = parts.slice(0, -1).reduce((o, p) => o[p], obj)
	target[parts[parts.length-1]] = value
}

export function saveAnim() {
	addToast({ icon: "floppy", title: "Game saved!", body: `Time played: ${toHHMMSS(GameState.stats.totalTimePlayed)}` })
}

export function randomPos() {
	return vec2(rand(0, width()), rand(0, height()))
}

export function bop(obj:any, howMuch = 0.1, bopEasing = easings.easeOutQuint) {
	if (!obj.is("scale")) obj.use(scale(1))
	if (!obj.bopDefScale) obj.bopDefScale = obj.scale

	tween(obj.scale, obj.bopDefScale.sub(howMuch), 0.15, (p) => obj.scale = p, bopEasing).then(() => {
		tween(obj.scale, obj.bopDefScale, 0.15, (p) => obj.scale = p, bopEasing)
	})
}

export function decreaseScoreBuy(price:number) {
	tween(GameState.score, GameState.score - price, 0.32, (p) => GameState.score = p, easings.easeOutExpo)
}

export function shrink(obj, howMuch) {
	if (!obj.is("scale")) obj.use(scale(1))
	if (!obj.shrinkDefScale) obj.shrinkDefScale = obj.scale
	
	tween(obj.scale, obj.scale.sub(obj.scale), 0.15, (p) => obj.scale = p, easings.easeOutQuint)
}

export function debugTexts() {
	let keys = {}

	function createKeys() {
		let text = Object.keys(keys).map((key) => `${key} ${keys[key]}`).join("\n")
		return text
	}

	let debugText = add([
		text("DEBUG", { size: 18 }),
		anchor("botleft"),
		opacity(0.25),
		pos(0, height()),
		fixed(),
		layer("mouse"),
	])

	let debugTexts = add([
		text("", {
			size: 18
		}),
		color(WHITE),
		opacity(0.25),
		anchor("topleft"),
		layer("mouse"),
		fixed(),
		pos(),
		z(mouse.z + 1),
		"debugText",
		{
			update() {
				if (isKeyPressed("tab")) this.hidden = !this.hidden

				keys = {
					"Auto loop time: ": autoLoopTime.toFixed(2),
					"Time until auto loop ends: ": GameState.timeUntilAutoLoopEnds,
					"Taskbar: ": GameState.taskbar,
					"isHoveringAWindow": isHoveringAWindow
				}

				this.text = createKeys()
			}
		}
	])

	debugTexts.hidden = true
}

export function debugFunctions() {
	debugTexts()
	
	window.globalThis.gamestate = function() {
		return GameState
	}

	window.globalThis.taskbar = function() {
		return GameState.taskbar
	}
	
	onUpdate(() => {
		// if (isKeyDown("control")) {
		if (isKeyPressed("c")) GameState.save(true)
		else if (isKeyPressed("v")) GameState.delete()
		else if (isKeyPressed("b")) GameState.cheat()
		else if (isKeyPressed("w")) hexagon.autoClick()
		else if (isKeyDown("q")) {
			hexagon.clickPress()
			wait(0.1, () => hexagon.clickRelease())
		}
	
		else if (isKeyPressed("f")) {
			spawnPowerup({
				type: choose(Object.keys(powerups)),
				pos: randomPos()
			})
		}

		else if (isKeyPressed("h")) {
			triggerGnome()
		}
	})

	// #region debug stuff
	onScroll((delta)=>{
		if (isKeyPressed("shift")) cam.scale = cam.scale * (1 - 0.1 * Math.sign(delta.y)) 
	})

	onMousePress("middle", () => {
		if (isKeyPressed("shift")) cam.scale = 1
	})
}
