
/**
 * Override the default Initiative formula to customize special behaviors of the system.
 * Apply advantage, proficiency, or bonuses where appropriate
 * Apply the dexterity score as a decimal tiebreaker if requested
 * See Combat._getInitiativeFormula for more detail.
 */
export const _getInitiativeFormula = function() {
  const actor = this.actor;
  if ( !actor ) return "1d20";
  const init = actor.system.skills.init;

  // Construct initiative formula parts
  let nd = 1;
  let mods = "";
  if (actor.getFlag("trpg", "halflingLucky")) mods += "r1=1";
  if (actor.getFlag("trpg", "initiativeAdv")) {
    nd = 2;
    mods += "kh";
  }
  const parts = [`${nd}d20${mods}`, init.mod, (init.prof !== 0) ? init.prof : null, (init.bonus !== 0) ? init.bonus : null];

  // Optionally apply Dexterity tiebreaker
  const tiebreaker = game.settings.get("trpg", "initiativeDexTiebreaker");
  if ( tiebreaker ) parts.push(actor.system.abilities.dex.value / 100);
  return parts.filter((p) => p !== null).join(" + ");
};
