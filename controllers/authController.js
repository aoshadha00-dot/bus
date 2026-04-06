const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_SECRET = process.env.JWT_SECRET || 'mysecretkey';

const normalizeUserResponse = (user) => {
  return {
    _id: user._id,
    id: user._id,
    name: user.name || '',
    email: user.email || '',
    role: user.role || 'passenger',
    assignedBusId: user.assignedBusId || '',
    assignedBus: user.assignedBusId || '',
    photoUrl: user.photoUrl || '',
  };
};

const makeToken = (user) => {
  return jwt.sign(
    {
      id: user._id.toString(),
      role: user.role || 'passenger',
      email: user.email || '',
    },
    JWT_SECRET,
    {
      expiresIn: '7d',
    }
  );
};

const signup = async (req, res) => {
  try {
    const { name, email, password, role, assignedBusId } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Name, email and password are required',
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedRole = String(role || 'passenger').trim().toLowerCase();
    const normalizedAssignedBusId = String(assignedBusId || '').trim();

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({
        message: 'Email already exists',
      });
    }

    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      password: String(password),
      role: normalizedRole,
      assignedBusId: normalizedAssignedBusId,
      photoUrl: '',
    });

    const token = makeToken(user);

    return res.status(201).json({
      message: 'Signup successful',
      token,
      role: user.role,
      user: normalizeUserResponse(user),
    });
  } catch (error) {
    console.log('SIGNUP ERROR:', error);
    return res.status(500).json({
      message: 'Signup failed',
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    console.log('========== LOGIN DEBUG START ==========');
    console.log('REQ BODY:', req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      console.log('LOGIN ERROR: email or password missing');
      return res.status(400).json({
        message: 'Email and password are required',
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedPassword = String(password);

    console.log('NORMALIZED EMAIL:', normalizedEmail);
    console.log('PASSWORD LENGTH:', normalizedPassword.length);

    const user = await User.findOne({ email: normalizedEmail });

    console.log('FOUND USER:', user);

    if (!user) {
      console.log('LOGIN ERROR: user not found');
      return res.status(400).json({
        message: 'Invalid credentials',
      });
    }

    console.log('DB PASSWORD:', user.password);
    console.log('INPUT PASSWORD:', normalizedPassword);

    if (String(user.password) !== normalizedPassword) {
      console.log('LOGIN ERROR: password mismatch');
      return res.status(400).json({
        message: 'Invalid credentials',
      });
    }

    const token = makeToken(user);

    console.log('LOGIN SUCCESS USER ID:', user._id.toString());
    console.log('LOGIN SUCCESS ROLE:', user.role);
    console.log('========== LOGIN DEBUG END ==========');

    return res.json({
      message: 'Login successful',
      token,
      role: user.role,
      user: normalizeUserResponse(user),
    });
  } catch (error) {
    console.log('LOGIN ERROR:', error);
    return res.status(500).json({
      message: 'Login failed',
      error: error.message,
    });
  }
};
const socialLogin = async (req, res) => {
  try {
    const { provider, email, name, photoUrl } = req.body;

    if (!provider || !email || !name) {
      return res.status(400).json({
        message: 'Provider, email and name are required',
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      user = await User.create({
        name: String(name).trim(),
        email: normalizedEmail,
        password: '',
        role: 'passenger',
        assignedBusId: '',
        photoUrl: String(photoUrl || ''),
      });
    } else {
      let changed = false;

      if (!user.name && name) {
        user.name = String(name).trim();
        changed = true;
      }

      if (!user.photoUrl && photoUrl) {
        user.photoUrl = String(photoUrl);
        changed = true;
      }

      if (changed) {
        await user.save();
      }
    }

    const token = makeToken(user);

    return res.json({
      message: 'Social login successful',
      token,
      role: user.role,
      user: normalizeUserResponse(user),
    });
  } catch (error) {
    console.log('SOCIAL LOGIN ERROR:', error);
    return res.status(500).json({
      message: 'Social login failed',
      error: error.message,
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    return res.json(normalizeUserResponse(user));
  } catch (error) {
    console.log('GET PROFILE ERROR:', error);
    return res.status(500).json({
      message: 'Failed to load profile',
      error: error.message,
    });
  }
};

module.exports = {
  signup,
  login,
  socialLogin,
  getProfile,
};