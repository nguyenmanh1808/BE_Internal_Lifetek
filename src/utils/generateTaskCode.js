const Counter = require("../models/counter.model.js");

async function getNextTaskCode(projectId) {
  const counter = await Counter.findOneAndUpdate(
    { name: projectId.toString() },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const taskNumber = String(counter.seq).padStart(3, "0");
  return `${taskNumber}`;
}

module.exports = getNextTaskCode;
