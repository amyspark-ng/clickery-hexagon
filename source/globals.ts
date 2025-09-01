export let DEBUG = false;
export let enableNg = true;
export const GAME_VERSION = "1.3.0";

const todayDate = new Date();
const clickeryBirthday = new Date();
clickeryBirthday.setDate(1);
clickeryBirthday.setMonth(8);
clickeryBirthday.setFullYear(2024);

/** How many years since clickery released, used in score calculation too */
export const clickeringYears = todayDate.getFullYear() - clickeryBirthday.getFullYear();

/** Wheter it's clickery's birthday or not */
export const isClickeryBirthday = todayDate.getMonth() == clickeryBirthday.getMonth() && todayDate.getDate() == clickeryBirthday.getDate();
