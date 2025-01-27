const supabase = require('../services/supabaseClient');
const { body, validationResult } = require('express-validator'); // Import express-validator

// Admin login (no signup)
const loginAdmin = async (req, res) => {
  // Validate input
  await body('email').isEmail().withMessage('Invalid email format').run(req);
  await body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long').run(req);
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Log in the admin with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ error: 'Invalid credentials' }); // Generic error message
    }

    // Role-based access control
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    res.status(200).json({ message: 'Admin logged in successfully', session: data.session });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ error: 'Internal server error' });
  }
};

// User signup (sign up logic for users)
const signUpUser = async (req, res) => {
  // Validate input
  await body('email').isEmail().withMessage('Invalid email format').run(req);
  await body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long').run(req);
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Sign up the user with Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role: 'user' }, // Set role as user for sign-ups
      },
    });

    if (error) {
      return res.status(400).json({ error: 'Failed to sign up user' }); // Generic error message
    }

    res.status(201).json({ message: 'User signed up successfully', data });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ error: 'Internal server error' });
  }
};

// User login (log in logic for users)
const loginUser = async (req, res) => {
  // Validate input
  await body('email').isEmail().withMessage('Invalid email format').run(req);
  await body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long').run(req);
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Log in the user with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Role-based access control
    if (data.user.role !== 'user') {
      return res.status(403).json({ error: 'Access denied. Users only.' });
    }

    res.status(200).json({ message: 'User logged in successfully', session: data.session });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// User logout
const logoutUser = async (req, res) => {
  try {
    // Validate session token from request headers
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No session token provided' });
    }

    // Extract token from Bearer header
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Invalid authorization header format' });
    }

    // Sign out the user from Supabase
    const { error } = await supabase.auth.signOut({
      scope: 'local', // Only sign out from current device
      token: token
    });

    if (error) throw error;

    res.status(200).json({ 
      message: 'Logged out successfully' 
    });

  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ error: 'Failed to logout' });
  }
};

// Update exports
module.exports = {
  loginAdmin,
  signUpUser,
  loginUser,
  logoutUser
};
