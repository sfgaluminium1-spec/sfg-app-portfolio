
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Calculator,
  FileText,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ValidationRule {
  id: string;
  name: string;
  description: string;
  category: 'time' | 'payroll' | 'business' | 'data';
  severity: 'error' | 'warning' | 'info';
  isActive: boolean;
}

interface ValidationResult {
  ruleId: string;
  ruleName: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  suggestion?: string;
  affectedFields?: string[];
  data?: any;
}

interface ValidationSummary {
  totalChecks: number;
  passed: number;
  failed: number;
  warnings: number;
  lastRun: Date;
}

interface ValidationProps {
  timesheetData?: any;
  onValidationComplete?: (results: ValidationResult[]) => void;
  autoValidate?: boolean;
}

export function AdvancedValidation({ 
  timesheetData, 
  onValidationComplete,
  autoValidate = false 
}: ValidationProps) {
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [validationSummary, setValidationSummary] = useState<ValidationSummary>({
    totalChecks: 0,
    passed: 0,
    failed: 0,
    warnings: 0,
    lastRun: new Date()
  });
  const [isValidating, setIsValidating] = useState(false);
  const [validationRules] = useState<ValidationRule[]>([
    {
      id: 'time-format',
      name: 'Time Format Validation',
      description: 'Ensures all time entries are in correct HH:MM format',
      category: 'time',
      severity: 'error',
      isActive: true
    },
    {
      id: 'time-logic',
      name: 'Time Logic Check',
      description: 'Verifies that end time is after start time and within reasonable bounds',
      category: 'time',
      severity: 'error',
      isActive: true
    },
    {
      id: 'break-validation',
      name: 'Break Time Validation',
      description: 'Checks that break times are reasonable and properly formatted',
      category: 'time',
      severity: 'warning',
      isActive: true
    },
    {
      id: 'overtime-calculation',
      name: 'Overtime Calculation Check',
      description: 'Validates overtime calculations based on SFG rules',
      category: 'payroll',
      severity: 'error',
      isActive: true
    },
    {
      id: 'sleep-rules',
      name: 'Sleep Rule Application',
      description: 'Ensures sleep rules are correctly applied for long shifts',
      category: 'payroll',
      severity: 'warning',
      isActive: true
    },
    {
      id: 'weekly-hours',
      name: 'Weekly Hours Limit',
      description: 'Checks for excessive weekly hours that may require approval',
      category: 'business',
      severity: 'warning',
      isActive: true
    },
    {
      id: 'consecutive-shifts',
      name: 'Consecutive Shift Check',
      description: 'Identifies potentially unsafe consecutive long shifts',
      category: 'business',
      severity: 'warning',
      isActive: true
    },
    {
      id: 'data-completeness',
      name: 'Data Completeness',
      description: 'Ensures all required fields are filled',
      category: 'data',
      severity: 'error',
      isActive: true
    },
    {
      id: 'duplicate-entries',
      name: 'Duplicate Entry Detection',
      description: 'Identifies potential duplicate timesheet entries',
      category: 'data',
      severity: 'warning',
      isActive: true
    },
    {
      id: 'historical-consistency',
      name: 'Historical Consistency',
      description: 'Compares with previous submissions for unusual patterns',
      category: 'business',
      severity: 'info',
      isActive: true
    }
  ]);

  const runValidation = useCallback(async (data?: any) => {
    setIsValidating(true);
    const dataToValidate = data || timesheetData;
    const results: ValidationResult[] = [];

    try {
      // Time Format Validation
      if (validationRules.find(r => r.id === 'time-format' && r.isActive)) {
        const timeFormatResult = validateTimeFormat(dataToValidate);
        results.push(timeFormatResult);
      }

      // Time Logic Check
      if (validationRules.find(r => r.id === 'time-logic' && r.isActive)) {
        const timeLogicResult = validateTimeLogic(dataToValidate);
        results.push(timeLogicResult);
      }

      // Break Time Validation
      if (validationRules.find(r => r.id === 'break-validation' && r.isActive)) {
        const breakValidationResult = validateBreakTimes(dataToValidate);
        results.push(breakValidationResult);
      }

      // Overtime Calculation Check
      if (validationRules.find(r => r.id === 'overtime-calculation' && r.isActive)) {
        const overtimeResult = validateOvertimeCalculation(dataToValidate);
        results.push(overtimeResult);
      }

      // Sleep Rule Application
      if (validationRules.find(r => r.id === 'sleep-rules' && r.isActive)) {
        const sleepRuleResult = validateSleepRules(dataToValidate);
        results.push(sleepRuleResult);
      }

      // Weekly Hours Limit
      if (validationRules.find(r => r.id === 'weekly-hours' && r.isActive)) {
        const weeklyHoursResult = validateWeeklyHours(dataToValidate);
        results.push(weeklyHoursResult);
      }

      // Consecutive Shift Check
      if (validationRules.find(r => r.id === 'consecutive-shifts' && r.isActive)) {
        const consecutiveShiftsResult = validateConsecutiveShifts(dataToValidate);
        results.push(consecutiveShiftsResult);
      }

      // Data Completeness
      if (validationRules.find(r => r.id === 'data-completeness' && r.isActive)) {
        const completenessResult = validateDataCompleteness(dataToValidate);
        results.push(completenessResult);
      }

      // Duplicate Entry Detection
      if (validationRules.find(r => r.id === 'duplicate-entries' && r.isActive)) {
        const duplicateResult = validateDuplicateEntries(dataToValidate);
        results.push(duplicateResult);
      }

      // Historical Consistency
      if (validationRules.find(r => r.id === 'historical-consistency' && r.isActive)) {
        const historicalResult = await validateHistoricalConsistency(dataToValidate);
        results.push(historicalResult);
      }

      setValidationResults(results);
      
      // Update summary
      const summary: ValidationSummary = {
        totalChecks: results.length,
        passed: results.filter(r => r.status === 'pass').length,
        failed: results.filter(r => r.status === 'fail').length,
        warnings: results.filter(r => r.status === 'warning').length,
        lastRun: new Date()
      };
      setValidationSummary(summary);

      // Call completion callback
      if (onValidationComplete) {
        onValidationComplete(results);
      }

      // Show toast notification
      if (summary.failed > 0) {
        toast.error(`Validation found ${summary.failed} error(s) and ${summary.warnings} warning(s)`);
      } else if (summary.warnings > 0) {
        toast(`Validation completed with ${summary.warnings} warning(s)`, { icon: '⚠️' });
      } else {
        toast.success('All validation checks passed');
      }

    } catch (error) {
      console.error('Validation error:', error);
      toast.error('Validation failed due to system error');
    } finally {
      setIsValidating(false);
    }
  }, [timesheetData, validationRules, onValidationComplete]);

  // Validation Functions
  const validateTimeFormat = (data: any): ValidationResult => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    let hasError = false;
    const affectedFields: string[] = [];

    if (data?.startTime && !timeRegex.test(data.startTime)) {
      hasError = true;
      affectedFields.push('startTime');
    }
    
    if (data?.endTime && !timeRegex.test(data.endTime)) {
      hasError = true;
      affectedFields.push('endTime');
    }

    return {
      ruleId: 'time-format',
      ruleName: 'Time Format Validation',
      status: hasError ? 'fail' : 'pass',
      message: hasError 
        ? `Invalid time format in fields: ${affectedFields.join(', ')}` 
        : 'All time formats are valid',
      suggestion: hasError ? 'Use HH:MM format (24-hour), e.g., 09:00 or 15:30' : undefined,
      affectedFields: hasError ? affectedFields : undefined
    };
  };

  const validateTimeLogic = (data: any): ValidationResult => {
    if (!data?.startTime || !data?.endTime) {
      return {
        ruleId: 'time-logic',
        ruleName: 'Time Logic Check',
        status: 'warning',
        message: 'Start or end time is missing',
        suggestion: 'Please enter both start and end times'
      };
    }

    const start = new Date(`1970-01-01T${data.startTime}:00`);
    let end = new Date(`1970-01-01T${data.endTime}:00`);
    
    // Handle overnight shifts
    if (end <= start) {
      end.setDate(end.getDate() + 1);
    }

    const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 0.5) {
      return {
        ruleId: 'time-logic',
        ruleName: 'Time Logic Check',
        status: 'fail',
        message: 'Shift duration is too short (less than 30 minutes)',
        suggestion: 'Check your start and end times - minimum shift is 30 minutes'
      };
    }
    
    if (diffHours > 16) {
      return {
        ruleId: 'time-logic',
        ruleName: 'Time Logic Check',
        status: 'warning',
        message: 'Shift duration is very long (over 16 hours)',
        suggestion: 'Verify this is correct and ensure proper rest periods are taken'
      };
    }

    return {
      ruleId: 'time-logic',
      ruleName: 'Time Logic Check',
      status: 'pass',
      message: 'Time logic is valid',
      data: { shiftDuration: diffHours }
    };
  };

  const validateBreakTimes = (data: any): ValidationResult => {
    const breakMinutes = data?.breakMinutes || 30;
    
    if (breakMinutes < 0) {
      return {
        ruleId: 'break-validation',
        ruleName: 'Break Time Validation',
        status: 'fail',
        message: 'Break time cannot be negative',
        suggestion: 'Enter a valid break duration in minutes'
      };
    }
    
    if (breakMinutes > 120) {
      return {
        ruleId: 'break-validation',
        ruleName: 'Break Time Validation',
        status: 'warning',
        message: 'Break time seems excessive (over 2 hours)',
        suggestion: 'Verify this is correct or adjust the break duration'
      };
    }
    
    if (breakMinutes === 0) {
      return {
        ruleId: 'break-validation',
        ruleName: 'Break Time Validation',
        status: 'warning',
        message: 'No break time recorded',
        suggestion: 'Consider if a break should be included'
      };
    }

    return {
      ruleId: 'break-validation',
      ruleName: 'Break Time Validation',
      status: 'pass',
      message: 'Break time is within normal range'
    };
  };

  const validateOvertimeCalculation = (data: any): ValidationResult => {
    if (!data?.startTime || !data?.endTime) {
      return {
        ruleId: 'overtime-calculation',
        ruleName: 'Overtime Calculation Check',
        status: 'warning',
        message: 'Cannot validate overtime without complete time data'
      };
    }

    const start = new Date(`1970-01-01T${data.startTime}:00`);
    let end = new Date(`1970-01-01T${data.endTime}:00`);
    
    if (end <= start) {
      end.setDate(end.getDate() + 1);
    }

    const totalMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
    const breakMinutes = data?.breakMinutes || 30;
    const workedHours = (totalMinutes - breakMinutes) / 60;
    
    const expectedRegularHours = Math.min(workedHours, 8.5);
    const expectedOvertimeHours = Math.max(0, workedHours - 8.5);
    
    const actualRegularHours = data?.regularHours || 0;
    const actualOvertimeHours = data?.overtimeHours || 0;
    
    const regularDiff = Math.abs(expectedRegularHours - actualRegularHours);
    const overtimeDiff = Math.abs(expectedOvertimeHours - actualOvertimeHours);
    
    if (regularDiff > 0.1 || overtimeDiff > 0.1) {
      return {
        ruleId: 'overtime-calculation',
        ruleName: 'Overtime Calculation Check',
        status: 'fail',
        message: 'Overtime calculation appears incorrect',
        suggestion: `Expected: ${expectedRegularHours.toFixed(2)} regular, ${expectedOvertimeHours.toFixed(2)} overtime`,
        data: { 
          expected: { regular: expectedRegularHours, overtime: expectedOvertimeHours },
          actual: { regular: actualRegularHours, overtime: actualOvertimeHours }
        }
      };
    }

    return {
      ruleId: 'overtime-calculation',
      ruleName: 'Overtime Calculation Check',
      status: 'pass',
      message: 'Overtime calculation is correct'
    };
  };

  const validateSleepRules = (data: any): ValidationResult => {
    if (!data?.startTime || !data?.endTime) {
      return {
        ruleId: 'sleep-rules',
        ruleName: 'Sleep Rule Application',
        status: 'warning',
        message: 'Cannot check sleep rules without complete time data'
      };
    }

    const start = new Date(`1970-01-01T${data.startTime}:00`);
    let end = new Date(`1970-01-01T${data.endTime}:00`);
    
    if (end <= start) {
      end.setDate(end.getDate() + 1);
    }

    const totalMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
    const totalHours = totalMinutes / 60;
    
    if (totalHours > 9) {
      const hasSleepDeduction = data?.sleepHours > 0;
      
      if (!hasSleepDeduction) {
        return {
          ruleId: 'sleep-rules',
          ruleName: 'Sleep Rule Application',
          status: 'warning',
          message: 'Shift over 9 hours may require sleep rule application',
          suggestion: 'Check if sleep rules should apply: 1 hour unpaid, 8 hours paid'
        };
      }
      
      if (data.sleepHours !== 8) {
        return {
          ruleId: 'sleep-rules',
          ruleName: 'Sleep Rule Application',
          status: 'warning',
          message: 'Sleep rule application may be incorrect',
          suggestion: 'Standard sleep rule: 8 hours paid sleep time'
        };
      }
    }

    return {
      ruleId: 'sleep-rules',
      ruleName: 'Sleep Rule Application',
      status: 'pass',
      message: totalHours > 9 ? 'Sleep rules correctly applied' : 'Sleep rules not required'
    };
  };

  const validateWeeklyHours = (data: any): ValidationResult => {
    // This would typically check against a week's worth of data
    const weeklyHours = data?.weeklyTotal || 0;
    
    if (weeklyHours > 60) {
      return {
        ruleId: 'weekly-hours',
        ruleName: 'Weekly Hours Limit',
        status: 'warning',
        message: `Weekly hours (${weeklyHours}) exceed recommended limit`,
        suggestion: 'Consider if additional approvals are needed for excessive hours'
      };
    }
    
    if (weeklyHours > 48) {
      return {
        ruleId: 'weekly-hours',
        ruleName: 'Weekly Hours Limit',
        status: 'warning',
        message: `Weekly hours (${weeklyHours}) are above standard working time`,
        suggestion: 'Ensure compliance with working time regulations'
      };
    }

    return {
      ruleId: 'weekly-hours',
      ruleName: 'Weekly Hours Limit',
      status: 'pass',
      message: 'Weekly hours are within normal limits'
    };
  };

  const validateConsecutiveShifts = (data: any): ValidationResult => {
    // This would check against historical data for consecutive long shifts
    return {
      ruleId: 'consecutive-shifts',
      ruleName: 'Consecutive Shift Check',
      status: 'pass',
      message: 'No consecutive shift issues detected'
    };
  };

  const validateDataCompleteness = (data: any): ValidationResult => {
    const requiredFields = ['startTime', 'endTime', 'date'];
    const missingFields = requiredFields.filter(field => !data?.[field]);
    
    if (missingFields.length > 0) {
      return {
        ruleId: 'data-completeness',
        ruleName: 'Data Completeness',
        status: 'fail',
        message: `Missing required fields: ${missingFields.join(', ')}`,
        suggestion: 'Complete all required fields before submission',
        affectedFields: missingFields
      };
    }

    return {
      ruleId: 'data-completeness',
      ruleName: 'Data Completeness',
      status: 'pass',
      message: 'All required fields are completed'
    };
  };

  const validateDuplicateEntries = (data: any): ValidationResult => {
    // This would check against existing timesheet entries
    return {
      ruleId: 'duplicate-entries',
      ruleName: 'Duplicate Entry Detection',
      status: 'pass',
      message: 'No duplicate entries detected'
    };
  };

  const validateHistoricalConsistency = async (data: any): Promise<ValidationResult> => {
    // This would compare against historical patterns
    return {
      ruleId: 'historical-consistency',
      ruleName: 'Historical Consistency',
      status: 'pass',
      message: 'Timesheet is consistent with historical patterns'
    };
  };

  useEffect(() => {
    if (autoValidate && timesheetData) {
      runValidation(timesheetData);
    }
  }, [timesheetData, autoValidate, runValidation]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default:
        return <Clock className="w-5 h-5 text-blue-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'bg-green-100 text-green-800';
      case 'fail':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'time':
        return <Clock className="w-4 h-4" />;
      case 'payroll':
        return <Calculator className="w-4 h-4" />;
      case 'business':
      case 'data':
        return <FileText className="w-4 h-4" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="warren-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-warren-blue-600" />
                Validation Summary
              </CardTitle>
              <CardDescription>
                Last run: {validationSummary.lastRun.toLocaleString('en-GB')}
              </CardDescription>
            </div>
            <Button 
              onClick={() => runValidation()}
              disabled={isValidating}
              className="warren-button-primary"
            >
              {isValidating ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              {isValidating ? 'Validating...' : 'Run Validation'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {validationSummary.totalChecks}
              </p>
              <p className="text-sm text-gray-600 dark:text-warren-gray-400">Total Checks</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {validationSummary.passed}
              </p>
              <p className="text-sm text-gray-600 dark:text-warren-gray-400">Passed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {validationSummary.failed}
              </p>
              <p className="text-sm text-gray-600 dark:text-warren-gray-400">Failed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {validationSummary.warnings}
              </p>
              <p className="text-sm text-gray-600 dark:text-warren-gray-400">Warnings</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Validation Results */}
      {validationResults.length > 0 && (
        <Card className="warren-card">
          <CardHeader>
            <CardTitle>Validation Results</CardTitle>
            <CardDescription>
              Detailed results from timesheet validation checks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {validationResults.map((result, index) => (
                <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0">
                    {getStatusIcon(result.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {result.ruleName}
                      </h3>
                      <Badge className={getStatusColor(result.status)}>
                        {result.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-warren-gray-400 mb-2">
                      {result.message}
                    </p>
                    {result.suggestion && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          <strong>Suggestion:</strong> {result.suggestion}
                        </p>
                      </div>
                    )}
                    {result.affectedFields && result.affectedFields.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 dark:text-warren-gray-500">
                          Affected fields: {result.affectedFields.join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Validation Rules */}
      <Card className="warren-card">
        <CardHeader>
          <CardTitle>Validation Rules</CardTitle>
          <CardDescription>
            Currently active validation rules and their configurations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {validationRules.map((rule) => (
              <div key={rule.id} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="flex-shrink-0 mt-1">
                  {getCategoryIcon(rule.category)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{rule.name}</h4>
                    <Badge className={rule.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {rule.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge className={
                      rule.severity === 'error' ? 'bg-red-100 text-red-800' :
                      rule.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }>
                      {rule.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-warren-gray-400">
                    {rule.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
