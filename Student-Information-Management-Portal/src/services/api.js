const STORAGE_KEY = "studentPortal_students";

// Known default IDs to purge if previously saved in browser localStorage
const DEFAULT_IDS = new Set(["std-1", "std-2", "std-3"]);

// Helper: read students from LocalStorage
const readStudents = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const students = JSON.parse(raw);
    if (!Array.isArray(students)) {
      return [];
    }
    // Purge default seed students if they were previously stored
    const cleaned = students.filter((s) => !DEFAULT_IDS.has(s.id));
    if (cleaned.length !== students.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
    }
    return cleaned;
  } catch (error) {
    console.error("Failed to read students from LocalStorage:", error);
    return [];
  }
};

// Helper: write students to LocalStorage
const writeStudents = (students) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  } catch (error) {
    console.error("Failed to write students to LocalStorage:", error);
    throw new Error("Storage quota exceeded or storage unavailable.");
  }
};

// Generate unique identifier
const generateId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "std_" + Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
};

export const fetchStudents = async () => {
  const students = readStudents();
  // Sort by createdAt descending (newest first) to preserve original backend behavior
  return [...students].sort(
    (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  );
};

export const createStudent = async (studentData) => {
  const students = readStudents();
  const rollUpper = studentData.rollNumber.trim().toUpperCase();

  // Check for duplicate roll number
  const isDuplicate = students.some(
    (s) => s.rollNumber.toUpperCase() === rollUpper
  );

  if (isDuplicate) {
    const err = new Error("Student data already exists!");
    err.errorType = "DUPLICATE_ROLL_NUMBER";
    err.message = "Student data already exists!";
    throw err;
  }

  const now = new Date().toISOString();
  const newStudent = {
    id: generateId(),
    name: studentData.name.trim(),
    rollNumber: rollUpper,
    department: studentData.department.trim(),
    semester: Number(studentData.semester),
    cgpa: Number(studentData.cgpa),
    photo: studentData.photo || "",
    createdAt: now,
    updatedAt: now,
  };

  students.unshift(newStudent);
  writeStudents(students);

  return newStudent;
};

export const updateStudent = async (id, studentData) => {
  const students = readStudents();
  const index = students.findIndex((s) => s.id === id);

  if (index === -1) {
    throw new Error("Student not found");
  }

  const rollUpper = studentData.rollNumber
    ? studentData.rollNumber.trim().toUpperCase()
    : students[index].rollNumber.toUpperCase();

  // Check if new roll number duplicates an existing student
  const isDuplicate = students.some(
    (s) => s.id !== id && s.rollNumber.toUpperCase() === rollUpper
  );

  if (isDuplicate) {
    const err = new Error("Student data already exists!");
    err.errorType = "DUPLICATE_ROLL_NUMBER";
    err.message = "Student data already exists!";
    throw err;
  }

  const updatedStudent = {
    ...students[index],
    name: studentData.name !== undefined ? studentData.name.trim() : students[index].name,
    rollNumber: rollUpper,
    department: studentData.department !== undefined ? studentData.department.trim() : students[index].department,
    semester: studentData.semester !== undefined ? Number(studentData.semester) : students[index].semester,
    cgpa: studentData.cgpa !== undefined ? Number(studentData.cgpa) : students[index].cgpa,
    photo: studentData.photo !== undefined ? studentData.photo : students[index].photo,
    updatedAt: new Date().toISOString(),
  };

  students[index] = updatedStudent;
  writeStudents(students);

  return updatedStudent;
};

export const deleteStudent = async (id) => {
  const students = readStudents();
  const filtered = students.filter((s) => s.id !== id);

  if (filtered.length === students.length) {
    throw new Error("Student not found");
  }

  writeStudents(filtered);
  return { message: "Student deleted successfully", id };
};
