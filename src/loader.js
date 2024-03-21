import { gamescene } from "./scenes/gamescene.js"

export function loadAssets() {
	loadRoot("./assets/")
	loadBean()
	
	loadSound("volumeChange", "sounds/volumeChange.wav")

	
	loadSprite("osaka", "sprites/osaka.png")
	// scenes
	gamescene()
}