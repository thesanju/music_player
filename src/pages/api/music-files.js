import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    // Make sure we're responding with JSON
    res.setHeader('Content-Type', 'application/json');
    
    // Define the path to your music directory
    const musicDir = path.join(process.cwd(), 'public', 'music');
    
    // Check if directory exists
    if (!fs.existsSync(musicDir)) {
      console.log(`Music directory does not exist: ${musicDir}`);
      // Return empty array instead of error
      return res.status(200).json([]);
    }
    
    // Read the directory
    const files = fs.readdirSync(musicDir);
    
    // Filter for audio files and exclude README.md
    const audioFiles = files.filter(file => {
      // Skip README.md and other non-audio files
      if (file === 'README.md' || file.startsWith('.')) return false;
      
      const ext = path.extname(file).toLowerCase();
      return ['.mp3', '.wav', '.ogg', '.m4a', '.flac'].includes(ext);
    });
    
    console.log(`Found ${audioFiles.length} audio files in ${musicDir}`);
    
    // Generate track info for each file
    const tracks = audioFiles.map(file => {
      return {
        filename: file,
        path: `/music/${file}`
      };
    });
    
    // Return the list of audio files with paths
    return res.status(200).json(tracks);
  } catch (error) {
    console.error('Error reading music directory:', error);
    // Return empty array instead of error
    return res.status(200).json([]);
  }
}
