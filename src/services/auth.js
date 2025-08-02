import axios from 'axios';

const API_BASE_URL = 'https://your-api-url.com'; // Replace with your API URL

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, credentials);
    const { token } = response.data;

    if (token) {
      localStorage.setItem('token', token);
    }

    return token;
  } catch (err) {
    throw new Error('Login failed');
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};
