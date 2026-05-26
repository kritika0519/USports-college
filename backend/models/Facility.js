const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sport: { type: String, required: true, trim: true },
    quantity: { type: Number, default: 1, min: 1 },
    college: { type: String, default: 'college_001' },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

facilitySchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
  }
});

module.exports = mongoose.model('Facility', facilitySchema);
