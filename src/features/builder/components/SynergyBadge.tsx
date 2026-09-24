import { CSSProperties } from 'react';

const CATEGORY_COLORS = {
    providerConsumer: '#4caf50',
    sameTrigger: '#2196f3',
    buff: '#ff9800',
    enhancer: '#ff5722',
    negative: '#f44336',
    default: '#64748b'
} as const;

type PatternCategory = keyof typeof CATEGORY_COLORS;

function normalizePatternName(patternName: string) {
    return patternName.toLowerCase();
}

export function getPatternCategory(patternName: string): PatternCategory {
    const normalized = normalizePatternName(patternName);

    if (normalized.includes('conflict') || normalized.includes('negative')) {
        return 'negative';
    }

    if (normalized.includes('same trigger')) {
        return 'sameTrigger';
    }

    if (normalized.includes('buff')) {
        return 'buff';
    }

    if (
        normalized.includes('enhancer')
        || normalized.includes('complement')
        || normalized.includes('both apply')
    ) {
        return 'enhancer';
    }

    if (normalized.includes('provider') || normalized.includes('consumer')) {
        return 'providerConsumer';
    }

    return 'default';
}

export function getPatternColor(patternName: string) {
    return CATEGORY_COLORS[getPatternCategory(patternName)];
}

export function patternMatchesFilter(patternName: string, filter: 'AP' | 'Status' | 'Buff' | 'Negative') {
    const normalized = normalizePatternName(patternName);

    if (filter === 'AP') {
        return normalized.includes('ap provider') || normalized.includes(' ap ') || normalized.startsWith('ap ');
    }

    if (filter === 'Status') {
        return normalized.includes('status') || normalized.includes('rush') || normalized.includes('burn') || normalized.includes('shield');
    }

    if (filter === 'Buff') {
        return normalized.includes('buff');
    }

    return normalized.includes('conflict') || normalized.includes('negative');
}

interface SynergyBadgeProps {
    patternName: string;
    score: number;
    title?: string;
    style?: CSSProperties;
}

export function SynergyBadge({ patternName, score, title, style }: SynergyBadgeProps) {
    const color = getPatternColor(patternName);
    const scoreLabel = score > 0 ? `+${score}` : `${score}`;

    return (
        <span
            title={title}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '0.75rem',
                lineHeight: 1.2,
                color: '#ffffff',
                background: color,
                whiteSpace: 'nowrap',
                ...style
            }}
        >
            <span>{patternName}</span>
            <span style={{ fontWeight: 700, opacity: 0.92 }}>{scoreLabel}</span>
        </span>
    );
}
