
const router = require('express').Router();
const Contact = require('../models/contact.model');

// Get all contacts
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    res.status(400).json('Error: ' + error);
  }
});

// Add new contact message
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    const newContact = new Contact({
      name,
      email,
      subject,
      message,
      read: false
    });

    const savedContact = await newContact.save();
    res.json(savedContact);
  } catch (error) {
    res.status(400).json({ message: 'Error: ' + error.message });
  }
});

// Mark contact as read
router.put('/:id/read', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    res.json(contact);
  } catch (error) {
    res.status(400).json({ message: 'Error: ' + error.message });
  }
});

// Update contact
router.put('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(contact);
  } catch (error) {
    res.status(400).json({ message: 'Error: ' + error.message });
  }
});

// Delete contact
router.delete('/:id', async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message supprimé' });
  } catch (error) {
    res.status(400).json({ message: 'Error: ' + error.message });
  }
});

module.exports = router;
