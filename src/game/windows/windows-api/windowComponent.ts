import { GameObj } from "kaplay";
import { windowKey } from "./windowManaging";

// if it's not imported it doesn't work
export interface windowComp {
	/**
	 * Wheter the window can be closed or not
	 */
	canClose: boolean,
	addContent(content: (this:GameObj, windowKey?:windowKey) => void): () => void
}

export function windowComp(key:windowKey) : windowComp {
	return {
		/**
		 * Wheter the window can be closed or not
		 */
		canClose: true,

		addContent(content: (this:GameObj, windowKey?:windowKey) => void): () => void {
			return content;
		}
	}
}