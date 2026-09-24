interface ViewToggleProps {
    currentView: 'pictos' | 'luminas';
    onChange: (view: 'pictos' | 'luminas') => void;
}

export function ViewToggle({ currentView, onChange }: ViewToggleProps) {
    return (
        <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.7rem' }}>
            <button
                onClick={() => onChange('pictos')}
                style={{
                    fontWeight: currentView === 'pictos' ? 700 : 500,
                    padding: '0.55rem 1rem',
                    background: currentView === 'pictos' ? '#16a34a' : '#eef2f7',
                    color: currentView === 'pictos' ? '#ffffff' : '#1f2937',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    cursor: 'pointer'
                }}
            >
                Pictos
            </button>
            <button
                onClick={() => onChange('luminas')}
                style={{
                    fontWeight: currentView === 'luminas' ? 700 : 500,
                    padding: '0.55rem 1rem',
                    background: currentView === 'luminas' ? '#16a34a' : '#eef2f7',
                    color: currentView === 'luminas' ? '#ffffff' : '#1f2937',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    cursor: 'pointer'
                }}
            >
                Luminas
            </button>
        </div>
    );
}
