// Handles adding, editing, deleting, and listing projects.

const { Project } = require('../models');

async function getProjects(req, res) {
  try {
    const projects = await Project.findAll({ order: [['name', 'ASC']] });
    res.json(projects);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function createProject(req, res) {
  try {
    const { name, description } = req.body;
    const project = await Project.create({ name, description });
    res.json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function updateProject(req, res) {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    const { name, description } = req.body;
    project.name = name;
    project.description = description;
    await project.save();
    res.json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function deleteProject(req, res) {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    await project.destroy();
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { getProjects, createProject, updateProject, deleteProject };