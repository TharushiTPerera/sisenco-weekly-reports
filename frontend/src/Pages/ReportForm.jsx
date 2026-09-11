import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getProjects, createReport, getReportById, updateReport } from '../api/reports';

function ReportForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // if this exists, we're editing an existing report

  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState('');
  const [weekStart, setWeekStart] = useState('');
  const [weekEnd, setWeekEnd] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const [tasks, setTasks] = useState([]);
  const [blockers, setBlockers] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [nextWeekTasks, setNextWeekTasks] = useState([]);
  const [hoursByType, setHoursByType] = useState([]);

  useEffect(() => {
    getProjects().then(setProjects).catch(() => setError('Could not load projects'));

    // If editing, load the existing report and pre-fill everything
    if (id) {
      getReportById(id).then((report) => {
        setProjectId(report.project_id);
        setWeekStart(report.week_start);
        setWeekEnd(report.week_end);
        setNotes(report.notes || '');
        setTasks(report.Tasks || []);
        setBlockers(report.Blockers || []);
        setAchievements(report.Achievements || []);
        setNextWeekTasks((report.NextWeekTasks || []).map((n) => n.description));
        setHoursByType(report.HoursByTypes || []);
      }).catch(() => setError('Could not load report'));
    }
  }, [id]);

  function addTask() {
    setTasks([...tasks, { task_name: '', priority: 'medium', planned_percent: 0, actual_percent: 0, status: 'not_started', time_planned_hours: 0, time_spent_hours: 0, output: '' }]);
  }
  function updateTask(index, field, value) {
    const updated = [...tasks];
    updated[index][field] = value;
    setTasks(updated);
  }
  function removeTask(index) {
    setTasks(tasks.filter((_, i) => i !== index));
  }

  function addBlocker() {
    setBlockers([...blockers, { description: '', is_key: false }]);
  }
  function updateBlocker(index, field, value) {
    const updated = [...blockers];
    updated[index][field] = value;
    setBlockers(updated);
  }
  function removeBlocker(index) {
    setBlockers(blockers.filter((_, i) => i !== index));
  }

  function addAchievement() {
    setAchievements([...achievements, { description: '', is_key: false }]);
  }
  function updateAchievement(index, field, value) {
    const updated = [...achievements];
    updated[index][field] = value;
    setAchievements(updated);
  }
  function removeAchievement(index) {
    setAchievements(achievements.filter((_, i) => i !== index));
  }

  function addNextWeekTask() {
    setNextWeekTasks([...nextWeekTasks, '']);
  }
  function updateNextWeekTask(index, value) {
    const updated = [...nextWeekTasks];
    updated[index] = value;
    setNextWeekTasks(updated);
  }
  function removeNextWeekTask(index) {
    setNextWeekTasks(nextWeekTasks.filter((_, i) => i !== index));
  }

  function addHoursByType() {
    setHoursByType([...hoursByType, { task_type: '', hours: 0 }]);
  }
  function updateHoursByType(index, field, value) {
    const updated = [...hoursByType];
    updated[index][field] = value;
    setHoursByType(updated);
  }
  function removeHoursByType(index) {
    setHoursByType(hoursByType.filter((_, i) => i !== index));
  }

  async function handleSave(e) {
    e.preventDefault();
    const payload = {
      project_id: projectId,
      week_start: weekStart,
      week_end: weekEnd,
      notes,
      tasks,
      blockers,
      achievements,
      nextWeekTasks,
      hoursByType,
    };
    try {
      if (id) {
        await updateReport(id, payload);
        navigate(`/report/${id}`); // go back to the detail page after editing
      } else {
        await createReport(payload);
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Could not save report');
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">{id ? 'Edit Report' : 'New Weekly Report'}</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSave} className="bg-white p-6 rounded-lg shadow space-y-6">
          <div>
            <label className="block text-sm mb-1">Project</label>
            <select value={projectId} onChange={(e) => setProjectId(e.target.value)} className="w-full border rounded px-3 py-2" required>
              <option value="">Select a project</option>
              {projects.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
            </select>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm mb-1">Week Start</label>
              <input type="date" value={weekStart} onChange={(e) => setWeekStart(e.target.value)} className="w-full border rounded px-3 py-2" required />
            </div>
            <div className="flex-1">
              <label className="block text-sm mb-1">Week End</label>
              <input type="date" value={weekEnd} onChange={(e) => setWeekEnd(e.target.value)} className="w-full border rounded px-3 py-2" required />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold">Tasks Completed</label>
              <button type="button" onClick={addTask} className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">+ Add Task</button>
            </div>
            {tasks.length === 0 && <p className="text-sm text-gray-400">No tasks added yet.</p>}
            {tasks.map((task, index) => (
              <div key={index} className="border rounded p-3 mb-3 bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Task {index + 1}</span>
                  <button type="button" onClick={() => removeTask(index)} className="text-red-500 text-sm hover:underline">Remove</button>
                </div>
                <input type="text" placeholder="Task name" value={task.task_name} onChange={(e) => updateTask(index, 'task_name', e.target.value)} className="w-full border rounded px-2 py-1 mb-2 text-sm" required />
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <select value={task.priority} onChange={(e) => updateTask(index, 'priority', e.target.value)} className="border rounded px-2 py-1 text-sm">
                    <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
                  </select>
                  <select value={task.status} onChange={(e) => updateTask(index, 'status', e.target.value)} className="border rounded px-2 py-1 text-sm">
                    <option value="not_started">Not Started</option><option value="in_progress">In Progress</option><option value="done">Done</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  <div><label className="text-xs text-gray-500">Planned %</label><input type="number" value={task.planned_percent} onChange={(e) => updateTask(index, 'planned_percent', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" /></div>
                  <div><label className="text-xs text-gray-500">Actual %</label><input type="number" value={task.actual_percent} onChange={(e) => updateTask(index, 'actual_percent', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" /></div>
                  <div><label className="text-xs text-gray-500">Time Planned (hrs)</label><input type="number" value={task.time_planned_hours} onChange={(e) => updateTask(index, 'time_planned_hours', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" /></div>
                  <div><label className="text-xs text-gray-500">Time Spent (hrs)</label><input type="number" value={task.time_spent_hours} onChange={(e) => updateTask(index, 'time_spent_hours', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" /></div>
                </div>
                <input type="text" placeholder="Output / deliverable" value={task.output} onChange={(e) => updateTask(index, 'output', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" />
              </div>
            ))}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold">Blockers / Challenges</label>
              <button type="button" onClick={addBlocker} className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">+ Add Blocker</button>
            </div>
            {blockers.length === 0 && <p className="text-sm text-gray-400">No blockers added.</p>}
            {blockers.map((b, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input type="text" placeholder="Describe the blocker" value={b.description} onChange={(e) => updateBlocker(index, 'description', e.target.value)} className="flex-1 border rounded px-2 py-1 text-sm" />
                <label className="text-xs flex items-center gap-1">
                  <input type="checkbox" checked={b.is_key} onChange={(e) => updateBlocker(index, 'is_key', e.target.checked)} />
                  Key issue
                </label>
                <button type="button" onClick={() => removeBlocker(index)} className="text-red-500 text-sm hover:underline">Remove</button>
              </div>
            ))}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold">Achievements / Highlights</label>
              <button type="button" onClick={addAchievement} className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">+ Add Achievement</button>
            </div>
            {achievements.length === 0 && <p className="text-sm text-gray-400">No achievements added.</p>}
            {achievements.map((a, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input type="text" placeholder="Describe the achievement" value={a.description} onChange={(e) => updateAchievement(index, 'description', e.target.value)} className="flex-1 border rounded px-2 py-1 text-sm" />
                <label className="text-xs flex items-center gap-1">
                  <input type="checkbox" checked={a.is_key} onChange={(e) => updateAchievement(index, 'is_key', e.target.checked)} />
                  Key achievement
                </label>
                <button type="button" onClick={() => removeAchievement(index)} className="text-red-500 text-sm hover:underline">Remove</button>
              </div>
            ))}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold">Tasks Planned for Next Week</label>
              <button type="button" onClick={addNextWeekTask} className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">+ Add Task</button>
            </div>
            {nextWeekTasks.length === 0 && <p className="text-sm text-gray-400">No planned tasks added.</p>}
            {nextWeekTasks.map((t, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input type="text" placeholder="Planned task" value={t} onChange={(e) => updateNextWeekTask(index, e.target.value)} className="flex-1 border rounded px-2 py-1 text-sm" />
                <button type="button" onClick={() => removeNextWeekTask(index)} className="text-red-500 text-sm hover:underline">Remove</button>
              </div>
            ))}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold">Hours by Task Type (optional)</label>
              <button type="button" onClick={addHoursByType} className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">+ Add</button>
            </div>
            {hoursByType.length === 0 && <p className="text-sm text-gray-400">No hours breakdown added.</p>}
            {hoursByType.map((h, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input type="text" placeholder="e.g. Development, Testing, Meetings" value={h.task_type} onChange={(e) => updateHoursByType(index, 'task_type', e.target.value)} className="flex-1 border rounded px-2 py-1 text-sm" />
                <input type="number" placeholder="Hours" value={h.hours} onChange={(e) => updateHoursByType(index, 'hours', e.target.value)} className="w-24 border rounded px-2 py-1 text-sm" />
                <button type="button" onClick={() => removeHoursByType(index)} className="text-red-500 text-sm hover:underline">Remove</button>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm mb-1">Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full border rounded px-3 py-2" rows={3} />
          </div>

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            {id ? 'Save Changes' : 'Save as Draft'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReportForm;