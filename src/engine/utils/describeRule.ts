// utils/describeRule.ts
import { Rule } from '../types';

export function describeRule(rule: Rule): string {
    const { trigger, condition, action, chance, maxActivationsPerTurn, maxActivationsPerBattle, cost } = rule;
    let base = '';

    // ---- TRIGGER ----
    switch (trigger) {
        case 'always': base = 'Passively'; break;
        case 'onBattleStart': base = 'On battle start'; break;
        case 'onTurnStart': base = 'On turn start'; break;
        case 'onTurnEnd': base = 'On turn end'; break;
        case 'onDeath': base = 'On death'; break;
        case 'onRevive': base = 'On revive'; break;
        case 'onKill': base = 'On killing an enemy'; break;
        case 'onBreak': base = 'On breaking an enemy'; break;
        case 'onPreAttack': base = 'Before attacking'; break;
        case 'onDamageCalculation': base = 'When calculating damage'; break;
        case 'onHit': base = 'On hitting an enemy'; break;
        case 'onCounterattackHit': base = 'On a counterattack hit'; break;
        case 'onCriticalHit': base = 'On a critical hit'; break;
        case 'onDodge': base = 'On dodging'; break;
        case 'onParry': base = 'On parrying'; break;
        case 'onDamageTaken': base = 'On taking damage'; break;
        case 'onHealAlly': base = 'When healing an ally'; break;
        case 'onHealSkillUse': base = 'When using a healing skill'; break;
        case 'onHealTint': base = 'When using a Healing Tint'; break;
        case 'onItemUse': base = 'When using an item'; break;
        case 'onStatusApplied': base = 'When applying a status effect'; break;
        case 'onBuffApplied': base = 'When applying a buff'; break;
        case 'onAPGain': base = 'When gaining AP'; break;
        case 'onGradientChargeConsumed': base = 'When a Gradient Charge is consumed'; break;
        default: base = trigger;
    }

    // ---- CONDITION ----
    if (condition && condition.type !== 'none') {
        switch (condition.type) {
            case 'healthBelowPercent': base += ` while health is below ${condition.percent}%`; break;
            case 'healthAbovePercent': base += ` while health is above ${condition.percent}%`; break;
            case 'fightingAlone': base += ` when fighting alone`; break;
            case 'hasStatus': base += ` if self has ${condition.status}`; break;
            case 'targetHasStatus': base += ` if target has ${condition.status}`; break;
            case 'targetHasWeakness': base += ` if target has a weakness`; break;
            case 'isCritical': base += ` (critical hit)`; break;
            case 'isPerfectDodge': base += ` (perfect dodge)`; break;
            case 'noDamageTakenSinceLastTurn': base += ` if no damage taken since last turn`; break;
            case 'hasAP': base += ` if AP ≥ ${condition.min ?? 1}`; break;
            case 'statusApplied': base += ` when applying ${condition.status}`; break;
            case 'buffApplied': base += ` when applying buff ${condition.buffId}`; break;
            case 'previousHitWasCritical': base += ` if previous hit was critical`; break;
            case 'hasBuff': base += ` while buff ${condition.buffId} is active`; break;
        }
    }

    // ---- ACTION ----
    switch (action.type) {
        case 'applyStatus':
            base += `: apply ${action.stacks ?? 1}x ${action.status} for ${action.duration} turn(s) to ${action.target}`;
            break;
        case 'statusImmunity':
            base += `: immune to ${action.statuses.join(', ')}`;
            break;
        case 'modifyDamage':
            const pct = ((action.multiplier - 1) * 100).toFixed(0);
            base += `: ${pct}% ${action.multiplier > 1 ? 'increased' : 'decreased'} ${action.damageType ?? 'damage'}`;
            break;
        case 'modifyCritChance':
            base += `: ${action.additivePercent >= 0 ? '+' : ''}${action.additivePercent}% crit chance`;
            break;
        case 'modifyAPCost':
            base += `: skills cost ${action.reduction} less AP`;
            break;
        case 'modifyResource':
            if (action.percent) base += `: recover ${action.percent}% of max ${action.resource}`;
            else base += `: gain ${action.amount} ${action.resource}`;
            break;
        case 'modifyAPGain':
            base += `: all AP gains increased by ${action.flatBonus}`;
            break;
        case 'lifesteal':
            base += `: recover ${action.percent}% health on ${action.onAttack} attack`;
            break;
        case 'die':
            base += `: die instantly`;
            break;
        case 'applyBuff':
            base += `: gain buff "${action.buff.id}" (${action.buff.duration} turns)`;
            break;
        case 'removeBuff':
            base += `: remove buff "${action.buffId}"`;
            break;
        case 'incrementBuffStacks':
            base += `: add ${action.amount} stacks to "${action.buffId}"`;
            break;
        case 'cleanseAllStatus':
            base += `: remove all status effects from ${action.target}`;
            break;
        case 'redirectDamage':
            base += `: redirect ${action.percent}% of damage taken to allies`;
            break;
        case 'reduceDamageTaken':
            base += `: reduce incoming damage by ${action.percent}%`;
            break;
        case 'modifyDamageTaken':
            base += `: take ${((action.multiplier - 1) * 100).toFixed(0)}% ${action.multiplier > 1 ? 'more' : 'less'} damage`;
            break;
        case 'preventHealing':
            base += `: cannot be healed`;
            break;
        case 'setBaseAttackCanBreak':
            base += `: base attacks can now break`;
            break;
        case 'modifyMarkRequiredHits':
            base += `: mark requires ${action.amount} more hit(s) to remove`;
            break;
        case 'grantExtraTurn':
            base += `: always play twice in a row`;
            break;
        case 'setFlag':
            base += `: ${action.flag} set to ${action.value}`;
            break;
    }

    // ---- CHANCE / LIMITS / COST ----
    if (chance !== undefined) base += ` (${(chance * 100).toFixed(0)}% chance)`;
    if (maxActivationsPerTurn) base += ` (max ${maxActivationsPerTurn}/turn)`;
    if (maxActivationsPerBattle) base += ` (max ${maxActivationsPerBattle}/battle)`;
    if (cost) base += ` (costs ${cost.amount} AP)`;

    return base + '.';
}