const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');
const Transaction = require('../models/Transaction');

// Get all goals for user
router.get('/', async (req, res) => {
  try {
    const userId = req.headers['user-id']; // In production, use auth middleware
    const goals = await Goal.find({ userId }).populate('linkedAccount');
    res.json(goals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single goal
router.get('/:id', async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id)
      .populate('linkedAccount')
      .populate('transactions');
    if (!goal) return res.status(404).json({ error: 'Goal not found' });
    res.json(goal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create goal
router.post('/', async (req, res) => {
  try {
    const { name, description, target, category } = req.body;
    const userId = req.headers['user-id'];

    const goal = new Goal({
      userId,
      name,
      description,
      target,
      category
    });

    await goal.save();
    res.status(201).json(goal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update goal
router.put('/:id', async (req, res) => {
  try {
    const goal = await Goal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!goal) return res.status(404).json({ error: 'Goal not found' });
    res.json(goal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete goal
router.delete('/:id', async (req, res) => {
  try {
    const goal = await Goal.findByIdAndDelete(req.params.id);
    if (!goal) return res.status(404).json({ error: 'Goal not found' });
    res.json({ message: 'Goal deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Deposit to goal
router.post('/:id/deposit', async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.headers['user-id'];

    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be positive' });
    }

    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ error: 'Goal not found' });

    // Create transaction
    const transaction = new Transaction({
      goalId: goal._id,
      userId,
      type: 'deposit',
      amount,
      status: 'completed'
    });
    await transaction.save();

    // Update goal
    goal.accumulated += amount;
    goal.transactions.push(transaction._id);
    await goal.save();

    res.json({ goal, transaction });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Withdraw from goal
router.post('/:id/withdraw', async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.headers['user-id'];

    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be positive' });
    }

    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ error: 'Goal not found' });

    if (goal.accumulated < amount) {
      return res.status(400).json({ error: 'Insufficient funds' });
    }

    // Create transaction
    const transaction = new Transaction({
      goalId: goal._id,
      userId,
      type: 'withdrawal',
      amount,
      status: 'completed'
    });
    await transaction.save();

    // Update goal
    goal.accumulated -= amount;
    goal.transactions.push(transaction._id);
    await goal.save();

    res.json({ goal, transaction });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
