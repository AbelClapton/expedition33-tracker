'use client'

import dynamic from 'next/dynamic';

const GameMap = dynamic(() => import('@/features/map/GameMap'), {
    ssr: false
});

export default function MapRoute() {
    return <GameMap />
}