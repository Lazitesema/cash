const { body, query, validationResult } = require('express-validator');
const supabase = require('../services/supabaseClient');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all withdrawals with pagination and filtering
const getWithdrawals = async (req, res) => {
  try {
    // Validate query parameters
    await query('page').isInt({ min: 1 }).optional().run(req);
    await query('limit').isInt({ min: 1, max: 100 }).optional().run(req);
    await query('status').isIn(['pending', 'accepted', 'rejected']).optional().run(req);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from('withdrawals')
      .select(`
        *,
        user:users (
          firstName,
          lastName,
          email
        ),
        bank:banks (
          name,
          accountNumber
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false });

    // Add status filter if provided
    if (status) {
      query = query.eq('status', status);
    }

    // Add pagination
    const { data, count, error } = await query
      .range(offset, offset + limit - 1);

    if (error) throw error;

    const totalPages = Math.ceil(count / limit);
    
    res.status(200).json({
      data: data.map(withdrawal => ({
        id: withdrawal.id,
        amount: withdrawal.amount,
        status: withdrawal.status,
        date: withdrawal.created_at,
        userName: `${withdrawal.user.firstName} ${withdrawal.user.lastName}`,
        userEmail: withdrawal.user.email,
        bankName: withdrawal.bank.name,
        accountNumber: withdrawal.bank.accountNumber
      })),
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: page,
        itemsPerPage: limit
      }
    });

  } catch (error) {
    console.error('Error fetching withdrawals:', error);
    res.status(500).json({ error: 'Failed to fetch withdrawals' });
  }
};

// Update withdrawal status (approve/reject)
const updateWithdrawalStatus = async (req, res) => {
  const { withdrawalId, status, adminNote } = req.body

  try {
    // Validate request
    if (!withdrawalId || !status || (status === 'rejected' && !adminNote)) {
      return res.status(400).json({ 
        error: 'Missing required fields' 
      })
    }

    // Get withdrawal request
    const withdrawal = await prisma.withdrawal.findUnique({
      where: { id: withdrawalId },
      include: { user: true }
    })

    if (!withdrawal) {
      return res.status(404).json({ 
        error: 'Withdrawal request not found' 
      })
    }

    if (withdrawal.status !== 'pending') {
      return res.status(400).json({ 
        error: 'Can only update pending withdrawal requests' 
      })
    }

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update withdrawal status
      const updatedWithdrawal = await tx.withdrawal.update({
        where: { id: withdrawalId },
        data: { 
          status: status === 'accepted' ? 'approved' : 'rejected',
          adminNote: adminNote || null,
          processedAt: new Date()
        }
      })

      // If approved, deduct from user's balance
      if (status === 'accepted') {
        await tx.user.update({
          where: { id: withdrawal.userId },
          data: {
            balance: {
              decrement: withdrawal.amount + withdrawal.fee
            }
          }
        })

        // Create transaction record
        await tx.transaction.create({
          data: {
            userId: withdrawal.userId,
            type: 'withdrawal',
            amount: withdrawal.amount,
            fee: withdrawal.fee,
            status: 'completed',
            description: `Withdrawal to ${withdrawal.bankName} - ${withdrawal.accountNumber}`
          }
        })
      }

      return updatedWithdrawal
    })

    // Send notification to user
    await sendNotification({
      userId: withdrawal.userId,
      title: `Withdrawal ${status === 'accepted' ? 'Approved' : 'Rejected'}`,
      message: status === 'accepted' 
        ? `Your withdrawal request for $${withdrawal.amount} has been approved`
        : `Your withdrawal request for $${withdrawal.amount} has been rejected. Reason: ${adminNote}`,
      type: status === 'accepted' ? 'success' : 'error'
    })

    return res.json({ 
      message: `Withdrawal ${status === 'accepted' ? 'approved' : 'rejected'} successfully`,
      data: result
    })

  } catch (error) {
    console.error('Error updating withdrawal status:', error)
    return res.status(500).json({ 
      error: 'Failed to update withdrawal status' 
    })
  }
}

// Create new withdrawal request
const createWithdrawal = async (req, res) => {
  try {
    // Validate request body
    await body('userId').notEmpty().isUUID().withMessage('Invalid user ID').run(req);
    await body('bankId').notEmpty().isUUID().withMessage('Invalid bank ID').run(req);
    await body('amount').isFloat({ min: 1 }).withMessage('Amount must be greater than 0').run(req);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, bankId, amount } = req.body;

    // Check user exists and has sufficient balance
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('balance, withdrawalLimit')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Validate withdrawal amount against limits
    if (amount > user.withdrawalLimit) {
      return res.status(400).json({ 
        error: `Amount exceeds withdrawal limit of ${user.withdrawalLimit}` 
      });
    }

    if (amount > user.balance) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Verify bank belongs to user
    const { data: bankUser, error: bankError } = await supabase
      .from('bank_users')
      .select('*')
      .eq('user_id', userId)
      .eq('bank_id', bankId)
      .single();

    if (bankError || !bankUser) {
      return res.status(400).json({ error: 'Invalid bank selection' });
    }

    // Create withdrawal request
    const { data: withdrawal, error: createError } = await supabase
      .from('withdrawals')
      .insert([{
        user_id: userId,
        bank_id: bankId,
        amount,
        status: 'pending',
        created_at: new Date()
      }])
      .select(`
        *,
        user:users (
          firstName,
          lastName,
          email
        ),
        bank:banks (
          name,
          accountNumber
        )
      `)
      .single();

    if (createError) throw createError;

    // Format response to match frontend interface
    const response = {
      id: withdrawal.id,
      amount: withdrawal.amount,
      status: withdrawal.status,
      date: withdrawal.created_at,
      userName: `${withdrawal.user.firstName} ${withdrawal.user.lastName}`,
      userEmail: withdrawal.user.email,
      bankName: withdrawal.bank.name,
      accountNumber: withdrawal.bank.accountNumber
    };

    res.status(201).json({
      message: 'Withdrawal request created successfully',
      data: response
    });

  } catch (error) {
    console.error('Error creating withdrawal request:', error);
    res.status(500).json({ error: 'Failed to create withdrawal request' });
  }
};

// Add validation middleware
const validateWithdrawalStats = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO date'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO date'),
  query('status')
    .optional()
    .isIn(['pending', 'approved', 'rejected'])
    .withMessage('Invalid status')
]

const getWithdrawalStats = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { startDate, endDate, status } = req.query
    const dateFilter = {}

    if (startDate || endDate) {
      dateFilter.createdAt = {}
      if (startDate) dateFilter.createdAt.gte = new Date(startDate)
      if (endDate) dateFilter.createdAt.lte = new Date(endDate)
    }

    const statusFilter = status ? { status } : {}

    const stats = await prisma.$transaction([
      // Get counts and sums by status with filters
      prisma.withdrawal.groupBy({
        by: ['status'],
        where: {
          ...dateFilter,
          ...statusFilter
        },
        _count: true,
        _sum: {
          amount: true,
          fee: true
        }
      }),
      // Get daily trend
      prisma.withdrawal.groupBy({
        by: ['status', 'createdAt'],
        where: {
          ...dateFilter,
          ...statusFilter
        },
        _count: true,
        _sum: {
          amount: true,
          fee: true
        },
        orderBy: {
          createdAt: 'asc'
        }
      })
    ])

    const [statusStats, dailyTrend] = stats

    res.json({
      overall: {
        totalRequests: statusStats.reduce((sum, curr) => sum + curr._count, 0),
        totalAmount: statusStats.reduce((sum, curr) => sum + (curr._sum.amount || 0), 0),
        totalFees: statusStats.reduce((sum, curr) => sum + (curr._sum.fee || 0), 0),
        byStatus: statusStats.reduce((acc, curr) => ({
          ...acc,
          [curr.status]: {
            count: curr._count,
            amount: curr._sum.amount || 0,
            fees: curr._sum.fee || 0
          }
        }), {})
      },
      dailyTrend: dailyTrend.reduce((acc, curr) => {
        const date = curr.createdAt.toISOString().split('T')[0]
        if (!acc[date]) {
          acc[date] = {}
        }
        acc[date][curr.status] = {
          count: curr._count,
          amount: curr._sum.amount || 0,
          fees: curr._sum.fee || 0
        }
        return acc
      }, {})
    })

  } catch (error) {
    console.error('Error fetching withdrawal stats:', error)
    res.status(500).json({ error: 'Failed to fetch withdrawal statistics' })
  }
}

// Add getUserWithdrawals endpoint
const getUserWithdrawals = async (req, res) => {
  try {
    await query('page').isInt({ min: 1 }).optional().run(req)
    await query('limit').isInt({ min: 1, max: 100 }).optional().run(req)
    
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { userId } = req.params
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const offset = (page - 1) * limit

    const { data, count, error } = await supabase
      .from('withdrawals')
      .select(`
        *,
        bank:banks (
          name,
          accountNumber
        )
      `, { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    res.json({
      data: data.map(w => ({
        id: w.id,
        amount: w.amount,
        status: w.status,
        date: w.created_at,
        bankName: w.bank.name,
        accountNumber: w.bank.accountNumber,
        adminNote: w.admin_note
      })),
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        itemsPerPage: limit
      }
    })

  } catch (error) {
    console.error('Error fetching user withdrawals:', error)
    res.status(500).json({ error: 'Failed to fetch user withdrawals' })
  }
}

// Update exports
module.exports = {
  getWithdrawals,
  updateWithdrawalStatus,
  createWithdrawal,
  getWithdrawalStats,
  validateWithdrawalStats,
  getUserWithdrawals
} 