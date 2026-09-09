const Employee = require('../models/Employee');
const Counter = require('../models/Counter');

// Get next auto-increment sequence value
const getNextSequenceValue = async (sequenceName) => {
  const sequenceDocument = await Counter.findOneAndUpdate(
    { id: sequenceName },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return sequenceDocument.seq;
};

// Create a new employee
exports.createEmployee = async (req, res) => {
  try {
    const { name, department, gender, phoneNumber, localAddress, permanentAddress } = req.body;

    // Validation
    if (!name || !department || !gender || !phoneNumber || !localAddress || !permanentAddress) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const seq = await getNextSequenceValue('employeeId');
    const employeeId = `EMP${String(seq).padStart(3, '0')}`;

    const employee = new Employee({
      name,
      employeeId,
      department,
      gender,
      phoneNumber,
      localAddress,
      permanentAddress
    });

    await employee.save();
    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Server error while adding employee.' });
  }
};

// Get all employees (with optional search and department filter)
exports.getEmployees = async (req, res) => {
  try {
    const { search, department } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } }
      ];
    }

    if (department) {
      query.department = department;
    }

    const employees = await Employee.find(query).sort({ createdAt: -1 });
    const totalCount = await Employee.countDocuments();

    res.status(200).json({ employees, totalCount });
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching employees.' });
  }
};

// Get single employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found.' });
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching employee.' });
  }
};

// Update an employee
exports.updateEmployee = async (req, res) => {
  try {
    const { name, department, gender, phoneNumber, localAddress, permanentAddress } = req.body;

    if (!name || !department || !gender || !phoneNumber || !localAddress || !permanentAddress) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { name, department, gender, phoneNumber, localAddress, permanentAddress },
      { new: true, runValidators: true }
    );

    if (!employee) return res.status(404).json({ message: 'Employee not found.' });
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Server error while updating employee.' });
  }
};

// Delete an employee
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found.' });
    res.status(200).json({ message: 'Employee deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while deleting employee.' });
  }
};
