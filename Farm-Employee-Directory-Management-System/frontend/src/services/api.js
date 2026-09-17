const STORAGE_KEY = 'farm_employees';
const COUNTER_KEY = 'farm_employee_counter';

const DEFAULT_EMPLOYEES = [
  {
    _id: 'emp_seed_001',
    employeeId: 'EMP001',
    name: 'John Vance',
    department: 'Agriculture',
    gender: 'Male',
    phoneNumber: '9876543210',
    localAddress: 'Green Valley Farm, Sector 4',
    permanentAddress: '12 Maple Street, Springfield',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    _id: 'emp_seed_002',
    employeeId: 'EMP002',
    name: 'Sarah Jenkins',
    department: 'Livestock',
    gender: 'Female',
    phoneNumber: '9876543211',
    localAddress: 'Dairy Barn Quarters, Room 2',
    permanentAddress: '45 Oak Lane, Riverdale',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    _id: 'emp_seed_003',
    employeeId: 'EMP003',
    name: 'Robert Martinez',
    department: 'Maintenance',
    gender: 'Male',
    phoneNumber: '9876543212',
    localAddress: 'Tractor Shed Workshop, Bay 1',
    permanentAddress: '78 Pine Road, Fairview',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    _id: 'emp_seed_004',
    employeeId: 'EMP004',
    name: 'Emily Chen',
    department: 'Administration',
    gender: 'Female',
    phoneNumber: '9876543213',
    localAddress: 'Main Farmhouse Office, Suite A',
    permanentAddress: '90 Elm Boulevard, Springfield',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

// Helper: read employees from LocalStorage with seed fallback
const getStoredEmployees = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_EMPLOYEES));
      localStorage.setItem(COUNTER_KEY, '4');
      return [...DEFAULT_EMPLOYEES];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to parse employees from LocalStorage:', err);
    return [];
  }
};

// Helper: save employees to LocalStorage
const saveStoredEmployees = (employees) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
  } catch (err) {
    console.error('Failed to save employees to LocalStorage:', err);
    throw new Error('Local storage write failed. Storage quota may be exceeded.');
  }
};

// Helper: compute next auto-increment employeeId
const getNextEmployeeId = (employees) => {
  let maxSeq = 0;
  employees.forEach((emp) => {
    if (emp.employeeId) {
      const match = emp.employeeId.match(/^EMP(\d+)$/i);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxSeq) maxSeq = num;
      }
    }
  });

  const storedCounter = parseInt(localStorage.getItem(COUNTER_KEY) || '0', 10);
  const nextSeq = Math.max(maxSeq + 1, storedCounter + 1);
  localStorage.setItem(COUNTER_KEY, nextSeq.toString());
  return `EMP${String(nextSeq).padStart(3, '0')}`;
};

/**
 * Fetch employees matching search and department criteria
 * Returns `{ data: { employees, totalCount } }` to match existing Axios response signature
 */
export const fetchEmployees = async (search = '', department = '') => {
  const allEmployees = getStoredEmployees();
  let filtered = [...allEmployees];

  if (search && search.trim()) {
    const query = search.trim().toLowerCase();
    filtered = filtered.filter(
      (emp) =>
        (emp.name && emp.name.toLowerCase().includes(query)) ||
        (emp.employeeId && emp.employeeId.toLowerCase().includes(query))
    );
  }

  if (department && department.trim()) {
    filtered = filtered.filter((emp) => emp.department === department.trim());
  }

  // Sort newest first (createdAt descending)
  filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  return {
    data: {
      employees: filtered,
      totalCount: allEmployees.length,
    },
  };
};

/**
 * Add a new employee
 * Returns `{ data: newEmployee }`
 */
export const addEmployee = async (data) => {
  const { name, department, gender, phoneNumber, localAddress, permanentAddress } = data;

  if (!name || !department || !gender || !phoneNumber || !localAddress || !permanentAddress) {
    const error = new Error('All fields are required.');
    error.response = { data: { message: 'All fields are required.' } };
    throw error;
  }

  const allEmployees = getStoredEmployees();
  const employeeId = getNextEmployeeId(allEmployees);

  const newEmployee = {
    _id: `emp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    employeeId,
    name: name.trim(),
    department: department.trim(),
    gender,
    phoneNumber: phoneNumber.trim(),
    localAddress: localAddress.trim(),
    permanentAddress: permanentAddress.trim(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  allEmployees.unshift(newEmployee);
  saveStoredEmployees(allEmployees);

  return { data: newEmployee };
};

/**
 * Edit an existing employee by ID
 * Returns `{ data: updatedEmployee }`
 */
export const editEmployee = async (id, data) => {
  const { name, department, gender, phoneNumber, localAddress, permanentAddress } = data;

  if (!name || !department || !gender || !phoneNumber || !localAddress || !permanentAddress) {
    const error = new Error('All fields are required.');
    error.response = { data: { message: 'All fields are required.' } };
    throw error;
  }

  const allEmployees = getStoredEmployees();
  const index = allEmployees.findIndex((emp) => emp._id === id);

  if (index === -1) {
    const error = new Error('Employee not found.');
    error.response = { data: { message: 'Employee not found.' } };
    throw error;
  }

  const updatedEmployee = {
    ...allEmployees[index],
    name: name.trim(),
    department: department.trim(),
    gender,
    phoneNumber: phoneNumber.trim(),
    localAddress: localAddress.trim(),
    permanentAddress: permanentAddress.trim(),
    updatedAt: new Date().toISOString(),
  };

  allEmployees[index] = updatedEmployee;
  saveStoredEmployees(allEmployees);

  return { data: updatedEmployee };
};

/**
 * Remove an employee by ID
 * Returns `{ data: { message: '...' } }`
 */
export const removeEmployee = async (id) => {
  const allEmployees = getStoredEmployees();
  const index = allEmployees.findIndex((emp) => emp._id === id);

  if (index === -1) {
    const error = new Error('Employee not found.');
    error.response = { data: { message: 'Employee not found.' } };
    throw error;
  }

  allEmployees.splice(index, 1);
  saveStoredEmployees(allEmployees);

  return { data: { message: 'Employee deleted successfully.' } };
};
