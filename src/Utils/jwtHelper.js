import jwtDecode from 'jwt-decode'; // ✅ This works correctly with version 3.1.2

export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const { exp } = jwtDecode(token);
    return Date.now() >= exp * 1000;
  } catch (err) {
    console.error("Invalid token:", err);
    return true;
  }
};

export const getUserFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch (err) {
    console.error("Error decoding token:", err);
    return null;
  }
};
