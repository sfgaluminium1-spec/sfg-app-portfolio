
/**
 * Currency and number formatting utilities for UK locale
 * Updated to use GBP (British Pounds) instead of USD
 */

/**
 * Formats a number as British Pounds Sterling (GBP)
 * @param amount - The amount to format
 * @param options - Formatting options
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  options: Intl.NumberFormatOptions = {}
): string {
  const defaultOptions: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };

  const formatOptions = { ...defaultOptions, ...options };

  return new Intl.NumberFormat('en-GB', formatOptions).format(amount);
}

/**
 * Formats hourly rate with proper UK currency formatting
 * @param rate - Hourly rate amount
 * @returns Formatted hourly rate string
 */
export function formatHourlyRate(rate: number): string {
  return `${formatCurrency(rate)}/hour`;
}

/**
 * Formats salary as annual amount in GBP
 * @param annualSalary - Annual salary amount
 * @returns Formatted annual salary string
 */
export function formatAnnualSalary(annualSalary: number): string {
  return `${formatCurrency(annualSalary, { maximumFractionDigits: 0 })} per annum`;
}

/**
 * Formats weekly wage in GBP
 * @param weeklyAmount - Weekly wage amount
 * @returns Formatted weekly wage string
 */
export function formatWeeklyWage(weeklyAmount: number): string {
  return `${formatCurrency(weeklyAmount)} per week`;
}

/**
 * Formats overtime rate (typically time and a half)
 * @param baseRate - Base hourly rate
 * @param multiplier - Overtime multiplier (default 1.5 for time and a half)
 * @returns Formatted overtime rate string
 */
export function formatOvertimeRate(baseRate: number, multiplier: number = 1.5): string {
  const overtimeRate = baseRate * multiplier;
  return `${formatCurrency(overtimeRate)}/hour (${multiplier}x)`;
}

/**
 * Formats a percentage for UK locale
 * @param value - Percentage value (0.15 for 15%)
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Formats a number with UK locale formatting
 * @param value - Number to format
 * @param options - Formatting options
 * @returns Formatted number string
 */
export function formatNumber(
  value: number,
  options: Intl.NumberFormatOptions = {}
): string {
  return new Intl.NumberFormat('en-GB', options).format(value);
}

/**
 * Formats tax amounts (Income Tax, National Insurance, etc.)
 * @param amount - Tax amount
 * @param taxType - Type of tax for context
 * @returns Formatted tax string
 */
export function formatTax(amount: number, taxType: string = 'Tax'): string {
  return `${taxType}: ${formatCurrency(amount)}`;
}

/**
 * Formats pension contributions
 * @param amount - Pension contribution amount
 * @param isEmployer - Whether this is employer or employee contribution
 * @returns Formatted pension contribution string
 */
export function formatPensionContribution(amount: number, isEmployer: boolean = false): string {
  const contributionType = isEmployer ? 'Employer' : 'Employee';
  return `${contributionType} Pension: ${formatCurrency(amount)}`;
}

/**
 * Formats National Insurance contributions
 * @param amount - National Insurance amount
 * @returns Formatted National Insurance string
 */
export function formatNationalInsurance(amount: number): string {
  return `National Insurance: ${formatCurrency(amount)}`;
}

/**
 * Formats student loan deductions
 * @param amount - Student loan deduction amount
 * @returns Formatted student loan string
 */
export function formatStudentLoan(amount: number): string {
  return `Student Loan: ${formatCurrency(amount)}`;
}

/**
 * Formats statutory payments (SSP, SMP, etc.)
 * @param amount - Statutory payment amount
 * @param paymentType - Type of statutory payment
 * @returns Formatted statutory payment string
 */
export function formatStatutoryPayment(amount: number, paymentType: string): string {
  return `${paymentType}: ${formatCurrency(amount)}`;
}

/**
 * Calculate and format gross pay from hours and rate
 * @param hours - Hours worked
 * @param hourlyRate - Hourly rate in GBP
 * @returns Formatted gross pay string
 */
export function calculateAndFormatGrossPay(hours: number, hourlyRate: number): string {
  const grossPay = hours * hourlyRate;
  return formatCurrency(grossPay);
}

/**
 * Format payroll period dates in UK format
 * @param startDate - Period start date
 * @param endDate - Period end date
 * @returns Formatted date range string
 */
export function formatPayrollPeriod(startDate: Date, endDate: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  
  const start = startDate.toLocaleDateString('en-GB', options);
  const end = endDate.toLocaleDateString('en-GB', options);
  
  return `${start} - ${end}`;
}

/**
 * Format UK date (DD/MM/YYYY)
 * @param date - Date to format
 * @returns Formatted UK date string
 */
export function formatUKDate(date: Date): string {
  return date.toLocaleDateString('en-GB');
}

/**
 * Format UK time (24-hour format)
 * @param date - Date/time to format
 * @returns Formatted UK time string
 */
export function formatUKTime(date: Date): string {
  return date.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
}

/**
 * Validate and format UK postcode
 * @param postcode - Postcode to format
 * @returns Formatted UK postcode or null if invalid
 */
export function formatUKPostcode(postcode: string): string | null {
  // Basic UK postcode regex - can be enhanced
  const ukPostcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}$/i;
  const cleaned = postcode.replace(/\s+/g, '').toUpperCase();
  
  if (!ukPostcodeRegex.test(cleaned)) {
    return null;
  }
  
  // Add space before last 3 characters if not present
  if (cleaned.length > 3) {
    return `${cleaned.slice(0, -3)} ${cleaned.slice(-3)}`;
  }
  
  return cleaned;
}

/**
 * Format UK phone number
 * @param phoneNumber - Phone number to format
 * @returns Formatted UK phone number
 */
export function formatUKPhoneNumber(phoneNumber: string): string {
  // Remove all non-numeric characters
  const numbers = phoneNumber.replace(/\D/g, '');
  
  // Handle different UK number formats
  if (numbers.startsWith('44')) {
    // International format
    return `+44 ${numbers.slice(2, 6)} ${numbers.slice(6)}`;
  } else if (numbers.startsWith('0')) {
    // UK national format
    if (numbers.length === 11) {
      return `${numbers.slice(0, 4)} ${numbers.slice(4, 7)} ${numbers.slice(7)}`;
    }
  }
  
  // Return as-is if format not recognised
  return phoneNumber;
}

/**
 * Constants for UK tax and benefit rates (2024-25 tax year)
 * These should be updated annually
 */
export const UK_TAX_RATES = {
  PERSONAL_ALLOWANCE: 12570, // £12,570 for 2024-25
  BASIC_RATE: 0.20, // 20%
  HIGHER_RATE: 0.40, // 40%
  ADDITIONAL_RATE: 0.45, // 45%
  BASIC_RATE_THRESHOLD: 37700, // £37,700
  HIGHER_RATE_THRESHOLD: 150000, // £150,000
  
  // National Insurance rates 2024-25
  NI_EMPLOYEE_RATE: 0.12, // 12%
  NI_EMPLOYER_RATE: 0.138, // 13.8%
  NI_THRESHOLD: 12570, // £12,570
  
  // Pension contributions
  PENSION_AUTO_ENROL_MIN: 0.08, // 8% total minimum
  PENSION_EMPLOYEE_MIN: 0.05, // 5% employee minimum
  PENSION_EMPLOYER_MIN: 0.03, // 3% employer minimum
} as const;
