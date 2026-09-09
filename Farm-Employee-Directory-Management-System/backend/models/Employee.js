const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  employeeId: { type: String, unique: true },
  department: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  phoneNumber: { type: String, required: true },
  localAddress: { type: String, required: true },
  permanentAddress: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
