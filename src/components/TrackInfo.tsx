import React from "react";
import { cn } from "@/lib/utils";
import { usePlayer } from "@/context/PlayerContext";
import { formatTime } from "@/utils/formatTime";
import { AlertCircle } from "lucide-react";

interface TrackInfoProps {
  className?: string;
}

const TrackInfo: React.FC<TrackInfoProps> = ({ className }) => {
  const { currentTrack, currentTime, duration } = usePlayer();
  
  return (
    <div className={cn("text-center", className)}>
      {currentTrack ? (
        <>
          <h2 className="text-xl font-semibold text-white mb-1 line-clamp-1">
            {currentTrack.title}
          </h2>
          <p className="text-white/70 mb-4 text-sm line-clamp-1">
            {currentTrack.artist} • {currentTrack.album}
          </p>
          <div className="flex items-center justify-between text-xs text-white/50">
            <span>{formatTime(currentTime)}</span>
            <span>
              {currentTrack.source === 'local' && duration === 0 ? (
                <div className="flex items-center text-amber-300">
                  <AlertCircle size={12} className="mr-1" />
                  <span>Loading...</span>
                </div>
              ) : (
                formatTime(duration)
              )}
            </span>
          </div>
        </>
      ) : (
        <div className="text-white/50">
          <h2 className="text-lg font-medium">No Track Selected</h2>
          <p className="text-sm">Choose a track from the library</p>
        </div>
      )}
    </div>
  );
};

export default TrackInfo;
