import { GameState } from "../../gamestate";
import { autoLoopTime, excessTime } from "./gamescene";
import { hexagon, scoreVars } from "./hexagon";
import { isHoveringUpgrade } from "./windows/store/upgrades";
import { isDraggingAWindow, isGenerallyHoveringAWindow, isPreciselyHoveringAWindow, manageWindow, openWindow } from "./windows/windowsAPI";

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

// function precioCPS(objectAmount, basePrice = 100, percentageIncreaase = 1.15) {
//     return basePrice * Math.pow(percentageIncreaase, objectAmount);
// }

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
	// if (isKeyDown("control")) {
		if (isKeyPressed("c")) {
			GameState.save(true)
		}

		else if (isKeyPressed("v")) {
			GameState.delete()
		}

		else if (isKeyPressed("tab")) {
			// debug.inspect = !debug.inspect
			// get("debugText")[0].hidden = !debug.inspect
			// get("debugText")[0].paused = !debug.inspect
		}

		else if (isKeyPressed("b")) {
			GameState.cheat()
		}

		else if (isKeyPressed("w")) {
			hexagon.autoClick()
		}

		else if (isKeyPressed("y")) {
			GameState.clickers++
		}
	// }
}

export let gameBg;
export function addBackground() {
	gameBg = add([
		rect(width(), height()),
		pos(center()),
		anchor("center"),
		scale(8),
		color(),
		z(-1),
		{
			speed: 0.1,
			movAngle: 5,
			uScale: 2,
			col1D: rgb(128, 128, 128),
			col2D: rgb(190, 190, 190),
			tintColor: arrayToColor(GameState.settings.bgColor),
			blendFactor: GameState.settings.bgColor[3],
		}
	])

	gameBg.use(shader("checkeredBg", () => ({
        "u_time": time() / 10,
        "u_color1": blendColors(gameBg.col1D, gameBg.tintColor, gameBg.blendFactor * 1.5),
        "u_color2": blendColors(gameBg.col2D, gameBg.tintColor, gameBg.blendFactor * 1.5),
        "u_speed": vec2(-1, 2).scale(gameBg.speed),
        "u_angle": gameBg.movAngle,
        "u_scale": gameBg.uScale,
		"u_aspect": width() / height()
    })))

	gameBg.onMousePress("right", () => {
		if (!get("folderObj")[0]) return
		if (!hexagon?.isHovering() && !get("folderObj")[0]?.isHovering() && !isGenerallyHoveringAWindow && !isDraggingAWindow) {
			manageWindow("bgColorWin")
		}
	})
}

export function customScreens() {
	onError(() => {
		drawRect({
			width: width(),
			height: height(),
			color: RED,
			z: 1,
		})

		drawText({
			text: "error",
			pos: vec2(width() / 2, height() / 2),
			size: 50
		})

		console.log("error")
	})
}

export function drawLoadScreen() {
	drawRect({
		width: width(),
		height: height(),
		color: BLACK,
	})
	
	drawRect({
		width: 100,
		height: 100
	})
}

export let mouse;
export function addMouse() {
	mouse = add([
		sprite("cursors"),
		pos(mousePos()),
		scale(0.8),
		color(WHITE),
		anchor(vec2(-0.5, -0.65)),
		fixed(),
		z(100),
		{
			intro: false,
			speed: 5000, // 5000 is the optimal for actual mouse movement
			grabbing: false,
			grab() {
				this.grabbing = true
				mouse.play("grab")
			},

			releaseAndPlay(newAnim = "cursor") {
				this.grabbing = false
				mouse.play(newAnim)
			},

			pinch() {
				// debug.log("pinch")
				// for (let i = 0; i < 1; i++) {
				// 	let circ = add([
				// 		circle(1),
				// 		scale(0),
				// 		anchor("center"),
				// 		pos(this.pos),
				// 		// rotate(90 * (i + 1)),
				// 	])
				// 	tween(circ.radius, 20, 0.1, (p) => circ.radius = p, easings.easeOutQuint)
				// }
			},
			
			update() {
				if (this.start) {
					this.moveTo(mousePos(), this.speed)
				}
				else {
					this.pos = mousePos()
				}
			}
		}
	])

	onHover("xButton", () => {
		mouse.play("point")
	})

	onHoverEnd("xButton", () => {
		mouse.play("cursor")
	})

	onHover("hover_outsideWindow", () => {
		if (!isPreciselyHoveringAWindow && !isDraggingAWindow) {
			mouse.play("point")
		}
	})

	onHoverEnd("hover_outsideWindow", () => {
		if (!isPreciselyHoveringAWindow && !isDraggingAWindow) {
			mouse.play("cursor")
		}
	})

	onHover("hover_insideWindow", () => {
		mouse.play("point")
	})

	onHoverEnd("hover_insideWindow", () => {
		mouse.play("cursor")
	})
}

export function addGrid(opts = { timesX: 3, timesY: 2, parent: null, objectCreator: function() {  } }) {
	for(let i = 0; i < opts.timesX * opts.timesY; i++) {
		opts.objectCreator(parent, i)
	}
}

export function addFlyingText(posToAdd, textToAdd) {
	let texty = add([
		text(textToAdd, {
			font: 'apl386',
			size: 20,
		}),
		pos(posToAdd.x - 40, posToAdd.y),
		opacity(1),
		anchor("center"),
		{
			update() {
				this.pos.y -= 1
				this.opacity -= 0.05
			}
		}
	])
}

// left or right means from what side is it coming
export function addToolTip(obj, textToAdd = "cooltext\nverycool", textSize = 20, left = true, down = true, xDistance = 0, yDistance = 100, speed = 1, xScale = 1, yScale = 1) {
	let anchorAdd = ""
	
	let tooltip = add([
		sprite("tooltip"),
		pos(obj.worldPos()),
		scale(0.01),
		z(obj.z + 1),
		opacity(0),
		"tooltip",
	])
	
	let texty = add([
		text(textToAdd, {
			size: textSize
		}),
		pos(),
		scale(),
		opacity(0),
		anchor("left"),
		z(tooltip.z + 1),
		"tooltip",
		"tooltiptext",
	])
	
	// confusing i know
	if (down) anchorAdd = "top"
	else anchorAdd = "bot"

	// not that confusing
	if (left) anchorAdd += "left"
	else anchorAdd += "right"
	
	if (left) tooltip.flipX = true
	if (down) tooltip.flipY = true

	tooltip.use(anchor(anchorAdd))

	// tooltip positioning
	tooltip.pos.x = obj.worldPos().x 
	texty.pos.x = obj.worldPos().x

	// this is actually down
	if (down == true) {
		tooltip.pos.y = obj.worldPos().y + ((obj.height / 2) * obj.scale.y) + yDistance
		texty.pos.y = (tooltip.pos.y + (tooltip.height + 24) / 2)
	}
	
	// up
	else {
		tooltip.pos.y = obj.worldPos().y - ((obj.height / 2) * obj.scale.y) - yDistance
		texty.pos.y = ((tooltip.pos.y - (tooltip.height) / 2) - 7)
	}
	
	// left side
	if (left == false) {
		texty.pos.x = (tooltip.pos.x - (tooltip.width * xScale) + 10) - xDistance
	}
	
	else {
		texty.pos.x = (tooltip.pos.x + 10) + xDistance
	}

	// since the smaller the number the faster it goes, i divide it
	if (speed > 2) {
		tooltip.opacity = 1
		tooltip.scale.y = 1
		tooltip.scale.x = 1
	}

	else {
		// animating
		tween(tooltip.opacity, 1, 0.25 / speed, (p) => tooltip.opacity = p, )
		tween(tooltip.scale.y, yScale, 0.45 / speed, (p) => tooltip.scale.y = p, easings.easeOutQuint)
		
		wait(0.1, () => {
			tween(tooltip.scale.x, xScale, 0.4 / speed, (p) => tooltip.scale.x = p, easings.easeOutQuint) 
			wait(0.1, () => {
				tween(texty.opacity, 1, 0.4, (p) => texty.opacity = p, easings.easeOutQuint)
			})
		})
	}
}

export function endToolTip(speed = 1) {
	get("tooltip").forEach(element => {
		tween(element.opacity, 0, 0.05 / speed, (p) => element.opacity = p)
		wait(0.08 / speed, () => {
			destroy(element)
		})
	});
}

let maxLogs = 3;
let toastQueue = [];
export function addToast(opt = { icon: "none", title: "Title", body: "Body", color: WHITE }) {
    let logs = get("toast", { recursive: true });

    function actuallyAddToast(idx, opt) {
        let toastBg = add([
            rect(200, 100),
            pos(-200, idx * 150),
            anchor("topleft"),
            color(BLACK.lighten(100)),
			area(),
            "toast",
            {
				running: true,
                timeLeft: 2,
                index: idx,
                update() {
                    this.timeLeft = map(toastProgressBar.width, 0, toastBg.width, 2, 0);
                },
				close() {
					tween(toastBg.pos.x, -toastBg.width, 0.8, (p) => (toastBg.pos.x = p), easings.easeOutQuint).onEnd(() => {
						destroy(toastBg);
						processQueue();
					});
				},
            },
        ]);

		toastBg.onClick(() => {
			toastBg.running = true
			toastBg.close()
			if (opt.title == "This is a title") {  }
			else if (opt.title == "Unlocked store window") openWindow("storeWin")
		})

        // Add content to the toast
        toastBg.add([
            text(opt.title, { size: 24 }),
            pos(10, 10),
        ]);

        let toastProgressBar = toastBg.add([
            rect(toastBg.width, 10),
            pos(0, toastBg.height),
			color(opt.color)
        ]);

        tween(toastBg.pos.x, 0, 0.5, (p) => (toastBg.pos.x = p), easings.easeOutQuint);
        tween(toastProgressBar.width, 0, 2, (p) => (toastProgressBar.width = p), easings.linear).onEnd(() => {
			if (toastBg.running) toastBg.close() 
		});
    }

    function processQueue() {
        let logs = get("toast", { recursive: true });
        while (toastQueue.length > 0 && logs.length < maxLogs) {
            let nextToast = toastQueue.shift();
            let availableIndex = getAvailableIndex(logs);
            if (availableIndex !== -1) {
                actuallyAddToast(availableIndex, nextToast);
                logs = get("toast", { recursive: true }); // update logs after adding a toast
            }
        }
    }

    function getAvailableIndex(logs) {
        let occupiedIndices = logs.map(log => log.index);
        for (let i = 0; i < maxLogs; i++) {
            if (!occupiedIndices.includes(i)) {
                return i;
            }
        }
        return -1;
    }

    logs = get("toast", { recursive: true }); // Update logs

    if (logs.length >= maxLogs) {
        toastQueue.push(opt);
    } else {
        let availableIndex = getAvailableIndex(logs);
        if (availableIndex !== -1) {
            actuallyAddToast(availableIndex, opt);
        }
    }

    processQueue(); // Ensure the queue is processed if there are available slots
}

export function addPlusPercentageScore(posToAdd, amount, size = [40, 50]) {
	let plusScoreText = add([
		text("+" + formatNumber(amount, true, false) + "%", {
			size: rand(size[0], size[1])
		}),
		pos(posToAdd),
		rotate(0),
		anchor("center"),
		z(6),
		{
			// TODO: i like this, look at it !!!
			// dir: vec2(rand(-200, 200), 200),
			// update() {
			// 	this.angle += this.dir.x / 100
			// 	this.dir.y += 10
			// 	this.move(this.dir)
			// },
			// update() {

			// }
		}
	])

	// tween(plusScoreText.pos.y, plusScoreText.pos.y - 50, 1, (p) => plusScoreText.pos.y = p, )
	// tween(1, 0, 1, (p) => plusScoreText.opacity = p, )

	plusScoreText.pos.x = choose([
		rand(posToAdd.x - 50, posToAdd.x - 40),
		rand(posToAdd.x + 50, posToAdd.x + 40),
	])

	plusScoreText.pos.y = choose([
		rand(posToAdd.y - 10, posToAdd.y - 10),
		rand(posToAdd.y + 10, posToAdd.y + 10),
	])

	// animate plusscoretext
	tween(
		plusScoreText.pos.y,
		plusScoreText.pos.y - 20,
		0.25,
		(p) => plusScoreText.pos.y = p,
	);
	tween(
		1,
		0,
		0.25,
		(p) => plusScoreText.opacity = p,
	);

	wait(0.25, () => {
		tween(
			plusScoreText.opacity,
			0,
			0.25,
			(p) => plusScoreText.opacity = p,
		);
	});
	
	wait(0.25, () => {
		destroy(plusScoreText);
	});
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

export function bop(obj, howMuch = 0.1) {
	if (!obj.is("scale")) obj.use(scale(1))
	if (!obj.bopDefScale) obj.bopDefScale = obj.scale

	tween(obj.scale, obj.bopDefScale.sub(howMuch), 0.15, (p) => obj.scale = p, easings.easeOutQuint).then(() => {
		tween(obj.scale, obj.bopDefScale, 0.15, (p) => obj.scale = p, easings.easeOutQuint)
	})
}