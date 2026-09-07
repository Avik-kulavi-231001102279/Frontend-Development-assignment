import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    rollNumber: {
      type: String,
      required: true,
      unique: true, // Prevents duplicates at DB level
      trim: true,
      uppercase: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    semester: {
      type: String,
      required: true,
      trim: true,
    },
    cgpa: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    photo: {
      type: String,
      default: "", // Empty string implies no photo uploaded (fallback applied on frontend)
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Transform _id to id for frontend consistency when converting to JSON
studentSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Student = mongoose.model("Student", studentSchema);

export default Student;
