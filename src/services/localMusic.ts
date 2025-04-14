import { Track } from '../data/tracks';
import { v4 as uuidv4 } from 'uuid';

// Define the local music library structure
interface LocalMusicFile {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverFile: string;
  audioFile: string;
  duration: number;
}

// This array will contain metadata for our local MP3 files
// Updated to match actual files in public/music directory
const localMusicLibrary: LocalMusicFile[] = [
  {
    id: "local-1",
    title: "Flashing Lights",
    artist: "Kanye West ft. Dwele",
    album: "Graduation",
    coverFile: "/music/grad.jpg", // No cover file available yet
    audioFile: "/music/Kanye West, Dwele - Flashing Lights.mp3",
    duration: 238
  },
  {
    id: "local-2",
    title: "Bound 2",
    artist: "Kanye West",
    album: "Yeezus",
    coverFile: "/music/ye.jpeg",
    audioFile: "/music/Kanye West - Bound 2.mp3",
    duration: 229
  },
  {
    id: "local-3",
    title: "Like That",
    artist: "Metro Boomin",
    album: "We don't trust you",
    coverFile: "/music/we.jpeg",
    audioFile: "music/Future, Metro Boomin, Kendrick Lamar - Like That.mp3",
    duration: 243
  },
  {
    id: "local-4",
    title: "Runaway",
    artist: "Kanye West ft. Pusha T",
    album: "My Beautiful Dark Twisted Fantasy",
    coverFile: "/music/dark.jpeg",
    audioFile: "/music/Kanye West, Pusha T - Runaway.mp3",
    duration: 547
  },
  {
    id: "local-5",
    title: "Something In The Way",
    artist: "Nirvana",
    album: "Nevermind",
    coverFile: "/music/never.jpg",
    audioFile: "/music/Nirvana - Something In The Way.mp3",
    duration: 271
  },
  {
    id: "local-6",
    title: "Let It Happen",
    artist: "Tame Impala",
    album: "Currents",
    coverFile: "/music/currents.jpeg",
    audioFile: "/music/Tame Impala - Let It Happen.mp3",
    duration: 215
  },
  {
    id: "local-7",
    title: "Pink + White",
    artist: "Frank Ocean",
    album: "Blonde",
    coverFile: "/music/blonde.jpeg",
    audioFile: "/music/Frank Ocean - Pink + White.mp3",
    duration: 184
  }
];

// Function to convert LocalMusicFile to Track
const convertToTrack = (localTrack: LocalMusicFile): Track => {
  // Log file paths for debugging
  console.log(`Converting track: ${localTrack.title}, audio: ${localTrack.audioFile}`);
  
  return {
    id: localTrack.id,
    title: localTrack.title,
    artist: localTrack.artist,
    album: localTrack.album,
    coverUrl: localTrack.coverFile || "", // Use empty string if no cover
    audioUrl: localTrack.audioFile,
    duration: localTrack.duration,
    source: 'local'
  };
};

// Function to load the local music library
export const loadLocalMusicLibrary = async (): Promise<Track[]> => {
  try {
    // First, try the predefined tracks from localMusicLibrary
    if (localMusicLibrary.length > 0) {
      console.log(`Using predefined local music library with ${localMusicLibrary.length} tracks`);
      return localMusicLibrary.map(convertToTrack);
    }

    // If predefined library is empty, try fetching from API
    console.log("Trying to fetch music files from API");
    const response = await fetch('/api/music-files');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch music files: ${response.status} ${response.statusText}`);
    }
    
    // Try to parse the response as JSON with error handling
    const text = await response.text();
    let files;
    try {
      files = JSON.parse(text);
    } catch (parseError) {
      console.error("Failed to parse API response as JSON:", text.substring(0, 100) + "...");
      throw new Error("Invalid JSON response from API");
    }
    
    if (!Array.isArray(files)) {
      throw new Error("API did not return an array of files");
    }
    
    // Map files to Track objects
    return files.map((file: string) => {
      // Extract title and artist from filename
      const fileName = file.split('/').pop() || '';
      let title = fileName.replace(/\.[^/.]+$/, '');
      let artist = "Unknown Artist";
      
      // Try to parse artist from the filename format "Artist - Title.mp3"
      const parts = title.split(' - ');
      if (parts.length > 1) {
        artist = parts[0];
        title = parts.slice(1).join(' - ');
      }
      
      return {
        id: uuidv4(),
        title: title,
        artist: artist,
        album: "Local Music",
        coverUrl: "", // Default empty - we'll use a placeholder in the UI
        audioUrl: `/music/${encodeURIComponent(fileName)}`,
        duration: 0, // We'll set this when audio loads
        source: 'local'
      };
    });
  } catch (error) {
    console.error("Error loading local music library:", error);
    // Fallback to scanPublicMusicFolder
    console.log("Falling back to scanning public music folder");
    return scanPublicMusicFolder();
  }
};

// Direct way to load files without API (fallback)
export const scanPublicMusicFolder = (): Track[] => {
  console.log("Using predefined music files as fallback");
  return localMusicLibrary.map(convertToTrack);
};

// Function to get a specific track by ID
export const getLocalTrackById = (id: string): Track | undefined => {
  const localTrack = localMusicLibrary.find(track => track.id === id);
  if (!localTrack) return undefined;
  
  return convertToTrack(localTrack);
};
