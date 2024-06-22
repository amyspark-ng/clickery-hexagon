import { GameState } from "../../gamestate"
import { curDraggin } from "../../plugins/drag"
import { panderitoIndex } from "./gamescene"
import { hexagon } from "./hexagon"
import { arrayToColor, blendColors } from "./utils"
import { isDraggingAWindow, isGenerallyHoveringAWindow, isPreciselyHoveringAWindow, manageWindow } from "./windows/windows-api/windowsAPI"

export let gameBg;
export function addBackground() {
	gameBg = add([
		rect(width(), height()),
		pos(center()),
		anchor("center"),
		scale(8),
		color(arrayToColor(GameState.settings.bgColor)),
		z(-1),
		stay(),
		{
			speed: 0.1,
			movAngle: 5,
			uScale: 2,
			col1D: rgb(128, 128, 128),
			col2D: rgb(190, 190, 190),
			update() {
				if (isMousePressed("right")) {
					// doesn't check for hovering this because you will always be hovering it lol
					if (!hexagon?.isHovering() && !get("folderObj")[0]?.isHovering() && !get("minibutton")[0]?.isHovering() && !get("window")[0]?.isHovering() && !isDraggingAWindow) {
						manageWindow("bgColorWin")
					}
				}
			}
		}
	])

	gameBg.color.a = GameState.settings.bgColor[3]
	gameBg.use(shader("checkeredBg", () => ({
        "u_time": time() / 10,
        "u_color1": blendColors(gameBg.col1D, gameBg.color, gameBg.color.a),
        "u_color2": blendColors(gameBg.col2D, gameBg.color, gameBg.color.a),
        "u_speed": vec2(-1, 2).scale(gameBg.speed),
        "u_angle": gameBg.movAngle,
        "u_scale": gameBg.uScale,
		"u_aspect": width() / height()
    })))
}

export let mouse;
export function addMouse() {
	mouse = add([
		sprite("cursors"),
		pos(mousePos()),
		scale(0.8),
		color(WHITE),
		stay(),
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
				this.pos = mousePos()
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
		if (!isPreciselyHoveringAWindow && !isDraggingAWindow && !curDraggin?.is("minibutton")) {
			mouse.play("point")
		}
	})

	onHoverEnd("hover_outsideWindow", () => {
		if (!isPreciselyHoveringAWindow && !isDraggingAWindow && !curDraggin?.is("minibutton")) {
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
export function addToast(opts = { icon: "none", title: "Title", body: "Body", color: WHITE }) {
    let logs = get("toast", { recursive: true });

    function actuallyAddToast(idx, opt) {
        let toastBg = add([
            rect(280, 120, { radius: [0, 10, 10, 0] }),
            pos(-200, 25 + idx * 150),
            anchor("topleft"),
            color(WHITE.darken(50)),
			z(hexagon.z),
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

		let drawShadow = onDraw(() => {
			drawRect({
				pos: vec2(toastBg.pos.x, toastBg.pos.y + 5),
				width: toastBg.width,
				height: toastBg.height,
				color: BLACK,
				radius: [0, 10, 10, 0],
				z: toastBg.z - 1,
				opacity: 0.5,
			})
		})

		toastBg.onClick(() => {
			toastBg.running = true
			toastBg.close()
			if (opt.title == "This is a title") {  }
			else if (opt.title == "Unlocked store window") openWindow("storeWin")
		})

        // Add content to the toast
		let icon;
		if (opts.icon) {
			icon = toastBg.add([
				sprite("mupgrades", {
					anim: "u_12",
				}),
				anchor("center"),
				pos(40, 40),
			])

			icon.width = 60
			icon.height = 60
		}
		
		// position and scale them based on icon opts.icon ? x
		let titleText = toastBg.add([
			text(opts.title, {
				font: "lambda",
				size: opts.icon ? 35 : 40,
				align: "left",
			}),
			pos(opts.icon ? icon.pos.x + 35 : 10, opts.icon ? icon.pos.y - 15 : 10),
			color(BLACK),
			scale(),
		]);

		let bodyText = toastBg.add([
			text(opts.body, {
				font: "lambda",
				size: 20,
				align: "left",
				width: toastBg.width - 10
			}),
			pos(opts.icon ? icon.pos.x - icon.width / 2 : 10, opts.icon ? icon.pos.y + icon.height / 2  + 15 : titleText.pos.y + titleText.height / 2 + 20),
			color(BLACK),
		]);

        let toastProgressBar = toastBg.add([
            rect(toastBg.width, 10),
            pos(0, toastBg.height),
			color(opt.color),
			opacity(0),
        ]);

        tween(toastBg.pos.x, 0, 0.5, (p) => toastBg.pos.x = p, easings.easeOutQuint);
        tween(toastProgressBar.width, 0, 2, (p) => toastProgressBar.width = p, easings.linear).onEnd(() => {
			if (toastBg.running) toastBg.close()
		});

		toastBg.onDestroy(() => {
			drawShadow.cancel()
		})
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
        toastQueue.push(opts);
    } else {
        let availableIndex = getAvailableIndex(logs);
        if (availableIndex !== -1) {
            actuallyAddToast(availableIndex, opts);
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
