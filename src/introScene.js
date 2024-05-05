import { playMusic } from "./sound"

export function introscene() {
	return scene("introscene", () => {
		playMusic("menuTheme", 0, true)
		
		debug.log("amuspark logo")
	})	
}