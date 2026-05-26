const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    rollNumber: { type: String, required: true, unique: true, trim: true },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    college: { type: String, default: 'college_001' },
    department: { type: String, default: '', trim: true },
    courseYear: { type: String, default: '', trim: true },
    contactNumber: { type: String, default: '', trim: true },
    sportsInterests: [{ type: String, trim: true }],
    profileImage: { type: String, default: '' }
  },
  { timestamps: true }
);

userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.password;
  }
});

module.exports = mongoose.model('User', userSchema);
