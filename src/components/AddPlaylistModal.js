import { useState } from 'react';
import Papa from 'papaparse';

export default function AddPlaylistModal({ onSave, onClose }) {
    const [playlistName, setPlaylistName] = useState('');
    const [playlistUrls, setPlaylistUrls] = useState('');

    const handleFileImport = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (!playlistName.trim()) {
            alert('Please enter a playlist name before selecting a file.');
            event.target.value = null; // Reset file input
            return;
        }

        Papa.parse(file, {
            header: true, // Crucial: treats the first row as headers
            skipEmptyLines: true,
            complete: (results) => {
                // results.data will be an array of objects
                // e.g., [{ url: '...', title: '...', difficulty: '...', topics: '...' }]
                if (!results.data.length || !results.data[0].url) {
                    alert("CSV parsing failed. Make sure the CSV has a 'url' column header and is not empty.");
                    return;
                }
                onSave(playlistName, results.data);
            },
            error: (error) => {
                alert("An error occurred while parsing the CSV file.");
                console.error("CSV Parsing Error:", error);
            }
        });
    };

    const handleManualSave = () => {
        if (!playlistName.trim() || !playlistUrls.trim()) {
            alert('Please provide a playlist name and at least one URL.');
            return;
        }
        const urls = playlistUrls.split('\n').filter(url => url.trim() !== '');
        // Convert the array of URL strings into the object structure we now expect
        const questions = urls.map(url => ({ url }));
        onSave(playlistName, questions);
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h2>Add New Playlist</h2>
                <input
                    type="text"
                    placeholder="Playlist Name (e.g., &#39;NeetCode 150&#39;)" // 🔧 Escaped apostrophe
                    value={playlistName}
                    onChange={(e) => setPlaylistName(e.target.value)}
                    style={styles.input}
                />

                <div style={styles.importSection}>
                    <h3 style={styles.sectionTitle}>Option 1: Import from CSV</h3>
                    <p style={styles.description}>
                        CSV must have &#39;url&#39;, &#39;title&#39;, &#39;difficulty&#39;, &#39;topics&#39; headers.
                        {/* 🔧 Escaped all apostrophes */}
                    </p>
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileImport}
                        style={styles.fileInput}
                    />
                </div>

                <div style={styles.separator}>OR</div>

                <div style={styles.importSection}>
                    <h3 style={styles.sectionTitle}>Option 2: Paste URLs Manually</h3>
                    <textarea
                        placeholder="Paste LeetCode question URLs here, one per line."
                        rows="8"
                        value={playlistUrls}
                        onChange={(e) => setPlaylistUrls(e.target.value)}
                        style={styles.textarea}
                    ></textarea>
                    <button onClick={handleManualSave} style={styles.manualSaveButton}>Save Manual List</button>
                </div>

                <div style={styles.buttonContainer}>
                    <button onClick={onClose} style={styles.cancelButton}>Close</button>
                </div>
            </div>
        </div>
    );
}


// --- STYLES ---
const styles = {
    overlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex',
        justifyContent: 'center', alignItems: 'center', zIndex: 1000,
    },
    modal: {
        backgroundColor: 'var(--secondary-bg)', padding: '2rem', borderRadius: '8px',
        width: '90%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1rem',
    },
    input: {
        padding: '10px', borderRadius: '4px', border: '1px solid var(--disabled-color)',
        backgroundColor: 'var(--primary-bg)', color: 'var(--primary-text)', fontSize: '1rem',
    },
    textarea: {
        padding: '10px', borderRadius: '4px', border: '1px solid var(--disabled-color)',
        backgroundColor: 'var(--primary-bg)', color: 'var(--primary-text)', fontSize: '1rem',
        fontFamily: 'var(--font-family)', resize: 'vertical', width: '100%'
    },
    buttonContainer: {
        display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem',
        borderTop: '1px solid var(--disabled-color)', paddingTop: '1rem'
    },
    cancelButton: {
        backgroundColor: 'var(--disabled-color)', color: 'var(--secondary-text)',
    },
    importSection: {
        border: '1px solid var(--disabled-color)',
        borderRadius: '8px',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    sectionTitle: { margin: 0, fontSize: '1.1rem' },
    description: { margin: 0, fontSize: '0.9rem', color: 'var(--secondary-text)' },
    fileInput: {
        backgroundColor: 'var(--primary-bg)', padding: '10px', borderRadius: '4px',
        cursor: 'pointer'
    },
    manualSaveButton: {
        backgroundColor: 'var(--accent-color)', color: 'var(--primary-text)',
        alignSelf: 'flex-end'
    },
    separator: {
        textAlign: 'center', fontWeight: 'bold', color: 'var(--secondary-text)',
        margin: '0.5rem 0'
    }
};
