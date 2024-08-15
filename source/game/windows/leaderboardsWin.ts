import ng from 'newgrounds.js';
import * as env from "../../env.json"
import { ScoreBoardGetScoresParams } from "newgrounds.js/dist/first";
import { GameObj } from 'kaplay';
import { Score } from 'newgrounds.js/dist/first';
import { formatNumber } from '../utils';

export async function leaderboardsWinContent(winParent:GameObj) {
	for (let i = 0; i < 5; i++) {
		let currentText = winParent.add([
			text(`#${i+1} - ${"NoOne"} ${formatNumber(0)}`),
			pos(0, i * 50),
			anchor("left"),
			"leaderboardText",
			{
				idx: i,
			}
		])
	}

	async function updateScores() {
		let leaderboards = await ng.getScores(env.LEADERBOARD_ID, {  } as ScoreBoardGetScoresParams);
		
		winParent.get("leaderboardText").forEach((currentTextObj) => {
			let currentLeaderboard = leaderboards[currentTextObj.idx] || { user: { name: "NoOne" }, value: 0 }
			currentTextObj.text = `#${currentTextObj.idx+1} - ${currentLeaderboard.user.name} ${formatNumber(currentLeaderboard.value)}`
		})
	}

	updateScores()

	wait(5, () => {
		winParent.loop(30, () => {
			updateScores()
		})
	})
}