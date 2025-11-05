// src/services/api.js

// Use the base URL directly since environment variables might not be loading
const BASE_URL = 'https://gms-api.kmgarage.com';

export const authAPI = {
  login: async (email, password) => {
    try {
      console.log('Making API call to:', `${BASE_URL}/api/auth/login`);
      
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          username: email, // Using email as username
          password: password
        }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid email or password');
        }
        throw new Error(`Login failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('Login successful:', data);
      return data;
    } catch (error) {
      console.error('API Error:', error);
      if (error.message) {
        throw error;
      }
      throw new Error('Network error. Please check your connection.');
    }
  }
};