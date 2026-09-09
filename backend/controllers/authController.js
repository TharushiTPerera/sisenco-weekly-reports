// This file handles what happens when someone registers or logs in.

const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;

    // Turn the plain password into a scrambled hash — we never store real passwords
    const password_hash = await bcrypt.hash(password, 10);

    // Create the user in the database
    const newUser = await User.create({
      name,
      email,
      password_hash,
      role,
    });

    res.json({ message: 'User created!', userId: newUser.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { register };