const mongoose = require('mongoose');

const WorkSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  service: { type: String, default: '' },
  image_path: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  edited__at: { type: Date, default: null }
});

module.exports = mongoose.model('Work', WorkSchema);
