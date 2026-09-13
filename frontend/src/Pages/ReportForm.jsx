import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getProjects, createReport, getReportById, updateReport } from '../api/reports';
import { CalendarDays, ListChecks, AlertTriangle, Trophy, ListTodo, Clock, StickyNote, Plus, Trash2 } from 'lucide-react';

function SectionCard({ icon: Icon, title, subtitle, tint, children, onAdd, addLabel }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${tint}`}>
            <Icon size={17} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
            {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
          </div>
        </div>
        {onAdd && (
          <button type="button" onClick={onAdd} className="flex items-center gap-1 text-xs font-medium bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700">
            <Plus size={13} /> {addLabel}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function ReportForm() {
  const navigate = useNavigate();
  const { id } = useParams();

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
    const payload = { project_id: projectId, week_start: weekStart, week_end: weekEnd, notes, tasks, blockers, achievements, nextWeekTasks, hoursByType };
    try {
      if (id) {
        await updateReport(id, payload);
        navigate(`/report/${id}`);
      } else {
        await createReport(payload);
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Could not save report');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{id ? 'Edit Report' : 'New Weekly Report'}</h1>
          <p className="text-sm text-gray-500 mt-1">Fill in your work for the week, section by section</p>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSave} className="space-y-4">

          <SectionCard icon={CalendarDays} title="Week & Project" tint="bg-blue-50 text-blue-600">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <label className="block text-xs text-gray-500 mb-1">Project</label>
                <select value={projectId} onChange={(e) => setProjectId(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" required>
                  <option value="">Select...</option>
                  {projects.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Week Start</label>
                <input type="date" value={weekStart} onChange={(e) => setWeekStart(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" required />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Week End</label>
                <input type="date" value={weekEnd} onChange={(e) => setWeekEnd(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" required />
              </div>
            </div>
          </SectionCard>

          <SectionCard icon={ListChecks} title="Tasks Completed" subtitle={`${tasks.length} task${tasks.length !== 1 ? 's' : ''}`} tint="bg-indigo-50 text-indigo-600" onAdd={addTask} addLabel="Add Task">
            {tasks.length === 0 && <p className="text-sm text-gray-400">No tasks added yet.</p>}
            <div className="space-y-3">
              {tasks.map((task, index) => (
                <div key={index} className="border border-gray-100 rounded-lg p-3 bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-gray-500">Task {index + 1}</span>
                    <button type="button" onClick={() => removeTask(index)} className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                  </div>
                  <input type="text" placeholder="Task name" value={task.task_name} onChange={(e) => updateTask(index, 'task_name', e.target.value)} className="w-full border border-gray-200 rounded-lg px-2 py-1.5 mb-2 text-sm bg-white" required />
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <select value={task.priority} onChange={(e) => updateTask(index, 'priority', e.target.value)} className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-white">
                      <option value="low">Low priority</option><option value="medium">Medium priority</option><option value="high">High priority</option>
                    </select>
                    <select value={task.status} onChange={(e) => updateTask(index, 'status', e.target.value)} className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-white">
                      <option value="not_started">Not Started</option><option value="in_progress">In Progress</option><option value="done">Done</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    <div><label className="text-xs text-gray-400">Planned %</label><input type="number" value={task.planned_percent} onChange={(e) => updateTask(index, 'planned_percent', e.target.value)} className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-white" /></div>
                    <div><label className="text-xs text-gray-400">Actual %</label><input type="number" value={task.actual_percent} onChange={(e) => updateTask(index, 'actual_percent', e.target.value)} className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-white" /></div>
                    <div><label className="text-xs text-gray-400">Hrs Planned</label><input type="number" value={task.time_planned_hours} onChange={(e) => updateTask(index, 'time_planned_hours', e.target.value)} className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-white" /></div>
                    <div><label className="text-xs text-gray-400">Hrs Spent</label><input type="number" value={task.time_spent_hours} onChange={(e) => updateTask(index, 'time_spent_hours', e.target.value)} className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-white" /></div>
                  </div>
                  <input type="text" placeholder="Output / deliverable" value={task.output} onChange={(e) => updateTask(index, 'output', e.target.value)} className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-white" />
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard icon={AlertTriangle} title="Blockers / Challenges" tint="bg-red-50 text-red-600" onAdd={addBlocker} addLabel="Add">
            {blockers.length === 0 && <p className="text-sm text-gray-400">No blockers added.</p>}
            <div className="space-y-2">
              {blockers.map((b, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input type="text" placeholder="Describe the blocker" value={b.description} onChange={(e) => updateBlocker(index, 'description', e.target.value)} className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                  <label className="text-xs flex items-center gap-1 text-gray-500 whitespace-nowrap">
                    <input type="checkbox" checked={b.is_key} onChange={(e) => updateBlocker(index, 'is_key', e.target.checked)} /> Key
                  </label>
                  <button type="button" onClick={() => removeBlocker(index)} className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard icon={Trophy} title="Achievements / Highlights" tint="bg-amber-50 text-amber-600" onAdd={addAchievement} addLabel="Add">
            {achievements.length === 0 && <p className="text-sm text-gray-400">No achievements added.</p>}
            <div className="space-y-2">
              {achievements.map((a, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input type="text" placeholder="Describe the achievement" value={a.description} onChange={(e) => updateAchievement(index, 'description', e.target.value)} className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                  <label className="text-xs flex items-center gap-1 text-gray-500 whitespace-nowrap">
                    <input type="checkbox" checked={a.is_key} onChange={(e) => updateAchievement(index, 'is_key', e.target.checked)} /> Key
                  </label>
                  <button type="button" onClick={() => removeAchievement(index)} className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard icon={ListTodo} title="Next Week's Plan" tint="bg-purple-50 text-purple-600" onAdd={addNextWeekTask} addLabel="Add">
            {nextWeekTasks.length === 0 && <p className="text-sm text-gray-400">No planned tasks added.</p>}
            <div className="space-y-2">
              {nextWeekTasks.map((t, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input type="text" placeholder="Planned task" value={t} onChange={(e) => updateNextWeekTask(index, e.target.value)} className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                  <button type="button" onClick={() => removeNextWeekTask(index)} className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard icon={Clock} title="Hours by Task Type" subtitle="Optional" tint="bg-cyan-50 text-cyan-600" onAdd={addHoursByType} addLabel="Add">
            {hoursByType.length === 0 && <p className="text-sm text-gray-400">No hours breakdown added.</p>}
            <div className="space-y-2">
              {hoursByType.map((h, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input type="text" placeholder="e.g. Development, Testing" value={h.task_type} onChange={(e) => updateHoursByType(index, 'task_type', e.target.value)} className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                  <input type="number" placeholder="Hours" value={h.hours} onChange={(e) => updateHoursByType(index, 'hours', e.target.value)} className="w-24 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                  <button type="button" onClick={() => removeHoursByType(index)} className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard icon={StickyNote} title="Notes" subtitle="Optional" tint="bg-gray-100 text-gray-500">
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" rows={3} placeholder="Any additional notes or links..." />
          </SectionCard>

          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition">
            {id ? 'Save Changes' : 'Save as Draft'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReportForm;