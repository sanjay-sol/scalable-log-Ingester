// models/Log.js
import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  level: String,
  message: String,
  resourceId: String,
  timestamp: Date,
  traceId: String,
  spanId: String,
  commit: String,
  metadata: {
    parentResourceId: String,
  },
});

// module.exports = mongoose.model('Log', logSchema);
export default mongoose.model("Log", logSchema);