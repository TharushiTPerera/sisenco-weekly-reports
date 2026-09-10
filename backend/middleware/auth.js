// This function runs before certain routes, and checks:
// "does this request have a valid login token?"
// If yes, it figures out who the user is and attaches it to the request.
// If no, it blocks the request.

const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  // The frontend sends the token in a header like: "Authorization: Bearer eyJhbGc..."
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; // "Bearer TOKEN" -> just TOKEN

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // now every route after this can use req.user.id and req.user.role
    next(); // move on to the actual route
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = requireAuth;