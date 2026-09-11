import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getAllReports } from '../api/reports';

function statusColor(status) {
  if (status === 'draft') return 'bg-gray-200 text-gray-700';
  if (status === 'submitted') return 'bg-blue-200 text-blue-700';
  if (status === 'needs_correction') return 'bg-red-200 text-red-700';
  if (status === 'approved') return 'bg-green-200 text-green-700';
  return 'bg-gray-200 text-gray-700';
}

function ManagerDashboard() {
  const [reports, setReports] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadReports();
  }, [statusFilter]);

  function loadReports() {
    const filters = {};
    if (statusFilter) filters.status = statusFilter;

    getAllReports(filters)
      .then((data) => setReports(data.reports))
      .catch(() => setError('Could not load reports'));
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto p-8">
                        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Team Dashboard</h1>
          <div className="flex gap-2">
            <Link to="/manager/projects" className="text-sm bg-gray-600 text-white px-3 py-2 rounded hover:bg-gray-700">
              Manage Projects
            </Link>
            <Link to="/manager/users" className="text-sm bg-gray-600 text-white px-3 py-2 rounded hover:bg-gray-700">
              Manage Users
            </Link>
          </div>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mb-4">
          <label className="text-sm mr-2">Filter by status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded px-3 py-1 text-sm"
          >
            <option value="">All</option>
            <option value="draft">Draft</option>
            <option value="submitted">Submitted</option>
            <option value="needs_correction">Needs Correction</option>
            <option value="approved">Approved</option>
          </select>
        </div>

        {reports.length === 0 && <p className="text-gray-500">No reports found.</p>}

        <div className="space-y-3">
          {reports.map((r) => (
            <Link
              key={r.id}
              to={`/report/${r.id}`}
              className="block bg-white p-4 rounded-lg shadow hover:shadow-md transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{r.week_start} to {r.week_end}</p>
                  <p className="text-sm text-gray-500">User ID: {r.user_id} — Project ID: {r.project_id}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor(r.status)}`}>
                  {r.status.replace('_', ' ')}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ManagerDashboard;