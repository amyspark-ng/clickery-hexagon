import ng from "newgrounds.js";
import * as env from "../../env.json";
import { ScoreBoardGetScoresParams } from "newgrounds.js/dist/first";
import { GameObj, TextCompOpt } from "kaplay";
import { Score } from "newgrounds.js/dist/first";
import { capitalizeFirstLetter, formatNumber, formatTime, toHHMMSS } from "../utils";
import { positionSetter } from "../plugins/positionSetter";
import { WindowGameObj } from "./windows-api/windowManaging";
import { hoverController } from "../../hoverManaging";
import { Period } from "newgrounds.js/dist/first";
import { isAchievementUnlocked } from "../unlockables/achievements";
import { GameState } from "../../gamestate";

let currentlyLoading = true;

const leaderboardIds = {
	"scoreAllTime": env.SCORE_LEADERBOARD_ID,
	"totalTime": env.TIME_LEADERBOARD_ID,
	"totalMana": env.MANA_LEADERBOARD_ID,
};

let currentLeaderboard: keyof typeof leaderboardIds = "scoreAllTime";
let currentTimePeriod: Period = "A";

async function updateScores(winParent: WindowGameObj) {
	currentlyLoading = true;
	const paramsForGettingScores = { period: currentTimePeriod, limit: 5 } as ScoreBoardGetScoresParams;
	const leaderboardData = await ng.getScores(leaderboardIds[currentLeaderboard], paramsForGettingScores);

	let names = winParent.get("names")[0];
	if (names) {
		let scoreNames = leaderboardData.map((score) => score.user.name);
		names.text = scoreNames.join("\n");
	}

	let scores = winParent.get("scores")[0];
	if (scores) {
		let scoreValues = leaderboardData.map((score) => {
			if (currentLeaderboard == "totalTime") return formatTime(score.value / 1000, false);
			else return formatNumber(score.value);
		});
		scores.text = scoreValues.join("\n");
	}

	let scoreicon = winParent.get("scoreIcon")[0];
	if (scoreicon) {
		switch (currentLeaderboard) {
			case "scoreAllTime":
				scoreicon.sprite = "hexagon";
				break;
			case "totalTime":
				scoreicon.sprite = "sandclock";
				break;
			case "totalMana":
				scoreicon.sprite = "icon_ascend";
				break;
		}
		scoreicon.width = 45;
		scoreicon.height = 45;
	}

	currentlyLoading = false;
}

export async function leaderboardsWinContent(winParent: WindowGameObj) {
	// is loading waiting for update scores
	winParent.onDraw(() => {
		if (!currentlyLoading) return;
		drawText({
			text: "Loading" + ".".repeat(wave(1, 4, time() * 10)),
			size: 24,
			anchor: "center",
			pos: vec2(0),
		});
	});

	await updateScores(winParent);

	// i was too lazy to make it in-game
	let header = winParent.add([
		sprite("leaderboardsHeader"),
		anchor("center"),
		pos(-192, -92),
	]);

	const propertyTextProperties = {
		textOpts: { align: "center", lineSpacing: 10 } as TextCompOpt,
		yPos: 40,
	};

	// ranks
	let ranks = winParent.add([
		text("", propertyTextProperties.textOpts),
		pos(-252, propertyTextProperties.yPos),
		anchor("center"),
	]);
	let rankNumbers = ["1.", "2.", "3.", "4.", "5."];
	ranks.text = rankNumbers.join("\n");

	// names
	let names = winParent.add([
		text("", propertyTextProperties.textOpts),
		pos(-141, propertyTextProperties.yPos),
		anchor("center"),
		"names",
	]);

	// scores
	let scores = winParent.add([
		text("", propertyTextProperties.textOpts),
		pos(39, propertyTextProperties.yPos),
		anchor("center"),
		"scores",
	]);

	let scoreIcon = winParent.add([
		sprite("hexagon"),
		pos(40, -94),
		anchor("center"),
		scale(),
		"scoreIcon",
	]);
	scoreIcon.width = 45;
	scoreIcon.height = 45;

	Object.keys(leaderboardIds).forEach((key, index: number) => {
		const upperKey = capitalizeFirstLetter(key);
		const leaderboardIdButton = winParent.add([
			sprite("leaderboards" + upperKey),
			pos(180, -65 + index * 50),
			hoverController(),
			area(),
			scale(),
			anchor("center"),
			color(),
			opacity(),
		]);

		leaderboardIdButton.onUpdate(() => {
			if (key as typeof currentLeaderboard == "totalMana" && GameState.stats.timesAscended < 1) {
				leaderboardIdButton.scale = vec2(0);
				return;
			}

			if (leaderboardIdButton.isHovering()) {
				leaderboardIdButton.scale = lerp(leaderboardIdButton.scale, vec2(1.1), 0.5);
				leaderboardIdButton.opacity = lerp(leaderboardIdButton.opacity, 1, 0.5);
			}
			else {
				leaderboardIdButton.scale = lerp(leaderboardIdButton.scale, vec2(1), 0.5);
				leaderboardIdButton.opacity = lerp(leaderboardIdButton.opacity, 0.9, 0.5);
			}

			if (currentLeaderboard == key) {
				leaderboardIdButton.color = lerp(leaderboardIdButton.color, WHITE, 0.5);
			}
			else {
				leaderboardIdButton.color = lerp(leaderboardIdButton.color, WHITE.darken(50), 0.5);
			}
		});

		leaderboardIdButton.onClick(async () => {
			if (currentLeaderboard == key) return;
			currentLeaderboard = key as typeof currentLeaderboard;
			await updateScores(winParent);
		});
	});

	const timePeriods: Period[] = ["W", "M", "A"];
	timePeriods.forEach((period, index) => {
		const periodButton = winParent.add([
			sprite("leaderboards" + period),
			pos(130 + 45 * index, 100),
			anchor("center"),
			area(),
			hoverController(),
			scale(),
			opacity(),
			color(),
		]);

		periodButton.onUpdate(() => {
			if (periodButton.isHovering()) {
				periodButton.scale = lerp(periodButton.scale, vec2(1.1), 0.5);
				periodButton.opacity = lerp(periodButton.opacity, 1, 0.5);
			}
			else {
				periodButton.scale = lerp(periodButton.scale, vec2(1), 0.5);
				periodButton.opacity = lerp(periodButton.opacity, 0.9, 0.5);
			}

			if (currentTimePeriod == period) {
				periodButton.color = lerp(periodButton.color, WHITE, 0.5);
			}
			else {
				periodButton.color = lerp(periodButton.color, WHITE.darken(50), 0.5);
			}
		});

		periodButton.onClick(async () => {
			if (currentTimePeriod == period) return;
			currentTimePeriod = period;
			await updateScores(winParent);
		});
	});

	// now after being added update them all
	await updateScores(winParent);

	winParent.onUpdate(() => {
		scoreIcon.hidden = currentlyLoading;
		scores.hidden = currentlyLoading;
		names.hidden = currentlyLoading;
		ranks.hidden = currentlyLoading;
		header.hidden = currentlyLoading;
	});

	winParent.on("close", () => {
		currentlyLoading = true;
	});
}
