import { Vec2 } from "kaplay"
import { drag } from "../.././plugins/drag"

type infoWinOpts = {
	width: number,
	height: number,
	pos: Vec2,
	content: () => void,
	/**
	 * What is the purpose/type of this window
	 */
	type: string,
}

// TODO: make the info window using slice-9 so i can add tips or stuff sometimes
export function openInfoWin(opts:infoWinOpts) {
	let windowObj = add([
		sprite("dumbTestWin"),
		pos(),
		anchor("center"),
		opacity(1),
		scale(1),
		layer("windows"),
		z(0),
		drag(),
		area({ scale: vec2(1, 1) }),
		"window",
		"infoWin",
		{
			type: opts.type,
		}
	])

	opts.content()
}

export function closeInfoWin(type:string) {
	query({
		include: ["window", "infoWin"],
		includeOp: "and",
	}).filter(win => win.type == type)[0].close()
}