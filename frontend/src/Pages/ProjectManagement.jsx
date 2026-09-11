import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getProjects, createProject, updateProject, deleteProject } from '../api/projects';

function ProjectManagement() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null); // if set, we're editing this project
  const [error, setError] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  function loadProjects() {
    getProjects().then(setProjects).catch(() => setError('Could not load projects'));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editingId) {
        await updateProject(editingId, name, description);
      } else {
        await createProject(name, description);
      }
      setName('');
      setDescription('');
      setEditingId(null);
      loadProjects();
    } catch (err) {
      setError('Could not save project');
    }
  }

  function startEdit(project) {
    setEditingId(project.id);
    setName(project.name);
    setDescription(project.description || '');
  }

  function cancelEdit() {
    setEditingId(null);
    setName('');
    setDescription('');
  }

  async function handleDelete(id) {
    if (!confirm('Delete this project?')) return;
    try {
      await deleteProject(id);
      loadProjects();
    } catch (err) {
      setError('Could not delete project');
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-2xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Manage Projects</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow mb-6 space-y-3">
          <h2 className="font-semibold">{editingId ? 'Edit Project' : 'Add New Project'}</h2>
          <input
            type="text"
            placeholder="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
            required
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          />
          <div className="flex gap-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
              {editingId ? 'Save Changes' : 'Add Project'}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} className="bg-gray-300 px-4 py-2 rounded text-sm hover:bg-gray-400">
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="space-y-2">
          {projects.map((p) => (
            <div key={p.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
              <div>
                <p className="font-medium">{p.name}</p>
                {p.description && <p className="text-sm text-gray-500">{p.description}</p>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(p)} className="text-sm text-blue-600 hover:underline">Edit</button>
                <button onClick={() => handleDelete(p.id)} className="text-sm text-red-600 hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProjectManagement;