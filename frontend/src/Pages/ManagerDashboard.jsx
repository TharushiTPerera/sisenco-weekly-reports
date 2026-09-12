import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getAllReports, getDashboardStats, getProjects } from '../api/reports';
import { getAllUsers } from '../api/users';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { FileCheck2, TrendingUp, AlertCircle, ShieldAlert, Settings, Users } from 'lucide-react';

function statusColor(status) {
  if (status === 'draft') return 'bg-gray-100 text-gray-600';
  if (status === 'submitted') return 'bg-blue-100 text-blue-700';
  if (status === 'needs_correction') return 'bg-red-100 text-red-700';
  if (status === 'approved') return 'bg-green-100 text-green-700';
  return 'bg-gray-100 text-gray-600';
}

const COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b'];
const STATUS_COLORS = {
  draft: '#d1d5db',
  submitted: '#3b82f6',
  needs_correction: '#ef4444',
  approved: '#22c55e',
};

function ManagerDashboard() {
  const [reports, setReports] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [startFilter, setStartFilter] = useState('');
  const [endFilter, setEndFilter] = useState('');

  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReports();
  }, [statusFilter, userFilter, projectFilter, startFilter, endFilter]);

  useEffect(() => {
    getDashboardStats().then(setStats).catch(() => setError('Could not load stats'));
    getAllUsers().then(setUsers).catch(() => {});
    getProjects().then(setProjects).catch(() => {});
  }, []);

  function loadReports() {
    const filters = {};
    if (statusFilter) filters.status = statusFilter;
    if (userFilter) filters.user_id = userFilter;
    if (projectFilter) filters.project_id = projectFilter;
    if (startFilter) filters.week_start = startFilter;
    if (endFilter) filters.week_end = endFilter;

    getAllReports(filters)
      .then((data) => setReports(data.reports))
      .catch(() => setError('Could not load reports'));
  }

  function clearFilters() {
    setStatusFilter('');
    setUserFilter('');
    setProjectFilter('');
    setStartFilter('');
    setEndFilter('');
  }

  const workloadData = stats?.workloadByProject.map((w) => ({
    name: `Project ${w.project_id}`,
    reports: parseInt(w.count),
  })) || [];

  const hoursData = stats?.hoursByType.map((h) => ({
    name: h.task_type,
    value: parseFloat(h.total_hours),
  })) || [];

  const statusByUserMap = {};
  stats?.statusByUser.forEach((row) => {
    const userName = row.User?.name || `User ${row.user_id}`;
    if (!statusByUserMap[userName]) {
      statusByUserMap[userName] = { user: userName, draft: 0, submitted: 0, needs_correction: 0, approved: 0 };
    }
    statusByUserMap[userName][row.status] = parseInt(row.count);
  });
  const statusByUserData = Object.values(statusByUserMap);

  const summaryCards = stats ? [
    { label: 'Submitted', value: stats.summary.totalSubmitted, icon: FileCheck2, tint: 'text-blue-600 bg-blue-50' },
    { label: 'Compliance rate', value: `${stats.summary.complianceRate}%`, icon: TrendingUp, tint: 'text-green-600 bg-green-50' },
    { label: 'Needs correction', value: stats.summary.needsCorrectionCount, icon: AlertCircle, tint: 'text-red-600 bg-red-50' },
    { label: 'Open blockers', value: stats.summary.openBlockersCount, icon: ShieldAlert, tint: 'text-amber-600 bg-amber-50' },
  ] : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto p-8">

        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Team Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">An overview of your team's weekly reports</p>
          </div>
          <div className="flex gap-2">
            <Link to="/manager/projects" className="flex items-center gap-1.5 text-sm bg-white border border-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50">
              <Settings size={15} /> Projects
            </Link>
            <Link to="/manager/users" className="flex items-center gap-1.5 text-sm bg-white border border-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50">
              <Users size={15} /> Team
            </Link>
          </div>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="grid grid-cols-4 gap-4 mb-8">
          {summaryCards.map((card) => (
            <div key={card.label} className="bg-white p-5 rounded-xl border border-gray-100">
              <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg ${card.tint} mb-3`}>
                <card.icon size={18} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
            </div>
          ))}
        </div>

        <p className="text-xs font-medium text-gray-400 mb-3">TEAM INSIGHTS</p>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white p-5 rounded-xl border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-800 mb-1">Workload by project</h3>
            <p className="text-xs text-gray-400 mb-3">Number of reports logged per project</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={workloadData}>
                <XAxis dataKey="name" fontSize={12} stroke="#9ca3af" />
                <YAxis allowDecimals={false} fontSize={12} stroke="#9ca3af" />
                <Tooltip />
                <Bar dataKey="reports" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-800 mb-1">Hours by task type</h3>
            <p className="text-xs text-gray-400 mb-3">Total hours logged, team-wide</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={hoursData} dataKey="value" nameKey="name" outerRadius={70} label>
                  {hoursData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 mb-8">
          <h3 className="text-sm font-semibold text-gray-800 mb-1">Report status by team member</h3>
          <p className="text-xs text-gray-400 mb-3">Where each person's reports currently stand</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={statusByUserData}>
              <XAxis dataKey="user" fontSize={12} stroke="#9ca3af" />
              <YAxis allowDecimals={false} fontSize={12} stroke="#9ca3af" />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="draft" stackId="a" fill={STATUS_COLORS.draft} name="Draft" />
              <Bar dataKey="submitted" stackId="a" fill={STATUS_COLORS.submitted} name="Submitted" />
              <Bar dataKey="needs_correction" stackId="a" fill={STATUS_COLORS.needs_correction} name="Needs Correction" />
              <Bar dataKey="approved" stackId="a" fill={STATUS_COLORS.approved} name="Approved" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Filters */}
        <p className="text-xs font-medium text-gray-400 mb-3">ALL REPORTS</p>
        <div className="bg-white p-4 rounded-xl border border-gray-100 mb-4 flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Status</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm">
              <option value="">All</option>
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="needs_correction">Needs Correction</option>
              <option value="approved">Approved</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Team member</label>
            <select value={userFilter} onChange={(e) => setUserFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm">
              <option value="">All</option>
              {users.map((u) => (<option key={u.id} value={u.id}>{u.name}</option>))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Project</label>
            <select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm">
              <option value="">All</option>
              {projects.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Week start</label>
            <input type="date" value={startFilter} onChange={(e) => setStartFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm" />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Week end</label>
            <input type="date" value={endFilter} onChange={(e) => setEndFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm" />
          </div>

          <button onClick={clearFilters} className="text-sm text-gray-500 hover:text-gray-700 px-2 py-1.5">
            Clear
          </button>
        </div>

        {reports.length === 0 && (
          <p className="text-gray-400 text-sm bg-white p-6 rounded-xl border border-gray-100 text-center">
            No reports found for this filter.
          </p>
        )}

        <div className="space-y-2">
          {reports.map((r) => (
            <Link key={r.id} to={`/report/${r.id}`} className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 hover:border-gray-300 transition">
              <div>
                <p className="text-sm font-medium text-gray-900">{r.week_start} to {r.week_end}</p>
                <p className="text-xs text-gray-400 mt-0.5">User #{r.user_id} · Project #{r.project_id}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor(r.status)}`}>
                {r.status.replace('_', ' ')}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ManagerDashboard;