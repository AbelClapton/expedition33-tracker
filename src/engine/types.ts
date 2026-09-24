// types.ts
export type Status =
    | 'Rush' | 'Powerful' | 'Shield' | 'Blight' | 'Burn' | 'Charm'
    | 'Freeze' | 'Stun' | 'Regen' | 'Shell' | 'Powerless' | 'Defenceless'
    | 'Mark' | 'Exhausted';

export type Resource = 'ap' | 'shield' | 'gradientCharge' | 'health';

export type Trigger =
    | 'always' | 'onBattleStart' | 'onTurnStart' | 'onTurnEnd' | 'onDeath'
    | 'onRevive' | 'onKill' | 'onBreak' | 'onPreAttack' | 'onDamageCalculation'
    | 'onHit' | 'onCounterattackHit' | 'onCriticalHit' | 'onDodge' | 'onParry'
    | 'onDamageTaken' | 'onHealAlly' | 'onHealSkillUse' | 'onHealTint'
    | 'onItemUse' | 'onStatusApplied' | 'onBuffApplied' | 'onAPGain'
    | 'onGradientChargeConsumed';

export type Condition =
    | { type: 'none' }
    | { type: 'healthBelowPercent'; percent: number }
    | { type: 'healthAbovePercent'; percent: number }
    | { type: 'fightingAlone' }
    | { type: 'hasStatus'; status: Status }
    | { type: 'targetHasStatus'; status: Status }
    | { type: 'targetHasWeakness' }
    | { type: 'isCritical' }
    | { type: 'isPerfectDodge' }
    | { type: 'noDamageTakenSinceLastTurn' }
    | { type: 'hasAP'; min?: number }
    | { type: 'statusApplied'; status: Status }
    | { type: 'buffApplied'; buffId: string }
    | { type: 'previousHitWasCritical' }
    | { type: 'hasBuff'; buffId: string };

export interface BuffDefinition {
    id: string;
    duration: 'permanent' | 'untilConsumed' | number;
    maxStacks?: number;
    damageMultiplier?: number;
    damageMultiplierOnNext?: {
        condition: 'nonCritical' | 'any';
        multiplier: number;
    };
    damageTakenMultiplierOnNext?: number;
}

export type Action =
    | { type: 'applyStatus'; status: Status; stacks?: number; duration: number; target: 'self' | 'healedAlly' | 'allAllies' | 'allEnemies' }
    | { type: 'statusImmunity'; statuses: Status[] }
    | { type: 'modifyDamage'; damageType?: 'base' | 'freeAim' | 'counter' | 'break' | 'skill'; multiplier: number }
    | { type: 'modifyCritChance'; additivePercent: number }
    | { type: 'modifyAPCost'; reduction: number }
    | { type: 'modifyResource'; resource: Resource; amount?: number; percent?: number }
    | { type: 'modifyAPGain'; flatBonus: number }
    | { type: 'lifesteal'; percent: number; onAttack: 'base' | 'any' }
    | { type: 'die' }
    | { type: 'applyBuff'; buff: BuffDefinition }
    | { type: 'removeBuff'; buffId: string }
    | { type: 'incrementBuffStacks'; buffId: string; amount: number }
    | { type: 'cleanseAllStatus'; target: 'healedAlly' | 'self' }
    | { type: 'redirectDamage'; percent: number }
    | { type: 'reduceDamageTaken'; percent: number }
    | { type: 'modifyDamageTaken'; multiplier: number }
    | { type: 'preventHealing' }
    | { type: 'setBaseAttackCanBreak' }
    | { type: 'modifyMarkRequiredHits'; amount: number }
    | { type: 'grantExtraTurn' }
    | { type: 'setFlag'; flag: string; value: boolean };

export interface Rule {
    trigger: Trigger;
    condition?: Condition;
    action: Action;
    chance?: number;
    maxActivationsPerTurn?: number;
    maxActivationsPerBattle?: number;
    cost?: { type: 'ap'; amount: number };
}

export interface Lumina {
    id: string;
    name: string;
    description?: string;
    rules: Rule[];
}

export interface SynergyPattern {
    name: string;
    score: number;
}

export interface SynergyDetail {
    total: number;
    patterns: SynergyPattern[];
}

export interface Stats {
    health: number;
    defense: number;
    speed: number;
    critRate: number;
}

export interface Picto {
    id: string;
    name: string;
    location: string;
    luminaId: string;
    level: number;
    stats: Stats;
}