import axios from 'axios';
import ip from '../values/values'

export const uploadAoi = async ({ projectId, geoJSON }) => {
  try {
    const blob = new Blob([JSON.stringify(geoJSON)], {
        type: 'application/geo+json',
      });
      console.log('GeoJSON Blob created:', projectId);
    const formData = new FormData();
    formData.append('id', projectId);
    formData.append('file', blob, `${projectId}.geojson`);

    const response = await fetch(`${ip}/api/projects/${projectId}/datafiles/`, {
      method: 'POST',
      body: formData,
    });

      const result = await response.json();
      console.log('✅ Upload successful:', result);
  } catch (error) {
      console.error('⚠️ Error uploading:', error);
      throw error;

    }
};
