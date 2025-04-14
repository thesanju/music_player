import { Track } from '../data/tracks';

const CLIENT_ID = '4585b2b49012426d901824474c7e1d98'; // Replace with your Spotify Client ID
const CLIENT_SECRET = '1e9d7cb92af740579fe9deab079e678d'; // Replace with your Client Secret
const REDIRECT_URI = 'http://localhost:3000/callback'; // Update with your redirect URI

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface SpotifyPlaylist {
  id: string;
  name: string;
  images: Array<{ url: string }>;
  tracks: {
    items: Array<{
      track: SpotifyTrack;
    }>;
  };
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: Array<{ url: string }>;
  };
  duration_ms: number;
  preview_url: string | null;
}

// Get Spotify access token using Client Credentials flow
async function getAccessToken(): Promise<string> {
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)
    },
    body: params
  });

  const data: SpotifyTokenResponse = await response.json();
  return data.access_token;
}

// Fetch a playlist by ID
export async function fetchPlaylist(playlistId: string): Promise<Track[]> {
  const token = await getAccessToken();
  
  const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const playlist: SpotifyPlaylist = await response.json();
  
  // Convert Spotify tracks to our Track format
  return playlist.tracks.items
    .filter(item => item.track.preview_url) // Only include tracks with preview URLs
    .map(item => ({
      id: item.track.id,
      title: item.track.name,
      artist: item.track.artists.map(artist => artist.name).join(', '),
      album: item.track.album.name,
      coverUrl: item.track.album.images[0]?.url || '',
      audioUrl: item.track.preview_url || '',
      duration: Math.floor(item.track.duration_ms / 1000),
      source: 'spotify'
    }));
}

// Get user's playlists (requires user authentication)
export async function getUserPlaylists(accessToken: string) {
  const response = await fetch('https://api.spotify.com/v1/me/playlists', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  
  return await response.json();
}
