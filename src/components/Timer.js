import { useState, useEffect, useRef, useCallback } from 'react';

const THINK_TIME_LIMIT = 600; // 10 minutes in seconds
const CODE_TIME_LIMIT = 600;  // 10 minutes in seconds
const REVIEW_TIME_LIMIT = 600; // 10 minutes in seconds

const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
};

export default function Timer({ onComplete, startSignal }) {
    const [phase, setPhase] = useState('idle');
    const [time, setTime] = useState(THINK_TIME_LIMIT);
    const [isActive, setIsActive] = useState(false);

    const timeThink = useRef(0);
    const timeCode = useRef(0);
    const sawSolution = useRef(false);

    const handleStart = () => {
        setPhase('thinking');
        setTime(THINK_TIME_LIMIT);
        setIsActive(true);
    };

    // --- FULL FUNCTION DEFINITIONS ARE NOW INCLUDED ---

    const handleNextPhase = useCallback(() => {
        setIsActive(false);

        if (phase === 'thinking') {
            timeThink.current = THINK_TIME_LIMIT - time;
            setPhase('coding');
            setTime(CODE_TIME_LIMIT);
            setIsActive(true);
        } else if (phase === 'coding') {
            timeCode.current = CODE_TIME_LIMIT - time;
            sawSolution.current = false;
            onComplete({
                timeThink: timeThink.current,
                timeCode: timeCode.current,
                sawSolution: sawSolution.current
            });
            setPhase('finished');
        } else if (phase === 'review') {
            onComplete({
                timeThink: timeThink.current,
                timeCode: timeCode.current,
                sawSolution: sawSolution.current
            });
            setPhase('finished');
        }
    }, [phase, time, onComplete]);

    const handleSeeSolution = useCallback(() => {
        setIsActive(false);
        sawSolution.current = true;

        if (phase === 'coding') {
            timeCode.current = CODE_TIME_LIMIT - time;
        } else if (phase === 'thinking') {
            timeThink.current = THINK_TIME_LIMIT - time;
            timeCode.current = 0;
        }

        setPhase('review');
        setTime(REVIEW_TIME_LIMIT);
        setIsActive(true);
    }, [phase, time]);


    // Effect to listen for the start signal from the parent page
    useEffect(() => {
        if (startSignal && phase === 'idle') {
            handleStart();
        }
    }, [startSignal, phase]);

    // The core timer countdown effect
    useEffect(() => {
        let interval;
        if (isActive && time > 0) {
            interval = setInterval(() => {
                setTime(prevTime => prevTime - 1);
            }, 1000);
        } else if (isActive && time === 0) {
            // Automatically move to next phase when time runs out
            handleNextPhase();
        }
        return () => clearInterval(interval);
    }, [isActive, time, handleNextPhase]);


    const getPhaseInfo = () => {
        switch (phase) {
            case 'idle':
                return { text: "Timer starts when you open the question link", color: 'var(--secondary-text)' };
            case 'thinking':
                return { text: "Phase 1: Thinking of a solution", color: '#3498db' };
            case 'coding':
                return { text: "Phase 2: Coding the solution", color: '#2ecc71' };
            case 'review':
                return { text: "Phase 3: Reviewing the solution", color: '#f1c40f' };
            case 'finished':
                return { text: "Attempt finished! Saving...", color: 'var(--secondary-text)' };
            default:
                return {};
        }
    };

    const { text: phaseText, color: phaseColor } = getPhaseInfo();

    return (
        <div style={styles.timerContainer}>
            <div style={{ ...styles.phaseIndicator, color: phaseColor }}>{phaseText}</div>

            <div style={styles.timeDisplay}>
                {phase === 'idle' ? '10:00' : formatTime(time)}
            </div>

            {time === 0 && <div style={styles.warning}>Time's up! Moving to next phase.</div>}

            <div style={styles.controls}>
                {phase === 'thinking' && (
                    <button onClick={handleNextPhase} style={styles.primaryButton}>I'm Ready to Code</button>
                )}
                {phase === 'coding' && (
                    <button onClick={handleNextPhase} style={styles.primaryButton}>I've Finished Coding</button>
                )}
                {phase === 'review' && (
                    <button onClick={handleNextPhase} style={styles.primaryButton}>Finished Reviewing</button>
                )}

                {phase !== 'idle' && phase !== 'finished' && (
                    <button onClick={handleSeeSolution} style={styles.secondaryButton}>I Need to See the Solution</button>
                )}
            </div>
        </div>
    );
}

const styles = {
    timerContainer: { width: '100%', maxWidth: '700px', backgroundColor: 'var(--secondary-bg)', borderRadius: '12px', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', border: '1px solid var(--disabled-color)' },
    phaseIndicator: { fontSize: '1.5rem', fontWeight: '600', textAlign: 'center' },
    timeDisplay: { fontSize: '6rem', fontWeight: 'bold', fontFamily: 'monospace', color: 'var(--primary-text)' },
    warning: { color: '#e74c3c', fontSize: '1rem', fontWeight: 'bold' },
    controls: { display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', minHeight: '50px' },
    primaryButton: { backgroundColor: 'var(--accent-color)', color: 'var(--primary-text)', minWidth: '200px' },
    secondaryButton: { backgroundColor: 'transparent', color: 'var(--accent-color)', border: '1px solid var(--accent-color)', minWidth: '200px' },
};