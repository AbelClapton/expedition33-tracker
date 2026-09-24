export type CollectionViewMode = 'detailed' | 'compact';
export type CollectionSortMode = 'name' | 'levelDesc' | 'levelAsc';

export type CollectionRuneFilter = 'offense' | 'defense' | 'support' | 'control' | 'resource';

export interface CollectionStat {
    label: string;
    value: number;
}

export interface CollectionCardModel {
    id: string;
    name: string;
    location: string;
    effect: string;
    level: number;
    imagePath: string;
    stats: CollectionStat[];
    runes: CollectionRuneFilter[];
}
