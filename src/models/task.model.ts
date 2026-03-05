import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    description: {
      type: String
    },

    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending"
    },

    dueDate: {
      type: Date
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }

  },
  { timestamps: true }
);

taskSchema.index({ owner: 1 });
taskSchema.index({ status: 1 });

export default mongoose.model("Task", taskSchema);