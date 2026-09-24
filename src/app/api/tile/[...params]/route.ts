import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ params: string[] }> }
) {
    // Await the params Promise
    const { params: tilePath } = await params;

    if (tilePath.length !== 3) {
        return new NextResponse('Invalid tile path: need /z/x/y', { status: 400 });
    }

    const [zoom, x, y] = tilePath; // all strings

    // Local file path: public/tiles/{zoom}/{x}/{y}.jpg
    const localDir = path.join(process.cwd(), 'public', 'tiles', zoom, x);
    const localFilePath = path.join(localDir, `${y}.jpg`);

    // Try to serve from local cache
    try {
        await fs.access(localFilePath);
        const fileBuffer = await fs.readFile(localFilePath);
        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': 'image/jpeg',
                'Cache-Control': 'public, max-age=31536000',
            },
        });
    } catch {
        // Not cached – fetch from external wiki
        const externalUrl = `https://expedition33.wiki.fextralife.com/file/Expedition-33/map-e54af741-6dd0-41ea-8af0-551a9b8c99ac/map-tiles.1/${zoom}/${x}/${y}.jpg`;

        try {
            const response = await fetch(externalUrl);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const buffer = await response.arrayBuffer();

            // Ensure directory exists and write file
            await fs.mkdir(localDir, { recursive: true });
            await fs.writeFile(localFilePath, Buffer.from(buffer));

            return new NextResponse(buffer, {
                headers: {
                    'Content-Type': 'image/jpeg',
                    'Cache-Control': 'public, max-age=31536000',
                },
            });
        } catch (error) {
            console.error(`Failed to fetch tile ${zoom}/${x}/${y}:`, error);
            return new NextResponse('Tile not found', { status: 404 });
        }
    }
}