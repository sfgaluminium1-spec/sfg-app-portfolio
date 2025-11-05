
/**
 * PDF Generator for SFG Timesheet Templates
 * Generates professional A4 landscape timesheets matching the Excel template
 */

export interface TimesheetData {
  employee: {
    name: string;
    id: string;
    department: string;
  };
  weekEnding: string;
  shifts: Array<{
    day: string;
    date: string;
    startTime: string;
    endTime: string;
    totalHours: number;
    breakDuration: string;
    overtimeHours: number;
    notes: string;
  }>;
  summary: {
    totalHours: number;
    overtimeHours: number;
    absences: string;
    authorizedLeave: string;
    travelTime: number;
  };
  supervisor?: {
    name: string;
    approved: boolean;
    date: string;
  };
}

export class TimesheetPDFGenerator {
  static async generatePDF(data: TimesheetData): Promise<Blob> {
    // Using jsPDF for client-side PDF generation
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF('landscape', 'mm', 'a4');
    
    // A4 Landscape dimensions: 297mm x 210mm
    const pageWidth = 297;
    const pageHeight = 210;
    
    // Header with logo placeholder
    doc.setFillColor(240, 240, 240);
    doc.rect(10, 10, 50, 25, 'F'); // Logo placeholder
    doc.setFontSize(8);
    doc.text('Logo Here', 35, 23, { align: 'center' });
    
    // Main title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('SFG Aluminium Limited - Weekly Timesheet', pageWidth/2, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text('Submission Form', pageWidth/2, 28, { align: 'center' });
    
    // Employee details section
    let yPos = 45;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    doc.text(`Employee Name: ${data.employee.name}`, 15, yPos);
    doc.text(`Employee ID: ${data.employee.id}`, 120, yPos);
    doc.text(`Week Ending: ${data.weekEnding}`, 200, yPos);
    
    yPos += 15;
    
    // Table headers
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    
    const headers = ['Day', 'Date', 'Start', 'End', 'Total Hrs', 'Breaks', 'OT Hrs', 'Notes'];
    const colWidths = [25, 30, 25, 25, 25, 25, 25, 80];
    let xPos = 15;
    
    // Draw header background
    doc.setFillColor(220, 220, 220);
    doc.rect(15, yPos - 5, 260, 10, 'F');
    
    // Draw headers
    headers.forEach((header, index) => {
      doc.text(header, xPos + colWidths[index]/2, yPos, { align: 'center' });
      xPos += colWidths[index];
    });
    
    yPos += 10;
    
    // Table data
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    
    data.shifts.forEach((shift, index) => {
      if (index % 2 === 0) {
        doc.setFillColor(250, 250, 250);
        doc.rect(15, yPos - 3, 260, 8, 'F');
      }
      
      xPos = 15;
      const values = [
        shift.day,
        shift.date,
        shift.startTime,
        shift.endTime,
        shift.totalHours.toFixed(2),
        shift.breakDuration,
        shift.overtimeHours.toFixed(2),
        shift.notes
      ];
      
      values.forEach((value, colIndex) => {
        const cellWidth = colWidths[colIndex];
        if (colIndex === 7) { // Notes column - left aligned
          doc.text(value.toString(), xPos + 2, yPos);
        } else {
          doc.text(value.toString(), xPos + cellWidth/2, yPos, { align: 'center' });
        }
        xPos += cellWidth;
      });
      
      yPos += 8;
    });
    
    // Weekly Summary
    yPos += 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Weekly Summary', 15, yPos);
    yPos += 10;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`Total Hours Worked: ${data.summary.totalHours.toFixed(2)}`, 15, yPos);
    doc.text(`Total Overtime Hours: ${data.summary.overtimeHours.toFixed(2)}`, 120, yPos);
    yPos += 8;
    doc.text(`Absences/Unauthorised Leave: ${data.summary.absences}`, 15, yPos);
    doc.text(`Travel Time Paid: ${data.summary.travelTime.toFixed(2)} hours`, 120, yPos);
    yPos += 8;
    doc.text(`Authorised Leave/Sick Leave: ${data.summary.authorizedLeave}`, 15, yPos);
    
    // Employee Declaration
    yPos += 15;
    doc.setFont('helvetica', 'bold');
    doc.text('Employee Declaration', 15, yPos);
    yPos += 8;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const declaration = 'I confirm that the above hours worked and absences are true and accurate to the best of my knowledge. I understand timesheets must be submitted by Tuesday 16:00 weekly. Late or incomplete submissions may result in delayed or reduced pay.';
    doc.text(declaration, 15, yPos, { maxWidth: 260 });
    
    yPos += 20;
    doc.text('Employee Signature: _______________________', 15, yPos);
    doc.text('Date: _______________________', 180, yPos);
    
    // Supervisor Approval
    yPos += 15;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('Supervisor Approval', 15, yPos);
    yPos += 8;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('I confirm that I have verified the accuracy of this timesheet and all hours worked comply with company policy and regulations.', 15, yPos, { maxWidth: 260 });
    
    yPos += 15;
    doc.text('Supervisor Name: _________________________', 15, yPos);
    doc.text('Date: _______________________', 180, yPos);
    yPos += 8;
    doc.text('Signature: _______________________________', 15, yPos);
    
    // Instructions footer
    yPos = pageHeight - 25;
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text('Instructions for Employees:', 15, yPos);
    yPos += 4;
    doc.setFont('helvetica', 'normal');
    const instructions = [
      '• Enter exact start and end times including breaks',
      '• Break deductions are mandatory unless covered under sleep rule paid overlap',  
      '• Submit timesheet by Tuesday 16:00 weekly, without fail',
      '• Use notes section for special remarks (late arrival, early departure, travel, etc.)'
    ];
    
    instructions.forEach(instruction => {
      doc.text(instruction, 15, yPos);
      yPos += 3;
    });
    
    // Border around entire page
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
    
    return doc.output('blob');
  }
  
  static async downloadPDF(data: TimesheetData, filename?: string) {
    const blob = await this.generatePDF(data);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `timesheet-${data.employee.name}-${data.weekEnding}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
  
  static async printPDF(data: TimesheetData) {
    const blob = await this.generatePDF(data);
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url);
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
    URL.revokeObjectURL(url);
  }
}
