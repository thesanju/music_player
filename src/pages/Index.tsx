import React, { useEffect } from 'react';
import MusicPlayer from "@/components/MusicPlayer";
import { PlayerProvider } from "@/context/PlayerContext";
import LibrarySidebar from "@/components/LibrarySidebar";
import { TrackProvider, useTracks } from '@/context/TrackContext';
import FileUploader from '../components/FileUploader';

const IndexContent = () => {
  const { tracks, currentTrack, isLoading } = useTracks();

  useEffect(() => {
    // Log track information for debugging
    console.log("Current tracks on Index page:", tracks);
    console.log("Current track:", currentTrack);
  }, [tracks, currentTrack]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-cyan-950 to-emerald-950 p-4 md:p-8">
      <PlayerProvider>
        <div className="container mx-auto max-w-6xl">
          {isLoading ? (
            <div className="flex items-center justify-center h-screen">
              <div className="text-white">Loading music library...</div>
            </div>
          ) : (
            <div className="relative bg-slate-900/40 backdrop-blur-lg border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
              <div className="flex flex-col lg:flex-row h-full">
                {/* Library Section */}
                <div className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-white/10">
                  <LibrarySidebar />
                </div>
                
                {/* Player Section */}
                <div className="w-full lg:w-2/3 flex items-center justify-center p-6 lg:p-10">
                  <MusicPlayer />
                </div>
              </div>
            </div>
          )}
        </div>
      </PlayerProvider>
    </div>
  );
};

const Index = () => {
  return (
    <TrackProvider>
      <IndexContent />
    </TrackProvider>
  );
};

export default Index;
