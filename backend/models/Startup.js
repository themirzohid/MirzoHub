const mongoose = require('mongoose');
const { Schema } = mongoose;

// Diqqat: bu mavjud Startup modelingizning to'liq varianti - faqat
// teamMembers[].role maydoni YANGI. Qolgan maydonlar frontend
// kontraktiga mos qilib tiklangan; haqiqiy sxemangizga moslashtiring.

const requiredRoleSchema = new Schema(
  {
    category: { type: String, required: true },
    level: { type: String, enum: ['Junior', 'Senior'], required: true },
    slots: { type: Number, default: 1 },
  },
  { _id: false }
);

const teamMemberSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['admin', 'member'], default: 'member' }, // YANGI
    joinedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const meetingSchema = new Schema({
  title: { type: String, required: true },
  platform: { type: String, enum: ['zoom', 'google_meet', 'other'], required: true },
  url: { type: String, required: true },
  scheduledAt: { type: Date, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

const startupSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    industry: { type: String },
    tags: [{ type: String }],
    stage: { type: String, enum: ['Idea', 'MVP', 'Growth', 'Launched'], default: 'Idea' },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    requiredRoles: [requiredRoleSchema],
    teamMembers: [teamMemberSchema],
    meetings: [meetingSchema], // YANGI
    telegramChatId: { type: String }, // YANGI - shoshilinch ogohlantirishlar shu chatga yuboriladi
  },
  { timestamps: true }
);

module.exports = mongoose.models.Startup || mongoose.model('Startup', startupSchema);
