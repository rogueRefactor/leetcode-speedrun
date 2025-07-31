import React from 'react';

export default function OverallStats({ questionsData }) {
    const questions = Object.values(questionsData);

    const totalQuestions = questions.length;
    const completedQuestions = questions.filter(q => q.completionStatus === 'Completed').length;
    const overallPercentage = totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0;
    const totalAttempts = questions.reduce((sum, q) => sum + q.totalAttempts, 0);

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>Overall Progress</h2>
            <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                    <div style={styles.statValue}>{totalQuestions}</div>
                    <div style={styles.statLabel}>Total Questions</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statValue}>{completedQuestions}</div>
                    <div style={styles.statLabel}>Questions Mastered</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statValue}>{totalAttempts}</div>
                    <div style={styles.statLabel}>Total Attempts Made</div>
                </div>
                <div style={{...styles.statCard, ...styles.wideCard}}>
                    <div style={styles.statValue}>{overallPercentage}%</div>
                    <div style={styles.statLabel}>Overall Completion</div>
                    <div style={styles.bigProgressBar}>
                        <div style={{...styles.bigProgressFill, width: `${overallPercentage}%`}}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: { padding: '2rem' },
    header: { textAlign: 'center', marginBottom: '3rem' },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
    },
    statCard: {
        backgroundColor: 'var(--secondary-bg)',
        padding: '2rem',
        borderRadius: '8px',
        textAlign: 'center',
    },
    wideCard: {
        gridColumn: '1 / -1', // Makes this card span the full width
    },
    statValue: {
        fontSize: '3rem',
        fontWeight: 'bold',
        color: 'var(--accent-color)',
    },
    statLabel: {
        fontSize: '1rem',
        color: 'var(--secondary-text)',
        marginTop: '0.5rem',
    },
    bigProgressBar: {
        width: '100%',
        height: '12px',
        backgroundColor: 'var(--disabled-color)',
        borderRadius: '6px',
        overflow: 'hidden',
        marginTop: '1.5rem'
    },
    bigProgressFill: {
        height: '100%',
        backgroundColor: 'var(--accent-color)',
        borderRadius: '6px',
        transition: 'width 0.3s ease-in-out',
    }
};