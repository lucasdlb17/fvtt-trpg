import Actor5e from "../entity.js";
import ActorSheet5e from "../sheets/base.js";

/**
 * An Actor sheet for NPC type characters.
 * Extends the base ActorSheet5e class.
 * @extends {ActorSheet5e}
 */
export default class ActorSheet5eNPC extends ActorSheet5e {
	/** @override */
	static get defaultOptions() {
		let classes = ["dnd5e", "sheet", "actor", "npc"];
		let height = 680;
		if (game.settings.get("trpg", "idjMode")) {
			classes.push("idj");
			height = 752;
		}
		return mergeObject(super.defaultOptions, {
			classes,
			width: 605,
			height,
		});
	}

	/* -------------------------------------------- */

	/** @override */
	static unsupportedItemTypes = new Set(["class"]);

	/* -------------------------------------------- */

	/**
	 * Organize Owned Items for rendering the NPC sheet
	 * @private
	 */
	_prepareItems(data) {
		// Categorize Items as Features, Jutsus and Spells
		const features = {
			weapons: {
				label: game.i18n.localize("TRPG.AttackPl"),
				items: [],
				hasActions: true,
				dataset: { type: "weapon", "weapon-type": "natural" },
			},
			actions: {
				label: game.i18n.localize("TRPG.ActionPl"),
				items: [],
				hasActions: true,
				dataset: { type: "feat", "activation.type": "action" },
			},
			passive: {
				label: game.i18n.localize("TRPG.Features"),
				items: [],
				dataset: { type: "feat" }
			},
			equipment: {
				label: game.i18n.localize("TRPG.Inventory"),
				items: [],
				dataset: { type: "loot" }
			},
		};

		// Start by classifying items into groups for rendering
		let [spells, jutsus, other] = data.items.reduce(
			(arr, item) => {
				item.img = item.img || CONST.DEFAULT_TOKEN;
				item.isStack = Number.isNumeric(item.system.quantity) && item.system.quantity !== 1;
				item.hasUses = item.system.uses && item.system.uses.max > 0;
				item.isOnCooldown = item.system.recharge && !!item.system.recharge.value && item.system.recharge.charged === false;
				item.isDepleted = item.isOnCooldown && item.system.uses.per && item.system.uses.value > 0;
				item.hasTarget = !!item.system.target && !["none", ""].includes(item.system.target.type);
				if (item.type === "spell") arr[0].push(item);
				else if (item.type === "jutsu") arr[1].push(item);
				else arr[2].push(item);
				return arr;
			},
			[[], [], []]
		);

		// Apply item filters
		spells = this._filterItems(spells, this._filters.spellbook);
		jutsus = this._filterItems(jutsus, this._filters.jutsuslist);
		other = this._filterItems(other, this._filters.features);

		// Organize Spellbook
		const spellbook = this._prepareSpellbook(data, spells);

		// Organize Jutsuslist
		const jutsuslist = this._prepareJutsuslist(data, jutsus);

		// Organize Features
		for (let item of other) {
			if (item.type === "weapon") features.weapons.items.push(item);
			else if (item.type === "feat") {
				if (item.system.activation.type) features.actions.items.push(item);
				else features.passive.items.push(item);
			} else features.equipment.items.push(item);
		}

		// Assign and return
		data.features = Object.values(features);
		data.spellbook = spellbook;
		data.jutsuslist = jutsuslist;
	}

	/* -------------------------------------------- */

	/** @inheritdoc */
	async getData(options) {
		const data = await super.getData(options);

		// Challenge Rating
		const cr = parseFloat(data.system.details.cr || 0);
		const crLabels = { 0: "0", 0.125: "1/8", 0.25: "1/4", 0.5: "1/2" };
		data.labels["cr"] = cr >= 1 ? String(cr) : crLabels[cr] || 1;

		// Creature Type
		data.labels["type"] = this.actor.labels.creatureType;

		data["idj"] = game.settings.get("trpg", "idjMode");
		// Armor Type
		data.labels["armorType"] = this.getArmorLabel();

		return data;
	}

	/* -------------------------------------------- */

	/**
	 * Format NPC armor information into a localized string.
	 * @return {string}  Formatted armor label.
	 */
	getArmorLabel() {
		const ac = this.actor.system.attributes.ac;
		const label = [];
		if (ac.calc === "default") label.push(this.actor.armor?.name || game.i18n.localize("TRPG.ArmorClassUnarmored"));
		else label.push(game.i18n.localize(CONFIG.TRPG.armorClasses[ac.calc].label));
		if (this.actor.shield) label.push(this.actor.shield.name);
		return label.filterJoin(", ");
	}

	/* -------------------------------------------- */
	/*  Object Updates                              */
	/* -------------------------------------------- */

	/** @override */
	async _updateObject(event, formData) {
		// Format NPC Challenge Rating
		const crs = { "1/8": 0.125, "1/4": 0.25, "1/2": 0.5 };
		let crv = "system.details.cr";
		let cr = formData[crv];
		cr = crs[cr] || parseFloat(cr);
		if (cr) formData[crv] = cr < 1 ? cr : parseInt(cr);

		// Parent ActorSheet update steps
		return super._updateObject(event, formData);
	}

	/* -------------------------------------------- */
	/*  Event Listeners and Handlers                */
	/* -------------------------------------------- */

	/** @override */
	activateListeners(html) {
		super.activateListeners(html);
		html.find(".health .rollable").click(this._onRollHPFormula.bind(this));
	}

	/* -------------------------------------------- */

	/**
	 * Handle rolling NPC health values using the provided formula
	 * @param {Event} event     The original click event
	 * @private
	 */
	_onRollHPFormula(event) {
		event.preventDefault();
		const formula = this.actor.system.attributes.hp.formula;
		if (!formula) return;
		const hp = new Roll(formula).roll({ async: false }).total;
		AudioHelper.play({ src: CONFIG.sounds.dice });
		this.actor.update({ "data.attributes.hp.value": hp, "data.attributes.hp.max": hp });
	}
}
