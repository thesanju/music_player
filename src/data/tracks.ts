import { loadLocalMusicLibrary } from '../services/localMusic';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  audioUrl: string;
  duration: number;
  source?: 'local' | 'spotify'; // Optional source property to identify track origin
  fileObject?: File; // Reference to the original file for local tracks
}

// Sample tracks
export const sampleTracks: Track[] = [
  
];

// Load tracks from local music library in the project folder
export const localMusicTracks = loadLocalMusicLibrary();

// Use either local tracks or sample tracks based on availability
export const allTracks: Track[] = localMusicTracks.length > 0 ? localMusicTracks : sampleTracks;

// Function to load tracks from a Spotify playlist
export const loadSpotifyPlaylist = async (playlistId: string): Promise<Track[]> => {
  try {
    // Import dynamically to avoid circular dependencies
    const { fetchPlaylist } = await import('../services/spotify');
    return await fetchPlaylist(playlistId);
  } catch (error) {
    console.error('Error loading Spotify playlist:', error);
    return [];
  }
};

// Add local tracks to the playlist
export const addLocalTracks = (localTracks: Track[]): Track[] => {
  return [...allTracks, ...localTracks];
};

// Example usage:
// Call this function where you want to load Spotify tracks
// const spotifyTracks = await loadSpotifyPlaylist('YOUR_PLAYLIST_ID');
