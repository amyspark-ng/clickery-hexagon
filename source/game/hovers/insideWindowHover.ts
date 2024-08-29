// =========================
// INSIDE HOVER WINDOW COMPONENT

import { GameObj } from "kaplay"
import { curDraggin } from "../plugins/drag"

// =========================
export function insideWindowHover(winParent:GameObj) {
	
	// doesn't take in account mouse animations, do it by yourself in the hover function!!
	return {
		id: "insideHover",
		require: ["area"],

		/**
		 * if the startHoverAnim function was called
		 */
		isBeingHovered: false,
	
		/**
		 * Function you set to be called (with no conditions) to be called when the hover starts
		 */
		startHoverAnim: null,
		/**
		 * Function you set to be called (with no conditions) to be called when the hover ends
		 */
		endHoverAnim: null,

		/**
		 * Function you set to be called (under certain inside window hover conditions) when the hover starts
		 */
		startHoverFunction: null,
		/**
		 * Function you set to be called (under certain inside window hover conditions) when the hover ends
		 */
		endHoverFunction: null,
		/**
		 * Function you set to be called (under certain inside window hover conditions) when the object is clicked
		 */
		clickFunction: null,

		winParent: winParent,

		add() {
			this.startHoverFunction = function() {
				if (this.startHoverAnim != null) {
					if (this.isBeingHovered == false) {
						this.startHoverAnim()
						
						this.trigger("insideHoverStart")
						this.isBeingHovered = true
					}
				}
			}

			this.endHoverFunction = function () {
				if (this.endHoverAnim != null) {
					if (this.isBeingHovered == true) {
						this.endHoverAnim()
	
						this.trigger("insideHoverEnd")
						this.isBeingHovered = false
					}
				}
			}

			this.onHover(() => {
				if (curDraggin) return
				if (this.winParent.active == false) return
				if (this.startHoverFunction != null) this.startHoverFunction()
			})

			this.onHoverEnd(() => {
				if (this.dragging == true) return
				if (this.winParent.active == false) return
				if (this.endHoverFunction != null) this.endHoverFunction()
			})

			this.onClick(() => {
				if (this.winParent.active == false) return
				if (this.clickFunction != null) this.clickFunction()
			})
		},

		/**
		 * Sets the start hover anim
		 */
		startingHover(action: () => void) {
			this.startHoverAnim = action
		},

		/**
		 * Sets the end hover anim
		 */
		endingHover(action: () => void) {
			this.endHoverAnim = action
		},

		/**
		 * Sets the click function
		 * Can't run if the window is un-active
		 */
		onPressClick(action: () => void) {
			this.clickFunction = action
		}
	}
}