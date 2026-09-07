import Student from "../models/Student.js";

// @desc    Get all students
// @route   GET /api/students
// @access  Public
export const getStudents = async (req, res) => {
  try {
    const students = await Student.find({}).sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ message: "Server error fetching students" });
  }
};

// @desc    Create a new student
// @route   POST /api/students
// @access  Public
export const createStudent = async (req, res) => {
  try {
    const { name, rollNumber, department, semester, cgpa, photo } = req.body;

    const newStudent = new Student({
      name,
      rollNumber,
      department,
      semester,
      cgpa,
      photo,
    });

    const savedStudent = await newStudent.save();
    res.status(201).json(savedStudent);
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.rollNumber) {
      return res.status(400).json({
        message: "Student data already exists!",
        errorType: "DUPLICATE_ROLL_NUMBER",
      });
    }
    console.error("Create error:", error);
    res.status(500).json({ message: "Server error creating student" });
  }
};

// @desc    Update a student
// @route   PUT /api/students/:id
// @access  Public
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedStudent = await Student.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(updatedStudent);
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.rollNumber) {
      return res.status(400).json({
        message: "Student data already exists!",
        errorType: "DUPLICATE_ROLL_NUMBER",
      });
    }
    console.error("Update error:", error);
    res.status(500).json({ message: "Server error updating student" });
  }
};

// @desc    Delete a student
// @route   DELETE /api/students/:id
// @access  Public
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Student deleted successfully", id });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Server error deleting student" });
  }
};
