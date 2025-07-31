import { useState } from 'react';

export default function AddRemarksModal({ onSave, onClose }) {
    const [remarks, setRemarks] = useState('');

    const handleSave = () => {
        onSave(remarks);
        // No need to close here, the parent will handle it
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h2>Add Remarks</h2>
                <p style={styles.description}>Add some notes about your attempt (e.g., what you struggled with, what you learned).</p>
                <textarea
                    placeholder="My initial approach was..."
                    rows="6"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    style={styles.textarea}
                ></textarea>
                <div style={styles.buttonContainer}>
                    <button onClick={handleSave} style={styles.saveButton}>Save Attempt</button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    overlay: { /* Same style as AddPlaylistModal */
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)', display: 'flex',
        justifyContent: 'center', alignItems: 'center', zIndex: 1000,
    },
    modal: { /* Same style as AddPlaylistModal */
        backgroundColor: 'var(--secondary-bg)', padding: '2rem', borderRadius: '8px',
        width: '90%', maxWidth: '500px', display: 'flex',
        flexDirection: 'column', gap: '1rem',
    },
    description: { margin: 0, fontSize: '0.9rem', color: 'var(--secondary-text)' },
    textarea: { /* Same style as AddPlaylistModal */
        padding: '10px', borderRadius: '4px', border: '1px solid var(--disabled-color)',
        backgroundColor: 'var(--primary-bg)', color: 'var(--primary-text)', fontSize: '1rem',
        fontFamily: 'var(--font-family)', resize: 'vertical',
    },
    buttonContainer: { display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' },
    saveButton: { backgroundColor: 'var(--accent-color)', color: 'var(--primary-text)' },
};