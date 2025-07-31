import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { getStoredData } from '../utils/storage';
import PlaylistSidebar from '../components/PlaylistSidebar';
import OverallStats from '../components/OverallStats';
import PlaylistDetails from '../components/PlaylistDetails';

export default function DashboardPage() {
    const [appData, setAppData] = useState({ playlists: {}, questions: {} });
    const [selectedPlaylistName, setSelectedPlaylistName] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const data = getStoredData();
        setAppData(data);
        setIsLoading(false);
    }, []);

    const handleSelectPlaylist = (name) => {
        // If clicking the same one, deselect it to show overall stats
        setSelectedPlaylistName(prev => prev === name ? null : name);
    };

    if (isLoading) {
        return <div style={styles.message}>Loading dashboard...</div>;
    }

    const selectedPlaylist = selectedPlaylistName ? appData.playlists[selectedPlaylistName] : null;

    return (
        <div style={styles.pageContainer}>
            <Head>
                <title>Progress Dashboard</title>
            </Head>
            <div style={styles.header}>
                <Link href="/" legacyBehavior>
                    <a style={styles.backLink}>← Back to Home</a>
                </Link>
            </div>
            <div style={styles.dashboardLayout}>
                <PlaylistSidebar
                    playlists={appData.playlists}
                    questionsData={appData.questions}
                    onSelectPlaylist={handleSelectPlaylist}
                    selectedPlaylistName={selectedPlaylistName}
                />
                <main style={styles.mainPanel}>
                    {selectedPlaylist ? (
                        <PlaylistDetails
                            playlistName={selectedPlaylistName}
                            playlist={selectedPlaylist}
                            questionsData={appData.questions}
                        />
                    ) : (
                        <OverallStats
                            questionsData={appData.questions}
                        />
                    )}
                </main>
            </div>
        </div>
    );
}

const styles = {
    pageContainer: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
    },
    header: {
        padding: '1rem 2rem',
        borderBottom: '1px solid var(--disabled-color)',
    },
    backLink: {
        textDecoration: 'none',
        color: 'var(--accent-color)',
        fontSize: '1rem',
    },
    dashboardLayout: {
        display: 'flex',
        flex: 1, // Take up remaining vertical space
        overflow: 'hidden', // Prevent whole page from scrolling
    },
    mainPanel: {
        flex: 1, // Take up remaining horizontal space
        overflowY: 'auto', // Allow only the main panel to scroll
    },
    message: {
        textAlign: 'center',
        color: 'var(--secondary-text)',
        fontSize: '1.2rem',
        padding: '4rem'
    },
};