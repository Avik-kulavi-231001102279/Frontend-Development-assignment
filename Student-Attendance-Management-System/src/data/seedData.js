/**
 * Attendify - Realistic Academic Seed Dataset
 * Contains:
 * - 24 Students across multiple departments, semesters, and sections (A, B, C)
 * - 6 Subjects with codes, department, semester, section, and credit units
 * - Realistic Attendance sessions across multiple dates with statuses (P, A, PL, E) and Late arrival tracking
 */

export const INITIAL_STUDENTS = [
  {
    id: 'STU001',
    name: 'Aarav Sharma',
    department: 'Computer Science',
    semester: 4,
    section: 'A',
    email: 'aarav.sharma@attendify.edu',
    status: 'Active',
  },
  {
    id: 'STU002',
    name: 'Diya Patel',
    department: 'Computer Science',
    semester: 4,
    section: 'A',
    email: 'diya.patel@attendify.edu',
    status: 'Active',
  },
  {
    id: 'STU003',
    name: 'Rohan Verma',
    department: 'Computer Science',
    semester: 4,
    section: 'A',
    email: 'rohan.verma@attendify.edu',
    status: 'Active',
  },
  {
    id: 'STU004',
    name: 'Ananya Iyer',
    department: 'Computer Science',
    semester: 4,
    section: 'A',
    email: 'ananya.iyer@attendify.edu',
    status: 'Active',
  },
  {
    id: 'STU005',
    name: 'Ishaan Mukherjee',
    department: 'Computer Science',
    semester: 4,
    section: 'B',
    email: 'ishaan.m@attendify.edu',
    status: 'Active',
  },
  {
    id: 'STU006',
    name: 'Meera Nair',
    department: 'Computer Science',
    semester: 4,
    section: 'B',
    email: 'meera.nair@attendify.edu',
    status: 'Active',
  },
  {
    id: 'STU007',
    name: 'Aditya Kulkarni',
    department: 'Computer Science',
    semester: 4,
    section: 'B',
    email: 'aditya.k@attendify.edu',
    status: 'Active',
  },
  {
    id: 'STU008',
    name: 'Pooja Reddy',
    department: 'Computer Science',
    semester: 4,
    section: 'C',
    email: 'pooja.reddy@attendify.edu',
    status: 'Active',
  },
  {
    id: 'STU009',
    name: 'Kabir Sengupta',
    department: 'Information Technology',
    semester: 6,
    section: 'A',
    email: 'kabir.s@attendify.edu',
    status: 'Active',
  },
  {
    id: 'STU010',
    name: 'Sneha Bose',
    department: 'Information Technology',
    semester: 6,
    section: 'A',
    email: 'sneha.bose@attendify.edu',
    status: 'Active',
  },
  {
    id: 'STU011',
    name: 'Vikram Joshi',
    department: 'Information Technology',
    semester: 6,
    section: 'A',
    email: 'vikram.j@attendify.edu',
    status: 'Active',
  },
  {
    id: 'STU012',
    name: 'Tanvi Chawla',
    department: 'Information Technology',
    semester: 6,
    section: 'B',
    email: 'tanvi.c@attendify.edu',
    status: 'Active',
  },
  {
    id: 'STU013',
    name: 'Arjun Das',
    department: 'Electronics',
    semester: 4,
    section: 'A',
    email: 'arjun.das@attendify.edu',
    status: 'Active',
  },
  {
    id: 'STU014',
    name: 'Riya Sen',
    department: 'Electronics',
    semester: 4,
    section: 'A',
    email: 'riya.sen@attendify.edu',
    status: 'Active',
  },
  {
    id: 'STU015',
    name: 'Kunal Kapoor',
    department: 'Electronics',
    semester: 4,
    section: 'B',
    email: 'kunal.k@attendify.edu',
    status: 'Active',
  },
  {
    id: 'STU016',
    name: 'Neha Roy',
    department: 'Electronics',
    semester: 4,
    section: 'B',
    email: 'neha.roy@attendify.edu',
    status: 'Active',
  },
  {
    id: 'STU017',
    name: 'Siddharth Rao',
    department: 'Mechanical',
    semester: 6,
    section: 'A',
    email: 'siddharth.r@attendify.edu',
    status: 'Active',
  },
  {
    id: 'STU018',
    name: 'Priyanka Menon',
    department: 'Mechanical',
    semester: 6,
    section: 'A',
    email: 'priyanka.m@attendify.edu',
    status: 'Active',
  },
  {
    id: 'STU019',
    name: 'Rahul Bhattacharya',
    department: 'Mechanical',
    semester: 6,
    section: 'B',
    email: 'rahul.b@attendify.edu',
    status: 'Active',
  },
  {
    id: 'STU020',
    name: 'Aniket Deshmukh',
    department: 'Civil',
    semester: 4,
    section: 'A',
    email: 'aniket.d@attendify.edu',
    status: 'Active',
  },
  {
    id: 'STU021',
    name: 'Shreya Ghosh',
    department: 'Civil',
    semester: 4,
    section: 'A',
    email: 'shreya.g@attendify.edu',
    status: 'Active',
  },
  {
    id: 'STU022',
    name: 'Manish Pandey',
    department: 'Computer Science',
    semester: 4,
    section: 'C',
    email: 'manish.p@attendify.edu',
    status: 'Inactive',
  },
  {
    id: 'STU023',
    name: 'Divya Nambiar',
    department: 'Information Technology',
    semester: 6,
    section: 'B',
    email: 'divya.n@attendify.edu',
    status: 'Active',
  },
  {
    id: 'STU024',
    name: 'Karan Singhania',
    department: 'Electronics',
    semester: 4,
    section: 'C',
    email: 'karan.s@attendify.edu',
    status: 'Active',
  },
];

export const INITIAL_SUBJECTS = [
  {
    id: 'SUB101',
    code: 'CS401',
    name: 'Database Management Systems',
    department: 'Computer Science',
    semester: 4,
    section: 'A',
    creditUnits: 4,
    instructor: 'Dr. Aris Thorne',
  },
  {
    id: 'SUB102',
    code: 'CS402',
    name: 'Design and Analysis of Algorithms',
    department: 'Computer Science',
    semester: 4,
    section: 'A',
    creditUnits: 4,
    instructor: 'Prof. Elena Rostova',
  },
  {
    id: 'SUB103',
    code: 'CS403',
    name: 'Operating Systems & System Programming',
    department: 'Computer Science',
    semester: 4,
    section: 'B',
    creditUnits: 3,
    instructor: 'Dr. Marcus Vance',
  },
  {
    id: 'SUB104',
    code: 'IT601',
    name: 'Cloud Computing & Distributed Systems',
    department: 'Information Technology',
    semester: 6,
    section: 'A',
    creditUnits: 4,
    instructor: 'Prof. Sarah Jenkins',
  },
  {
    id: 'SUB105',
    code: 'EC401',
    name: 'Microprocessors and Interfacing',
    department: 'Electronics',
    semester: 4,
    section: 'A',
    creditUnits: 4,
    instructor: 'Dr. Rajesh Pillai',
  },
  {
    id: 'SUB106',
    code: 'ME601',
    name: 'Thermodynamics & Heat Transfer',
    department: 'Mechanical',
    semester: 6,
    section: 'A',
    creditUnits: 3,
    instructor: 'Prof. David Miller',
  },
];

// Helper to generate seed attendance records across past dates
const generateSeedAttendance = () => {
  const records = [];
  const dates = [
    '2026-10-24',
    '2026-10-25',
    '2026-10-26',
    '2026-10-27',
    '2026-10-28',
    '2026-10-29',
    '2026-10-30',
  ];

  // Subject CS401 (Section A, CS students: STU001, STU002, STU003, STU004)
  const cs401Students = ['STU001', 'STU002', 'STU003', 'STU004'];
  const statusCycleCS401 = [
    // STU001: high attendance, one late
    ['P', 'P', 'P', 'P', 'P', 'P', 'P'],
    // STU002: low attendance (absent many times)
    ['A', 'A', 'P', 'A', 'A', 'P', 'A'],
    // STU003: has Internship Placement (PL) and engagement (E)
    ['P', 'PL', 'PL', 'E', 'P', 'P', 'P'],
    // STU004: moderate attendance
    ['P', 'A', 'P', 'A', 'P', 'P', 'A'],
  ];

  dates.forEach((date, dateIdx) => {
    cs401Students.forEach((stuId, stuIdx) => {
      const status = statusCycleCS401[stuIdx][dateIdx] || 'P';
      const isLate = stuId === 'STU001' && dateIdx === 2;
      records.push({
        id: `att_${stuId}_SUB101_${date}`,
        studentId: stuId,
        subjectId: 'SUB101',
        subjectCode: 'CS401',
        date,
        status,
        isLate,
        lateTime: isLate ? '09:18 AM' : null,
      });
    });
  });

  // Subject CS402 (Section A, CS students: STU001, STU002, STU003, STU004)
  const statusCycleCS402 = [
    ['P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['A', 'P', 'A', 'A', 'A', 'P', 'A'], // Below threshold
    ['PL', 'PL', 'P', 'P', 'P', 'P', 'E'],
    ['P', 'P', 'A', 'P', 'P', 'A', 'P'],
  ];

  dates.forEach((date, dateIdx) => {
    cs401Students.forEach((stuId, stuIdx) => {
      const status = statusCycleCS402[stuIdx][dateIdx] || 'P';
      const isLate = stuId === 'STU004' && dateIdx === 4;
      records.push({
        id: `att_${stuId}_SUB102_${date}`,
        studentId: stuId,
        subjectId: 'SUB102',
        subjectCode: 'CS402',
        date,
        status,
        isLate,
        lateTime: isLate ? '10:22 AM' : null,
      });
    });
  });

  // Subject IT601 (Section A, IT students: STU009, STU010, STU011)
  const itStudents = ['STU009', 'STU010', 'STU011'];
  dates.slice(0, 5).forEach((date, dateIdx) => {
    itStudents.forEach((stuId) => {
      const status = stuId === 'STU011' && dateIdx > 1 ? 'A' : 'P';
      const isLate = stuId === 'STU009' && dateIdx === 1;
      records.push({
        id: `att_${stuId}_SUB104_${date}`,
        studentId: stuId,
        subjectId: 'SUB104',
        subjectCode: 'IT601',
        date,
        status,
        isLate,
        lateTime: isLate ? '11:15 AM' : null,
      });
    });
  });

  // Subject EC401 (Section A, EC students: STU013, STU014)
  const ecStudents = ['STU013', 'STU014'];
  dates.slice(0, 4).forEach((date, dateIdx) => {
    ecStudents.forEach((stuId) => {
      records.push({
        id: `att_${stuId}_SUB105_${date}`,
        studentId: stuId,
        subjectId: 'SUB105',
        subjectCode: 'EC401',
        date,
        status: dateIdx === 1 ? 'A' : 'P',
        isLate: false,
        lateTime: null,
      });
    });
  });

  return records;
};

export const INITIAL_ATTENDANCE = generateSeedAttendance();

export const INITIAL_PREFERENCES = {
  theme: 'light',
  threshold: 45,
  institutionName: 'Attendify Institute of Technology',
  academicYear: '2026-2027',
};
