import React from "react";
import { cn } from "@/lib/utils";
import { usePlayer } from "@/context/PlayerContext";
import { Music } from "lucide-react";

interface AlbumCoverProps {
  className?: string;
}

const AlbumCover: React.FC<AlbumCoverProps> = ({ className }) => {
  const { currentTrack, isPlaying } = usePlayer();
  
  return (
    <div className={cn("relative mx-auto", className)}>
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full blur-2xl opacity-30 animate-pulse-light"></div>
      <div 
        className={cn(
          "relative vinyl-record w-48 h-48 mx-auto rounded-full overflow-hidden shadow-[0_0_25px_rgba(6,182,212,0.5)]", 
          isPlaying && "animate-spin-slow"
        )}
      >
        {currentTrack ? (
          currentTrack.coverUrl ? (
            <img 
              src={currentTrack.coverUrl} 
              alt={`${currentTrack.album} by ${currentTrack.artist}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-800 to-cyan-950 flex items-center justify-center">
              <div className="flex flex-col items-center">
                <Music className="w-12 h-12 text-white/50 mb-2" />
                <span className="text-white/70 font-medium text-sm">{currentTrack.title}</span>
                <span className="text-white/50 text-xs mt-1">{currentTrack.artist}</span>
              </div>
            </div>
          )
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-cyan-950 flex items-center justify-center">
            <span className="text-white/70 font-display text-sm">SELECT TRACK</span>
          </div>
        )}
        <div className="absolute inset-0 ring-1 ring-white/20 rounded-full"></div>
      </div>
    </div>
  );
};

export default AlbumCover;
