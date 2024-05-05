import { GameState } from "../../GameState";
import { isHoveringUpgrade, storeOpen } from "./store";
import { autoLoopTime, excessTime, scorePerAutoClick } from "./gamescene";
import { autoClick, autoScorePerSecond, hexagon } from "./addHexagon";
import { trail } from "../../plugins/trail";

const clamp = (val, min, max) => Math.min(Math.max(val, min), max)

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

export function percentage(number, percentageTo) {
	return Math.round((number * percentageTo) / 100)
}

export function getPrice(basePrice, percentageIncrease, objectAmount, amountToBuy) {
    let priceToReturn = 0;

    for (let i = 0; i < amountToBuy; i++) {
        let currentPrice = basePrice + ((basePrice * percentageIncrease) / 100) * objectAmount * (i + 1);
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
				volumeIndex: ${GameState.volumeIndex}
				sfxVolindex: ${GameState.sfxVolindex}
				musicVolindex: ${GameState.musicVolIndex}
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
			debug.inspect = !debug.inspect
			get("debugText")[0].hidden = !debug.inspect
			get("debugText")[0].paused = !debug.inspect
		}

		else if (isKeyPressed("b")) {
			GameState.cheat()
		}

		else if (isKeyDown("q")) {
			GameState.addScore(10)
		}

		else if (isKeyPressed("w")) {
			autoClick()
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
		area(),
		color(),
		z(0),
		{
			speed: 0.1,
			movAngle: 5,
			uScale: 2,
			col1D: rgb(128, 128, 128),
			col2D: rgb(190, 190, 190),
			tintColor: BLACK,
			blendFactor: 0.55,
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
		if (!hexagon.isHovering()) {
			gameBg.tintColor = BLUE
		}
	})
}

export let mouse;
export function addMouse() {
	mouse = add([
		sprite("cursors"),
		pos(mousePos()),
		area(),
		scale(),
		color(WHITE),
		anchor("center"),
		z(100),
		{
			start: false,
			clicking: false,
			speed: 5000, // 5000 is the optimal for actual mouse movement
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
	
	// mouse.use(trail("cursors", 2, 1, WHITE, 1, 0.5, 1, 0.5))
	
	onHoverUpdate("hoverObj", (obj) => {
		if (obj.is("hexagon")) {
			if (!storeOpen) {
				if (mouse.clicking) mouse.play("grab")
				else mouse.play("point")
			}
		}

		else if (obj.is("storeElement")) {
			if (!isHoveringUpgrade) {
				if (GameState.score >= obj.price) mouse.play("point")
				else mouse.play("cursor")
			}
		}
	
		else if (obj.is("upgrade")) {
			if (GameState.score >= obj.price) mouse.play("point")
			else mouse.play("cursor")
		}
	
		else {
			mouse.play("point")
		}
	})

	onHoverEnd("hoverObj", () => {
		mouse.play("cursor")
		mouse.clicking = false
	})

	onHoverUpdate("glass", (obj) => {
		if (!storeOpen) mouse.play("check")
	})

	onHoverEnd("glass", () => {
		mouse.play("cursor")
	})
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

export function addPlusScoreText(posToAdd, amount, size = [40, 50]) {
	let plusScoreText = add([
		text("+" + formatNumber(amount, true, false), {
			size: rand(size[0], size[1])
		}),
		pos(posToAdd),
		rotate(0),
		anchor("center"),
		z(4),
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
	tween(
		plusScoreText.angle,
		rand(-10, 10),
		0.25,
		(p) => plusScoreText.angle = p,
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

	if (plusScoreText.pos.x > posToAdd.x) plusScoreText.anchor = "left"
	else plusScoreText.anchor = "right"
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