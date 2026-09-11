import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getReportById, submitReport } from '../api/reports';

// Little helper to color-code the status badge
function statusColor(status) {
  if (status === 'draft') return 'bg-gray-200 text-gray-700';
  if (status === 'submitted') return 'bg-blue-200 text-blue-700';
  if (status === 'needs_correction') return 'bg-red-200 text-red-700';
  if (status === 'approved') return 'bg-green-200 text-green-700';
  return 'bg-gray-200 text-gray-700';
}

function ReportDetail() {
  const { id } = useParams(); // reads the report ID from the URL, e.g. /report/3
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [error, setError] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    loadReport();
  }, [id]);

  function loadReport() {
    getReportById(id)
      .then((data) => setReport(data))
      .catch(() => setError('Could not load this report'));
  }

  async function handleSubmit() {
    try {
      await submitReport(id);
      loadReport(); // refresh to show the new status
    } catch (err) {
      setError('Could not submit report');
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <p className="p-8 text-red-500">{error}</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <p className="p-8">Loading...</p>
      </div>
    );
  }

  const isOwner = report.user_id === user?.id;
  const canEditOrSubmit = isOwner && (report.status === 'draft' || report.status === 'needs_correction');

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto p-8">
        <Link to="/dashboard" className="text-blue-600 text-sm">&larr; Back</Link>

        <div className="flex justify-between items-center mt-2 mb-6">
          <h1 className="text-2xl font-bold">
            Report: {report.week_start} to {report.week_end}
          </h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor(report.status)}`}>
            {report.status.replace('_', ' ')}
          </span>
        </div>

        {report.status === 'needs_correction' && report.latest_comment && (
          <div className="bg-red-50 border border-red-200 rounded p-4 mb-6">
            <p className="text-sm font-semibold text-red-700">Manager's feedback:</p>
            <p className="text-sm text-red-700">{report.latest_comment}</p>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow space-y-6">
          <div>
            <h2 className="font-semibold mb-2">Notes</h2>
            <p className="text-gray-700 text-sm">{report.notes || 'No notes'}</p>
          </div>

          <div>
            <h2 className="font-semibold mb-2">Tasks</h2>
            {report.Tasks?.length === 0 && <p className="text-sm text-gray-400">No tasks recorded.</p>}
            {report.Tasks?.map((t) => (
              <div key={t.id} className="border rounded p-3 mb-2 text-sm">
                <p className="font-medium">{t.task_name} <span className="text-gray-400">({t.priority} priority, {t.status})</span></p>
                <p className="text-gray-600">Planned {t.planned_percent}% / Actual {t.actual_percent}% — {t.time_spent_hours}h spent of {t.time_planned_hours}h planned</p>
                {t.output && <p className="text-gray-600">Output: {t.output}</p>}
              </div>
            ))}
          </div>

          <div>
            <h2 className="font-semibold mb-2">Blockers</h2>
            {report.Blockers?.length === 0 && <p className="text-sm text-gray-400">None.</p>}
            {report.Blockers?.map((b) => (
              <p key={b.id} className="text-sm mb-1">
                {b.is_key && <span className="text-red-600 font-semibold">[Key] </span>}
                {b.description}
              </p>
            ))}
          </div>

          <div>
            <h2 className="font-semibold mb-2">Achievements</h2>
            {report.Achievements?.length === 0 && <p className="text-sm text-gray-400">None.</p>}
            {report.Achievements?.map((a) => (
              <p key={a.id} className="text-sm mb-1">
                {a.is_key && <span className="text-green-600 font-semibold">[Key] </span>}
                {a.description}
              </p>
            ))}
          </div>

          <div>
            <h2 className="font-semibold mb-2">Next Week's Plan</h2>
            {report.NextWeekTasks?.length === 0 && <p className="text-sm text-gray-400">None.</p>}
            {report.NextWeekTasks?.map((n) => (
              <p key={n.id} className="text-sm mb-1">• {n.description}</p>
            ))}
          </div>

          <div>
            <h2 className="font-semibold mb-2">Hours by Type</h2>
            {report.HoursByTypes?.length === 0 && <p className="text-sm text-gray-400">None.</p>}
            {report.HoursByTypes?.map((h) => (
              <p key={h.id} className="text-sm mb-1">{h.task_type}: {h.hours}h</p>
            ))}
          </div>
        </div>

        {canEditOrSubmit && (
          <div className="mt-6 flex gap-3">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Submit for Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReportDetail;