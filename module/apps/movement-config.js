/**
 * A simple form to set actor movement speeds
 * @extends {DocumentSheet}
 */
export default class ActorMovementConfig extends DocumentSheet {
	/** @override */
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ["dnd5e"],
			template: "systems/trpg/templates/apps/movement-config.html",
			width: 300,
			height: "auto",
		});
	}

	/* -------------------------------------------- */

	/** @override */
	get title() {
		return `${game.i18n.localize("TRPG.MovementConfig")}: ${this.document.name}`;
	}

	/* -------------------------------------------- */

	/** @override */
	getData(options) {
		const sourceMovement = foundry.utils.getProperty(this.document.system._source, "data.attributes.movement") || {};
		const data = {
			movement: foundry.utils.deepClone(sourceMovement),
			units: CONFIG.TRPG.movementUnits,
		};
		for (let [k, v] of Object.entries(data.movement)) {
			if (["units", "hover"].includes(k)) continue;
			data.movement[k] = Number.isNumeric(v) ? v.toNearest(0.1) : 0;
		}
		return data;
	}
}
