import { GameState } from "../main"

export function save(thingToSave, valueToSave) {
	if (thingToSave == "storeElements") {
		GameState.storeElements = valueToSave
		setData("storeElements", GameState.storeElements)
	}

	else {
		GameState.upgradePriceData = valueToSave
		setData("upgradePriceData", GameState.upgradePriceData)
	}

	let savedText = add([
		text("Buy-data saved"),
		pos(width(), height() + 50),
		color(rgb(154, 255, 150)),
		anchor("right"),
		opacity(1),
	])

	tween(savedText.pos.y, height() - 25, 0.5, (p) => savedText.pos.y = p, easings.easeOutQuint)
	wait(2, () => {
		tween(savedText.opacity, 0, 0.25, (p) => savedText.opacity = p, easings.easeOutQuint).onEnd(() => {
			destroy(savedText)
		})
	})
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

export let gameBg;
export function addBackground() {
	gameBg = add([
		rect(width(), height()),
		pos(center()),
		anchor("center"),
		scale(8),
		area(),
		stay(),
		color(),
		z(0),
		"bg",
		{
			defScale: vec2(1),
			speed: 0.1,
			movAngle: 5,
			uScale: 2,
			col1D: rgb(128, 128, 128),
			col2D: rgb(190, 190, 190),
			tintColor: rgb(0, 8, 18),
			blendFactor: 0.62,
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
}

export function bop(obj, howMuch = 0.1) {
	if (!obj.is("scale")) obj.use(scale(1))
	if (!obj.defScale) obj.defScale = obj.scale

	tween(obj.scale, obj.defScale.sub(howMuch), 0.15, (p) => obj.scale = p, easings.easeOutQuint).then(() => {
		tween(obj.scale, obj.defScale, 0.15, (p) => obj.scale = p, easings.easeOutQuint)
	})
}