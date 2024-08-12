import { Color, GameObj, Vec2 } from "kaplay";
import { GameState, saveColor, scoreManager } from "../gamestate";
import { addToast, mouse } from "./additives";
import { autoLoopTime, cam, triggerGnome } from "./gamescene";
import { hexagon } from "./hexagon";
import { unlockAchievement } from "./unlockables/achievements";
import { openWindow } from "./windows/windows-api/windowManaging";
import { powerupTypes, spawnPowerup } from "./powerups";

// definetely not stack overflow
// dots are always for thousands, leave it like this
export function formatNumberSimple(value:number) {
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
	fullWord?:boolean,
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
	if (opts == undefined) opts = {} as formatNumberOpts 
	opts.price = opts.price ?? false
	opts.fullWord = opts.fullWord ?? false
	
	if (opts.price && !opts.fixAmount) opts.fixAmount = 1
	else opts.fixAmount = opts.fixAmount ?? 3

	let returnValue = ""

	if (value < 1000) {
		returnValue = value.toString();
	}

	// if number is inside the limits (will always try to be)
	else if (value < Math.pow(1000, Object.keys(numTypes).length) && value > 999) {
		// run until it finds the numType
		for (let i = 1; value >= Math.pow(1000, i); i++) {
			// turn it into a smaller version
			let numberValue = (value / Math.pow(1000, i)).toFixed(opts.fixAmount) 
			let suffix = (opts.fullWord == true ? " " : "") + numTypes[Object.keys(numTypes)[i]][opts.fullWord == true ? "large" : "small"];
			returnValue = numberValue + suffix
		}
	}

	// very big number
	else {
		returnValue = value.toExponential(2);
	}

	if (opts.price == true) returnValue = returnValue.replace (/^/,'$');
	if (GameState.settings.commaInsteadOfDot == true) returnValue = returnValue.replaceAll(".", ",");

	return returnValue
}

export function arrToVec(arr:Array<number>): Vec2 {
	let vector = vec2(arr[0], arr[1])
	return vector;
}

export function coolSetFullscreen(bool:boolean) {
	let kanvas = document.querySelector("#kanva")

	if (bool == true) {
		kanvas.requestFullscreen()
	}

	else if (bool == false) kanvas
}

// 3 columns means 3 objects laid horizontally, 3 rows is 3 objects laid vertically
// from top to bottom
//   ccc
//  r...
//  r...
/**
 * Function to get the position of an object in a grid, it works like this:
 * Row 0 and Column 0 mean initialPos btw
 * @param initialpos It's the initial pos the objects will be at, column 0 and row 0 means this exact position
 * @param row These are objects displayed vertically, the greater it is the more to the bottom they'll be
 * @param column These are objects displayed horizontally, the greater then column the more to the right 
 * @param spacing It's the spacing objects will have, if you set Y spacing to 0, the objects won't be more apart when changing the row  
 * @returns A Vec2 with the position of the object
 */
export function getPosInGrid(initialpos:Vec2, row:number, column:number, spacing:Vec2) {
	return vec2(initialpos.x + spacing.x * (column), initialpos.y + spacing.y * (row));
}

/**
 * Formats time
 * @param time Time in seconds
 * @param opts Options for formatting
 */
export function formatTime(time:number, includeWords:boolean) {
	function toHHMMSS(timeInSeconds:number) {
		const hours = Math.floor(timeInSeconds / 3600);
		const minutes = Math.floor((timeInSeconds % 3600) / 60);
		const seconds = Math.floor(timeInSeconds % 60);
	
		const formattedHours = hours > 0 ? `${hours}:` : '';
		const formattedMinutes = hours > 0 ? `${minutes < 10 ? '0' + minutes : minutes}` : minutes;
		const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;
	
		return `${formattedHours}${formattedMinutes}:${formattedSeconds}`;
	}
	
	let returnValue = toHHMMSS(time);

	if (includeWords == true) {
		// an hour is 3600 seconds
		let timeName = "";
		
		if (time > 3600) {
			if (time < 3600 * 2) timeName = "hour"
			else timeName = "hours"
		}
		
		// minutes
		else if (time > 60) {
			if (time < 120) timeName = "min"
			else timeName = "mins"
		}
		
		// seconds
		else if (time > 0) {
			if (time < 2) timeName = "sec"
			else timeName = "secs"
		}
	
		returnValue = `${returnValue} ${timeName}`
	}

	return returnValue;
}

/**
 * @param percentageOf is the percentage you want
 * @param number is the number you're taking the percentage of
 * @returns % of number
 */
export function percentage(percentageOf:number, number:number) {
	return Math.round((percentageOf * number) / 100)
}

type getPriceOpts = {
	basePrice:number,
	percentageIncrease:number,
	objectAmount:number,
	amountToBuy?:number,
	gifted?:number,
}

export function getPrice(opts:getPriceOpts) {
    opts.amountToBuy = opts.amountToBuy ?? 1
	opts.gifted = opts.gifted ?? 0
	
	let percentageMultiplier = (1 + opts.percentageIncrease / 100)
	let priceToReturn = 0;

    for (let i = 0; i < opts.amountToBuy; i++) {
		// OLD FORMULA
		// let currentPrice = opts.basePrice * Math.pow(percentageMultiplier, opts.objectAmount + i);
        // priceToReturn += Math.round(currentPrice);
		
		let currentPrice = opts.basePrice * percentageMultiplier ** ((opts.objectAmount + i) - opts.gifted)
		priceToReturn += Math.round(currentPrice);
	}

    return priceToReturn;
}

export function getCompletedAchievementPercentage(unlockeds, total) {
	return Math.round((unlockeds * 100) / total)
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

/**
 * Inserts a string at the start of another 
 * @param str The string of which the start wants to be inserted
 * @param replacement The string that will be inserted
 * @returns The result
 */
export function insertAtStart(str:string, replacement:string) {
	return str.replace(/^/,`${replacement}`);
}

export function getZBetween(a, b) {
	return Math.floor(a + b / 2)
}

export function blendColors(color1:Color, color2:Color, blendFactor:number) {
    return color1.lerp(color2, blendFactor);
}

export function saveColorToColor(color:saveColor) {
	return rgb(color.r, color.g, color.b)
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

/**
 * This function gets the position an object would if it went in a random direction
 * @param initialPos The initial pos the obj was in
 * @param onlyCardinal Wheter to only move on the cardinals, if it's false it will also go diagonal
 * @param mult How far it would go
 * @returns vec2() of the object in that position
 */
export function getRandomDirection(initialPos:Vec2, onlyCardinal:boolean, mult:number) {
	onlyCardinal = onlyCardinal || false

	let directions = {
		"left": LEFT,
		"right": RIGHT,
		"top": UP,
		"bot": DOWN,
	}

	if (onlyCardinal == false) {
		directions["botleft"] = vec2(-1, 1)
		directions["topleft"] = vec2(-1, -1)

		directions["botright"] = vec2(1, 1)
		directions["botleft"] = vec2(1, -1)
	}

	let direction = choose(Object.values(directions))
	direction = direction.scale(mult)
	
	let newPos = vec2()
	newPos.x = initialPos.x + direction.x * mult
	newPos.y = initialPos.y + direction.y * mult

	return newPos
}

export function parseAnimation(obj:GameObj, anim:string) {
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
	addToast({ icon: "floppy", title: "Game saved!", body: `Time played: ${formatTime(GameState.stats.totalTimePlayed, true)}`, type: "gamesaved" })
}

export function randomPos() {
	return vec2(rand(0, width()), rand(0, height()))
}

export function bop(obj:any, howMuch = 0.1, bopEasing = easings.easeOutQuint) {
	if (!obj.is("scale")) throw new Error("Obj must have scale component")
	if (obj.bopDefScale == null) obj.bopDefScale = obj.scale

	tween(obj.scale, obj.bopDefScale.sub(howMuch), 0.15, (p) => obj.scale = p, bopEasing).then(() => {
		tween(obj.scale, obj.bopDefScale, 0.15, (p) => obj.scale = p, bopEasing)
	})
}

export function shrink(obj) {
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

	add([
		text("DEBUG", { size: 18 }),
		anchor("botleft"),
		opacity(0.25),
		pos(0, height()),
		fixed(),
		layer("mouse"),
		{
			update() {
				let fps = 1000 / dt()
				this.text = "DEBUG" + ` ${fps.toFixed(0)}`
			}
		}
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
				}

				for (let powerup in powerupTypes) {
					keys[`${powerup} running time :`] = powerupTypes[powerup].runningTime.toFixed(1)
				}

				this.text = createKeys()
			}
		}
	])

	debugTexts.hidden = true
}

export function debugFunctions() {
	debugTexts()
	
	// can modify gamestate from console
	window.globalThis.GameState = GameState
	window.globalThis.scoreManager = scoreManager
	window.globalThis.unlockAchievement = unlockAchievement
	window.globalThis.spawnPowerup = spawnPowerup
	window.globalThis.hexagon = hexagon
	window.globalThis.openWindow = openWindow
	window.globalThis.powerupsTypes = powerupTypes
	
	onUpdate(() => {
		// if (isKeyDown("control")) {
		if (isKeyPressed("c") && GameState.scoreAllTime > 25) GameState.save(true)
		else if (isKeyPressed("v")) GameState.delete()
		else if (isKeyPressed("b")) GameState.cheat()
		
			else if (isKeyPressed("w")) {
			hexagon.autoClick()
		}
		
		else if (isKeyDown("q")) {
			hexagon.clickPress()
			wait(0.1, () => hexagon.clickRelease())
		}
	
		else if (isKeyPressed("f")) {
			spawnPowerup({
				type: "random",
				pos: mousePos(),
				natural: true,
			})
		}

		else if (isKeyPressed("h")) {
			triggerGnome()
		}
	})

	// #region debug stuff
	onScroll((delta)=>{
		if (isKeyDown("shift")) cam.zoom = cam.zoom * (1 - 0.1 * Math.sign(delta.y)) 
	})

	onMousePress("middle", () => {
		if (isKeyDown("shift")) cam.zoom = 1
	})
}