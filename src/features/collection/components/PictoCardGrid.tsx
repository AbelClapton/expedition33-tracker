import { CollectionCardModel, CollectionViewMode } from '../types';
import { useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import styles from '../collection.module.css';
import { useCardGlow } from '../hooks/useCardGlow';
import { PictoCard } from './PictoCard';

interface PictoCardGridProps {
    cards: CollectionCardModel[];
    viewMode: CollectionViewMode;
    isFound: (id: string) => boolean;
    onToggleFound: (id: string) => void;
}

export function PictoCardGrid({ cards, viewMode, isFound, onToggleFound }: PictoCardGridProps) {
    const gridRef = useRef<HTMLElement | null>(null);
    useCardGlow(gridRef);

    if (cards.length === 0) {
        return (
            <Card className="border-dashed border-white/20 bg-black/15">
                <CardContent className="p-10 text-center text-[var(--collection-ink-muted)]">
                    No pictos match your search.
                </CardContent>
            </Card>
        );
    }

    return (
        <section
            ref={gridRef}
            className={`${styles.cardGrid} ${viewMode === 'compact' ? styles.cardGridCompact : ''}`}
        >
            {cards.map(card => (
                <PictoCard
                    key={card.id}
                    card={card}
                    viewMode={viewMode}
                    isFound={isFound(card.id)}
                    onToggleFound={onToggleFound}
                />
            ))}
        </section>
    );
}
