
/**
 * SFG ALUMINIUM LTD - BUSINESS RULES ENGINE
 * Version: 2.0
 * Last Updated: September 11, 2025
 * 
 * This file contains the authoritative business rules for SFG Aluminium Ltd
 * payroll calculations, extracted from comprehensive analysis of provided documentation.
 */

export interface SFGBusinessRules {
  // WAGE RATES
  wages: {
    standardHourlyRate: number;      // £15.00/hour (base rate)
    overtimeMultiplier: number;      // 1.5x confirmed
    normalDayHours: number;          // 8.5 hours before overtime
    standardWeekHours: number;       // 42.5 hours (5 × 8.5)
  };
  
  // SHIFT PATTERNS
  shifts: {
    extendedShift: {
      totalHours: number;            // 28.0 hours (includes sleep/rest)
      actualWorkTime: number;        // 9.0 hours real work 
      structure: "dual";             // Split into 2 periods
      sleepRuleApplied: boolean;     // Always true
    };
    
    standardPatterns: {
      day: [string, string];         // ["08:00-12:00", "12:00-17:00"]
      early: [string, string];       // ["06:00-10:00", "10:00-15:00"] 
      night: [string, string];       // ["22:00-02:00", "02:00-07:00"]
    };
  };
  
  // WEEKDAY VS WEEKEND LOGIC
  calculations: {
    weekday: {
      normalHours: number;           // 8.5 max
      overtimeHours: number;         // 11.5 (for 28-hour shifts)
    };
    weekend: {
      normalHours: number;           // 0.0 (all overtime)
      overtimeHours: number;         // 20.0 (for 28-hour shifts)
    };
  };
  
  // DEADLINE PROCESSING
  deadlines: {
    submissionCutoff: {
      day: "Tuesday";
      time: string;                  // "17:00" (5 PM - assumed)
    };
    lateSubmissionDefaults: {
      hours: number;                 // 42.5 standard hours
      rate: number;                  // £15.00 base rate
      overtimeHours: number;         // 0 (no overtime for late)
    };
  };
  
  // EMPLOYEE STRUCTURE
  departments: string[];
  roles: string[];
}

export const SFG_RULES: SFGBusinessRules = {
  wages: {
    standardHourlyRate: 15.00,
    overtimeMultiplier: 1.5,
    normalDayHours: 8.5,
    standardWeekHours: 42.5,
  },
  
  shifts: {
    extendedShift: {
      totalHours: 28.0,
      actualWorkTime: 9.0,
      structure: "dual",
      sleepRuleApplied: true,
    },
    standardPatterns: {
      day: ["08:00-12:00", "12:00-17:00"],
      early: ["06:00-10:00", "10:00-15:00"], 
      night: ["22:00-02:00", "02:00-07:00"],
    },
  },
  
  calculations: {
    weekday: {
      normalHours: 8.5,
      overtimeHours: 11.5, // For 28-hour shifts after sleep deduction
    },
    weekend: {
      normalHours: 0.0,
      overtimeHours: 20.0, // All weekend work is overtime after sleep deduction
    },
  },
  
  deadlines: {
    submissionCutoff: {
      day: "Tuesday",
      time: "17:00", // 5 PM assumption - to be confirmed
    },
    lateSubmissionDefaults: {
      hours: 42.5,
      rate: 15.00,
      overtimeHours: 0,
    },
  },
  
  departments: [
    "Management",
    "Marketing", 
    "Operations",
    "Installations",
    "Administration",
    "Factory",
    "Fabrication",
    "Production", 
    "Accounts",
    "Estimation",
    "Design",
  ],
  
  roles: [
    "Director",
    "Operations Manager & Technical Advisor", 
    "General Manager / Except Accounts",
    "Production Manager / Customer Communications",
    "Installation Manager / Customer Communications",
    "Business Development / Direct Sales",
    "Marketing",
    "Site Surveyor", 
    "Installations Team Leader",
    "Installations Team Member",
    "Aluminium Fabricator Team Leader",
    "Factory Operative / Powder Coating and Sheet Metal Manufacture",
    "Design Office CAD Drawing / Customer Contact and Drawing Approvals",
    "Estimation All Projects",
    "Office Admin",
    "Accounts Admin / Book Keeper",
  ],
};

/**
 * SFG PAYROLL CALCULATION ENGINE
 * Core calculation functions using confirmed business rules
 */

export interface TimesheetEntry {
  employeeId: string;
  date: Date;
  startTime: string;
  endTime: string;
  breakMinutes?: number;
  isExtendedShift?: boolean;
  shiftType?: 'day' | 'early' | 'night';
  notes?: string;
}

export interface PayrollCalculation {
  normalHours: number;
  overtimeHours: number;
  normalPay: number;
  overtimePay: number;
  totalPay: number;
  sleepRuleApplied: boolean;
  calculationNotes: string[];
}

export function calculateSFGPayroll(
  entry: TimesheetEntry, 
  employeeHourlyRate: number = SFG_RULES.wages.standardHourlyRate
): PayrollCalculation {
  const isWeekend = entry.date.getDay() === 0 || entry.date.getDay() === 6;
  const notes: string[] = [];
  
  // Handle 28-hour extended shifts (confirmed from documentation)
  if (entry.isExtendedShift) {
    notes.push("28-hour extended shift pattern applied");
    notes.push("Sleep rule deductions already factored into calculations");
    
    if (isWeekend) {
      // Weekend: All overtime after sleep deduction
      const overtimeHours = SFG_RULES.calculations.weekend.overtimeHours; // 20.0
      const overtimePay = overtimeHours * employeeHourlyRate * SFG_RULES.wages.overtimeMultiplier;
      
      notes.push("Weekend work - all hours treated as overtime");
      
      return {
        normalHours: 0.0,
        overtimeHours,
        normalPay: 0.0,
        overtimePay,
        totalPay: overtimePay,
        sleepRuleApplied: true,
        calculationNotes: notes,
      };
    } else {
      // Weekday: Split normal/overtime after sleep deduction
      const normalHours = SFG_RULES.calculations.weekday.normalHours; // 8.5
      const overtimeHours = SFG_RULES.calculations.weekday.overtimeHours; // 11.5
      const normalPay = normalHours * employeeHourlyRate;
      const overtimePay = overtimeHours * employeeHourlyRate * SFG_RULES.wages.overtimeMultiplier;
      
      notes.push("Weekday extended shift - normal/overtime split applied");
      
      return {
        normalHours,
        overtimeHours,
        normalPay,
        overtimePay,
        totalPay: normalPay + overtimePay,
        sleepRuleApplied: true,
        calculationNotes: notes,
      };
    }
  }
  
  // Handle regular shifts
  const totalHours = calculateHours(entry.startTime, entry.endTime, entry.breakMinutes || 0);
  const normalHours = Math.min(totalHours, SFG_RULES.wages.normalDayHours);
  const overtimeHours = Math.max(0, totalHours - SFG_RULES.wages.normalDayHours);
  
  const normalPay = normalHours * employeeHourlyRate;
  const overtimePay = overtimeHours * employeeHourlyRate * SFG_RULES.wages.overtimeMultiplier;
  
  notes.push("Standard shift calculation applied");
  if (overtimeHours > 0) {
    notes.push(`${overtimeHours.toFixed(2)} hours overtime at ${SFG_RULES.wages.overtimeMultiplier}x rate`);
  }
  
  return {
    normalHours,
    overtimeHours, 
    normalPay,
    overtimePay,
    totalPay: normalPay + overtimePay,
    sleepRuleApplied: false,
    calculationNotes: notes,
  };
}

export function processTuesdayDeadline(
  submissionTimestamp: Date,
  actualTimesheet: TimesheetEntry[],
  deadlineTime: string = SFG_RULES.deadlines.submissionCutoff.time
): { isLate: boolean; processedHours: number; deferredData?: TimesheetEntry[] } {
  const submissionDay = submissionTimestamp.getDay();
  const submissionHour = submissionTimestamp.getHours();
  const deadlineHour = parseInt(deadlineTime.split(':')[0]);
  
  // Check if submission is after Tuesday 5 PM (or specified time)
  const isLate = submissionDay > 2 || (submissionDay === 2 && submissionHour >= deadlineHour);
  
  if (isLate) {
    return {
      isLate: true,
      processedHours: SFG_RULES.deadlines.lateSubmissionDefaults.hours, // 42.5
      deferredData: actualTimesheet, // Defer to next week
    };
  }
  
  return {
    isLate: false,
    processedHours: 0, // Process actual hours
  };
}

function calculateHours(startTime: string, endTime: string, breakMinutes: number): number {
  const start = new Date(`1970-01-01T${startTime}:00`);
  let end = new Date(`1970-01-01T${endTime}:00`);
  
  // Handle cross-midnight shifts
  if (end <= start) {
    end.setDate(end.getDate() + 1);
  }
  
  const diffMs = end.getTime() - start.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const breakHours = breakMinutes / 60;
  
  return Math.max(0, diffHours - breakHours);
}

export function validateEmployeeRole(role: string): boolean {
  return SFG_RULES.roles.includes(role);
}

export function validateDepartment(department: string): boolean {
  return SFG_RULES.departments.includes(department);
}

/**
 * CONFIRMED WEEKLY CALCULATION EXAMPLE
 * From Antonee Heathcote documentation (£15/hour):
 * - Normal Hours: 42.5 hours = £637.50
 * - Overtime Hours: 97.5 hours = £2,193.75  
 * - Total Weekly Pay: £2,831.25
 */
export const CONFIRMED_EXAMPLE = {
  employee: "Antonee Heathcote",
  hourlyRate: 15.00,
  weeklyNormalHours: 42.5,
  weeklyOvertimeHours: 97.5,
  weeklyNormalPay: 637.50,
  weeklyOvertimePay: 2193.75,
  weeklyTotalPay: 2831.25,
};

// Additional helper functions for compatibility
export function calculateRegularShift(startTime: string, endTime: string, workDate: Date, hourlyRate: number, breakMinutes: number = 0) {
  const totalHours = calculateHours(startTime, endTime, breakMinutes);
  const normalHours = Math.min(totalHours, SFG_RULES.wages.normalDayHours);
  const overtimeHours = Math.max(0, totalHours - SFG_RULES.wages.normalDayHours);
  
  return {
    totalHours,
    normalHours,
    overtimeHours,
    normalPay: normalHours * hourlyRate,
    overtimePay: overtimeHours * hourlyRate * SFG_RULES.wages.overtimeMultiplier,
    totalPay: (normalHours * hourlyRate) + (overtimeHours * hourlyRate * SFG_RULES.wages.overtimeMultiplier),
  };
}

export function isLateSubmission(submissionTimestamp: Date, deadlineTime: string = SFG_RULES.deadlines.submissionCutoff.time): boolean {
  const submissionDay = submissionTimestamp.getDay();
  const submissionHour = submissionTimestamp.getHours();
  const deadlineHour = parseInt(deadlineTime.split(':')[0]);
  
  return submissionDay > 2 || (submissionDay === 2 && submissionHour >= deadlineHour);
}

export function processLateSubmission(timesheetData: any, employeeHourlyRate: number = SFG_RULES.wages.standardHourlyRate) {
  const standardHours = SFG_RULES.deadlines.lateSubmissionDefaults.hours;
  
  return {
    totalHours: standardHours,
    processedHours: standardHours,
    normalHours: standardHours,
    overtimeHours: SFG_RULES.deadlines.lateSubmissionDefaults.overtimeHours,
    normalPay: standardHours * employeeHourlyRate,
    overtimePay: 0, // No overtime for late submissions
    totalPay: standardHours * employeeHourlyRate,
    status: 'Late submission - standard week processed',
  };
}

// Legacy export for compatibility
export const sfgPayrollEngine = {
  calculateSFGPayroll,
  calculateRegularShift,
  processTuesdayDeadline,
  isLateSubmission,
  processLateSubmission,
  SFG_RULES,
  validateEmployeeRole,
  validateDepartment,
  CONFIRMED_EXAMPLE,
};
