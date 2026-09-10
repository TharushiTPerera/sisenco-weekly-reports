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
const jwt = require('jsonwebtoken');

async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Check if the password matches the stored hash
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Create a token that proves this user is logged in
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
module.exports = { register, login };