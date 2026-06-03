const express = require('express');
const router = express.Router();
const BankAccount = require('../models/BankAccount');

// Get all bank accounts for user
router.get('/', async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    const accounts = await BankAccount.find({ userId }).select('-accountNumber -routingNumber -cardNumber');
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single account
router.get('/:id', async (req, res) => {
  try {
    const account = await BankAccount.findById(req.params.id)
      .select('-accountNumber -routingNumber -cardNumber');
    if (!account) return res.status(404).json({ error: 'Account not found' });
    res.json(account);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Link bank account
router.post('/', async (req, res) => {
  try {
    const { accountName, accountType, bankName, accountNumber, routingNumber } = req.body;
    const userId = req.headers['user-id'];

    const account = new BankAccount({
      userId,
      accountName,
      accountType: 'bank',
      bankName,
      accountNumber,
      routingNumber,
      accountSubType: accountType
    });

    await account.save();
    res.status(201).json(account);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Link debit/credit card
router.post('/cards', async (req, res) => {
  try {
    const { accountName, cardType, cardNumber, expiryDate } = req.body;
    const userId = req.headers['user-id'];

    const account = new BankAccount({
      userId,
      accountName,
      accountType: 'card',
      cardType,
      cardNumber,
      expiryDate
    });

    await account.save();
    res.status(201).json(account);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update account
router.put('/:id', async (req, res) => {
  try {
    const account = await BankAccount.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select('-accountNumber -routingNumber -cardNumber');
    if (!account) return res.status(404).json({ error: 'Account not found' });
    res.json(account);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete account
router.delete('/:id', async (req, res) => {
  try {
    const account = await BankAccount.findByIdAndDelete(req.params.id);
    if (!account) return res.status(404).json({ error: 'Account not found' });
    res.json({ message: 'Account deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
