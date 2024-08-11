import ng, { User } from "newgrounds.js"
import { newgroundsSceneContent } from "../../newgrounds"

export const ngScene = () => scene("ngScene", () => {
	newgroundsSceneContent()
})