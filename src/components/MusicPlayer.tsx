
import React from "react";
import AlbumCover from "./AlbumCover";
import TrackInfo from "./TrackInfo";
import PlayerControls from "./PlayerControls";
import Equalizer from "./Equalizer";
import { cn } from "@/lib/utils";

interface MusicPlayerProps {
  className?: string;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ className }) => {
  return (
    <div className={cn("w-full max-w-md", className)}>
      <div className="bg-gradient-to-br from-slate-900/80 via-cyan-900/70 to-emerald-900/80 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl border border-white/10">
        <div className="px-6 pt-6 pb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-display text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-emerald-300">WAVE BEATS</h1>
            <Equalizer />
          </div>
          
          <AlbumCover className="mb-6" />
          
          <TrackInfo className="mb-6" />
          
          <PlayerControls className="mb-0" />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
