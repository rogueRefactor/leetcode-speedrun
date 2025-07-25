import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getStoredData } from '../utils/storage';
import Head from 'next/head';

export default function DashboardPage() {
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const data = getStoredData();
        // Convert the questions object to an array for easier mapping
        const questionsArray = Object.values(data.questions || {});
        setQuestions(questionsArray);
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return <div style={styles.message}>Loading dashboard...</div>;
    }

    return (
        <div style={styles.container}>
            <Head>
                <title>Progress Dashboard</title>
            </Head>
            <header style={styles.header}>
                <Link href="/" legacyBehavior>
                    <a style={styles.backLink}>← Back to Home</a>
                </Link>
                <h1 style={styles.pageTitle}>Progress Dashboard</h1>
            </header>

            <main style={styles.main}>
                {questions.length === 0 ? (
                    <p style={styles.message}>No questions found. Start a playlist to track your progress!</p>
                ) : (
                    <div style={styles.tableWrapper}>
                        <table style={styles.table}>
                            <thead>
                            <tr>
                                <th style={styles.th}>Question</th>
                                <th style={styles.th}>Difficulty</th>
                                <th style={styles.th}>Attempts</th>
                                <th style={styles.th}>Unaided</th>
                                <th style={styles.th}>Status</th>
                                <th style={styles.th}>Avg. Time</th>
                            </tr>
                            </thead>
                            <tbody>
                            {questions.map(q => {
                                const avgTime = q.history.length > 0
                                    ? (q.history.reduce((sum, h) => sum + h.totalTime, 0) / q.history.length).toFixed(0)
                                    : 0;
                                const avgTimeDisplay = q.history.length > 0 ? `${avgTime}s` : 'N/A';

                                return (
                                    <tr key={q.url}>
                                        <td style={styles.td}>{q.title}</td>
                                        <td style={{...styles.td, color: getDifficultyColor(q.difficulty)}}>{q.difficulty}</td>
                                        <td style={styles.td}>{q.totalAttempts}</td>
                                        <td style={styles.td}>{q.unaidedAttempts}</td>
                                        <td style={{...styles.td, fontWeight: 'bold'}}>{q.completionStatus}</td>
                                        <td style={styles.td}>{avgTimeDisplay}</td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
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
    container: {
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginBottom: '2rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid var(--secondary-bg)',
    },
    pageTitle: {
        fontSize: '2rem',
    },
    backLink: {
        textDecoration: 'none',
        color: 'var(--accent-color)',
        position: 'absolute',
        left: 0,
        fontSize: '1rem',
    },
    main: {
        backgroundColor: 'var(--secondary-bg)',
        padding: '2rem',
        borderRadius: '8px',
    },
    message: {
        textAlign: 'center',
        color: 'var(--secondary-text)',
        fontSize: '1.2rem',
    },
    tableWrapper: {
        maxHeight: '70vh',
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
        position: 'sticky',
        top: 0,
        backgroundColor: 'var(--secondary-bg)',
    },
    td: {
        padding: '12px 15px',
        borderBottom: '1px solid var(--primary-bg)',
    },
};