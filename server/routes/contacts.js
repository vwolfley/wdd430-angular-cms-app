const express = require('express');
const router = express.Router();

const sequenceGenerator = require('./sequenceGenerator');
const Contact = require('../models/contact');

// GET all contacts
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().populate('group');
    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).json({
      message: 'An error occurred while fetching contacts.',
      error: err,
    });
  }
});

// POST a new contact
router.post('/', async (req, res) => {
  try {
    const maxContactId = await sequenceGenerator.nextId('contacts');

    const contact = new Contact({
      id: maxContactId,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      imageUrl: req.body.imageUrl,
      group: req.body.group,
    });

    const createdContact = await contact.save();

    res.status(201).json({
      message: 'Contact added successfully',
      contact: createdContact,
    });
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred',
      error,
    });
  }
});

// PUT update a contact
router.put('/:id', async (req, res) => {
  try {
    const contact = await Contact.findOne({ id: req.params.id });

    if (!contact) {
      return res.status(404).json({
        message: 'Contact not found.',
        error: { contact: 'Contact not found' },
      });
    }

    // Update fields
    contact.name = req.body.name;
    contact.email = req.body.email;
    contact.phone = req.body.phone;
    contact.imageUrl = req.body.imageUrl;
    contact.group = req.body.group;

    await Contact.updateOne({ id: req.params.id }, contact);

    res.status(204).json({
      message: 'Contact updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred',
      error,
    });
  }
});

// DELETE a contact
router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findOne({ id: req.params.id });

    if (!contact) {
      return res.status(404).json({
        message: 'Contact not found.',
        error: { contact: 'Contact not found' },
      });
    }

    await Contact.deleteOne({ id: req.params.id });

    res.status(204).json({
      message: 'Contact deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred',
      error,
    });
  }
});

module.exports = router;
