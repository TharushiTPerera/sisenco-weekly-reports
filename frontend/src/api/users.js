import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

function authHeader() {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}` } };
}

export async function getAllUsers() {
  const response = await axios.get(`${API_URL}/users`, authHeader());
  return response.data;
}

export async function updateUserRole(id, role) {
  const response = await axios.put(`${API_URL}/users/${id}/role`, { role }, authHeader());
  return response.data;
}