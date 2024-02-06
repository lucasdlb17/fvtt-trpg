/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function () {
	return loadTemplates([
		// Shared Partials
		"systems/trpg/templates/actors/parts/active-effects.html",
		"systems/trpg/templates/actors/parts/character-sheet-header.html",
		"systems/trpg/templates/actors/parts/npc-sheet-header.html",
		"systems/trpg/templates/actors/parts/character-nav-bar.html",
		"systems/trpg/templates/actors/parts/npc-nav-bar.html",		

		// Actor Sheet Partials
		"systems/trpg/templates/actors/parts/actor-abilities.html",
		"systems/trpg/templates/actors/parts/actor-armor-class.html",
		"systems/trpg/templates/actors/parts/actor-traits.html",
		"systems/trpg/templates/actors/parts/actor-features.html",
		"systems/trpg/templates/actors/parts/actor-inventory.html",
		"systems/trpg/templates/actors/parts/actor-saves.html",
		"systems/trpg/templates/actors/parts/actor-skills.html",
		"systems/trpg/templates/actors/parts/actor-spellbook.html",
		"systems/trpg/templates/actors/parts/actor-jutsuslist.html",
		"systems/trpg/templates/actors/parts/actor-resources.html",
		"systems/trpg/templates/actors/parts/actor-warnings.html",

		// Item Sheet Partials
		"systems/trpg/templates/items/parts/item-action.html",
		"systems/trpg/templates/items/parts/item-activation.html",
		"systems/trpg/templates/items/parts/item-description.html",
		"systems/trpg/templates/items/parts/item-mountable.html",
	]);
};
