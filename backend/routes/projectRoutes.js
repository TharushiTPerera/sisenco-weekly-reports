const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth');
const requireManager = require('../middleware/requireManager');
const { getProjects, createProject, updateProject, deleteProject } = require('../controllers/projectController');

// Anyone logged in can view the list (they need it to tag their reports)
router.get('/', requireAuth, getProjects);

// Only managers can add/edit/delete
router.post('/', requireAuth, requireManager, createProject);
router.put('/:id', requireAuth, requireManager, updateProject);
router.delete('/:id', requireAuth, requireManager, deleteProject);

module.exports = router;