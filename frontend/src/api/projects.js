import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function authHeader() {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}` } };
}

export async function getProjects() {
  const response = await axios.get(`${API_URL}/projects`, authHeader());
  return response.data;
}

export async function createProject(name, description) {
  const response = await axios.post(`${API_URL}/projects`, { name, description }, authHeader());
  return response.data;
}

export async function updateProject(id, name, description) {
  const response = await axios.put(`${API_URL}/projects/${id}`, { name, description }, authHeader());
  return response.data;
}

export async function deleteProject(id) {
  const response = await axios.delete(`${API_URL}/projects/${id}`, authHeader());
  return response.data;
}