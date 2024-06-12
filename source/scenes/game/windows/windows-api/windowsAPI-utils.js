import { GameState } from "../../../../gamestate";
import { addMinibutton, folderObj, infoForWindows, miniButtonsArray } from "./windowsAPI";

function calculateButtonPosition(index, buttonSpacing = 75) {
    return folderObj.pos.x - buttonSpacing * (index + 1);
}

export function updateButtonPositions() {
    // Define the base position and spacing for the buttons
    const baseXPos = folderObj.pos.x;
    const buttonSpacing = 75; // Adjust this value as needed

    // Iterate through the taskbar array to update button positions
    GameState.taskbar.forEach((key, index) => {
        // Calculate the new x position for the button based on the index
        const newXPos = baseXPos - (index * buttonSpacing);

        // Retrieve the button directly using the index from the taskbar
		const button = miniButtonsArray[index];

		// Animate existing button to the new position
		tween(button.pos.x, newXPos, 0.32, (p) => button.pos.x = p, easings.easeOutQuint);
    });
}