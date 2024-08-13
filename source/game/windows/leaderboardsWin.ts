import ng from 'newgrounds.js';
import * as env from "../../env.json"
import { ScoreBoardGetScoresParams } from "newgrounds.js/dist/first";

export async function leaderboardsWinContent(winParent) {
	let leaderboard = await ng.getScores(env.LEADERBOARD_ID, {  } as ScoreBoardGetScoresParams);
}