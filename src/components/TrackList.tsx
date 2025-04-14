
import React from "react";
import { usePlayer } from "@/context/PlayerContext";
import { cn } from "@/lib/utils";
import { formatTime } from "@/utils/formatTime";
import { Music, Play } from "lucide-react";

interface TrackListProps {
  className?: string;
}

const TrackList: React.FC<TrackListProps> = ({ className }) => {
  const { queue, playTrack, currentTrack } = usePlayer();
  
  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="text-lg font-display text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-pink-100">Library</h3>
      
      <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
        {queue.map((track) => (
          <div 
            key={track.id}
            onClick={() => playTrack(track)}
            className={cn(
              "flex items-center p-3 rounded-xl cursor-pointer transition-all", 
              currentTrack?.id === track.id 
                ? "bg-white/10 backdrop-blur-md text-white border border-white/10" 
                : "hover:bg-white/5 text-white/80 hover:border border-transparent hover:border-white/5"
            )}
          >
            <div className="w-10 h-10 mr-3 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
              {track.coverUrl ? (
                <img 
                  src={track.coverUrl} 
                  alt={track.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-900 to-black">
                  <Music size={16} className="text-white/70" />
                </div>
              )}
            </div>
            
            <div className="flex-grow min-w-0">
              <div className="font-medium truncate">{track.title}</div>
              <div className="text-xs opacity-70 truncate">{track.artist}</div>
            </div>
            
            <div className="flex items-center space-x-3 ml-2">
              <span className="text-xs text-white/50">{formatTime(track.duration)}</span>
              {currentTrack?.id === track.id && (
                <Play size={14} className="text-indigo-300" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackList;
