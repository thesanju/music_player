const CLIENT_ID = '4585b2b49012426d901824474c7e1d98'; // Replace with your Spotify Client ID
const REDIRECT_URI = 'http://localhost:3000/callback'; // Update with your redirect URI

// Generate a random string for state parameter
function generateRandomString(length: number): string {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';
  
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// Redirect to Spotify authorization page
export function redirectToSpotifyLogin() {
  const state = generateRandomString(16);
  localStorage.setItem('spotify_auth_state', state);
  
  const scope = 'user-read-private user-read-email playlist-read-private playlist-read-collaborative';
  
  const params = new URLSearchParams({
    response_type: 'token',
    client_id: CLIENT_ID,
    scope: scope,
    redirect_uri: REDIRECT_URI,
    state: state
  });
  
  window.location.href = 'https://accounts.spotify.com/authorize?' + params.toString();
}

// Parse the access token from the URL after Spotify redirects back
export function getAccessTokenFromUrl(): string | null {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  
  const token = params.get('access_token');
  const state = params.get('state');
  const storedState = localStorage.getItem('spotify_auth_state');
  
  if (state === null || state !== storedState) {
    console.error('State mismatch error');
    return null;
  }
  
  // Clear the state from localStorage
  localStorage.removeItem('spotify_auth_state');
  
  return token;
}

// Store the token in localStorage (you might want to use a more secure approach in production)
export function saveToken(token: string) {
  localStorage.setItem('spotify_access_token', token);
}

// Get the stored token
export function getStoredToken(): string | null {
  return localStorage.getItem('spotify_access_token');
}
