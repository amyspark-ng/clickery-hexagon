import { GameObj } from "kaplay";
import { DEBUG } from "../../main";
import { addTooltip } from "../additives";
import { insideWindowHover } from "../hovers/insideWindowHover";
import { achievements, getAchievement, isAchievementUnlocked, unlockAchievement } from "../unlockables/achievements";
import { blendColors } from "../utils";
import { Vec2 } from "kaplay/src";

// Constants
const totalColumns = 5;
const totalRows = 7;
const initialPos = { x: -132, y: 42 };
const spacing = { x: 66, y: 65 };
const availableAchievements = achievements.slice(0, 20);
let medalsContainer: GameObj | undefined;
let medalMap: Map<string, GameObj> = new Map();

// Position Calculation
function getPositionInWindow(row: number, column: number) {
    const posX = initialPos.x + spacing.x * (column - 1);
    const posY = initialPos.y + spacing.y * (row - 1);
    return vec2(posX, posY);
}

function indexToGrid(i: number) {
    return { row: Math.floor(i / totalColumns) + 1, column: (i % totalColumns) + 1 };
}

// Initialize medal window content
export function medalsWinContent(winParent: GameObj) {
    // Clear any existing medals
    clearMedals();

    medalsContainer = winParent.add([
        pos(-18, -214),
        rect(350, winParent.height - 35 * 2, { radius: 5 }),
        color(BLACK),
        opacity(0.5),
        anchor("top"),
    ]);

    addScrollBar(medalsContainer)
    // Add all medals
    addAllMedals();

    winParent.onScroll(delta => {
        if (!winParent.active || (DEBUG && isKeyDown("shift"))) return;
        scroll(delta.y > 0 ? "down" : "up");
    });

    // Add cleanup logic when the window is closed
    winParent.on("close", clearMedals);
}

// Clear medals from the screen
function clearMedals() {
    if (medalsContainer) {
        medalsContainer.get("medal").forEach(medal => {
            if (medal) {
                medal.destroy(); // Remove individual medal
            }
        });
        medalsContainer.destroy(); // Remove the goddam container
        medalsContainer = undefined;
    }
    medalMap.clear();
}

// Add all medals to the display
function addAllMedals() {
    for (let row = 1; row <= totalRows; row++) {
        const medalIndex = (row - 1) * totalColumns; // Adjust index for first column
        if (medalIndex < achievements.length) {
            const achievementId = achievements[medalIndex].id;
            addMedal({ row: row, column: 1 }, achievementId);
        } else {
            console.warn(`No achievement available for row ${row}, column 1`);
        }
    }

    for (let i = 0; i < achievements.length; i++) {
        if (i >= totalColumns * totalRows) break;
        addMedal(indexToGrid(i), achievements[i].id);
    }
}

// Add a medal to the display
function addMedal(gridPosition: { row: number, column: number }, medal_ID: string, position?: { x: number; y: number }) {
    if (!medalsContainer) {
        console.error("medalsContainer is not defined in addMedal");
        return;
    }
    if (medalMap.has(medal_ID)) return;

    // Check for existing medals at the same position
    const existingMedal = medalsContainer.get("medal").find(medal => medal.row === gridPosition.row && medal.column === gridPosition.column);
    if (existingMedal) {
        console.warn(`Medal at row ${gridPosition.row}, column ${gridPosition.column} already exists. Skipping addition for ${medal_ID}.`);
        return;
    }

    const medalObj = medalsContainer.add(createMedalObject(gridPosition, medal_ID));
    if (position) {
        medalObj.pos = vec2(position.x, position.y);
    } else {
        medalObj.pos = getPositionInWindow(gridPosition.row, gridPosition.column);
    }
    medalObj.achievementIdx = achievements.findIndex(a => a.id === medal_ID);
    medalObj.onClick(() => handleMedalClick(medalObj));
    medalObj.onHover(() => handleMedalHover(medalObj));
    medalObj.onHoverEnd(() => handleMedalHoverEnd(medalObj));
    medalMap.set(medal_ID, medalObj);
}

// Create medal
function createMedalObject(gridPosition: { row: number, column: number }, medal_ID: string) {
    return [
        sprite("medalsUnknown"),
        pos(getPositionInWindow(gridPosition.row, gridPosition.column)),
        anchor("center"),
        layer("windows"), ,
        area(),
        insideWindowHover(medalsContainer),
        color(),
        "medal",
        {
            achievementId: medal_ID,
            row: gridPosition.row,
            column: gridPosition.column,
            update() {
                updateMedalState(this);
            },
        }
    ];
}

// Update medal state
function updateMedalState(medalObj) {
    if (!medalsContainer) {
        console.error("medalsContainer is not defined in updateMedalState");
        return;
    }
    const theAchievement = getAchievement(medalObj.achievementId);
    if (isAchievementUnlocked(medalObj.achievementId)) {
        if (availableAchievements.some(a => a.id === medalObj.achievementId)) {
            medalObj.sprite = "medals_" + medalObj.achievementId;
        } else {
            medalObj.sprite = "medalsUnknown";
            medalObj.color = GREEN.lighten(100);
        }
        if (!medalObj.is("outline")) {
            medalObj.use(outline(5, BLACK));
        }
    } else {
        updateMedalAppearance(medalObj, theAchievement);
    }
}

// Update medal appearance
function updateMedalAppearance(medalObj, theAchievement) {
    const PURPLE = blendColors(RED, BLUE, 0.5);
    if (medalObj.achievementId === "extra.theSlot" && medalObj.sprite !== "medalsUnknown_tap") {
        medalObj.sprite = "medalsUnknown_tap";
    }
    medalObj.color = theAchievement.visibleCondition ?
        (theAchievement.visibleCondition() ? (theAchievement.rare ? YELLOW : RED) : PURPLE) :
        (theAchievement.rare ? YELLOW : RED);
}

// Handle medal click
function handleMedalClick(medalObj) {
    if (medalObj.achievementId === "extra.theSlot" && !isAchievementUnlocked(medalObj.achievementId)) {
        unlockAchievement(medalObj.achievementId);
    }
}

// Handle medal hover
function handleMedalHover(medalObj) {
    const theAchievement = getAchievement(medalObj.achievementId);
    let title = formatTooltipText(theAchievement.title, 50);
    let description = formatTooltipText(theAchievement.description, 50);
    let flavorText = theAchievement.flavorText;
    if (!isAchievementUnlocked(theAchievement.id)) {
        if (theAchievement.visibleCondition && !theAchievement.visibleCondition()) {
            title = "???";
            description = "This achievement is secret\nFor now...";
            flavorText = "";
        } else {
            title = "???";
            description = theAchievement.description;
            flavorText = "";
        }
    }
    const tooltip = addTooltip(medalObj, {
        text: `${title}\n${description}${flavorText.length < 50 ? `. ${flavorText}` : ""}`,
        direction: "down",
        lerpValue: 0.5
    });
    tooltip.tooltipText.align = "center";
    medalObj.tooltip = tooltip;
}

// Format text for tooltip
function formatTooltipText(text: string, maxLength: number) {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
}

// Handle hover end
function handleMedalHoverEnd(medalObj) {
    if (medalObj.tooltip) {
        medalObj.tooltip.end();
    }
}

// Scroll handling
function scroll(direction: "up" | "down") {
    if (!medalsContainer) {
        console.error("medalsContainer is not defined in scroll function");
        return;
    }
    const medals = medalsContainer.get("medal").filter(medal => medal !== undefined);
    const sortedMedals = medals.sort((a, b) => a.achievementIdx - b.achievementIdx);
    if ((direction === "down" && sortedMedals[sortedMedals.length - 1]?.achievementIdx === achievements.length - 1) ||
        (direction === "up" && sortedMedals[0]?.achievementIdx === 0)) return;

    const isScrollingDown = direction === "down";
    const rowChange = isScrollingDown ? -1 : 1;
    const yOffset = isScrollingDown ? -spacing.y : spacing.y;

    // Remove off-screen medals
    medals.forEach(medal => {
        if (medal) {
            if ((isScrollingDown && medal.row === 1) || (!isScrollingDown && medal.row === totalRows)) {
                medalMap.delete(medal.achievementId);
                medal.destroy();
            } else {
                medal.row += rowChange;
                medal.pos.y += yOffset;
            }
        }
    });

    const firstOrLastIdx = sortedMedals[isScrollingDown ? medals.length - 1 : 0]?.achievementIdx;
    if (firstOrLastIdx === undefined) return;

    const nextAchievements = achievements.slice(
        firstOrLastIdx + (isScrollingDown ? 1 : -totalColumns),
        firstOrLastIdx + (isScrollingDown ? 1 : -totalColumns) + totalColumns
    );

    nextAchievements.forEach((achievement, index) => {
        const gridPos = indexToGrid(index);
        addMedal({ row: isScrollingDown ? totalRows : 1, column: gridPos.column }, achievement.id);
    });
}


function addScrollBar(medalsContainer, totalScrolls = 3) {
    if (!medalsContainer) {
        console.error("medalsContainer is not defined in addScrollBar");
        return;
    }

    const scrollBarWidth = 10;
    const scrollBarHeight = medalsContainer.height;
    const totalParts = totalScrolls;

    const bar = medalsContainer.add([
        pos(medalsContainer.width / 2 + 20, 0),
        rect(scrollBarWidth, scrollBarHeight),
        color(0, 0, 0),
        layer("ui"),
    ]);

    const elevatorHeight = scrollBarHeight / totalParts;
    const elevator = medalsContainer.add([
        pos(medalsContainer.width / 2 + 20, 0),
        rect(scrollBarWidth, elevatorHeight),
        color(255, 255, 255),
        layer("ui"),
        area(),
        "elevator",
    ]);

    let currentScroll = 0;
    let isDragging = false;

    function updateElevator(scrollStep) {
        currentScroll = Math.max(0, Math.min(currentScroll + scrollStep, totalScrolls));
        const elevatorY = (currentScroll / totalScrolls) * (scrollBarHeight - elevatorHeight);
        elevator.pos.y = elevatorY;
    }

    medalsContainer.onScroll((delta) => {
        if (delta.y > 0) {
            updateElevator(1);
        } else if (delta.y < 0) {
            updateElevator(-1);
        }
    });

    onMouseDown("left", () => {
        const mouseY = mousePos().y;
        if (mouseY >= elevator.pos.y && mouseY <= elevator.pos.y + elevatorHeight) {
            isDragging = true;
        }
    });

    onMouseRelease("left", () => {
        isDragging = false;
    });

    onUpdate(() => {
        if (isDragging) {
            const mouseY = mousePos().y;
            const newElevatorY = Math.max(0, Math.min(mouseY - elevatorHeight / 2, scrollBarHeight - elevatorHeight));
            elevator.pos.y = newElevatorY;

            // Update the current scroll based on the new elevator position
            currentScroll = Math.round((elevator.pos.y / (scrollBarHeight - elevatorHeight)) * totalScrolls);
        }
    });

    function getSectionByClick(mousePositionY) {
        const sectionHeight = scrollBarHeight / totalParts;
        return Math.floor(mousePositionY / sectionHeight);
    }

    /* onMouseDown("left", () => {
        const mouseY = mousePos().y;

        // Only trigger scroll logic if the click is directly on the scroll bar but not on the elevator
        if (mouseY < elevator.pos.y || mouseY > elevator.pos.y + elevatorHeight) {
            const targetSection = getSectionByClick(mouseY);

            currentScroll = Math.max(0, Math.min(targetSection, totalScrolls));
            const elevatorY = (currentScroll / totalScrolls) * (scrollBarHeight - elevatorHeight);
            elevator.pos.y = elevatorY;
        }
    });*/
}