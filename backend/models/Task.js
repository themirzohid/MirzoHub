const mongoose = require('mongoose');
const { Schema } = mongoose;

const taskSchema = new Schema(
  {
    startupId: { type: Schema.Types.ObjectId, ref: 'Startup', required: true, index: true },
    title: { type: String, required: true },
    description: { type: String },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['todo', 'in_progress', 'done'], default: 'todo' },
    priority: { type: String, enum: ['low', 'medium', 'urgent'], default: 'medium' },
    dueDate: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Task || mongoose.model('Task', taskSchema);
