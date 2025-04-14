/**
 * Utility to verify that asset files exist and are accessible
 */
export const verifyAssets = async () => {
  const assetPaths = [
    '/music/covers/grad.jpg',
    '/music/tracks/flashing-lights.mp3',
    '/music/tracks/stronger.mp3',
    '/music/tracks/good-life.mp3'
  ];
  
  console.log('Verifying asset files...');
  
  for (const path of assetPaths) {
    try {
      const response = await fetch(path, { method: 'HEAD' });
      if (response.ok) {
        console.log(`✅ Asset found: ${path}`);
      } else {
        console.error(`❌ Asset not found: ${path} (${response.status})`);
      }
    } catch (error) {
      console.error(`❌ Error checking asset: ${path}`, error);
    }
  }
};
