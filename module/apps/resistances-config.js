/**
 * A simple form to set Actor movement speeds.
 * @extends {DocumentSheet}
 */
export default class ActorResistancesConfig extends DocumentSheet {

    /** @inheritdoc */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["dnd5e"],
            template: "systems/trpg/templates/apps/resistances-config.html",
            width: 300,
            height: "auto"
        });
    }

    /* -------------------------------------------- */

    /** @inheritdoc */
    get title() {
        return `${game.i18n.localize("TRPG.ResistancesConfig")}: ${this.document.name}`;
    }

    /* -------------------------------------------- */

    /** @inheritdoc */
    getData(options) {
        const resistances = foundry.utils.getProperty(this.document.system._source, "data.traits.resistances") || {};
        const data = {
            resistances: {}
        };
        for (let [name, label] of Object.entries(CONFIG.TRPG.damageResistanceTypes)) {
            const v = resistances[name];
            data.resistances[name] = {
                label: game.i18n.localize(label),
                value: Number.isNumeric(v) ? v.toNearest(0.1) : 0
            }
        }
        return data;
    }
}
