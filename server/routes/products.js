
const router = require('express').Router();
let Product = require('../models/product.model');

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Add a new product
router.post('/', async (req, res) => {
  try {
    const { name, description, price, category, image, stock, featured } = req.body;
    
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      image: image || '/placeholder.svg',
      stock: stock || 0,
      featured: featured || false
    });
    
    const savedProduct = await newProduct.save();
    res.json(savedProduct);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Get a specific product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json('Product not found');
    res.json(product);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Update a product
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json('Product not found');
    
    Object.assign(product, req.body);
    const updatedProduct = await product.save();
    
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json('Product deleted');
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

module.exports = router;
