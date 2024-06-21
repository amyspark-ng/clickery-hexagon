import { GameState } from "../../gamestate";
import { addToast } from "./additives";
import { autoLoopTime, cam, excessTime, panderitoIndex } from "./gamescene";

// definetely not chatgpt
export function formatNumber(number = 0, short = true, isPrice = false) {
	let valueToReturn;
	
	if (short) {
		if (number >= 1000000000000) {
			valueToReturn = number >= 1100000000000 ? (number / 1000000000000).toFixed(1) + 'T' : (number / 1000000000000) + 'T';
		} else if (number >= 1000000000) {
			valueToReturn = number >= 1100000000 ? (number / 1000000000).toFixed(1) + 'B' : (number / 1000000000) + 'B';
		} else if (number >= 1000000) {
			valueToReturn = number >= 1100000 ? (number / 1000000).toFixed(1) + 'M' : (number / 1000000) + 'M';
		} else if (number >= 1000) {
			valueToReturn = (number / 1000).toFixed(number % 1000 === 0 ? 0 : 1) + 'K';
		} else {
			valueToReturn = number.toString();
		}	
	} 
	
	else {
		// Convert number to locale string
		valueToReturn = number.toLocaleString().replace(/,/g, '.');

		// Add suffixes for thousands, millions, or billions
		if (number >= 1000000000000) {
			valueToReturn += 'T';
		} else if (number >= 1000000000) {
			valueToReturn += 'B';
		} else if (number >= 1000000) {
			valueToReturn += 'M';
		} else if (number >= 1000) {
			valueToReturn += 'K';
		}
	}

	if (isPrice) valueToReturn = valueToReturn.slice(0, 0)
	+ "$" + valueToReturn.slice(0);

	return valueToReturn;
}

export function formatMusicTime(timeInSeconds) {
	return `${Math.floor(timeInSeconds / 60)}:${Math.floor(timeInSeconds % 60) < 10 ? '0' + Math.floor(timeInSeconds % 60) : Math.floor(timeInSeconds % 60)}`
}

export function percentage(number, percentageTo) {
	return Math.round((number * percentageTo) / 100)
}

export function getPrice(basePrice, percentageIncrease, objectAmount, amountToBuy) {
    let priceToReturn = 0;

    for (let i = 0; i < amountToBuy; i++) {
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

// definetely not chatgpt again
export function timeOutSideOfWindowManaging() {
	let isTabActive = true; // Variable to track if the tab is currently active
	let totalTimeOutsideTab = 0; // Variable to store the total time the user has been outside of the tab
	let startTimeOutsideTab; // Variable to store the start time when the tab becomes inactive
	
	// Function to handle tab visibility change
	function handleVisibilityChange() {
		if (document.hidden) {
			// Tab becomes inactive
			totalTimeOutsideTab = 0
			isTabActive = false;
			startTimeOutsideTab = performance.now(); // Store the start time when the tab becomes inactive
		}
		
		else {
			// Tab becomes active
			if (!isTabActive) {
				// If the tab was previously inactive, calculate the time outside the tab and update the total time
				const timeOutsideTab = performance.now() - startTimeOutsideTab;
				totalTimeOutsideTab += timeOutsideTab;
			}
			isTabActive = true;
		}
	}
	
	// Listen for visibility change events
	document.addEventListener("visibilitychange", handleVisibilityChange);
	
	// Function to get the total time outside of the tab
	function getTotalTimeOutsideTab() {
	  // If the tab is currently inactive, calculate the time outside the tab until now
		if (!isTabActive) {
			return (totalTimeOutsideTab + performance.now() - startTimeOutsideTab) / 1000; // Convert milliseconds to seconds
		} 
		else {
			return totalTimeOutsideTab / 1000; // Convert milliseconds to seconds
		}
	}
}

// im aware kaboom has Color.mult, i like blend more
export function blendColors(color1, color2, blendFactor) {
    // Extract RGB components from color structures
    const rgb1 = [color1.r, color1.g, color1.b];
    const rgb2 = [color2.r, color2.g, color2.b];

    // Calculate blended RGB values
    const blendedRgb = rgb1.map((val, index) => (1 - blendFactor) * val + blendFactor * rgb2[index]);

    // Round and clamp blended RGB values
    const blendedColor = rgb(
		Math.round(blendedRgb[0]),
		Math.round(blendedRgb[1]),
		Math.round(blendedRgb[2]),
	)

    return blendedColor;
}

export function arrayToColor(arr) {
	return rgb(arr[0], arr[1], arr[2])
}

export function colorToArray(color) {
	return [color.r, color.g, color.b]
}

export function getSides(obj) {
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
	let floppy = add([
		sprite("floppy"),
		pos(width() - 50, height() - 50),
		anchor("center"),
		opacity(0),
		scale(1),
	])

	tween(floppy.pos.y, height() - 120, 0.5, (p) => floppy.pos.y = p, easings.easeOutBack )
	tween(0, 1, 0.5, (p) => floppy.opacity = p, easings.easeOutBack )
	
	wait(0.5, () => {
		tween(vec2(1), vec2(1.1), 0.1, (p) => floppy.scale = p, easings.easeOutBack )
		tween(1, 0, 0.5, (p) => floppy.opacity = p, easings.easeOutBack )
	
		wait(0.5, () => {
			destroy(floppy)
		})
	})
}

export function bop(obj, howMuch = 0.1, bopEasing = easings.easeOutQuint) {
	if (!obj.is("scale")) obj.use(scale(1))
	if (!obj.bopDefScale) obj.bopDefScale = obj.scale

	tween(obj.scale, obj.bopDefScale.sub(howMuch), 0.15, (p) => obj.scale = p, bopEasing).then(() => {
		tween(obj.scale, obj.bopDefScale, 0.15, (p) => obj.scale = p, bopEasing)
	})
}

export function shrink(obj, howMuch) {
	if (!obj.is("scale")) obj.use(scale(1))
	if (!obj.shrinkDefScale) obj.shrinkDefScale = obj.scale
	
	tween(obj.scale, obj.scale.sub(obj.scale), 0.15, (p) => obj.scale = p, easings.easeOutQuint)
}

export function debugTexts() {
	let texty = add([
		text("", {
			size: 20
		}),
		pos(-50, 60),
		anchor("topleft"),
		"debugText",
		{
			update() {
				this.text = `
				timeUntilAutoLoopEnds: ${GameState.timeUntilAutoLoopEnds}
				autoLoopTime: ${autoLoopTime.toFixed(4)}
				excessTime: ${excessTime.toFixed(4)}
				masterVolume: ${GameState.settings.volume}
				sfx: ${GameState.settings.sfx.volume}
				music: ${GameState.settings.music.volume}
				`.trim()
			}
		}
	])

	texty.hidden = true
	texty.paused = true
}

export function debugFunctions() {
	debugTexts()
	
	window.taskbar = function() {
		console.log(GameState.taskbar)
	}
	
	onUpdate(() => {
		// if (isKeyDown("control")) {
		if (isKeyPressed("c")) GameState.save(true)
		else if (isKeyPressed("v")) GameState.delete()
		else if (isKeyPressed("b")) GameState.cheat()
		else if (isKeyPressed("r") && panderitoIndex != 6) go("gamescene")
		
		else if (isKeyPressed("g")) addToast({ title: "Welcome back!", body: "Now with a body" })
		else if (isKeyPressed("h")) addToast({ title: "Welcome back!", body: "Did you know there's actually a limit to how long these body texts can b-"})
		else if (isKeyPressed("j")) addToast({ title: "Welcome back!", body: "Now with a body and an icon too", icon: "cursor" })
	})

	// #region debug stuff
	onScroll((delta)=>{
		cam.scale = cam.scale * (1 - 0.1 * Math.sign(delta.y))
	})

	onMousePress("middle", () => {
		cam.scale = 1
	})
}
