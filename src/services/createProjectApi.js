import axios from 'axios';
import ip from "../values/values.js";

export const createProject = async ({ name, description }) => {
  try {
    const payload = { name, description };
    const response = await axios.post(ip +'/api/projects/', payload);
    return response.data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};
