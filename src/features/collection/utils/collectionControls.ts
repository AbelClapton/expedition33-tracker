import { CollectionRuneFilter, CollectionSortMode } from '../types';

export const collectionRuneFilters: Array<{ key: CollectionRuneFilter; icon: string; label: string }> = [
    { key: 'offense', icon: 'flare', label: 'Offense' },
    { key: 'defense', icon: 'shield', label: 'Defense' },
    { key: 'support', icon: 'help', label: 'Support' },
    { key: 'control', icon: 'filter_vintage', label: 'Control' },
    { key: 'resource', icon: 'auto_fix_high', label: 'Resource' }
];

export const collectionSortModes: Array<{ key: CollectionSortMode; label: string; hint: string }> = [
    { key: 'name', label: 'A-Z', hint: 'Archive order' },
    { key: 'levelDesc', label: 'HIGH', hint: 'Highest level first' },
    { key: 'levelAsc', label: 'LOW', hint: 'Lowest level first' }
];

export function getCollectionSortLabel(mode: CollectionSortMode): string {
    const item = collectionSortModes.find(option => option.key === mode);
    return item?.label ?? mode;
}