// This runs AFTER requireAuth (so req.user already exists).
// It just checks: is this user a manager? If not, block them.

function requireManager(req, res, next) {
  if (req.user.role !== 'manager') {
    return res.status(403).json({ error: 'Managers only' });
  }
  next();
}

module.exports = requireManager;
