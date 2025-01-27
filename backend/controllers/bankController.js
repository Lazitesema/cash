const { body, validationResult } = require('express-validator');
const supabase = require('../services/supabaseClient');

// Get all banks
const getBanks = async (req, res) => {
  try {
    // Fetch banks with their associated users count
    const { data: banks, error } = await supabase
      .from('banks')
      .select(`
        *,
        users:bank_users (
          count
        )
      `);

    if (error) throw error;

    if (!banks || banks.length === 0) {
      return res.status(404).json({ error: 'No banks found' });
    }

    res.status(200).json({ data: banks });

  } catch (error) {
    console.error('Error fetching banks:', error);
    res.status(500).json({ error: 'Failed to fetch banks' });
  }
};

// Add new bank
const addBank = async (req, res) => {
  try {
    // Validate request body
    await body('name').notEmpty().withMessage('Bank name is required').run(req);
    await body('address').optional().isString().run(req);
    await body('accountNumber').optional().isString().run(req);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, address, accountNumber } = req.body;

    // Check for existing bank with same name
    const { data: existingBank, error: lookupError } = await supabase
      .from('banks')
      .select('name')
      .eq('name', name)
      .single();

    if (lookupError && lookupError.code !== 'PGRST116') throw lookupError;
    if (existingBank) {
      return res.status(409).json({ error: 'Bank with this name already exists' });
    }

    // Create new bank
    const { data: newBank, error: insertError } = await supabase
      .from('banks')
      .insert([{
        name,
        address,
        account_number: accountNumber,
        created_at: new Date()
      }])
      .select()
      .single();

    if (insertError) throw insertError;

    res.status(201).json({
      message: 'Bank added successfully',
      data: newBank
    });

  } catch (error) {
    console.error('Error adding bank:', error);
    res.status(500).json({ error: 'Failed to add bank' });
  }
};

// Delete bank by ID
const deleteBank = async (req, res) => {
  try {
    // Validate bank ID parameter
    await param('id').notEmpty().isUUID().withMessage('Invalid bank ID').run(req);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    // Check if bank exists
    const { data: existingBank, error: lookupError } = await supabase
      .from('banks')
      .select('id')
      .eq('id', id)
      .single();

    if (lookupError || !existingBank) {
      return res.status(404).json({ error: 'Bank not found' });
    }

    // Check if bank has associated users
    const { count, error: countError } = await supabase
      .from('bank_users')
      .select('*', { count: 'exact' })
      .eq('bank_id', id);

    if (countError) throw countError;

    if (count > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete bank with associated users' 
      });
    }

    // Delete bank
    const { error: deleteError } = await supabase
      .from('banks')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    res.status(200).json({ 
      message: 'Bank deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting bank:', error);
    res.status(500).json({ error: 'Failed to delete bank' });
  }
};

module.exports = { getBanks, addBank, deleteBank }; 