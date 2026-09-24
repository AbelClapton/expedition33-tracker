// utils/synergy.ts
import { Lumina, Rule, SynergyDetail, SynergyPattern } from '../types';

type PatternDetector = (a: Rule, b: Rule) => SynergyPattern[];

const pat = (name: string, score: number): SynergyPattern => ({ name, score });

function getActionField(action: Rule['action'], field: string): unknown {
    if (!(field in action)) {
        return undefined;
    }
    return (action as Record<string, unknown>)[field];
}

function getActionType(rule: Rule): string {
    return String((rule.action as { type: string }).type);
}

function getConditionField(rule: Rule, field: string): unknown {
    if (!rule.condition || !(field in rule.condition)) {
        return undefined;
    }
    return (rule.condition as Record<string, unknown>)[field];
}

function getConditionType(rule: Rule): string | undefined {
    return rule.condition ? String((rule.condition as { type: string }).type) : undefined;
}

function getCostType(rule: Rule): string | undefined {
    return rule.cost ? String((rule.cost as { type: string }).type) : undefined;
}

function isPositiveModifyResource(rule: Rule, resource: string): boolean {
    if (rule.action.type !== 'modifyResource' || rule.action.resource !== resource) {
        return false;
    }
    return (rule.action.amount ?? 0) > 0 || (rule.action.percent ?? 0) > 0;
}

function isConditionType(rule: Rule, type: string): boolean {
    return Boolean(rule.condition && rule.condition.type === type);
}

/** 1. Same trigger (exclude passive) */
function detectSameTrigger(a: Rule, b: Rule): SynergyPattern[] {
    if (a.trigger === b.trigger && a.trigger !== 'always') {
        return [pat(`Same trigger: ${a.trigger}`, 3)];
    }
    return [];
}

/** 2. Status Provider -> Consumer (target) */
function detectStatusProviderTarget(a: Rule, b: Rule): SynergyPattern[] {
    const patterns: SynergyPattern[] = [];
    if (
        a.action.type === 'applyStatus' &&
        b.condition?.type === 'targetHasStatus' &&
        b.condition.status === a.action.status
    ) {
        patterns.push(pat(`Status provider -> target consumer: ${a.action.status}`, 4));
    }
    if (
        b.action.type === 'applyStatus' &&
        a.condition?.type === 'targetHasStatus' &&
        a.condition.status === b.action.status
    ) {
        patterns.push(pat(`Status provider -> target consumer: ${b.action.status}`, 4));
    }
    return patterns;
}

/** 3. Status Provider -> Consumer (self) */
function detectStatusProviderSelf(a: Rule, b: Rule): SynergyPattern[] {
    const patterns: SynergyPattern[] = [];
    if (
        a.action.type === 'applyStatus' &&
        a.action.target === 'self' &&
        b.condition?.type === 'hasStatus' &&
        b.condition.status === a.action.status
    ) {
        patterns.push(pat(`Status provider -> self consumer: ${a.action.status}`, 4));
    }
    if (
        b.action.type === 'applyStatus' &&
        b.action.target === 'self' &&
        a.condition?.type === 'hasStatus' &&
        a.condition.status === b.action.status
    ) {
        patterns.push(pat(`Status provider -> self consumer: ${b.action.status}`, 4));
    }
    return patterns;
}

/** 4. Status Enhancer */
function detectStatusEnhancer(a: Rule, b: Rule): SynergyPattern[] {
    const enhancerTypes = new Set(['extendStatusDuration', 'modifyStatusDuration', 'modifyStatusEffect', 'doubleStatusStacks']);
    const patterns: SynergyPattern[] = [];

    const bStatus = typeof getActionField(b.action, 'status') === 'string' ? (getActionField(b.action, 'status') as string) : undefined;
    if (
        a.action.type === 'applyStatus' &&
        enhancerTypes.has(b.action.type) &&
        bStatus === a.action.status
    ) {
        patterns.push(pat(`Status enhancer: ${a.action.status}`, 4));
    }

    const aStatus = typeof getActionField(a.action, 'status') === 'string' ? (getActionField(a.action, 'status') as string) : undefined;
    if (
        b.action.type === 'applyStatus' &&
        enhancerTypes.has(a.action.type) &&
        aStatus === b.action.status
    ) {
        patterns.push(pat(`Status enhancer: ${b.action.status}`, 4));
    }
    return patterns;
}

/** 5. Resource Provider -> Consumer (AP) */
function detectAPProvider(a: Rule, b: Rule): SynergyPattern[] {
    const patterns: SynergyPattern[] = [];
    const bPerAP = getActionField(b.action, 'multiplier');
    const aPerAP = getActionField(a.action, 'multiplier');

    if (isPositiveModifyResource(a, 'ap')) {
        if (b.cost?.type === 'ap' || isConditionType(b, 'hasAP')) {
            patterns.push(pat('AP provider -> consumer', 4));
        }
        if (typeof bPerAP === 'object' && bPerAP && 'perAP' in (bPerAP as Record<string, unknown>)) {
            patterns.push(pat('AP provider -> scaler', 4));
        }
    }
    if (isPositiveModifyResource(b, 'ap')) {
        if (a.cost?.type === 'ap' || isConditionType(a, 'hasAP')) {
            patterns.push(pat('AP provider -> consumer', 4));
        }
        if (typeof aPerAP === 'object' && aPerAP && 'perAP' in (aPerAP as Record<string, unknown>)) {
            patterns.push(pat('AP provider -> scaler', 4));
        }
    }
    return patterns;
}

/** 6. Resource Provider -> Consumer (Shield) */
function detectShieldProvider(a: Rule, b: Rule): SynergyPattern[] {
    const patterns: SynergyPattern[] = [];
    const bPerResource = getActionField(b.action, 'multiplier');
    const aPerResource = getActionField(a.action, 'multiplier');

    if (isPositiveModifyResource(a, 'shield')) {
        const bConsumesShield =
            getActionType(b) === 'removeAllShields' ||
            (typeof bPerResource === 'object' &&
                bPerResource !== null &&
                (bPerResource as Record<string, unknown>).perResource === 'shield');
        if (bConsumesShield) {
            patterns.push(pat('Shield provider -> consumer', 4));
        }
    }
    if (isPositiveModifyResource(b, 'shield')) {
        const aConsumesShield =
            getActionType(a) === 'removeAllShields' ||
            (typeof aPerResource === 'object' &&
                aPerResource !== null &&
                (aPerResource as Record<string, unknown>).perResource === 'shield');
        if (aConsumesShield) {
            patterns.push(pat('Shield provider -> consumer', 4));
        }
    }
    return patterns;
}

/** 7. Resource Provider -> Consumer (Gradient Charge) */
function detectGradientChargeProvider(a: Rule, b: Rule): SynergyPattern[] {
    const patterns: SynergyPattern[] = [];
    const bResource = getConditionField(b, 'resource');
    const aResource = getConditionField(a, 'resource');

    if (isPositiveModifyResource(a, 'gradientCharge')) {
        const bConsumesGradient =
            getCostType(b) === 'gradientCharge' ||
            (getConditionType(b) === 'hasResource' && bResource === 'gradientCharge');
        if (bConsumesGradient) {
            patterns.push(pat('Gradient Charge provider -> consumer', 4));
        }
    }
    if (isPositiveModifyResource(b, 'gradientCharge')) {
        const aConsumesGradient =
            getCostType(a) === 'gradientCharge' ||
            (getConditionType(a) === 'hasResource' && aResource === 'gradientCharge');
        if (aConsumesGradient) {
            patterns.push(pat('Gradient Charge provider -> consumer', 4));
        }
    }
    return patterns;
}

/** 8. Buff Provider -> Buff Consumer */
function detectBuffProvider(a: Rule, b: Rule): SynergyPattern[] {
    const patterns: SynergyPattern[] = [];
    if (a.action.type === 'applyBuff' && b.action.type === 'removeBuff' && b.action.buffId === a.action.buff.id) {
        patterns.push(pat(`Buff provider -> consumer: ${a.action.buff.id}`, 5));
    }
    if (b.action.type === 'applyBuff' && a.action.type === 'removeBuff' && a.action.buffId === b.action.buff.id) {
        patterns.push(pat(`Buff provider -> consumer: ${b.action.buff.id}`, 5));
    }
    return patterns;
}

/** 9. AP Cost Reduction + Skill Use */
function detectAPCostSkill(a: Rule, b: Rule): SynergyPattern[] {
    const patterns: SynergyPattern[] = [];
    const bValue = getConditionField(b, 'value');
    const aValue = getConditionField(a, 'value');
    if (a.action.type === 'modifyAPCost' && b.trigger === 'onHit' && getConditionType(b) === 'attackType' && bValue === 'skill') {
        patterns.push(pat('AP cost reduction -> skill use', 3));
    }
    if (b.action.type === 'modifyAPCost' && a.trigger === 'onHit' && getConditionType(a) === 'attackType' && aValue === 'skill') {
        patterns.push(pat('AP cost reduction -> skill use', 3));
    }
    return patterns;
}

/** 10. Complementary Status Application */
function detectComplementaryStatus(a: Rule, b: Rule): SynergyPattern[] {
    if (a.action.type === 'applyStatus' && b.action.type === 'applyStatus' && a.action.status === b.action.status) {
        return [pat(`Both apply ${a.action.status}`, 2)];
    }
    return [];
}

/** 11. Negative Interaction (Flag Conflict) */
function detectFlagConflict(a: Rule, b: Rule): SynergyPattern[] {
    const patterns: SynergyPattern[] = [];
    if (a.action.type === 'setFlag' && a.action.flag === 'parryGivesAP' && a.action.value === false) {
        if (b.trigger === 'onParry' && b.action.type === 'modifyResource' && b.action.resource === 'ap') {
            patterns.push(pat('Conflict: Parry AP disabled vs gain AP on parry', -5));
        }
    }
    if (b.action.type === 'setFlag' && b.action.flag === 'parryGivesAP' && b.action.value === false) {
        if (a.trigger === 'onParry' && a.action.type === 'modifyResource' && a.action.resource === 'ap') {
            patterns.push(pat('Conflict: Parry AP disabled vs gain AP on parry', -5));
        }
    }
    return patterns;
}

/** 12. Status Provider -> Scaler (damage per status on self) */
function detectStatusScaler(a: Rule, b: Rule): SynergyPattern[] {
    const patterns: SynergyPattern[] = [];
    const bMultiplier = getActionField(b.action, 'multiplier');
    const aMultiplier = getActionField(a.action, 'multiplier');
    if (
        a.action.type === 'applyStatus' &&
        a.action.target === 'self' &&
        typeof bMultiplier === 'object' &&
        bMultiplier !== null &&
        'perStatusEffect' in (bMultiplier as Record<string, unknown>)
    ) {
        patterns.push(pat('Self status provider -> damage scaler', 4));
    }
    if (
        b.action.type === 'applyStatus' &&
        b.action.target === 'self' &&
        typeof aMultiplier === 'object' &&
        aMultiplier !== null &&
        'perStatusEffect' in (aMultiplier as Record<string, unknown>)
    ) {
        patterns.push(pat('Self status provider -> damage scaler', 4));
    }
    return patterns;
}

/** 13. Shared Activation Condition (non-status) */
function detectSharedCondition(a: Rule, b: Rule): SynergyPattern[] {
    if (a.condition && b.condition && a.condition.type !== 'none' && b.condition.type !== 'none') {
        if (a.condition.type === b.condition.type) {
            if (a.condition.type === 'fightingAlone') {
                return [pat('Shared condition: fighting alone', 2)];
            }
            if (
                a.condition.type === 'healthBelowPercent' &&
                b.condition.type === 'healthBelowPercent' &&
                a.condition.percent === b.condition.percent
            ) {
                return [pat('Shared condition: health threshold', 2)];
            }
            if (getConditionType(a) === 'allAlliesAlive' && getConditionType(b) === 'allAlliesAlive') {
                return [pat('Shared condition: full party', 2)];
            }
            const excluded = new Set([
                'hasStatus',
                'targetHasStatus',
                'targetHasWeakness',
                'hasBuff',
                'statusApplied',
                'buffApplied'
            ]);
            if (!excluded.has(a.condition.type)) {
                return [pat(`Shared condition: ${a.condition.type}`, 2)];
            }
        }
    }
    return [];
}

/** 14. Extra Turn / Action Enabler -> Per-Action Scaler */
function detectExtraTurnScaler(a: Rule, b: Rule): SynergyPattern[] {
    const patterns: SynergyPattern[] = [];
    const aBuff = getActionField(a.action, 'buff');
    const bBuff = getActionField(b.action, 'buff');
    const aGrantsExtraAction =
        typeof aBuff === 'object' &&
        aBuff !== null &&
        (aBuff as Record<string, unknown>).grantsExtraAction === true;
    const bGrantsExtraAction =
        typeof bBuff === 'object' &&
        bBuff !== null &&
        (bBuff as Record<string, unknown>).grantsExtraAction === true;

    if (a.action.type === 'grantExtraTurn' || (a.action.type === 'applyBuff' && aGrantsExtraAction)) {
        if (b.trigger === 'onTurnStart' || b.trigger === 'onTurnEnd' || b.trigger === 'onHit') {
            patterns.push(pat('Extra turn enabler -> per-action scaler', 3));
        }
    }
    if (b.action.type === 'grantExtraTurn' || (b.action.type === 'applyBuff' && bGrantsExtraAction)) {
        if (a.trigger === 'onTurnStart' || a.trigger === 'onTurnEnd' || a.trigger === 'onHit') {
            patterns.push(pat('Extra turn enabler -> per-action scaler', 3));
        }
    }
    return patterns;
}

/** 15. Condition Enabler (health/shield thresholds) */
function detectConditionEnabler(a: Rule, b: Rule): SynergyPattern[] {
    const patterns: SynergyPattern[] = [];
    const bResource = getConditionField(b, 'resource');
    const aResource = getConditionField(a, 'resource');

    if (isPositiveModifyResource(a, 'health')) {
        if (b.condition?.type === 'healthAbovePercent' || b.condition?.type === 'noDamageTakenSinceLastTurn') {
            patterns.push(pat('Heal provider -> condition enabler', 3));
        }
    }
    if (isPositiveModifyResource(b, 'health')) {
        if (a.condition?.type === 'healthAbovePercent' || a.condition?.type === 'noDamageTakenSinceLastTurn') {
            patterns.push(pat('Heal provider -> condition enabler', 3));
        }
    }

    if (isPositiveModifyResource(a, 'shield')) {
        if (getConditionType(b) === 'hasResource' && bResource === 'shield') {
            patterns.push(pat('Shield provider -> condition enabler', 3));
        }
    }
    if (isPositiveModifyResource(b, 'shield')) {
        if (getConditionType(a) === 'hasResource' && aResource === 'shield') {
            patterns.push(pat('Shield provider -> condition enabler', 3));
        }
    }
    return patterns;
}

/** 16. Mechanic Enabler */
function detectMechanicEnabler(a: Rule, b: Rule): SynergyPattern[] {
    const patterns: SynergyPattern[] = [];

    const isEnabler = (r: Rule): boolean =>
        (r.action.type === 'setFlag' &&
            (r.action.flag === 'damageCapRemoved' || r.action.flag === 'freeAimIgnoresShield' || r.action.flag === 'extra_hits')) ||
        r.action.type === 'setBaseAttackCanBreak';

    const hasBreakModifier = (r: Rule): boolean =>
        r.action.type === 'modifyDamage' &&
        typeof getActionField(r.action, 'damageType') === 'string' &&
        getActionField(r.action, 'damageType') === 'break';

    const hasFreeAimModifier = (r: Rule): boolean =>
        r.action.type === 'modifyDamage' &&
        typeof getActionField(r.action, 'damageType') === 'string' &&
        getActionField(r.action, 'damageType') === 'freeAim';

    const flagsEnableFreeAim =
        (a.action.type === 'setFlag' && a.action.flag === 'freeAimIgnoresShield') ||
        (b.action.type === 'setFlag' && b.action.flag === 'freeAimIgnoresShield');

    const isBooster = (r: Rule): boolean =>
        hasBreakModifier(r) || (hasFreeAimModifier(r) && flagsEnableFreeAim);

    if (isEnabler(a) && isBooster(b)) {
        patterns.push(pat('Mechanic enabler -> booster', 3));
    }
    if (isEnabler(b) && isBooster(a)) {
        patterns.push(pat('Mechanic enabler -> booster', 3));
    }

    if (a.action.type === 'setBaseAttackCanBreak' && hasBreakModifier(b)) {
        patterns.push(pat('Base attack break enabler -> break booster', 3));
    }
    if (b.action.type === 'setBaseAttackCanBreak' && hasBreakModifier(a)) {
        patterns.push(pat('Base attack break enabler -> break booster', 3));
    }
    return patterns;
}

/** 17. Status Application -> Resource Gain */
function detectStatusToResource(a: Rule, b: Rule): SynergyPattern[] {
    const patterns: SynergyPattern[] = [];

    if (a.action.type === 'applyStatus') {
        if (
            b.trigger === 'onStatusApplied' &&
            b.condition?.type === 'statusApplied' &&
            b.condition.status === a.action.status &&
            (b.action.type === 'modifyResource' || b.action.type === 'modifyAPGain')
        ) {
            patterns.push(pat(`Status application -> resource gain: ${a.action.status}`, 4));
        }
    }

    if (b.action.type === 'applyStatus') {
        if (
            a.trigger === 'onStatusApplied' &&
            a.condition?.type === 'statusApplied' &&
            a.condition.status === b.action.status &&
            (a.action.type === 'modifyResource' || a.action.type === 'modifyAPGain')
        ) {
            patterns.push(pat(`Status application -> resource gain: ${b.action.status}`, 4));
        }
    }
    return patterns;
}

const detectors: PatternDetector[] = [
    detectSameTrigger,
    detectStatusProviderTarget,
    detectStatusProviderSelf,
    detectStatusEnhancer,
    detectAPProvider,
    detectShieldProvider,
    detectGradientChargeProvider,
    detectBuffProvider,
    detectAPCostSkill,
    detectComplementaryStatus,
    detectFlagConflict,
    detectStatusScaler,
    detectSharedCondition,
    detectExtraTurnScaler,
    detectConditionEnabler,
    detectMechanicEnabler,
    detectStatusToResource
];

/**
 * Score two rules and collect all matched detector patterns.
 */
function getRulePatterns(a: Rule, b: Rule): SynergyPattern[] {
    const patterns: SynergyPattern[] = [];
    for (const detector of detectors) {
        patterns.push(...detector(a, b));
    }
    return patterns;
}

/**
 * Build detailed synergy matrix.
 */
export function buildSynergyMatrix(luminas: Lumina[]): Record<string, Record<string, SynergyDetail>> {
    const matrix: Record<string, Record<string, SynergyDetail>> = {};
    for (const lumA of luminas) {
        matrix[lumA.id] = {};
        for (const lumB of luminas) {
            if (lumA.id === lumB.id) {
                matrix[lumA.id][lumB.id] = { total: 0, patterns: [] };
                continue;
            }
            const patterns: SynergyPattern[] = [];
            for (const ra of lumA.rules) {
                for (const rb of lumB.rules) {
                    patterns.push(...getRulePatterns(ra, rb));
                }
            }
            const total = patterns.reduce((sum, p) => sum + p.score, 0);
            matrix[lumA.id][lumB.id] = { total, patterns };
        }
    }
    return matrix;
}

/**
 * Get suggestions based on total synergy score (still works).
 */
export function getSuggestions(
    selectedIds: string[],
    allLuminas: Lumina[],
    matrix: Record<string, Record<string, SynergyDetail>>
): { lumina: Lumina; score: number; patterns: SynergyPattern[] }[] {
    return allLuminas
        .filter(l => !selectedIds.includes(l.id))
        .map(l => {
            let total = 0;
            const allPatterns: SynergyPattern[] = [];
            for (const selId of selectedIds) {
                const detail = matrix[l.id]?.[selId];
                if (detail) {
                    total += detail.total;
                    allPatterns.push(...detail.patterns);
                }
            }
            return { lumina: l, score: total, patterns: allPatterns };
        })
        .filter(x => x.score > 0)
        .sort((a, b) => b.score - a.score);
}