
/**
 * SFG Aluminium Limited - Truth File Configuration
 * Version: v1.2.3
 * Non-Negotiables: Do not modify without written approval from Warren, Yanika, or Pawel (min 2 of 3)
 */

export const SFG_CONFIG = {
  // Authority to Change (Non-Negotiables only)
  APPROVERS: [
    'Warren Heathcote (Operations Manager)',
    'Yanika Heathcote (Admin/Director)',
    'Pawel Marzec (Operations Manager)'
  ],
  
  // Required fields for stage progression
  REQUIRED_FIELDS: [
    'baseNumber',
    'customer',
    'project',
    'location',
    'productType',
    'deliveryType',
    'enquiryInitialCount'
  ],
  
  // Project Status Colors
  STATUS_COLORS: {
    ENQ: { color: '#FFFFFF', bg: '#F9FAFB', border: '#E5E7EB', name: 'Enquiry' },
    QUO: { color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE', name: 'Quote' },
    ORD: { color: '#F59E0B', bg: '#FEF3C7', border: '#FDE68A', name: 'Order' },
    INV: { color: '#9333EA', bg: '#FAF5FF', border: '#E9D5FF', name: 'Invoice' },
    DEL: { color: '#1E3A8A', bg: '#DBEAFE', border: '#93C5FD', name: 'Delivered' },
    PAID: { color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0', name: 'Paid' },
    MISSING: { color: '#DC2626', bg: '#FEF2F2', border: '#FECACA', name: 'Missing Fields' }
  },
  
  // Email and Filename Patterns
  EMAIL_SUBJECT_PATTERN: '[{baseNumber}-{prefix}] → CUS {customer} → {project} → {location} → {productType} → {deliveryType} — SFG Aluminium — Customer Order nr {customerOrderNumber}',
  
  FILENAME_PATTERNS: {
    QUOTE: '{baseNumber}-{prefix}_Quote_{revision}.pdf',
    PURCHASE_ORDER: '{baseNumber}-{prefix}_Customer_PO_{poNumber}.pdf',
    RFQ: '{baseNumber}-SFG-ENQ_RFQ_{category}.pdf'
  },
  
  // Drawing Workflow Stages (sequential, no skipping)
  DRAWING_WORKFLOW: [
    { code: '05a', name: 'Incoming Requests', order: 1 },
    { code: '05b', name: 'SFG Issue', order: 2 },
    { code: '05c', name: 'Change Requests', order: 3 },
    { code: '05d', name: 'Confirmations', order: 4 },
    { code: '05e', name: 'Approval', order: 5 },
    { code: '05f', name: 'Live Drawings', order: 6 },
    { code: '05g', name: 'Rejected Designs', order: 7 }
  ],
  
  // Approved Document Types
  APPROVED_DOC_TYPES: [
    { code: '10a', name: 'Quotation Approved', type: 'QUOTATION' },
    { code: '10b', name: 'Purchase Order Received', type: 'PURCHASE_ORDER' },
    { code: '10c', name: 'Drawing Approved', type: 'DRAWING' },
    { code: '10d', name: 'Customer Agreements Mirror', type: 'AGREEMENT' }
  ],
  
  // Folder Structure (Non-Negotiable order)
  FOLDER_STRUCTURE: [
    '01 Enquiry',
    '02 Customer Replies',
    '03 SFG Quotes',
    '04 Customer Orders (Inbound)',
    '05 Drawings',
    '05 Drawings/05a Incoming Requests',
    '05 Drawings/05b SFG Issue',
    '05 Drawings/05c Change Requests',
    '05 Drawings/05d Confirmations',
    '05 Drawings/05e Approval',
    '05 Drawings/05f Live Drawings',
    '05 Drawings/05g Rejected Designs',
    '06 Site Photos',
    '07 Customers',
    '07 Customers/07a RFQs',
    '07 Customers/07b POs',
    '08 Waiting For Approval',
    '09 Invoicing',
    '10 Approved Documents (locked)',
    '10 Approved Documents (locked)/10a Quotation Approved',
    '10 Approved Documents (locked)/10b Purchase Order Received',
    '10 Approved Documents (locked)/10c Drawing Approved',
    '10 Approved Documents (locked)/10d Customer Agreements Mirror',
    '11 O&Ms',
    '12 Compliance',
    '13 Customer Contacts',
    '13 Customer Contacts/13a Primary',
    '13 Customer Contacts/13b Accounts',
    '13 Customer Contacts/13c Site',
    '14 Misc',
    '17 Completed Pack',
    '17 Completed Pack/17a Invoices (Customer)',
    '17 Completed Pack/17b Delivery Notes (Prepared but un-signed)',
    '17 Completed Pack/17c Delivery Notes (signed)',
    '17 Completed Pack/17d O&M Final',
    '17 Completed Pack/17e Completion Certificates/Warranty'
  ],
  
  // Canonical Paths (for future SharePoint integration)
  CANONICAL_PATHS: {
    ACTIVE_ROOT: '/sites/Files/SFG Aluminium/2025 SFG Aluminium/Active',
    COMPLETED_ROOT: '/sites/Files/SFG Aluminium/2025 SFG Aluminium/Completed',
    MONTH_ACCESS_ROOT: '/sites/Files/SFG Aluminium/2025 SFG Aluminium'
  },
  
  // Product Type List (placeholder - to be populated from database)
  PRODUCT_TYPES: [
    'Aluminium Windows',
    'Aluminium Doors',
    'Curtain Walling',
    'Brise Soleil',
    'Balustrades',
    'Rooflight Systems',
    'Other'
  ],
  
  // Delivery Types
  DELIVERY_TYPES: [
    { value: 'SUPPLY_ONLY', label: 'Supply Only' },
    { value: 'COLLECTED', label: 'Collected' },
    { value: 'SUPPLY_AND_INSTALL', label: 'Supply & Install' }
  ],
  
  // Xero Integration Settings
  XERO: {
    // Temporary default: Option A (SFG-first)
    CONTACT_FLOW: 'SFG_FIRST', // 'SFG_FIRST' or 'XERO_FIRST'
    MANDATORY_FIELDS: [
      'contactName',
      'primaryEmail',
      'billingAddressLine1',
      'billingCity',
      'billingPostcode'
    ]
  },
  
  // Tier Routing Rules
  TIER_ROUTING: {
    PRE_INVOICE: ['T1_OPS', 'T1_ESTIMATING'],
    POST_INVOICE: ['T2_ACCOUNTS', 'T3_UPPER_MANAGEMENT'],
    EMERGENCY_OVERRIDE: true
  }
} as const

export type ProjectStatusKey = keyof typeof SFG_CONFIG.STATUS_COLORS

export function getStatusColor(status: ProjectStatusKey) {
  return SFG_CONFIG.STATUS_COLORS[status] || SFG_CONFIG.STATUS_COLORS.MISSING
}

export function validateRequiredFields(project: any): { isValid: boolean; missingFields: string[] } {
  const missingFields = SFG_CONFIG.REQUIRED_FIELDS.filter(field => {
    const value = project[field]
    return value === null || value === undefined || value === ''
  })
  
  return {
    isValid: missingFields.length === 0,
    missingFields
  }
}

export function canProgressToStatus(currentStatus: ProjectStatusKey, project: any): { allowed: boolean; reason?: string } {
  // Block QUO→ORD progression if required fields are missing
  if (currentStatus === 'ENQ' && project.targetStatus === 'QUO') {
    const validation = validateRequiredFields(project)
    if (!validation.isValid) {
      return {
        allowed: false,
        reason: `Missing required fields: ${validation.missingFields.join(', ')}`
      }
    }
  }
  
  if (currentStatus === 'QUO' && project.targetStatus === 'ORD') {
    const validation = validateRequiredFields(project)
    if (!validation.isValid) {
      return {
        allowed: false,
        reason: `Missing required fields: ${validation.missingFields.join(', ')}`
      }
    }
    
    if (!project.enquiryInitialCount || !project.currentProductCount) {
      return {
        allowed: false,
        reason: 'Product count must be set before creating order'
      }
    }
  }
  
  return { allowed: true }
}

export function getDrawingWorkflowStage(code: string) {
  return SFG_CONFIG.DRAWING_WORKFLOW.find(stage => stage.code === code)
}

export function canProgressDrawingWorkflow(currentCode: string, targetCode: string): boolean {
  const current = getDrawingWorkflowStage(currentCode)
  const target = getDrawingWorkflowStage(targetCode)
  
  if (!current || !target) return false
  
  // Can only progress to next stage (no skipping)
  return target.order === current.order + 1
}
