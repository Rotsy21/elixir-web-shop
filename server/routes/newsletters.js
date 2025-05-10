
const router = require('express').Router();
const Newsletter = require('../models/newsletter.model');

// Get all newsletter subscribers
router.get('/', async (req, res) => {
  try {
    const newsletters = await Newsletter.find();
    res.json(newsletters);
  } catch (error) {
    res.status(400).json('Error: ' + error);
  }
});

// Add new newsletter subscriber
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check if email already exists
    const existingEmail = await Newsletter.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Cette adresse email est déjà inscrite' });
    }
    
    const newNewsletter = new Newsletter({ email });
    const savedNewsletter = await newNewsletter.save();
    res.json(savedNewsletter);
  } catch (error) {
    res.status(400).json({ message: 'Error: ' + error.message });
  }
});

// Delete newsletter subscriber
router.delete('/:id', async (req, res) => {
  try {
    await Newsletter.findByIdAndDelete(req.params.id);
    res.json({ message: 'Inscription supprimée' });
  } catch (error) {
    res.status(400).json({ message: 'Error: ' + error.message });
  }
});

module.exports = router;
