

interface UIProps {
    onSetState: (state: 'TREE_SHAPE' | 'SCATTERED') => void
    currentState: 'TREE_SHAPE' | 'SCATTERED'
}

export function UI({ onSetState, currentState }: UIProps) {
    return (
        <div style={{
            position: 'absolute',
            bottom: '50px',
            left: '0',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            pointerEvents: 'none', // Allow clicks to pass through to canvas
            zIndex: 10
        }}>
            <button
                onClick={() => onSetState('TREE_SHAPE')}
                style={{
                    pointerEvents: 'auto',
                    background: currentState === 'TREE_SHAPE' ? '#FFD700' : 'rgba(0,0,0,0.5)',
                    color: currentState === 'TREE_SHAPE' ? '#000' : '#FFD700',
                    border: '1px solid #FFD700',
                    padding: '12px 24px',
                    fontSize: '16px',
                    fontFamily: 'serif',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textTransform: 'uppercase',
                    letterSpacing: '2px'
                }}
            >
                Merry Christmas Tree
            </button>

            <button
                onClick={() => onSetState('SCATTERED')}
                style={{
                    pointerEvents: 'auto',
                    background: currentState === 'SCATTERED' ? '#FFD700' : 'rgba(0,0,0,0.5)',
                    color: currentState === 'SCATTERED' ? '#000' : '#FFD700',
                    border: '1px solid #FFD700',
                    padding: '12px 24px',
                    fontSize: '16px',
                    fontFamily: 'serif',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textTransform: 'uppercase',
                    letterSpacing: '2px'
                }}
            >
                Gift
            </button>
        </div>
    )
}
