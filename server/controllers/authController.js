const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Mock Authentication Logic
    let user = null;

    if (username === 'guard' && password === 'guard') {
      user = { id: '1', name: 'Guard 1', role: 'guard' };
    } else if (username === 'admin' && password === 'admin') {
      user = { id: '2', name: 'Admin 1', role: 'admin' };
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      user,
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error during login' });
  }
};

module.exports = {
  login,
};
