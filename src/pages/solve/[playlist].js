import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import { getStoredData, saveStoredData } from '../../utils/storage';
import Link from 'next/link';
import Timer from '../../components/Timer';
import AddRemarksModal from '../../components/AddRemarksModal';

export default function SolvePage() {
    const router = useRouter();
    const { playlist: playlistName } = router.query;

    const [isTimerActive, setIsTimerActive] = useState(false);
    const [appData, setAppData] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPlaylistComplete, setIsPlaylistComplete] = useState(false);
    const [isRemarksModalOpen, setIsRemarksModalOpen] = useState(false);
    const tempAttemptData = useRef(null);

    useEffect(() => {
        if (!playlistName) return;
        const data = getStoredData();
        setAppData(data);
        const decodedPlaylistName = decodeURIComponent(playlistName);
        const playlistUrls = data.playlists[decodedPlaylistName]?.urls;

        if (playlistUrls && playlistUrls.length > 0) {
            const nextQuestionUrl = getNextQuestion(playlistUrls, data.questions);
            if (nextQuestionUrl) {
                const questionDetails = data.questions[nextQuestionUrl];
                setCurrentQuestion({ url: nextQuestionUrl, ...questionDetails });
            } else {
                setIsPlaylistComplete(true);
            }
        }
        setIsLoading(false);
    }, [playlistName]);

    const getNextQuestion = (playlistUrls, questionsData) => {
        const unsolvedQuestions = playlistUrls
            .map(url => questionsData[url])
            .filter(q => q.completionStatus !== 'Completed');

        if (unsolvedQuestions.length === 0) return null;

        const unattemptedQuestions = unsolvedQuestions.filter(q => q.totalAttempts === 0);
        if (unattemptedQuestions.length > 0) {
            return unattemptedQuestions[0].url;
        }

        unsolvedQuestions.sort((a, b) => {
            const aSawSolution = a.history.length > 0 && a.history[a.history.length - 1].sawSolution;
            const bSawSolution = b.history.length > 0 && b.history[b.history.length - 1].sawSolution;
            if (aSawSolution && !bSawSolution) return -1;
            if (!aSawSolution && bSawSolution) return 1;

            if (a.unaidedAttempts < b.unaidedAttempts) return -1;
            if (a.unaidedAttempts > b.unaidedAttempts) return 1;

            const avgTimeA = a.history.reduce((sum, h) => sum + h.totalTime, 0) / (a.history.length || 1);
            const avgTimeB = b.history.reduce((sum, h) => sum + h.totalTime, 0) / (b.history.length || 1);
            if (avgTimeA > avgTimeB) return -1;
            if (avgTimeA < avgTimeB) return 1;

            return 0;
        });

        return unsolvedQuestions[0].url;
    };

    const handleAttemptComplete = (timingData) => {
        tempAttemptData.current = timingData;
        setIsRemarksModalOpen(true);
    };

    const handleSaveAttempt = (remarks) => {
        const newHistoryItem = {
            date: new Date().toISOString(), ...tempAttemptData.current,
            totalTime: tempAttemptData.current.timeThink + tempAttemptData.current.timeCode,
            remarks: remarks,
        };
        const updatedAppData = { ...appData };
        const questionToUpdate = updatedAppData.questions[currentQuestion.url];

        questionToUpdate.history.push(newHistoryItem);
        questionToUpdate.totalAttempts += 1;
        if (!newHistoryItem.sawSolution) {
            questionToUpdate.unaidedAttempts += 1;
        }

        const everSawSolution = questionToUpdate.history.some(h => h.sawSolution);
        const requiredUnaidedAttempts = everSawSolution ? 4 : 3;
        if (questionToUpdate.unaidedAttempts >= requiredUnaidedAttempts) {
            questionToUpdate.completionStatus = 'Completed';
        } else {
            questionToUpdate.completionStatus = 'In Progress';
        }
        setAppData(updatedAppData);
        saveStoredData(updatedAppData);
        setIsRemarksModalOpen(false);
        alert(`Attempt saved! Status: ${questionToUpdate.completionStatus}`);
        router.reload();
    };

    const handleLinkClick = () => {
        setIsTimerActive(true);
    };

    if (isLoading) return <div style={styles.centerMessage}>Loading your session...</div>;
    if (isPlaylistComplete) return <div style={styles.centerMessage}><h2 style={{color: '#2ecc71'}}>🎉 Playlist Complete! 🎉</h2><p>Go back home to start a Speedrun!</p><Link href="/" legacyBehavior><a style={styles.backLink}>Go back home</a></Link></div>;
    if (!currentQuestion) return <div style={styles.centerMessage}><p>Could not find this playlist, or it might be empty.</p><Link href="/" legacyBehavior><a style={styles.backLink}>Go back home</a></Link></div>;

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <Link href="/" legacyBehavior><a style={styles.backLink}>← End Session</a></Link>
                <h1 style={styles.playlistTitle}>Playlist: {decodeURIComponent(playlistName)}</h1>
            </header>
            <main style={styles.main}>
                <div style={styles.questionContainer}>
                    <h2 style={styles.questionTitle}>{currentQuestion.title}</h2>
                    <p style={styles.metaInfo}>Difficulty: {currentQuestion.difficulty} | Topics: {currentQuestion.topics.join(', ')}</p>
                    <a
                        href={currentQuestion.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.questionLink}
                        onClick={handleLinkClick}
                    >
                        Open on LeetCode (Starts Timer)
                    </a>
                </div>
                <Timer
                    onComplete={handleAttemptComplete}
                    startSignal={isTimerActive}
                />
            </main>
            {isRemarksModalOpen && (<AddRemarksModal onSave={handleSaveAttempt} />)}
        </div>
    );
}

const styles = { centerMessage: { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', fontSize: '1.5rem', textAlign: 'center', padding: '2rem' }, container: { display: 'flex', flexDirection: 'column', minHeight: '100vh', padding: '0 2rem' }, header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid var(--secondary-bg)' }, playlistTitle: { fontSize: '1.5rem', color: 'var(--primary-text)', textAlign: 'center', flex: 1 }, backLink: { textDecoration: 'none', color: 'var(--accent-color)', fontSize: '1rem' }, main: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '4rem' }, questionContainer: { textAlign: 'center', marginBottom: '3rem', width: '100%', maxWidth: '800px' }, questionTitle: { fontSize: '2.5rem', marginBottom: '0.5rem' }, metaInfo: { color: 'var(--secondary-text)', marginBottom: '1.5rem', fontStyle: 'italic' }, questionLink: { fontSize: '1.2rem', color: 'var(--accent-color)', textDecoration: 'none', border: '1px solid var(--accent-color)', padding: '10px 20px', borderRadius: '8px', transition: 'background-color 0.2s' } };