
/**
 * SFG Aluminium Ltd Payroll Calculation Engine
 * 
 * Business Rules:
 * - Normal hours: Mon-Fri 08:00-17:00 (8.5 hours after 30min lunch)
 * - Overtime: 1.5x rate for hours before 08:00, after 17:00, or over 8.5/day
 * - Sleep rule: 8-hour deduction for overnight shifts (23:00-07:00)
 * - Weekend work: All hours at overtime rate
 * - Cross-midnight shift handling
 */

export interface TimeEntry {
  startTime: string; // "HH:MM" format
  endTime: string;   // "HH:MM" format
  workDate: Date;
  breakMinutes?: number;
}

export interface PayrollCalculation {
  regularHours: number;
  overtimeHours: number;
  nightHours: number;
  sleepHours: number;
  totalHours: number;
  regularPay: number;
  overtimePay: number;
  totalPay: number;
  breakdown: {
    normalTimeHours: number;
    beforeWorkHours: number;
    afterWorkHours: number;
    weekendHours: number;
    sleepDeduction: number;
  };
}

// Convert time string "HH:MM" to minutes from midnight
function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

// Convert minutes to hours (decimal)
function minutesToHours(minutes: number): number {
  return minutes / 60;
}

// Convert minutes from midnight to "HH:MM" string
function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60) % 24;
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

// Check if date is weekend (Saturday or Sunday)
function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
}

// Check if time falls within sleep period (23:00 - 07:00)
function isInSleepPeriod(minutes: number): boolean {
  // Sleep period: 23:00 (1380 min) to 07:00 (420 min) next day
  return minutes >= 1380 || minutes <= 420;
}

// Calculate overlap between two time ranges in minutes
function calculateOverlap(start1: number, end1: number, start2: number, end2: number): number {
  const overlapStart = Math.max(start1, start2);
  const overlapEnd = Math.min(end1, end2);
  return Math.max(0, overlapEnd - overlapStart);
}

export function calculatePayroll(
  timeEntry: TimeEntry, 
  hourlyRate: number
): PayrollCalculation {
  
  const { startTime, endTime, workDate, breakMinutes = 30 } = timeEntry;
  
  let startMinutes = timeToMinutes(startTime);
  let endMinutes = timeToMinutes(endTime);
  
  // Handle cross-midnight shifts
  if (endMinutes <= startMinutes) {
    endMinutes += 24 * 60; // Add 24 hours
  }
  
  // Total work time in minutes (excluding breaks)
  const totalWorkMinutes = endMinutes - startMinutes - breakMinutes;
  const totalHours = minutesToHours(totalWorkMinutes);
  
  // Initialize breakdown
  let normalTimeHours = 0;
  let beforeWorkHours = 0;
  let afterWorkHours = 0;
  let weekendHours = 0;
  let sleepDeduction = 0;
  
  if (isWeekend(workDate)) {
    // Weekend work - all hours are overtime
    weekendHours = totalHours;
  } else {
    // Weekday work - calculate normal and overtime periods
    const normalStart = 8 * 60;  // 08:00
    const normalEnd = 17 * 60;   // 17:00
    
    // Calculate work periods
    let currentMinutes = startMinutes;
    const workEndMinutes = endMinutes - breakMinutes;
    
    while (currentMinutes < workEndMinutes) {
      const segmentEnd = Math.min(currentMinutes + 60, workEndMinutes);
      const segmentHours = minutesToHours(segmentEnd - currentMinutes);
      
      // Check which period this segment falls into
      const segmentMidpoint = (currentMinutes + segmentEnd) / 2;
      const normalizedMidpoint = segmentMidpoint % (24 * 60); // Handle cross-midnight
      
      if (normalizedMidpoint >= normalStart && normalizedMidpoint < normalEnd) {
        normalTimeHours += segmentHours;
      } else if (normalizedMidpoint < normalStart) {
        beforeWorkHours += segmentHours;
      } else {
        afterWorkHours += segmentHours;
      }
      
      currentMinutes = segmentEnd;
    }
    
    // Enforce 8.5 hour daily limit for normal time
    if (normalTimeHours > 8.5) {
      const excessHours = normalTimeHours - 8.5;
      normalTimeHours = 8.5;
      afterWorkHours += excessHours;
    }
  }
  
  // Calculate sleep rule deduction for overnight shifts
  let nightHours = 0;
  if (startMinutes >= 1380 || endMinutes <= 420 + (24 * 60)) { // 23:00 to 07:00 next day
    // Check for sleep period overlap
    const sleepStart = 1380; // 23:00
    const sleepEnd = 420 + (24 * 60); // 07:00 next day
    
    const sleepOverlap = calculateOverlap(startMinutes, endMinutes, sleepStart, sleepEnd);
    nightHours = minutesToHours(sleepOverlap);
    
    // Apply 8-hour sleep deduction if shift spans the sleep period
    if (nightHours > 0 && totalHours >= 8) {
      sleepDeduction = Math.min(8, nightHours);
    }
  }
  
  // Calculate final hours after sleep deduction
  const adjustedTotalHours = Math.max(0, totalHours - sleepDeduction);
  
  // Distribute hours between regular and overtime
  let regularHours = 0;
  let overtimeHours = 0;
  
  if (isWeekend(workDate)) {
    // Weekend - all hours are overtime
    overtimeHours = adjustedTotalHours;
  } else {
    // Weekday - normal time first, then overtime
    regularHours = Math.min(adjustedTotalHours, normalTimeHours);
    overtimeHours = Math.max(0, adjustedTotalHours - regularHours);
  }
  
  // Calculate pay
  const regularPay = regularHours * hourlyRate;
  const overtimePay = overtimeHours * hourlyRate * 1.5;
  const totalPay = regularPay + overtimePay;
  
  return {
    regularHours: Math.round(regularHours * 100) / 100,
    overtimeHours: Math.round(overtimeHours * 100) / 100,
    nightHours: Math.round(nightHours * 100) / 100,
    sleepHours: Math.round(sleepDeduction * 100) / 100,
    totalHours: Math.round(adjustedTotalHours * 100) / 100,
    regularPay: Math.round(regularPay * 100) / 100,
    overtimePay: Math.round(overtimePay * 100) / 100,
    totalPay: Math.round(totalPay * 100) / 100,
    breakdown: {
      normalTimeHours: Math.round(normalTimeHours * 100) / 100,
      beforeWorkHours: Math.round(beforeWorkHours * 100) / 100,
      afterWorkHours: Math.round(afterWorkHours * 100) / 100,
      weekendHours: Math.round(weekendHours * 100) / 100,
      sleepDeduction: Math.round(sleepDeduction * 100) / 100,
    }
  };
}

// Validate time entry
export function validateTimeEntry(timeEntry: TimeEntry): string[] {
  const errors: string[] = [];
  
  const timePattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  
  if (!timePattern.test(timeEntry.startTime)) {
    errors.push('Start time must be in HH:MM format (24-hour)');
  }
  
  if (!timePattern.test(timeEntry.endTime)) {
    errors.push('End time must be in HH:MM format (24-hour)');
  }
  
  if (timeEntry.breakMinutes && (timeEntry.breakMinutes < 0 || timeEntry.breakMinutes > 480)) {
    errors.push('Break minutes must be between 0 and 480 (8 hours)');
  }
  
  // Check for reasonable shift length
  const startMinutes = timeToMinutes(timeEntry.startTime);
  let endMinutes = timeToMinutes(timeEntry.endTime);
  
  if (endMinutes <= startMinutes) {
    endMinutes += 24 * 60;
  }
  
  const totalMinutes = endMinutes - startMinutes;
  if (totalMinutes > 16 * 60) { // More than 16 hours
    errors.push('Shift cannot exceed 16 hours');
  }
  
  if (totalMinutes <= (timeEntry.breakMinutes || 0)) {
    errors.push('Work time must be longer than break time');
  }
  
  return errors;
}
