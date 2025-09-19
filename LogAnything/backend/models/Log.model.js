const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const logSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: { type: String },
  type: { type: String, required: true },
  mood: { type: String },
  content: { type: Schema.Types.Mixed, required: true },
  date: { type: Date, required: true },
}, {
  timestamps: true,
});

const Log = mongoose.model('Log', logSchema);
module.exports = Log;