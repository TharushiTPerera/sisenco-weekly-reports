import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getAllReports, getDashboardStats } from '../api/reports';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

function statusColor(status) {
  if (status === 'draft') return 'bg-gray-200 text-gray-700';
  if (status === 'submitted') return 'bg-blue-200 text-blue-700';
  if (status === 'needs_correction') return 'bg-red-200 text-red-700';
  if (status === 'approved') return 'bg-green-200 text-green-700';
  return 'bg-gray-200 text-gray-700';
}

const COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6'];

function ManagerDashboard() {
  const [reports, setReports] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReports();
  }, [statusFilter]);

  useEffect(() => {
    getDashboardStats().then(setStats).catch(() => setError('Could not load stats'));
  }, []);

  function loadReports() {
    const filters = {};
    if (statusFilter) filters.status = statusFilter;

    getAllReports(filters)
      .then((data) => setReports(data.reports))
      .catch(() => setError('Could not load reports'));
  }

  // Reshape data slightly for the charts
  const workloadData = stats?.workloadByProject.map((w) => ({
    name: `Project ${w.project_id}`,
    reports: parseInt(w.count),
  })) || [];

  const hoursData = stats?.hoursByType.map((h) => ({
    name: h.task_type,
    value: parseFloat(h.total_hours),
  })) || [];

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

        {/* Summary cards */}
        {stats && (
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <p className="text-2xl font-bold">{stats.summary.totalSubmitted}</p>
              <p className="text-xs text-gray-500">Submitted</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <p className="text-2xl font-bold">{stats.summary.complianceRate}%</p>
              <p className="text-xs text-gray-500">Compliance Rate</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <p className="text-2xl font-bold">{stats.summary.needsCorrectionCount}</p>
              <p className="text-xs text-gray-500">Needs Correction</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <p className="text-2xl font-bold">{stats.summary.openBlockersCount}</p>
              <p className="text-xs text-gray-500">Open Blockers</p>
            </div>
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-semibold mb-2">Workload by Project</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={workloadData}>
                <XAxis dataKey="name" fontSize={12} />
                <YAxis allowDecimals={false} fontSize={12} />
                <Tooltip />
                <Bar dataKey="reports" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-semibold mb-2">Hours by Task Type</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={hoursData} dataKey="value" nameKey="name" outerRadius={70} label>
                  {hoursData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

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