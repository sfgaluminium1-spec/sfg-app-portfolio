
// SFG Aluminium Employee Database
// Complete employee roster with contact details and roles

export interface Employee {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address: {
    line1: string;
    line2?: string;
    line3?: string;
    city: string;
    postcode: string;
    country: string;
  };
  role: string;
  department: string;
  hourlyRate: number;
  standardHours: number;
  startDate: string;
  status: 'active' | 'inactive';
  manager?: string;
}

export const SFG_EMPLOYEES: Employee[] = [
  {
    id: 'EMP001',
    employeeNumber: 'SFG001',
    firstName: 'Yanika',
    lastName: 'Heathcote',
    email: 'yanika@sfg-aluminium.co.uk',
    phone: '',
    address: {
      line1: 'C 19.02 Great Northern Tower',
      line2: '1 Watson St',
      city: 'Manchester',
      postcode: 'M34EF',
      country: 'United Kingdom'
    },
    role: 'Director',
    department: 'Executive',
    hourlyRate: 25.00,
    standardHours: 42.5,
    startDate: '2020-01-01',
    status: 'active'
  },
  {
    id: 'EMP002',
    employeeNumber: 'SFG002',
    firstName: 'Warren',
    lastName: 'Heathcote',
    email: 'warren@sfg-aluminium.co.uk',
    phone: '07787631861',
    address: {
      line1: 'C 19.02 Great Northern Tower',
      line2: '1 Watson St',
      city: 'Manchester',
      postcode: 'M34EF',
      country: 'United Kingdom'
    },
    role: 'Operation Manager & Technical Advisor',
    department: 'Operations',
    hourlyRate: 22.00,
    standardHours: 42.5,
    startDate: '2020-01-01',
    status: 'active'
  },
  {
    id: 'EMP003',
    employeeNumber: 'SFG003',
    firstName: 'Pawel',
    lastName: 'Marzec',
    email: 'pawelmarzec1@gmail.com',
    phone: '',
    address: {
      line1: '3 Cemetery Road',
      city: 'Manchester',
      postcode: 'M43 6QQ',
      country: 'United Kingdom'
    },
    role: 'General Manager / Except Accounts',
    department: 'Management',
    hourlyRate: 20.00,
    standardHours: 42.5,
    startDate: '2020-02-01',
    status: 'active'
  },
  {
    id: 'EMP004',
    employeeNumber: 'SFG004',
    firstName: 'Chris',
    lastName: 'Bulmer',
    email: 'chris.bulmer@sfg-aluminium.co.uk',
    phone: '',
    address: {
      line1: 'TBC',
      city: 'Manchester',
      postcode: 'TBC',
      country: 'United Kingdom'
    },
    role: 'Business Development / Direct Sales',
    department: 'Management',
    hourlyRate: 18.00,
    standardHours: 42.5,
    startDate: '2025-09-11',
    status: 'active'
  },
  {
    id: 'EMP005',
    employeeNumber: 'SFG005',
    firstName: 'Antonee',
    lastName: 'Heathcote',
    email: 'antonee07@gmail.com',
    phone: '',
    address: {
      line1: '104 The Sorting House',
      line2: '83 Newton Street',
      city: 'Manchester',
      postcode: 'M1 1ER',
      country: 'United Kingdom'
    },
    role: 'Marketing',
    department: 'Marketing',
    hourlyRate: 15.00,
    standardHours: 42.5,
    startDate: '2021-03-01',
    status: 'active'
  },
  {
    id: 'EMP006',
    employeeNumber: 'SFG006',
    firstName: 'Matthew',
    lastName: 'Connor',
    email: 'mattconnor68@gmail.com',
    phone: '07904164997',
    address: {
      line1: '15 Pailin Drive',
      city: 'Droylsden',
      postcode: 'M43 7LR',
      country: 'United Kingdom'
    },
    role: 'Production Manager / Customer Communications',
    department: 'Production',
    hourlyRate: 18.00,
    standardHours: 42.5,
    startDate: '2020-06-01',
    status: 'active'
  },
  {
    id: 'EMP007',
    employeeNumber: 'SFG007',
    firstName: 'Michael',
    lastName: 'Viljoen',
    email: 'michaeldviljoen85@hotmail.com',
    phone: '',
    address: {
      line1: '5 Southwick Road',
      line2: 'Northern Moor',
      line3: 'Wythenshawe',
      city: 'Manchester',
      postcode: 'M23 0FU',
      country: 'United Kingdom'
    },
    role: 'Installation Manager / Customer Communications',
    department: 'Installations',
    hourlyRate: 17.00,
    standardHours: 42.5,
    startDate: '2020-07-01',
    status: 'active'
  },
  {
    id: 'EMP008',
    employeeNumber: 'SFG008',
    firstName: 'Mohammed',
    lastName: 'Khan',
    email: 'abdullahyarkhan@hotmail.com',
    phone: '',
    address: {
      line1: '12 Valley Lane',
      city: 'Blackburn',
      line2: 'Lancashire',
      postcode: 'BB1 1PH',
      country: 'United Kingdom'
    },
    role: 'Estimation All Projects',
    department: 'Estimating',
    hourlyRate: 16.50,
    standardHours: 42.5,
    startDate: '2020-08-01',
    status: 'active'
  },
  {
    id: 'EMP009',
    employeeNumber: 'SFG009',
    firstName: 'Rafal',
    lastName: 'Zwarycz',
    email: 'Rafal.zwarycz@gmail.com',
    phone: '',
    address: {
      line1: 'Apartment 19',
      line2: '6 Copper Place',
      city: 'Manchester',
      postcode: 'M14 7FZ',
      country: 'United Kingdom'
    },
    role: 'Design Office CAD Drawing / Customer Contact and Drawing Approvals',
    department: 'Design',
    hourlyRate: 16.00,
    standardHours: 42.5,
    startDate: '2020-09-01',
    status: 'active'
  },
  {
    id: 'EMP010',
    employeeNumber: 'SFG010',
    firstName: 'Darren',
    lastName: 'Newbury',
    email: 'darren.newbury44@gmail.com',
    phone: '',
    address: {
      line1: '16 Parkhurst Avenue',
      city: 'Preston',
      line2: 'Lancashire',
      postcode: 'PE25 5PF',
      country: 'United Kingdom'
    },
    role: 'Site Surveyor',
    department: 'Surveying',
    hourlyRate: 15.50,
    standardHours: 42.5,
    startDate: '2020-10-01',
    status: 'active'
  },
  {
    id: 'EMP011',
    employeeNumber: 'SFG011',
    firstName: 'Martin',
    lastName: 'Greenough',
    email: 'martingreenough68@gmail.com',
    phone: '',
    address: {
      line1: '42 Hartshead Avenue',
      city: 'Ashton Under Lyne',
      line2: 'Manchester',
      postcode: 'OL6 8SF',
      country: 'United Kingdom'
    },
    role: 'Installations Team Leader',
    department: 'Installations',
    hourlyRate: 16.50,
    standardHours: 42.5,
    startDate: '2020-11-01',
    status: 'active'
  },
  {
    id: 'EMP012',
    employeeNumber: 'SFG012',
    firstName: 'Gary',
    lastName: 'Spencer',
    email: 'godfather735@gmail.com',
    phone: '',
    address: {
      line1: '119 Firwood Avenue',
      city: 'Urmston',
      line2: 'Manchester',
      postcode: 'M41 9PW',
      country: 'United Kingdom'
    },
    role: 'Installations Team Leader',
    department: 'Installations',
    hourlyRate: 16.50,
    standardHours: 42.5,
    startDate: '2020-12-01',
    status: 'active'
  },
  {
    id: 'EMP013',
    employeeNumber: 'SFG013',
    firstName: 'Lukasz',
    lastName: 'Wisniowski',
    email: 'Lwsn33@gmail.com',
    phone: '07955647344',
    address: {
      line1: '5 Windermere Avenue',
      city: 'Accrington',
      postcode: 'BB5 6JG',
      country: 'United Kingdom'
    },
    role: 'Aluminium Fabricator Team Leader',
    department: 'Fabrication',
    hourlyRate: 16.00,
    standardHours: 42.5,
    startDate: '2021-01-01',
    status: 'active'
  },
  {
    id: 'EMP014',
    employeeNumber: 'SFG014',
    firstName: 'Paul',
    lastName: 'Farrell',
    email: 'farrellp92@yahoo.co.uk',
    phone: '',
    address: {
      line1: '96 St. Annes Road',
      city: 'Audenshaw',
      line2: 'Manchester',
      postcode: 'M34 5AP',
      country: 'United Kingdom'
    },
    role: 'Aluminium Fabricator Team Leader',
    department: 'Fabrication',
    hourlyRate: 16.00,
    standardHours: 42.5,
    startDate: '2021-02-01',
    status: 'active'
  },
  {
    id: 'EMP015',
    employeeNumber: 'SFG015',
    firstName: 'Rafal',
    lastName: 'Wisniowski',
    email: 'Gosc001@sky.com',
    phone: '',
    address: {
      line1: '227 Queens Rd West',
      city: 'Accrington',
      postcode: 'BB5 4AX',
      country: 'United Kingdom'
    },
    role: 'Aluminium Fabricator Team Leader',
    department: 'Fabrication',
    hourlyRate: 16.00,
    standardHours: 42.5,
    startDate: '2021-03-01',
    status: 'active'
  },
  {
    id: 'EMP016',
    employeeNumber: 'SFG016',
    firstName: 'Liam',
    lastName: 'Greenough',
    email: 'greenoughl33@icloud.com',
    phone: '07404171766',
    address: {
      line1: '42 Hartshead Avenue',
      city: 'Ashton Under Lyne',
      line2: 'Manchester',
      postcode: 'OL6 8SF',
      country: 'United Kingdom'
    },
    role: 'Installations Team Member',
    department: 'Installations',
    hourlyRate: 15.00,
    standardHours: 42.5,
    startDate: '2021-04-01',
    status: 'active'
  },
  {
    id: 'EMP017',
    employeeNumber: 'SFG017',
    firstName: 'Wayne',
    lastName: 'Spencer',
    email: 'Waynespencer7@outlook.com',
    phone: '',
    address: {
      line1: '119 Firwood Avenue',
      city: 'Urmston',
      line2: 'Manchester',
      postcode: 'M41 9PW',
      country: 'United Kingdom'
    },
    role: 'Installations Team Member',
    department: 'Installations',
    hourlyRate: 15.00,
    standardHours: 42.5,
    startDate: '2021-05-01',
    status: 'active'
  },
  {
    id: 'EMP018',
    employeeNumber: 'SFG018',
    firstName: 'Lukasz',
    lastName: 'Topolski',
    email: 'l.topolski1987@gmail.com',
    phone: '',
    address: {
      line1: '305 Grimshaw Lane',
      city: 'Middleton',
      line2: 'Manchester',
      postcode: 'M24 2AT',
      country: 'United Kingdom'
    },
    role: 'Factory Operative / Powder Coating and Sheet Metal Manufacture',
    department: 'Factory',
    hourlyRate: 14.50,
    standardHours: 42.5,
    startDate: '2021-06-01',
    status: 'active'
  },
  {
    id: 'EMP019',
    employeeNumber: 'SFG019',
    firstName: 'Mariusz',
    lastName: 'Koszla',
    email: 'mariuszkoszla84@gmail.com',
    phone: '07851329792',
    address: {
      line1: '11 Smith Street',
      city: 'Ashton Under Lyne',
      line2: 'Lancashire',
      postcode: 'OL7 0DD',
      country: 'United Kingdom'
    },
    role: 'Factory Operative / Powder Coating and Sheet Metal Manufacture',
    department: 'Factory',
    hourlyRate: 14.50,
    standardHours: 42.5,
    startDate: '2021-07-01',
    status: 'active'
  },
  {
    id: 'EMP020',
    employeeNumber: 'SFG020',
    firstName: 'Katarzyna',
    lastName: 'Marzec',
    email: 'Kiwaniak87@gmail.com',
    phone: '',
    address: {
      line1: '3 Cemetery Road',
      city: 'Manchester',
      postcode: 'M43 6QQ',
      country: 'United Kingdom'
    },
    role: 'Office Admin',
    department: 'Administration',
    hourlyRate: 14.00,
    standardHours: 42.5,
    startDate: '2021-08-01',
    status: 'active'
  },
  {
    id: 'EMP021',
    employeeNumber: 'SFG021',
    firstName: 'Mikenzie',
    lastName: 'Lewis',
    email: 'lewiskenzie02@gmail.com',
    phone: '',
    address: {
      line1: '28 Briarwood Avenue',
      city: 'Manchester',
      postcode: 'M43 7RG',
      country: 'United Kingdom'
    },
    role: 'Accounts Admin / Book Keeper',
    department: 'Accounts',
    hourlyRate: 15.50,
    standardHours: 42.5,
    startDate: '2021-09-01',
    status: 'active'
  }
];

// Helper functions for employee management
export const getEmployeeById = (id: string): Employee | undefined => {
  return SFG_EMPLOYEES.find(emp => emp.id === id);
};

export const getEmployeeByEmail = (email: string): Employee | undefined => {
  return SFG_EMPLOYEES.find(emp => emp.email === email);
};

export const getEmployeesByDepartment = (department: string): Employee[] => {
  return SFG_EMPLOYEES.filter(emp => emp.department === department && emp.status === 'active');
};

export const getAllActiveEmployees = (): Employee[] => {
  return SFG_EMPLOYEES.filter(emp => emp.status === 'active');
};

export const getDepartments = (): string[] => {
  const departments = [...new Set(SFG_EMPLOYEES.map(emp => emp.department))];
  return departments.sort();
};

export const getManagerHierarchy = (): Record<string, string[]> => {
  return {
    'Executive': ['Operations', 'Management', 'Accounts'],
    'Operations': ['Production', 'Installations', 'Factory'],
    'Management': ['Marketing', 'Estimating', 'Design', 'Surveying'],
    'Production': ['Fabrication'],
    'Installations': [],
    'Factory': [],
    'Marketing': [],
    'Estimating': [],
    'Design': [],
    'Surveying': [],
    'Administration': [],
    'Accounts': [],
    'Fabrication': []
  };
};
