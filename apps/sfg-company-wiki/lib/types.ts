
import { Prisma } from '@prisma/client'

// User tier levels matching SFG Aluminium staff structure
export enum UserTierLevel {
  CEO = 'CEO',           // Tier 1 - CEO/Exec
  FINANCE = 'FINANCE',   // Tier 2 - Finance & Estimation
  SALES = 'SALES'        // Tier 3 - Sales & Design
}

// Tier color mapping for UI
export const TIER_COLORS = {
  CEO: {
    primary: '#2563EB',
    ring: '#2563EB',
    card: 'opaque',
    border: '#263247',
    name: 'CEO/Executive'
  },
  FINANCE: {
    primary: '#3B82F6',
    ring: '#3B82F6',
    card: 'glass-medium',
    border: '#202938',
    name: 'Finance & Estimation'
  },
  SALES: {
    primary: '#60A5FA',
    ring: '#60A5FA',
    card: 'glass-light',
    border: '#2B3950',
    name: 'Sales & Design'
  }
}

// Tier permissions
export const TIER_PERMISSIONS = {
  CEO: {
    canViewFinancials: true,
    canEditPricing: true,
    canManageUsers: true,
    canViewAllProjects: true,
    canApproveContracts: true,
    canAccessAdminSettings: true
  },
  FINANCE: {
    canViewFinancials: true,
    canEditPricing: true,
    canManageUsers: false,
    canViewAllProjects: true,
    canApproveContracts: false,
    canAccessAdminSettings: false
  },
  SALES: {
    canViewFinancials: false,
    canEditPricing: false,
    canManageUsers: false,
    canViewAllProjects: false,
    canApproveContracts: false,
    canAccessAdminSettings: false
  }
}

export type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    procedures: true
    conflictReports: true
  }
}>

export type ProcedureWithDetails = Prisma.ProcedureGetPayload<{
  include: {
    category: true
    createdBy: true
    conflicts: true
    crossReferences: {
      include: {
        targetProcedure: {
          include: {
            category: true
          }
        }
      }
    }
    referencedIn: {
      include: {
        sourceProcedure: {
          include: {
            category: true
          }
        }
      }
    }
    attachments: true
  }
}>

export type CategoryWithProcedures = Prisma.CategoryGetPayload<{
  include: {
    procedures: {
      include: {
        createdBy: true
        conflicts: true
      }
    }
    children: true
    parent: true
  }
}>

export type ConflictReportWithDetails = Prisma.ConflictReportGetPayload<{
  include: {
    procedure: {
      include: {
        category: true
      }
    }
    relatedProcedure: {
      include: {
        category: true
      }
    }
    reportedBy: true
  }
}>

export type ChatSessionWithMessages = Prisma.ChatSessionGetPayload<{
  include: {
    messages: true
    user: true
  }
}>

// Search and filtering types
export interface SearchFilters {
  query?: string
  categoryId?: string
  tags?: string[]
  priority?: string
  status?: string
  conflictStatus?: string
  dateRange?: {
    from: Date
    to: Date
  }
}

export interface DashboardStats {
  totalProcedures: number
  totalConflicts: number
  criticalConflicts: number
  recentUpdates: number
  categoryCounts: Record<string, number>
  conflictsBySeverity: Record<string, number>
  proceduresByStatus: Record<string, number>
}

// Import/Export types
export interface ImportPreview {
  headers: string[]
  sampleRows: string[][]
  totalRows: number
  mapping: Record<string, string>
}

export interface ExportOptions {
  format: 'csv' | 'json' | 'pdf'
  categories?: string[]
  includeArchived?: boolean
  dateRange?: {
    from: Date
    to: Date
  }
}

// RAG types
export interface RAGResponse {
  answer: string
  sources: {
    id: string
    title: string
    category: string
    relevance: number
  }[]
  confidence: number
}

// Workflow types
export interface WorkflowNode {
  id: string
  title: string
  category: string
  type: 'procedure' | 'decision' | 'action'
  dependencies: string[]
  position: { x: number; y: number }
}

export interface WorkflowEdge {
  id: string
  source: string
  target: string
  type: 'depends' | 'conflicts' | 'related'
  label?: string
}
