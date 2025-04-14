import React, { createContext, useContext, useState, useEffect } from "react";
import { Track, sampleTracks } from "../data/tracks";
import { loadLocalMusicLibrary } from "../services/localMusic";

interface TrackContextType {
  tracks: Track[];
  currentTrack: Track | null;
  setCurrentTrack: (track: Track | null) => void;
  addTracks: (newTracks: Track[]) => void;
  isLoading: boolean;
}

const TrackContext = createContext<TrackContextType | undefined>(undefined);

export const TrackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tracks, setTracks] = useState<Track[]>(sampleTracks);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTracks = async () => {
      try {
        setIsLoading(true);
        
        // Load local tracks first
        console.log("Loading local music library...");
        const localTracks = await loadLocalMusicLibrary();
        
        if (localTracks && localTracks.length > 0) {
          console.log(`Loaded ${localTracks.length} local tracks`);
          
          // If we have local tracks, merge them with sample tracks
          // or just use local tracks if you prefer
          setTracks(prevTracks => {
            // Combine local tracks with existing sample tracks
            // and remove duplicates by ID
            const combinedTracks = [...localTracks, ...prevTracks];
            const uniqueTracks = Array.from(
              new Map(combinedTracks.map(track => [track.id, track])).values()
            );
            return uniqueTracks;
          });
          
          // Set first local track as current if none selected
          if (!currentTrack) {
            setCurrentTrack(localTracks[0]);
          }
        } else {
          console.log("No local tracks found, using sample tracks");
        }
      } catch (error) {
        console.error("Error loading tracks:", error);
        // Keep the sample tracks if there's an error
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTracks();
  }, []);

  const addTracks = (newTracks: Track[]) => {
    setTracks(prev => {
      // Add new tracks and avoid duplicates
      const combinedTracks = [...prev, ...newTracks];
      return Array.from(
        new Map(combinedTracks.map(track => [track.id, track])).values()
      );
    });
  };

  return (
    <TrackContext.Provider
      value={{
        tracks,
        currentTrack,
        setCurrentTrack,
        addTracks,
        isLoading
      }}
    >
      {children}
    </TrackContext.Provider>
  );
};

export const useTracks = (): TrackContextType => {
  const context = useContext(TrackContext);
  
  if (context === undefined) {
    throw new Error("useTracks must be used within a TrackProvider");
  }
  
  return context;
};
