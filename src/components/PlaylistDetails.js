import React from 'react';

// Reusing helper function from old dashboard
const getDifficultyColor = (difficulty) => {
    switch(difficulty?.toLowerCase()) {
        case 'easy': return '#2ecc71';
        case 'medium': return '#f1c40f';
        case 'hard': return '#e74c3c';
        default: return 'var(--primary-text)';
    }
};

const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds === 0) return 'N/A';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}m ${s}s`;
};

export default function PlaylistDetails({ playlistName, playlist, questionsData }) {
    const questions = playlist.urls.map(url => questionsData[url]);

    // Find best speedrun time
    const bestSpeedrun = playlist.speedrunHistory.length > 0
        ? Math.min(...playlist.speedrunHistory.map(run => run.totalTime))
        : null;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2>{playlistName}</h2>
                {bestSpeedrun && (
                    <div style={styles.speedrunScore}>
                        🏆 Best Speedrun: <strong>{formatTime(bestSpeedrun)}</strong>
                    </div>
                )}
            </div>

            <div style={styles.tableWrapper}>
                <table style={styles.table}>
                    <thead>
                    <tr>
                        <th style={styles.th}>Question</th>
                        <th style={styles.th}>Difficulty</th>
                        <th style={styles.th}>Status</th>
                        <th style={styles.th}>Attempts</th>
                        <th style={styles.th}>Avg. Time</th>
                    </tr>
                    </thead>
                    <tbody>
                    {questions.map(q => {
                        if (!q) return null; // Handle case where question data might be missing
                        const avgTime = q.history.length > 0
                            ? q.history.reduce((sum, h) => sum + h.totalTime, 0) / q.history.length
                            : 0;

                        return (
                            <tr key={q.url}>
                                <td style={styles.td}>{q.title}</td>
                                <td style={{...styles.td, color: getDifficultyColor(q.difficulty)}}>{q.difficulty}</td>
                                <td style={{...styles.td, fontWeight: 'bold'}}>{q.completionStatus}</td>
                                <td style={styles.td}>{q.totalAttempts}</td>
                                <td style={styles.td}>{formatTime(avgTime)}</td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const styles = {
    container: { padding: '2rem' },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
    },
    speedrunScore: {
        backgroundColor: 'rgba(46, 204, 113, 0.1)',
        color: '#2ecc71',
        padding: '8px 16px',
        borderRadius: '8px',
        fontFamily: 'monospace',
    },
    tableWrapper: { maxHeight: '70vh', overflowY: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
    th: {
        padding: '12px 15px',
        borderBottom: '1px solid var(--disabled-color)',
        position: 'sticky', top: 0,
        backgroundColor: 'var(--primary-bg)',
    },
    td: { padding: '12px 15px', borderBottom: '1px solid var(--secondary-bg)' },
};