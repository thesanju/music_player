
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { usePlayer } from "@/context/PlayerContext";

interface EqualizerProps {
  className?: string;
}

const Equalizer: React.FC<EqualizerProps> = ({ className }) => {
  const { isPlaying } = usePlayer();
  const [barHeights, setBarHeights] = useState<number[]>([30, 50, 20, 70, 40]);
  
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setBarHeights([
        Math.random() * 60 + 20,
        Math.random() * 70 + 20,
        Math.random() * 60 + 20,
        Math.random() * 80 + 20,
        Math.random() * 60 + 20,
      ]);
    }, 200);
    
    return () => clearInterval(interval);
  }, [isPlaying]);
  
  return (
    <div className={cn("flex items-end h-8 space-x-0.5", className, !isPlaying && "opacity-30")}>
      {barHeights.map((height, index) => (
        <div 
          key={index}
          className={cn(
            "w-1 bg-gradient-to-t from-cyan-400 to-emerald-400 rounded-t",
            !isPlaying && "!h-1 from-cyan-300/50 to-emerald-400/50"
          )}
          style={{ 
            height: isPlaying ? `${height}%` : "10%",
            transition: "height 0.2s ease"
          }}
        />
      ))}
    </div>
  );
};

export default Equalizer;
