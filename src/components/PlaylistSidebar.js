import React from 'react';

export default function PlaylistSidebar({ playlists, questionsData, onSelectPlaylist, selectedPlaylistName }) {

    const calculateCompletion = (playlist) => {
        if (!playlist.urls || playlist.urls.length === 0) return 0;

        const completedCount = playlist.urls.filter(url =>
            questionsData[url]?.completionStatus === 'Completed'
        ).length;

        return Math.round((completedCount / playlist.urls.length) * 100);
    };

    return (
        <div style={styles.sidebar}>
            <h2 style={styles.header}>Dashboard</h2>
            <div style={styles.list}>

                {/* --- NEW: Button to return to overall stats --- */}
                <button
                    style={!selectedPlaylistName ? {...styles.item, ...styles.itemActive, ...styles.overallButton} : {...styles.item, ...styles.overallButton}}
                    onClick={() => onSelectPlaylist(null)}
                >
                    📊 Overall Stats
                </button>

                <hr style={styles.divider} />

                {Object.keys(playlists).map(name => {
                    const playlist = playlists[name];
                    const percentage = calculateCompletion(playlist);
                    const isActive = name === selectedPlaylistName;

                    return (
                        <button
                            key={name}
                            style={isActive ? {...styles.item, ...styles.itemActive} : styles.item}
                            onClick={() => onSelectPlaylist(name)}
                        >
                            <span style={styles.itemName}>{name}</span>
                            <div style={styles.progressBar}>
                                <div style={{...styles.progressFill, width: `${percentage}%`}}></div>
                            </div>
                            <span style={styles.itemPercentage}>{percentage}%</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

const styles = {
    sidebar: {
        width: '300px',
        minWidth: '300px',
        backgroundColor: 'var(--primary-bg)',
        borderRight: '1px solid var(--disabled-color)',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        margin: '0 0 1.5rem 0',
        textAlign: 'center',
        color: 'var(--primary-text)',
    },
    list: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        overflowY: 'auto',
    },
    divider: {
        border: 'none',
        borderTop: '1px solid var(--secondary-bg)',
        margin: '0.5rem 0',
    },
    item: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem',
        backgroundColor: 'transparent',
        border: '1px solid transparent', // Change from secondary-bg to transparent
        borderRadius: '8px',
        textAlign: 'left',
        color: 'var(--primary-text)',
        cursor: 'pointer',
        width: '100%', // Ensure buttons take full width
    },
    itemActive: {
        borderColor: 'var(--accent-color)',
        backgroundColor: 'rgba(0, 112, 243, 0.1)',
    },
    overallButton: {
        justifyContent: 'center',
        fontSize: '1rem',
        fontWeight: '600',
    },
    itemName: {
        fontWeight: '600',
        flex: 1,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    progressBar: {
        width: '60px',
        height: '8px',
        backgroundColor: 'var(--disabled-color)',
        borderRadius: '4px',
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: 'var(--accent-color)',
        borderRadius: '4px',
        transition: 'width 0.3s ease-in-out',
    },
    itemPercentage: {
        fontFamily: 'monospace',
        fontSize: '0.9rem',
    }
};