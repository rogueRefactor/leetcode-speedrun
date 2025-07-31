import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AddPlaylistModal from '../components/AddPlaylistModal';
import PlaylistDropdown from '../components/PlaylistDropdown';
import { getStoredData, saveStoredData } from '../utils/storage';

export default function Home() {
  const [appData, setAppData] = useState({ playlists: {}, questions: {} });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const data = getStoredData();
    setAppData(data);
  }, []);

  const handleSavePlaylist = (playlistName, questions) => {
    // This function remains unchanged
    if (appData.playlists[playlistName]) {
      alert('A playlist with this name already exists.');
      return;
    }
    const newAppData = { ...appData };
    const urls = questions.map(q => q.url);
    newAppData.playlists[playlistName] = {
      urls: urls,
      speedrunHistory: [],
    };
    questions.forEach(questionData => {
      const { url, title, difficulty, topics } = questionData;
      if (!url) return;
      const fallbackTitle = url.split('/problems/')[1]?.replace(/[/]/g, '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      newAppData.questions[url] = {
        ...newAppData.questions[url],
        url: url, title: title || fallbackTitle,
        difficulty: difficulty || 'N/A',
        topics: typeof topics === 'string' ? topics.split(',').map(t => t.trim()) : (topics || []),
        totalAttempts: newAppData.questions[url]?.totalAttempts || 0,
        unaidedAttempts: newAppData.questions[url]?.unaidedAttempts || 0,
        completionStatus: newAppData.questions[url]?.completionStatus || 'Not Started',
        history: newAppData.questions[url]?.history || [],
      };
    });
    setAppData(newAppData);
    saveStoredData(newAppData);
    setIsModalOpen(false);
  };

  // --- NEW FUNCTION TO HANDLE DELETION ---
  const handleDeletePlaylist = (playlistName) => {
    const newPlaylists = { ...appData.playlists };
    delete newPlaylists[playlistName]; // Remove the playlist

    // Note: We are NOT deleting the questions themselves, as they might be in other playlists.
    const newAppData = {
      ...appData,
      playlists: newPlaylists,
    };

    setAppData(newAppData);
    saveStoredData(newAppData);
    setIsDropdownOpen(false); // Close the dropdown after deletion
  };

  const handleStartClick = () => {
    if (Object.keys(appData.playlists).length > 0) {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  const isPlaylistComplete = (playlist, questionsData) => {
    if (!playlist || !playlist.urls) return false;
    return playlist.urls.every(url => questionsData[url]?.completionStatus === 'Completed');
  };

  const handlePlaylistSelect = (playlistName) => {
    setIsDropdownOpen(false);
    const playlist = appData.playlists[playlistName];
    if (isPlaylistComplete(playlist, appData.questions)) {
      router.push(`/speedrun/${encodeURIComponent(playlistName)}`);
    } else {
      router.push(`/solve/${encodeURIComponent(playlistName)}`);
    }
  };

  const isStartDisabled = Object.keys(appData.playlists).length === 0;

  return (
      <div style={styles.container}>
        <Head>
          <title>LeetCode Speedrun</title>
          <meta name="description" content="A local LeetCode tracker" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <header style={styles.header}>
          <h1 style={styles.title}>LeetCode Speedrun</h1>
          <button onClick={() => setIsModalOpen(true)} style={styles.playlistButton}>
            Add Playlist
          </button>
        </header>

        <main style={styles.main}>
          <button onClick={handleStartClick} style={isStartDisabled ? styles.startButtonDisabled : styles.startButton} disabled={isStartDisabled}>
            Start
          </button>
          {isDropdownOpen && (
              <PlaylistDropdown
                  playlists={Object.keys(appData.playlists)}
                  onSelect={handlePlaylistSelect}
                  onClose={() => setIsDropdownOpen(false)}
                  onDelete={handleDeletePlaylist} // Pass the new handler here
              />
          )}
        </main>

        <footer style={styles.footer}>
          <Link href="/dashboard" legacyBehavior>
            <a style={styles.dashboardButton}>View Progress Dashboard</a>
          </Link>
        </footer>

        {isModalOpen && (
            <AddPlaylistModal
                onSave={handleSavePlaylist}
                onClose={() => setIsModalOpen(false)}
            />
        )}
      </div>
  );
}

// Styles are unchanged.
const styles = {
  container: { display: 'flex', flexDirection: 'column', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', borderBottom: '1px solid var(--secondary-bg)' },
  title: { fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-text)' },
  playlistButton: { backgroundColor: 'var(--accent-color)', color: 'var(--primary-text)' },
  main: { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  startButton: { backgroundColor: 'var(--accent-color)', color: 'var(--primary-text)', fontSize: '2rem', padding: '2rem 4rem' },
  startButtonDisabled: { backgroundColor: 'var(--disabled-color)', color: 'var(--secondary-text)', fontSize: '2rem', padding: '2rem 4rem', cursor: 'not-allowed' },
  footer: { padding: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', borderTop: '1px solid var(--secondary-bg)' },
  dashboardButton: { textDecoration: 'none', color: 'var(--primary-text)', backgroundColor: 'var(--secondary-bg)', padding: '12px 24px', borderRadius: '8px', fontWeight: '600', transition: 'background-color 0.2s' }
};