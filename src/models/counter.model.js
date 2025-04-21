const mongoose = require("mongoose");

const CounterSchema = new mongoose.Schema({
  name: { type: String, required: true }, // sẽ là projectId
  seq: { type: Number, default: 0 },
});

CounterSchema.index({ name: 1 }, { unique: true }); // bảo đảm mỗi project chỉ có 1 counter

module.exports = mongoose.model("Counter", CounterSchema);
