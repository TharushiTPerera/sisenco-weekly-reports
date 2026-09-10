// Functions that talk to our backend's report and project routes.

import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Helper: builds the auth header using the saved token
function authHeader() {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}` } };
}

export async function getProjects() {
  const response = await axios.get(`${API_URL}/projects`, authHeader());
  return response.data;
}

export async function createReport(reportData) {
  const response = await axios.post(`${API_URL}/reports`, reportData, authHeader());
  return response.data;
}
