
import React from "react";
import { usePlayer } from "@/context/PlayerContext";
import { cn } from "@/lib/utils";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { formatTime } from "@/utils/formatTime";

interface PlayerControlsProps {
  className?: string;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({ className }) => {
  const { 
    isPlaying, 
    togglePlayPause, 
    nextTrack, 
    prevTrack, 
    currentTime, 
    duration, 
    seekTo,
    volume,
    setVolume,
    currentTrack
  } = usePlayer();
  
  const handleProgressChange = (values: number[]) => {
    seekTo(values[0]);
  };
  
  const handleVolumeChange = (values: number[]) => {
    setVolume(values[0]);
  };
  
  const toggleMute = () => {
    setVolume(volume > 0 ? 0 : 0.7);
  };
  
  return (
    <div className={cn("space-y-4", className)}>
      {/* Time and progress bar */}
      <div className="space-y-1.5">
        <Slider 
          value={[currentTime]} 
          max={duration || 100} 
          step={0.1} 
          onValueChange={handleProgressChange}
          disabled={!currentTrack}
          className="cursor-pointer"
        />
        
        <div className="flex justify-between text-xs text-white/60">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration || 0)}</span>
        </div>
      </div>
      
      {/* Main controls */}
      <div className="flex items-center justify-center space-x-6">
        <button 
          onClick={prevTrack}
          className="text-white/70 hover:text-white transition-colors p-2"
          disabled={!currentTrack}
        >
          <SkipBack size={22} className={!currentTrack ? "opacity-50" : ""} />
        </button>
        
        <button 
          onClick={togglePlayPause}
          className="p-4 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 rounded-full transition-all shadow-lg text-white transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          disabled={!currentTrack}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
        </button>
        
        <button 
          onClick={nextTrack}
          className="text-white/70 hover:text-white transition-colors p-2"
          disabled={!currentTrack}
        >
          <SkipForward size={22} className={!currentTrack ? "opacity-50" : ""} />
        </button>
      </div>
      
      {/* Volume control */}
      <div className="flex items-center space-x-3 justify-center">
        <button 
          onClick={toggleMute}
          className="text-white/70 hover:text-white transition-colors"
        >
          {volume > 0 ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
        
        <Slider 
          value={[volume]} 
          max={1} 
          step={0.01} 
          onValueChange={handleVolumeChange}
          className="cursor-pointer w-24"
        />
      </div>
    </div>
  );
};

export default PlayerControls;
