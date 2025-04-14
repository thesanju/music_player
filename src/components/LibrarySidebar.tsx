import React from "react";
import { usePlayer } from "@/context/PlayerContext";
import { cn } from "@/lib/utils";
import { formatTime } from "@/utils/formatTime";
import { Music, Play, ListMusic, Disc, UploadCloud } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTracks } from "@/context/TrackContext";

interface LibrarySidebarProps {
  className?: string;
  onSelect?: () => void;
}

const LibrarySidebar: React.FC<LibrarySidebarProps> = ({ className, onSelect }) => {
  const { playTrack, currentTrack, isPlaying } = usePlayer();
  const { tracks, isLoading } = useTracks();
  
  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="p-6 border-b border-white/10 flex items-center space-x-3">
        <Disc className="w-6 h-6 text-cyan-400" />
        <h1 className="text-xl font-display bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-emerald-300">
          YOUR LIBRARY
        </h1>
      </div>
      
      <Tabs defaultValue="all" className="w-full flex-1 flex flex-col">
        <div className="px-4 pt-4">
          <TabsList className="w-full bg-white/5 border border-white/10">
            <TabsTrigger value="all" className="flex-1 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-50">
              <ListMusic className="w-4 h-4 mr-2" />
              All Tracks
            </TabsTrigger>
            <TabsTrigger value="local" className="flex-1 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-50">
              <UploadCloud className="w-4 h-4 mr-2" />
              Local Files
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="all" className="mt-0 flex-1">
          <ScrollArea className="h-[calc(100%-2rem)] px-4 pt-4 pb-0">
            {isLoading ? (
              <div className="text-center py-8 text-white/50">Loading tracks...</div>
            ) : tracks.length === 0 ? (
              <div className="text-center py-8 text-white/50">No tracks found</div>
            ) : (
              <div className="space-y-2 pr-4">
                {tracks.map((track) => (
                  <div 
                    key={track.id}
                    onClick={() => {
                      playTrack(track);
                      if (onSelect) onSelect();
                    }}
                    className={cn(
                      "flex items-center p-3 rounded-xl cursor-pointer transition-all", 
                      currentTrack?.id === track.id 
                        ? "bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 backdrop-blur-md text-white border border-white/20" 
                        : "hover:bg-white/5 text-white/80 hover:border border-transparent hover:border-white/10"
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
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-cyan-950">
                          <Music size={16} className="text-white/70" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-grow min-w-0">
                      <div className="font-medium truncate">{track.title}</div>
                      <div className="text-xs opacity-70 truncate">{track.artist}</div>
                    </div>
                    
                    <div className="flex items-center space-x-3 ml-2">
                      <span className="text-xs text-white/50">
                        {track.duration > 0 ? formatTime(track.duration) : "--:--"}
                      </span>
                      {currentTrack?.id === track.id && isPlaying && (
                        <Play size={14} className="text-cyan-300" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="local" className="mt-0 flex-1">
          <ScrollArea className="h-[calc(100%-2rem)] px-4 pt-4 pb-0">
            {isLoading ? (
              <div className="text-center py-8 text-white/50">Loading local tracks...</div>
            ) : (
              <div className="space-y-2 pr-4">
                {tracks.filter(track => track.source === 'local').length === 0 ? (
                  <div className="text-center py-8 text-white/50">
                    <p className="mb-2">No local tracks found</p>
                    <p className="text-xs">Add MP3 files to your /public/music folder</p>
                  </div>
                ) : (
                  tracks
                    .filter(track => track.source === 'local')
                    .map((track) => (
                      <div 
                        key={track.id}
                        onClick={() => {
                          playTrack(track);
                          if (onSelect) onSelect();
                        }}
                        className={cn(
                          "flex items-center p-3 rounded-xl cursor-pointer transition-all", 
                          currentTrack?.id === track.id 
                            ? "bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 backdrop-blur-md text-white border border-white/20" 
                            : "hover:bg-white/5 text-white/80 hover:border border-transparent hover:border-white/10"
                        )}
                      >
                        <div className="w-10 h-10 mr-3 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-cyan-950">
                            <Music size={16} className="text-white/70" />
                          </div>
                        </div>
                        
                        <div className="flex-grow min-w-0">
                          <div className="font-medium truncate">{track.title}</div>
                          <div className="text-xs opacity-70 truncate">{track.artist}</div>
                        </div>
                        
                        <div className="flex items-center space-x-3 ml-2">
                          <span className="text-xs text-white/50">
                            {track.duration > 0 ? formatTime(track.duration) : "--:--"}
                          </span>
                          {currentTrack?.id === track.id && isPlaying && (
                            <Play size={14} className="text-cyan-300" />
                          )}
                        </div>
                      </div>
                    ))
                )}
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LibrarySidebar;
