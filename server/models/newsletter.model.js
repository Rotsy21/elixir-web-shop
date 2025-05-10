
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newsletterSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
});

const Newsletter = mongoose.model('Newsletter', newsletterSchema);

module.exports = Newsletter;
