import { bop } from "./utils"

let upgradePriceData = {
	"u_0": 10,
	"u_1": 30,
	"u_2": 100,
	"u_3": 300,
	"u_4": 1000,
	"u_5": 3000,
	"u_6": 10000,
	"u_7": 30000,
	"u_8": 100000,
	"u_9": 300000,
	"u_10": 1000000,
	"u_11": 3000000,
	"u_12": 10000000,
	"u_13": 30000000,
	"u_14": 100000000,
	"u_15": 300000000,
}

function deactivateAllTextboxes() {
	get("upgrade", { recursive: true }).forEach((obj) => {
		obj.closeTextBox()		
	})
}

export function addUpgrade(type, idx) {
	let upgrade = add([
		sprite(type == "u_" ? "mupgrades" : "upgrades", {
			anim: type + idx
		}),
		pos(10, 10 + 75 * idx),
		scale(type == "u_" ? 0.9 : 1.5),
		area(),
		anchor("center"),
		"clickable",
		"upgrade",
		{
			idx: idx,
			textObj: null,
			active: false,
			addTextBox() {
				let bg = add([
					rect(priceText.width + 10, priceText.height + 10),
					color(WHITE),
					pos(this.textObj.pos),
					anchor(this.textObj.anchor),
					z(this.textObj.z - 1),
					"textbox",
					{
						update() {
							this.width = priceText.width + 10
							this.height = priceText.height + 10
						}
					}
				])
				
				this.active = true
				readd(this.textObj)
				this.textObj.color = BLACK

				bg.onCharInput((ch) => {
					if (!isNaN(Number(ch)))
					this.textObj.text += Number(ch)
				})

				bg.onKeyPressRepeat("backspace", () => {
					if (this.textObj.text[this.textObj.text.length - 1] == "$") return
					this.textObj.text = this.textObj.text.slice(0, -1)
				})

				bg.onKeyPress("enter", () => {
					if (!get("clickable").some((obj) => obj.isHovering()) && get("textbox").length > 0) {
						deactivateAllTextboxes()
					}
				})
			},

			closeTextBox() {
				if (!this.active) return
				upgradePriceData["u_" + this.idx] = this.textObj.text.replace("$", "")
				this.textObj.color = WHITE
				destroy(get("textbox")[0])
				this.active = false
			}
		}
	])

	if (type == "k_") {
		upgrade.pos.x = 45
		upgrade.pos.y = 85 * (idx + 1)
	}

	else if (type == "c_") {
		upgrade.pos.x = 350
		upgrade.pos.y = 85 * ((idx - 6) + 1)
	}

	else if (type == "u_") {
		upgrade.pos.x = 700
		upgrade.pos.y = 85 * ((idx - 12) + 1)
	}

	upgrade.onUpdate(() => {
		if (type == "u_") {
			upgrade.frame = (idx - 12) * 3
		}
		
		else {
			upgrade.frame = idx * 3
		}
	})

	let priceText = add([
		text(upgradePriceData[idx]),
		pos(upgrade.pos.x + 50, upgrade.pos.y),
		anchor("left"),
		area(),
		"clickable",
		{
			upgrade: upgrade,
			update() {
				// u referring to upgrade not to misc upgrade
				if (!upgrade.active) this.text = "$" + upgradePriceData["u_" + idx] 
			}
		}
	])

	upgrade.textObj = priceText
}

export function upgradescene() {
	return scene("upgradescene", () => {
		
		for(let i = 0; i < 16; i++) {
			let type = "k_";

			if (i < 6) {
				type = "k_"
			}
			else if (i < 12) {
				type = "c_"
			}
			else {
				type = "u_"
			}

			addUpgrade(type, i)
		}

		onClick(() => {
			if (!get("clickable").some((obj) => obj.isHovering()) && get("textbox").length > 0) {
				deactivateAllTextboxes()
			}
		})

		onClick("clickable", (obj) => {
			if (obj.is("upgrade")) {
				bop(obj, 0.05)
				play("generalClick", { detune: 10 * obj.idx })
				obj.addTextBox()
			}

			else {
				obj.upgrade.addTextBox()
			}
		})

		onKeyPress("left", () => {
			go("gamescene")
		})
	})
}
