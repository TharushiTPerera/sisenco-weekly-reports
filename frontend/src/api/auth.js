// This file holds functions that talk to our backend's auth routes.

import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export async function loginUser(email, password) {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data; // { token, user }
}

export async function registerUser(name, email, password, role) {
  const response = await axios.post(`${API_URL}/register`, { name, email, password, role });
  return response.data;
}
