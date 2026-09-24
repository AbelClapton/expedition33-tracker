import { RefObject, useEffect } from 'react';

export function useCardGlow(containerRef: RefObject<HTMLElement | null>) {
    useEffect(() => {
        const container = containerRef.current;
        if (!container) {
            return;
        }

        let cards = Array.from(container.querySelectorAll<HTMLElement>('[data-collection-card]'));

        const refreshCards = () => {
            cards = Array.from(container.querySelectorAll<HTMLElement>('[data-collection-card]'));
        };

        refreshCards();

        const updateGlow = (event: MouseEvent) => {
            if (cards.length === 0) {
                return;
            }

            const mouseX = event.clientX;
            const mouseY = event.clientY;

            cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const localX = mouseX - rect.left;
                const localY = mouseY - rect.top;
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const distance = Math.hypot(mouseX - centerX, mouseY - centerY);
                const maxRange = 1000;

                let intensity = Math.max(0, 1 - distance / maxRange);
                intensity = Math.pow(intensity, 4);

                card.style.setProperty('--mouse-x', `${localX}px`);
                card.style.setProperty('--mouse-y', `${localY}px`);
                card.style.setProperty('--glow-opacity', intensity.toFixed(3));
            });
        };

        const observer = new MutationObserver(() => {
            refreshCards();
        });

        observer.observe(container, { childList: true, subtree: true });

        window.addEventListener('mousemove', updateGlow);
        return () => {
            window.removeEventListener('mousemove', updateGlow);
            observer.disconnect();
        };
    }, [containerRef]);
}
