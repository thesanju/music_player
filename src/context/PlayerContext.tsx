import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { Track } from "../data/tracks";
import { useToast } from "@/components/ui/use-toast";
import { useTracks } from "./TrackContext";

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playTrack: (track: Track) => void;
  togglePlayPause: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seekTo: (time: number) => void;
  volume: number;
  setVolume: (volume: number) => void;
  queue: Track[];
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { tracks, currentTrack: contextTrack, setCurrentTrack: setContextTrack } = useTracks();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  // Use tracks from TrackContext as queue
  const queue = tracks;

  useEffect(() => {
    audioRef.current = new Audio();
    
    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    };
    
    const handleLoadedMetadata = () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration);
        setLoadError(null);
        
        // If this is a local track with duration 0, update the duration
        if (contextTrack && contextTrack.duration === 0 && contextTrack.source === 'local') {
          setContextTrack({
            ...contextTrack,
            duration: audioRef.current.duration
          });
        }
      }
    };
    
    const handleEnded = () => {
      nextTrack();
    };
    
    const handleError = (e: ErrorEvent) => {
      console.error("Audio loading error:", e);
      setLoadError(`Failed to load audio: ${audioRef.current?.src}`);
      setIsPlaying(false);
      
      toast({
        title: "Audio Error",
        description: `Could not load audio file. Please check if the file exists and is in a supported format.`,
        variant: "destructive"
      });
    };
    
    if (audioRef.current) {
      audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
      audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
      audioRef.current.addEventListener("ended", handleEnded);
      audioRef.current.addEventListener("error", handleError as EventListener);
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
        audioRef.current.removeEventListener("loadedmetadata", handleLoadedMetadata);
        audioRef.current.removeEventListener("ended", handleEnded);
        audioRef.current.removeEventListener("error", handleError as EventListener);
        audioRef.current.pause();
      }
    };
  }, []);
  
  useEffect(() => {
    if (contextTrack && audioRef.current) {
      // Log the audio source for debugging
      console.log(`Loading track: ${contextTrack.title}, Audio URL: ${contextTrack.audioUrl}`);
      
      try {
        // Reset error state
        setLoadError(null);
        
        // Set the audio source
        audioRef.current.src = contextTrack.audioUrl;
        audioRef.current.load();
        
        if (isPlaying) {
          const playPromise = audioRef.current.play();
          
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                // Playback started successfully
                console.log("Audio playback started successfully");
              })
              .catch(error => {
                // Auto-play was prevented or other error
                console.error("Error playing audio:", error);
                setLoadError(error.message);
                
                toast({
                  title: "Playback Error",
                  description: "Could not play the audio. Please try again or select a different track.",
                  variant: "destructive"
                });
                setIsPlaying(false);
                
                // If this track failed, try the next one
                if (error.name === "NotSupportedError") {
                  toast({
                    title: "Unsupported Audio",
                    description: "This audio format is not supported or the file cannot be found. Trying next track...",
                    variant: "destructive"
                  });
                  
                  // Short delay before trying the next track
                  setTimeout(() => {
                    nextTrack();
                  }, 1500);
                }
              });
          }
        }
      } catch (error) {
        console.error("Error setting up audio playback:", error);
        toast({
          title: "Playback Error",
          description: "Could not set up audio playback. Please try a different track.",
          variant: "destructive"
        });
      }
    }
  }, [contextTrack]);
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  
  const playTrack = (track: Track) => {
    console.log(`Playing track: ${track.title}, source: ${track.source || 'unknown'}`);
    setContextTrack(track);
    setIsPlaying(true);
  };
  
  const togglePlayPause = () => {
    if (!contextTrack) return;
    
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audioRef.current?.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Playback started successfully
            setIsPlaying(true);
          })
          .catch(error => {
            console.error("Error playing audio:", error);
            
            toast({
              title: "Playback Error",
              description: "Could not play the audio. Please try again.",
              variant: "destructive"
            });
            
            // If there's a serious error with this track, try the next one
            if (error.name === "NotSupportedError") {
              toast({
                title: "Trying Different Track",
                description: "This audio file isn't working. Trying another track...",
                variant: "destructive"
              });
              
              // Try the next track after a short delay
              setTimeout(() => nextTrack(), 1000);
            }
          });
      }
    }
  };
  
  const nextTrack = () => {
    if (!contextTrack || queue.length === 0) return;
    
    const currentIndex = queue.findIndex(track => track.id === contextTrack.id);
    const nextIndex = (currentIndex + 1) % queue.length;
    
    setContextTrack(queue[nextIndex]);
    setIsPlaying(true);
  };
  
  const prevTrack = () => {
    if (!contextTrack || queue.length === 0) return;
    
    const currentIndex = queue.findIndex(track => track.id === contextTrack.id);
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    
    setContextTrack(queue[prevIndex]);
    setIsPlaying(true);
  };
  
  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };
  
  const value = {
    currentTrack: contextTrack,
    isPlaying,
    currentTime,
    duration,
    playTrack,
    togglePlayPause,
    nextTrack,
    prevTrack,
    seekTo,
    volume,
    setVolume,
    queue
  };
  
  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  
  if (context === undefined) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  
  return context;
};
