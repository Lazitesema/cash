const { body, query, validationResult, param } = require('express-validator');
const supabase = require('../services/supabaseClient');

// Get all users with pagination
const getUsers = async (req, res) => {
  try {
    // Validate query parameters
    await query('page').isInt({ min: 1 }).optional().run(req);
    await query('limit').isInt({ min: 1, max: 100 }).optional().run(req);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Fetch users with pagination
    const { data, count, error } = await supabase
      .from('users')
      .select(`
        *,
        profile (
          role,
          status
        )
      `, { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const totalPages = Math.ceil(count / limit);
    
    res.status(200).json({
      data,
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: page,
        itemsPerPage: limit
      }
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Create new user
const addUser = async (req, res) => {
  try {
    // Validate request body
    await body('firstName').notEmpty().withMessage('First name is required').run(req);
    await body('lastName').notEmpty().withMessage('Last name is required').run(req);
    await body('email').isEmail().withMessage('Invalid email format').run(req);
    await body('balance').isFloat({ min: 0 }).withMessage('Balance must be a positive number').run(req);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, balance, withdrawalLimit, sendingLimit } = req.body;

    // Check for existing user
    const { data: existingUser, error: lookupError } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (lookupError && lookupError.code !== 'PGRST116') throw lookupError;
    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    // Create new user
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([{ 
        firstName, 
        lastName,
        email, 
        balance,
        withdrawalLimit,
        sendingLimit,
        profile: {
          role: 'user',
          status: 'pending'
        },
        created_at: new Date()
      }])
      .select()
      .single();

    if (insertError) throw insertError;

    res.status(201).json({ 
      message: 'User created successfully', 
      data: newUser 
    });

  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

// Delete user by ID
const deleteUser = async (req, res) => {
  try {
    // Validate user ID parameter
    await param('id').notEmpty().isUUID().withMessage('Invalid user ID').run(req);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    // Check if user exists
    const { data: existingUser, error: lookupError } = await supabase
      .from('users')
      .select('id')
      .eq('id', id)
      .single();

    if (lookupError || !existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete user
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    res.status(200).json({ 
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

// Update user by ID
const updateUser = async (req, res) => {
  try {
    // Validate parameters
    await param('id').notEmpty().isUUID().withMessage('Invalid user ID').run(req);
    await body('firstName').optional().notEmpty().withMessage('First name cannot be empty').run(req);
    await body('lastName').optional().notEmpty().withMessage('Last name cannot be empty').run(req);
    await body('email').optional().isEmail().withMessage('Invalid email format').run(req);
    await body('balance').optional().isFloat({ min: 0 }).withMessage('Balance must be a positive number').run(req);
    await body('withdrawalLimit').optional().isFloat({ min: 0 }).withMessage('Withdrawal limit must be a positive number').run(req);
    await body('sendingLimit').optional().isFloat({ min: 0 }).withMessage('Sending limit must be a positive number').run(req);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updateData = req.body;

    // Check if user exists
    const { data: existingUser, error: lookupError } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (lookupError || !existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // If email is being updated, check for duplicates
    if (updateData.email && updateData.email !== existingUser.email) {
      const { data: emailCheck, error: emailError } = await supabase
        .from('users')
        .select('id')
        .eq('email', updateData.email)
        .single();

      if (emailError && emailError.code !== 'PGRST116') throw emailError;
      if (emailCheck) {
        return res.status(409).json({ error: 'Email already exists' });
      }
    }

    // Prepare update data
    const updateFields = {
      ...(updateData.firstName && { firstName: updateData.firstName }),
      ...(updateData.lastName && { lastName: updateData.lastName }),
      ...(updateData.email && { email: updateData.email }),
      ...(updateData.balance && { balance: updateData.balance }),
      ...(updateData.withdrawalLimit && { withdrawalLimit: updateData.withdrawalLimit }),
      ...(updateData.sendingLimit && { sendingLimit: updateData.sendingLimit }),
      updated_at: new Date()
    };

    // Update user
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update(updateFields)
      .eq('id', id)
      .select(`
        *,
        profile (
          role,
          status
        )
      `)
      .single();

    if (updateError) throw updateError;

    res.status(200).json({
      message: 'User updated successfully',
      data: updatedUser
    });

  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};