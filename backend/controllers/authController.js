// This file handles what happens when someone registers, logs in, or is managed by an admin.

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;

    const password_hash = await bcrypt.hash(password, 10);

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

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

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

async function getAllUsers(req, res) {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role'],
    });
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function updateUserRole(req, res) {
  try {
    const { role } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (role !== 'team_member' && role !== 'manager') {
      return res.status(400).json({ error: 'Invalid role' });
    }

    user.role = role;
    await user.save();

    res.json({ message: 'Role updated', user: { id: user.id, name: user.name, role: user.role } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { register, login, getAllUsers, updateUserRole };