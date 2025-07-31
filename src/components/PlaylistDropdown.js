import TrashIcon from './TrashIcon'; // Import the new icon component

export default function PlaylistDropdown({ playlists, onSelect, onClose, onDelete }) {
    if (!playlists || playlists.length === 0) {
        return null;
    }

    const handleDeleteClick = (e, playlistName) => {
        e.stopPropagation();
        if (window.confirm(`Are you sure you want to delete the playlist "${playlistName}"? This cannot be undone.`)) {
            onDelete(playlistName);
        }
    };

    return (
        <div onClick={onClose} style={styles.overlay}>
            <div style={styles.dropdownContainer} onClick={(e) => e.stopPropagation()}>
                <div style={styles.dropdownHeader}>Select a playlist</div>
                {playlists.map(playlistName => (
                    <div key={playlistName} style={styles.dropdownItemContainer}>
                        <button
                            onClick={() => onSelect(playlistName)}
                            style={styles.selectButton}
                        >
                            {playlistName}
                        </button>
                        <button
                            onClick={(e) => handleDeleteClick(e, playlistName)}
                            style={styles.deleteButton}
                            title={`Delete playlist: ${playlistName}`}
                        >
                            <TrashIcon /> {/* Use the new SVG icon component here */}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'transparent',
        zIndex: 900,
    },
    dropdownContainer: {
        position: 'absolute',
        top: '58%',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'var(--secondary-bg)',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        padding: '0.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
        minWidth: '300px',
        zIndex: 901,
    },
    dropdownHeader: {
        padding: '8px 12px',
        color: 'var(--secondary-text)',
        fontSize: '0.9rem',
        fontWeight: 'bold',
    },
    dropdownItemContainer: {
        display: 'flex',
        alignItems: 'center',
        borderRadius: '4px',
        transition: 'background-color 0.2s',
    },
    selectButton: {
        flex: 1,
        backgroundColor: 'transparent',
        color: 'var(--primary-text)',
        textAlign: 'left',
        padding: '12px 15px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1rem',
    },
    deleteButton: {
        backgroundColor: 'transparent',
        color: 'var(--secondary-text)', // The SVG will inherit this color
        border: 'none',
        padding: '12px 15px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '4px',
    },
    'deleteButton:hover': { // This won't work with inline styles, but for clarity
        color: '#e74c3c', // Red color on hover
        backgroundColor: '#3e3e3e',
    }
};