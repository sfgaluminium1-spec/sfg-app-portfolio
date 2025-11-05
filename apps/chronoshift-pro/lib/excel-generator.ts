
/**
 * Excel Generator for SFG Timesheet Export
 * Creates professional Excel workbooks with formulas, validation, and protection
 */

import ExcelJS from 'exceljs';
import { TimesheetData } from './pdf-generator';

export interface ExcelExportOptions {
  includeFormulas: boolean;
  protectSheets: boolean;
  password?: string;
  includeInstructions: boolean;
  templateMode: boolean;
}

export class TimesheetExcelGenerator {
  static async generateExcel(
    data: TimesheetData[], 
    options: ExcelExportOptions = {
      includeFormulas: true,
      protectSheets: false,
      includeInstructions: true,
      templateMode: false
    }
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    
    // Set workbook properties
    workbook.creator = 'ChronoShift Pro - SFG Aluminium Ltd';
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.lastPrinted = new Date();
    
    // Create main timesheet worksheet
    const worksheet = workbook.addWorksheet('Timesheets', {
      properties: {
        defaultRowHeight: 20,
        defaultColWidth: 12
      },
      pageSetup: {
        paperSize: 9, // A4
        orientation: 'landscape',
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 0
      }
    });

    // Set column widths and headers
    const columns = [
      { key: 'employeeName', header: 'Employee Name', width: 20 },
      { key: 'employeeId', header: 'Employee ID', width: 15 },
      { key: 'department', header: 'Department', width: 15 },
      { key: 'date', header: 'Date', width: 12 },
      { key: 'dayOfWeek', header: 'Day', width: 10 },
      { key: 'startTime', header: 'Start Time', width: 12 },
      { key: 'endTime', header: 'End Time', width: 12 },
      { key: 'breakMinutes', header: 'Break (min)', width: 12 },
      { key: 'totalHours', header: 'Total Hours', width: 12 },
      { key: 'regularHours', header: 'Regular Hours', width: 12 },
      { key: 'overtimeHours', header: 'Overtime Hours', width: 12 },
      { key: 'nightHours', header: 'Night Hours', width: 12 },
      { key: 'sleepHours', header: 'Sleep Hours', width: 12 },
      { key: 'notes', header: 'Notes', width: 25 },
      { key: 'status', header: 'Status', width: 12 }
    ];

    worksheet.columns = columns;

    // Style the header row
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF2563EB' }
    };
    headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
    headerRow.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };

    // Add data rows
    let currentRow = 2;
    data.forEach((timesheet) => {
      timesheet.shifts.forEach((shift, index) => {
        const row = worksheet.getRow(currentRow);
        
        // Only show employee details on first shift entry
        if (index === 0) {
          row.getCell('employeeName').value = timesheet.employee.name;
          row.getCell('employeeId').value = timesheet.employee.id;
          row.getCell('department').value = timesheet.employee.department;
        }
        
        row.getCell('date').value = new Date(shift.date);
        row.getCell('dayOfWeek').value = shift.day;
        row.getCell('startTime').value = shift.startTime;
        row.getCell('endTime').value = shift.endTime;
        row.getCell('breakMinutes').value = parseInt(shift.breakDuration) || 30;
        row.getCell('totalHours').value = shift.totalHours;
        row.getCell('regularHours').value = Math.min(shift.totalHours, 8.5);
        row.getCell('overtimeHours').value = shift.overtimeHours;
        row.getCell('nightHours').value = 0; // Calculate based on shift times
        row.getCell('sleepHours').value = 0; // Calculate based on sleep rules
        row.getCell('notes').value = shift.notes;
        row.getCell('status').value = 'SUBMITTED';

        // Add formulas if requested
        if (options.includeFormulas) {
          const totalHoursCell = row.getCell('totalHours');
          const startCell = row.getCell('startTime');
          const endCell = row.getCell('endTime');
          const breakCell = row.getCell('breakMinutes');
          
          totalHoursCell.value = {
            formula: `=IF(AND(${startCell.address}<>"",${endCell.address}<>""),((${endCell.address}-${startCell.address})*24)-(${breakCell.address}/60),0)`,
            result: shift.totalHours
          };
          
          const regularHoursCell = row.getCell('regularHours');
          regularHoursCell.value = {
            formula: `=MIN(${totalHoursCell.address},8.5)`,
            result: Math.min(shift.totalHours, 8.5)
          };
          
          const overtimeHoursCell = row.getCell('overtimeHours');
          overtimeHoursCell.value = {
            formula: `=MAX(0,${totalHoursCell.address}-8.5)`,
            result: shift.overtimeHours
          };
        }

        // Style data rows
        row.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        
        // Alternate row colors
        if (currentRow % 2 === 0) {
          row.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF8FAFC' }
          };
        }

        currentRow++;
      });
      
      // Add summary row for each employee
      const summaryRow = worksheet.getRow(currentRow);
      summaryRow.getCell('employeeName').value = `${timesheet.employee.name} - TOTAL`;
      summaryRow.getCell('totalHours').value = timesheet.summary.totalHours;
      summaryRow.getCell('overtimeHours').value = timesheet.summary.overtimeHours;
      summaryRow.font = { bold: true };
      summaryRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFECFCCB' }
      };
      currentRow += 2; // Add spacing
    });

    // Add summary section
    this.addSummarySection(worksheet, currentRow, data);

    // Add validation for time entries
    this.addDataValidation(worksheet, currentRow);

    // Create instructions sheet if requested
    if (options.includeInstructions) {
      this.createInstructionsSheet(workbook);
    }

    // Create template sheet if requested
    if (options.templateMode) {
      this.createTemplateSheet(workbook);
    }

    // Protect sheets if requested
    if (options.protectSheets && options.password) {
      await this.protectWorksheet(worksheet, options.password);
    }

    // Generate buffer
    return await workbook.xlsx.writeBuffer() as Buffer;
  }

  private static addSummarySection(worksheet: ExcelJS.Worksheet, startRow: number, data: TimesheetData[]) {
    const totalHours = data.reduce((sum, t) => sum + t.summary.totalHours, 0);
    const totalOvertimeHours = data.reduce((sum, t) => sum + t.summary.overtimeHours, 0);
    const totalEmployees = data.length;

    worksheet.getCell(`A${startRow}`).value = 'WEEKLY SUMMARY';
    worksheet.getCell(`A${startRow}`).font = { bold: true, size: 14 };
    
    worksheet.getCell(`A${startRow + 2}`).value = 'Total Employees:';
    worksheet.getCell(`B${startRow + 2}`).value = totalEmployees;
    
    worksheet.getCell(`A${startRow + 3}`).value = 'Total Hours:';
    worksheet.getCell(`B${startRow + 3}`).value = totalHours;
    
    worksheet.getCell(`A${startRow + 4}`).value = 'Total Overtime:';
    worksheet.getCell(`B${startRow + 4}`).value = totalOvertimeHours;
    
    worksheet.getCell(`A${startRow + 5}`).value = 'Average Hours/Employee:';
    worksheet.getCell(`B${startRow + 5}`).value = totalEmployees > 0 ? totalHours / totalEmployees : 0;
  }

  private static addDataValidation(worksheet: ExcelJS.Worksheet, endRow: number) {
    // Time format validation
    worksheet.getColumn('startTime').eachCell((cell, rowNumber) => {
      if (rowNumber > 1 && rowNumber < endRow) {
        cell.dataValidation = {
          type: 'custom',
          allowBlank: false,
          formulae: ['=AND(LEN(A2)=5,MID(A2,3,1)=":",VALUE(LEFT(A2,2))<=23,VALUE(RIGHT(A2,2))<=59)'],
          showErrorMessage: true,
          errorStyle: 'error',
          errorTitle: 'Invalid Time',
          error: 'Please enter time in HH:MM format (24-hour)'
        };
      }
    });

    worksheet.getColumn('endTime').eachCell((cell, rowNumber) => {
      if (rowNumber > 1 && rowNumber < endRow) {
        cell.dataValidation = {
          type: 'custom',
          allowBlank: false,
          formulae: ['=AND(LEN(B2)=5,MID(B2,3,1)=":",VALUE(LEFT(B2,2))<=23,VALUE(RIGHT(B2,2))<=59)'],
          showErrorMessage: true,
          errorStyle: 'error',
          errorTitle: 'Invalid Time',
          error: 'Please enter time in HH:MM format (24-hour)'
        };
      }
    });

    // Status dropdown validation
    worksheet.getColumn('status').eachCell((cell, rowNumber) => {
      if (rowNumber > 1 && rowNumber < endRow) {
        cell.dataValidation = {
          type: 'list',
          allowBlank: false,
          formulae: ['"DRAFT,SUBMITTED,APPROVED,REJECTED"'],
          showErrorMessage: true,
          errorStyle: 'error',
          errorTitle: 'Invalid Status',
          error: 'Please select a valid status from the dropdown'
        };
      }
    });
  }

  private static createInstructionsSheet(workbook: ExcelJS.Workbook) {
    const instructionsSheet = workbook.addWorksheet('Instructions & Manual');
    
    const instructions = [
      ['SFG ALUMINIUM LTD - TIMESHEET SYSTEM USER MANUAL', '', '', ''],
      ['', '', '', ''],
      ['VERSION:', '2.0', 'DATE:', new Date().toLocaleDateString('en-GB')],
      ['', '', '', ''],
      ['SECTION 1: GETTING STARTED', '', '', ''],
      ['1.1 System Overview', 'ChronoShift Pro is your digital timesheet solution', '', ''],
      ['1.2 Login Requirements', 'Use your employee credentials to access the system', '', ''],
      ['1.3 Navigation', 'Use the main menu to access different features', '', ''],
      ['', '', '', ''],
      ['SECTION 2: TIMESHEET ENTRY', '', '', ''],
      ['2.1 Daily Entry', 'Enter start and end times for each work day', '', ''],
      ['2.2 Break Times', 'Default 30-minute break is automatically deducted', '', ''],
      ['2.3 Notes Section', 'Add details about travel, delays, or special circumstances', '', ''],
      ['2.4 Sleep Rule', '9-hour rest period: 1 hour unpaid, 8 hours paid', '', ''],
      ['', '', '', ''],
      ['SECTION 3: SUPERVISOR APPROVAL', '', '', ''],
      ['3.1 Submit Timesheet', 'Submit by Tuesday 16:00 for weekly processing', '', ''],
      ['3.2 Approval Process', 'Supervisors review and approve submitted timesheets', '', ''],
      ['3.3 Corrections', 'Rejected timesheets must be corrected and resubmitted', '', ''],
      ['', '', '', ''],
      ['SECTION 4: CALCULATIONS', '', '', ''],
      ['4.1 Regular Hours', 'Up to 8.5 hours per day at standard rate', '', ''],
      ['4.2 Overtime Hours', 'Hours above 8.5 per day at 1.5x rate', '', ''],
      ['4.3 Night Work', 'Work between 22:00-06:00 may have additional rates', '', ''],
      ['4.4 Sleep Allowance', 'For shifts over 9 hours: 1 hour unpaid, 8 hours paid', '', ''],
      ['', '', '', ''],
      ['SECTION 5: TROUBLESHOOTING', '', '', ''],
      ['5.1 Common Issues', '', '', ''],
      ['- Unable to login', 'Contact your supervisor or IT support', '', ''],
      ['- Timesheet locked', 'Use unlock toggle or contact admin', '', ''],
      ['- Formula errors', 'Check time format (HH:MM) and ensure end > start', '', ''],
      ['- Missing data', 'All fields must be completed before submission', '', ''],
      ['', '', '', ''],
      ['5.2 Excel-Specific Help', '', '', ''],
      ['- Protect/Unprotect', 'Use toggle button to lock/unlock sheets', '', ''],
      ['- Formula Protection', 'Calculation cells are locked to prevent errors', '', ''],
      ['- Data Validation', 'Dropdown lists ensure consistent data entry', '', ''],
      ['', '', '', ''],
      ['SECTION 6: SECURITY & BACKUP', '', '', ''],
      ['6.1 Password Protection', 'Sheets are password protected against unauthorized changes', '', ''],
      ['6.2 Data Backup', 'Regular backups ensure data safety', '', ''],
      ['6.3 Access Control', 'Only authorized personnel can modify protected areas', '', ''],
      ['', '', '', ''],
      ['SECTION 7: SUPPORT CONTACTS', '', '', ''],
      ['IT Support:', 'support@sfgaluminium.co.uk', '', ''],
      ['Payroll Queries:', 'payroll@sfgaluminium.co.uk', '', ''],
      ['General Help:', 'help@sfgaluminium.co.uk', '', ''],
      ['', '', '', ''],
      ['END OF MANUAL - Version 2.0', '', '', '']
    ];

    instructions.forEach((row, index) => {
      const worksheetRow = instructionsSheet.getRow(index + 1);
      row.forEach((cell, cellIndex) => {
        worksheetRow.getCell(cellIndex + 1).value = cell;
      });
      
      // Style headers
      if (row[0].includes('SECTION') || row[0].includes('MANUAL')) {
        worksheetRow.font = { bold: true, size: 12 };
        worksheetRow.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE3F2FD' }
        };
      }
    });

    // Set column widths
    instructionsSheet.columns = [
      { width: 25 },
      { width: 40 },
      { width: 15 },
      { width: 20 }
    ];
  }

  private static createTemplateSheet(workbook: ExcelJS.Workbook) {
    const templateSheet = workbook.addWorksheet('Blank Template');
    
    // Add company header
    templateSheet.getCell('A1').value = 'SFG ALUMINIUM LTD';
    templateSheet.getCell('A2').value = 'Weekly Timesheet Template';
    templateSheet.getCell('A1').font = { bold: true, size: 16 };
    templateSheet.getCell('A2').font = { bold: true, size: 12 };
    
    // Add employee info section
    templateSheet.getCell('A4').value = 'Employee Name:';
    templateSheet.getCell('C4').value = '[Enter Name]';
    templateSheet.getCell('A5').value = 'Employee ID:';
    templateSheet.getCell('C5').value = '[Enter ID]';
    templateSheet.getCell('A6').value = 'Week Ending:';
    templateSheet.getCell('C6').value = '[Enter Date]';
    
    // Add timesheet table headers
    const headers = ['Day', 'Date', 'Start Time', 'End Time', 'Break (min)', 'Total Hours', 'Notes'];
    headers.forEach((header, index) => {
      templateSheet.getCell(8, index + 1).value = header;
    });
    
    // Style header row
    const headerRow = templateSheet.getRow(8);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE3F2FD' }
    };
    
    // Add days of week
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    days.forEach((day, index) => {
      templateSheet.getCell(9 + index, 1).value = day;
    });
  }

  private static async protectWorksheet(worksheet: ExcelJS.Worksheet, password: string) {
    await worksheet.protect(password, {
      selectLockedCells: true,
      selectUnlockedCells: true,
      formatCells: true,
      formatColumns: true,
      formatRows: true,
      insertColumns: false,
      insertRows: false,
      insertHyperlinks: false,
      deleteColumns: false,
      deleteRows: false,
      sort: false,
      autoFilter: false,
      pivotTables: false
    });
  }

  static async downloadExcel(data: TimesheetData[], filename?: string, options?: ExcelExportOptions) {
    const buffer = await this.generateExcel(data, options);
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `SFG-Timesheets-${new Date().toISOString().split('T')[0]}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export default TimesheetExcelGenerator;
