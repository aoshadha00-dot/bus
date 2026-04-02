const { getDB } = require('../db');

const signup = async (req, res) => {
  try {
    const { name, email, password, role, assignedBusId } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const db = getDB();
    const users = db.collection('users');

    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const newUser = {
      name,
      email,
      password,
      role,
      assignedBusId: role === 'driver' ? (assignedBusId || '') : '',
      createdAt: new Date().toISOString(),
    };

    const result = await users.insertOne(newUser);

    res.json({
      message: 'Signup successful',
      user: {
        id: result.insertedId.toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        assignedBusId: newUser.assignedBusId,
      },
    });
  } catch (e) {
    res.status(500).json({ message: 'Signup failed', error: e.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const db = getDB();
    const users = db.collection('users');

    const user = await users.findOne({ email, password });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      message: 'Login successful',
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        assignedBusId: user.assignedBusId || '',
      },
    });
  } catch (e) {
    res.status(500).json({ message: 'Login failed', error: e.message });
  }
};

module.exports = {
  signup,
  login,
};