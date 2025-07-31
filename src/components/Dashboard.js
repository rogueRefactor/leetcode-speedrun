export default function Dashboard({ questionsData }) {
    const questions = Object.values(questionsData);

    if (questions.length === 0) {
        return (
            <div style={styles.dashboardContainer}>
                <h2 style={styles.title}>Progress Dashboard</h2>
                <p style={styles.emptyMessage}>Your dashboard is empty. Add a playlist and solve some questions to see your progress!</p>
            </div>
        );
    }

    return (
        <div style={styles.dashboardContainer}>
            <h2 style={styles.title}>Progress Dashboard</h2>
            <div style={styles.tableWrapper}>
                <table style={styles.table}>
                    <thead>
                    <tr>
                        <th style={styles.th}>Question</th>
                        <th style={styles.th}>Difficulty</th>
                        <th style={styles.th}>Attempts</th>
                        <th style={styles.th}>Unaided</th>
                        <th style={styles.th}>Status</th>
                        <th style={styles.th}>Last Attempt Time</th>
                    </tr>
                    </thead>
                    <tbody>
                    {questions.map(q => {
                        const lastAttempt = q.history.length > 0 ? q.history[q.history.length - 1] : null;
                        const lastTime = lastAttempt ? `${(lastAttempt.totalTime / 60).toFixed(1)} mins` : 'N/A';

                        return (
                            <tr key={q.url}>
                                <td style={styles.td}>{q.title}</td>
                                <td style={{...styles.td, color: getDifficultyColor(q.difficulty)}}>{q.difficulty}</td>
                                <td style={styles.td}>{q.totalAttempts}</td>
                                <td style={styles.td}>{q.unaidedAttempts}</td>
                                <td style={{...styles.td, fontWeight: 'bold'}}>{q.completionStatus}</td>
                                <td style={styles.td}>{lastTime}</td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const getDifficultyColor = (difficulty) => {
    switch(difficulty?.toLowerCase()) {
        case 'easy': return '#2ecc71';
        case 'medium': return '#f1c40f';
        case 'hard': return '#e74c3c';
        default: return 'var(--primary-text)';
    }
}

const styles = {
    dashboardContainer: {
        padding: '2rem',
        backgroundColor: 'var(--secondary-bg)',
        borderTop: '2px solid var(--disabled-color)',
        width: '100%',
    },
    title: {
        textAlign: 'center',
        marginBottom: '1.5rem',
        color: 'var(--primary-text)',
    },
    emptyMessage: {
        textAlign: 'center',
        color: 'var(--secondary-text)',
    },
    tableWrapper: {
        maxHeight: '300px', // Makes the table body scrollable
        overflowY: 'auto',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        textAlign: 'left',
    },
    th: {
        padding: '12px 15px',
        borderBottom: '1px solid var(--disabled-color)',
        position: 'sticky', // Makes headers stick to top when scrolling
        top: 0,
        backgroundColor: 'var(--secondary-bg)',
    },
    td: {
        padding: '12px 15px',
        borderBottom: '1px solid var(--primary-bg)',
    },
};