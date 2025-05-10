
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/beverage-shop', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

// Define routes
app.get('/', (req, res) => {
  res.send('Express server is running');
});

// Products API routes
const productsRouter = require('./server/routes/products');
app.use('/api/products', productsRouter);

// Users API routes
const usersRouter = require('./server/routes/users');
app.use('/api/users', usersRouter);

// Contacts API routes
const contactsRouter = require('./server/routes/contacts');
app.use('/api/contacts', contactsRouter);

// Newsletters API routes
const newslettersRouter = require('./server/routes/newsletters');
app.use('/api/newsletters', newslettersRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
