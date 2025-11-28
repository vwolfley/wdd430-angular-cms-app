const express = require('express');
const router = express.Router();

const sequenceGenerator = require('./sequenceGenerator');
const Message = require('../models/message');

// GET all messages
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().populate('sender');
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({
      message: 'An error occurred while fetching messages.',
      error: err,
    });
  }
});

// POST a new message
router.post('/', async (req, res) => {
  try {
    const maxMessageId = await sequenceGenerator.nextId('messages');

    const message = new Message({
      id: maxMessageId,
      subject: req.body.subject,
      msgText: req.body.msgText,
      sender: req.body.sender,
    });

    const createdMessage = await message.save();

    res.status(201).json({
      message: 'Message added successfully',
      createdMessage,
    });
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred',
      error,
    });
  }
});

// PUT update a message
router.put('/:id', async (req, res) => {
  try {
    const message = await Message.findOne({ id: req.params.id });

    if (!message) {
      return res.status(404).json({
        message: 'Message not found.',
        error: { message: 'Message not found' },
      });
    }

    // Update fields
    message.subject = req.body.subject;
    message.msgText = req.body.msgText;
    message.sender = req.body.sender;

    await Message.updateOne({ id: req.params.id }, message);

    res.status(204).json({
      message: 'Message updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred',
      error,
    });
  }
});

// DELETE a message
router.delete('/:id', async (req, res) => {
  try {
    const message = await Message.findOne({ id: req.params.id });

    if (!message) {
      return res.status(404).json({
        message: 'Message not found.',
        error: { message: 'Message not found' },
      });
    }

    await Message.deleteOne({ id: req.params.id });

    res.status(204).json({
      message: 'Message deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred',
      error,
    });
  }
});

module.exports = router;
