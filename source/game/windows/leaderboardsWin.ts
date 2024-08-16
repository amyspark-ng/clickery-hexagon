import ng from 'newgrounds.js';
import * as env from "../../env.json"
import { ScoreBoardGetScoresParams } from "newgrounds.js/dist/first";
import { GameObj, TextCompOpt } from 'kaplay';
import { Score } from 'newgrounds.js/dist/first';
import { formatNumber } from '../utils';
import { positionSetter } from '../plugins/positionSetter';

async function updateScores(winParent:GameObj) {
	const paramsForGettingScores = { period: "A", limit: 5 } as ScoreBoardGetScoresParams 
	const dummyLeaderboard = { user: { name: "NoOne" }, value: 0 } as Score
	const scoreLeaderboards = await ng.getScores(env.SCORE_LEADERBOARD_ID, paramsForGettingScores);
	const timeLeaderboards = await ng.getScores(env.TIME_LEADERBOARD_ID, paramsForGettingScores);

	for (let i = 0; i < 5; i++) {
		if (!scoreLeaderboards[i]) scoreLeaderboards[i] = dummyLeaderboard
	}

	for (let i = 0; i < 5; i++) {
		if (!timeLeaderboards[i]) timeLeaderboards[i] = dummyLeaderboard
	}

	let names = winParent.get("names")[0]
	if (names) {
		let scoreNames = scoreLeaderboards.map((score) => score.user.name)
		names.text = scoreNames.join("\n")
	}

	let scores = winParent.get("scores")[0]
	if (scores) {
		let scoreValues = scoreLeaderboards.map((score) => formatNumber(score.value))
		scores.text = scoreValues.join("\n")
	}

	let times = winParent.get("times")[0]
	if (times) {
		let timeValues = timeLeaderboards.map((score) => score.value + "h")
		times.text = timeValues.join("\n")
	}

	debug.log("updated scores")
}

export async function leaderboardsWinContent(winParent:GameObj) {
	// is loading waiting for update scores
	let loadingEvent = winParent.onDraw(() => {
		drawText({
			text: "loading" + ".".repeat(wave(1, 4, time() * 12)),
			size: 24,
			anchor: "center",
			pos: vec2(0),
		});
	})

	await updateScores(winParent)

	// all of this runs after the scores are gotten
	loadingEvent.cancel()

	// i was too lazy to make it in-game
	let header = winParent.add([
		sprite("leaderboardsHeader"),
		anchor("center"),
		pos(-30, -91),
	])

	const propertyTextProperties = {
		textOpts: { align: "center", lineSpacing: 10 } as TextCompOpt,
		yPos: 40,
	}

	// ranks
	let ranks = winParent.add([
		text("", propertyTextProperties.textOpts),
		pos(-252, propertyTextProperties.yPos),
		anchor("center"),
	])
	let rankNumbers = ["1.", "2.", "3.", "4.", "5."]
	ranks.text = rankNumbers.join("\n") 

	// names
	let names = winParent.add([
		text("", propertyTextProperties.textOpts),
		pos(-141, propertyTextProperties.yPos),
		anchor("center"),
		"names"
	])

	// scores
	let scores = winParent.add([
		text("", propertyTextProperties.textOpts),
		pos(39, propertyTextProperties.yPos),
		anchor("center"),
		"scores"
	])

	// times
	let times = winParent.add([
		text("", propertyTextProperties.textOpts),
		pos(189, propertyTextProperties.yPos),
		anchor("center"),
		"times"
	])
	
	let line1 = winParent.add([
		sprite("leaderboardsTheLine"),
		pos(-26, 21),
		anchor("center"),
	])

	let line2 = winParent.add([
		sprite("leaderboardsTheLine"),
		pos(114, 21),
		anchor("center"),
	])

	// now after being added update them all
	await updateScores(winParent)

	winParent.wait(10, () => {
		winParent.loop(30, async () => {
			await updateScores(winParent)
		})
	})
}