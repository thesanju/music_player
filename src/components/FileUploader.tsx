import React, { useState } from 'react';
import { Track } from '../data/tracks';
import * as musicMetadata from 'music-metadata-browser';

interface FileUploaderProps {
  onTracksAdded: (tracks: Track[]) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onTracksAdded }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setProgress(0);
    
    const uploadedTracks: Track[] = [];
    const total = files.length;
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type === 'audio/mpeg' || file.type === 'audio/mp3') {
        try {
          // Parse the metadata from the MP3 file
          const metadata = await musicMetadata.parseBlob(file);
          
          // Create object URL for the audio file
          const audioUrl = URL.createObjectURL(file);
          
          // Extract cover art if it exists
          let coverUrl = '';
          if (metadata.common.picture && metadata.common.picture.length > 0) {
            const picture = metadata.common.picture[0];
            const blob = new Blob([picture.data], { type: picture.format });
            coverUrl = URL.createObjectURL(blob);
          }
          
          const track: Track = {
            id: `local-${Date.now()}-${i}`,
            title: metadata.common.title || file.name.replace('.mp3', ''),
            artist: metadata.common.artist || 'Unknown Artist',
            album: metadata.common.album || 'Unknown Album',
            coverUrl: coverUrl,
            audioUrl: audioUrl,
            duration: Math.floor(metadata.format.duration || 0),
            source: 'local',
            fileObject: file // Store the original file object
          };
          
          uploadedTracks.push(track);
        } catch (error) {
          console.error('Error parsing metadata:', error);
          // Create a basic track without metadata
          const audioUrl = URL.createObjectURL(file);
          const track: Track = {
            id: `local-${Date.now()}-${i}`,
            title: file.name.replace('.mp3', ''),
            artist: 'Unknown Artist',
            album: 'Unknown Album',
            coverUrl: '',
            audioUrl: audioUrl,
            duration: 0, // Will be determined during playback
            source: 'local',
            fileObject: file
          };
          uploadedTracks.push(track);
        }
      }
      
      // Update progress
      setProgress(Math.floor(((i + 1) / total) * 100));
    }
    
    // Add the tracks to the playlist
    onTracksAdded(uploadedTracks);
    setIsUploading(false);
  };

  return (
    <div className="file-uploader">
      <label className="upload-button">
        <input 
          type="file" 
          accept=".mp3,audio/mpeg" 
          multiple 
          onChange={handleFileUpload} 
          style={{ display: 'none' }}
        />
        Upload MP3 Files
      </label>
      
      {isUploading && (
        <div className="upload-progress">
          <progress value={progress} max="100"></progress>
          <span>{progress}%</span>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
