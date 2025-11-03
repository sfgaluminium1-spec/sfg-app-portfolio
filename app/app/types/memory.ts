/**
 * TypeScript Types and Interfaces for Persistent Memory System
 * Version: 1.0.0
 * Created: November 3, 2025
 * Purpose: Type definitions for the NEXUS Persistent Memory System
 */

// ============================================
// CONVERSATION TYPES
// ============================================

export type ConversationStatus = 'ACTIVE' | 'COMPLETED' | 'ARCHIVED' | 'SUSPENDED';

export interface ConversationMetadata {
  topic?: string;
  tags?: string[];
  participants?: string[];
  relatedEntities?: {
    type: string;
    id: string;
    name: string;
  }[];
  [key: string]: any;
}

export interface ConversationCreateInput {
  title?: string;
  userId?: string;
  metadata?: ConversationMetadata;
}

export interface ConversationUpdateInput {
  title?: string;
  status?: ConversationStatus;
  metadata?: ConversationMetadata;
}

export interface ConversationResponse {
  id: string;
  title?: string;
  startedAt: Date;
  lastActivityAt: Date;
  status: ConversationStatus;
  userId?: string;
  metadata?: ConversationMetadata;
  messageCount?: number;
  planCount?: number;
  decisionCount?: number;
}

// ============================================
// MESSAGE TYPES
// ============================================

export type MessageRole = 'USER' | 'ASSISTANT' | 'SYSTEM';

export interface MessageMetadata {
  tokens?: number;
  model?: string;
  attachments?: string[];
  codeBlocks?: {
    language: string;
    code: string;
  }[];
  references?: string[];
  [key: string]: any;
}

export interface MessageCreateInput {
  conversationId: string;
  role: MessageRole;
  content: string;
  metadata?: MessageMetadata;
}

export interface MessageResponse {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  metadata?: MessageMetadata;
}

// ============================================
// PLAN TYPES
// ============================================

export type PlanStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'ON_HOLD';
export type PlanPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface PlanTask {
  id: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  assignedTo?: string;
  dueDate?: Date;
}

export interface PlanMetadata {
  tasks?: PlanTask[];
  milestones?: {
    name: string;
    dueDate: Date;
    completed: boolean;
  }[];
  dependencies?: string[];
  estimatedHours?: number;
  actualHours?: number;
  [key: string]: any;
}

export interface PlanCreateInput {
  conversationId?: string;
  title: string;
  description: string;
  status?: PlanStatus;
  priority?: PlanPriority;
  metadata?: PlanMetadata;
}

export interface PlanUpdateInput {
  title?: string;
  description?: string;
  status?: PlanStatus;
  priority?: PlanPriority;
  completedAt?: Date | null;
  metadata?: PlanMetadata;
}

export interface PlanResponse {
  id: string;
  conversationId?: string;
  title: string;
  description: string;
  status: PlanStatus;
  priority: PlanPriority;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  metadata?: PlanMetadata;
  decisionCount?: number;
}

// ============================================
// DECISION TYPES
// ============================================

export type DecisionImpact = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface DecisionMetadata {
  alternatives?: {
    option: string;
    pros: string[];
    cons: string[];
  }[];
  affectedSystems?: string[];
  stakeholders?: string[];
  reviewDate?: Date;
  [key: string]: any;
}

export interface DecisionCreateInput {
  conversationId?: string;
  planId?: string;
  title: string;
  description: string;
  rationale?: string;
  madeBy?: string;
  impact?: DecisionImpact;
  metadata?: DecisionMetadata;
}

export interface DecisionUpdateInput {
  title?: string;
  description?: string;
  rationale?: string;
  impact?: DecisionImpact;
  metadata?: DecisionMetadata;
}

export interface DecisionResponse {
  id: string;
  conversationId?: string;
  planId?: string;
  title: string;
  description: string;
  rationale?: string;
  madeAt: Date;
  madeBy?: string;
  impact: DecisionImpact;
  metadata?: DecisionMetadata;
}

// ============================================
// APP REGISTRY TYPES
// ============================================

export type AppType = 
  | 'CORE_SYSTEM'
  | 'SATELLITE_APP'
  | 'INTEGRATION'
  | 'UTILITY'
  | 'REPORT'
  | 'DASHBOARD'
  | 'WORKFLOW'
  | 'API_SERVICE'
  | 'MOBILE_APP'
  | 'OTHER';

export type AppStatus = 
  | 'ACTIVE'
  | 'DEVELOPMENT'
  | 'MAINTENANCE'
  | 'DEPRECATED'
  | 'ARCHIVED';

export interface AppTechnology {
  name: string;
  version?: string;
  type: 'framework' | 'database' | 'language' | 'tool' | 'library';
}

export interface AppApiEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  description?: string;
  requiresAuth?: boolean;
}

export interface AppMetadata {
  dependencies?: string[];
  integrations?: string[];
  version?: string;
  deploymentUrl?: string;
  documentation?: string;
  contactEmail?: string;
  lastDeployment?: Date;
  [key: string]: any;
}

export interface AppRegistryCreateInput {
  appName: string;
  appType: AppType;
  description?: string;
  baseUrl?: string;
  status?: AppStatus;
  technologies?: AppTechnology[];
  owner?: string;
  repositoryPath?: string;
  apiEndpoints?: AppApiEndpoint[];
  metadata?: AppMetadata;
}

export interface AppRegistryUpdateInput {
  appName?: string;
  appType?: AppType;
  description?: string;
  baseUrl?: string;
  status?: AppStatus;
  technologies?: AppTechnology[];
  owner?: string;
  repositoryPath?: string;
  apiEndpoints?: AppApiEndpoint[];
  metadata?: AppMetadata;
}

export interface AppRegistryResponse {
  id: string;
  appName: string;
  appType: AppType;
  description?: string;
  baseUrl?: string;
  status: AppStatus;
  technologies?: AppTechnology[];
  owner?: string;
  registeredAt: Date;
  lastUpdatedAt: Date;
  repositoryPath?: string;
  apiEndpoints?: AppApiEndpoint[];
  metadata?: AppMetadata;
}

// ============================================
// INSTRUCTION TYPES
// ============================================

export type InstructionCategory =
  | 'DEPLOYMENT'
  | 'CONFIGURATION'
  | 'TROUBLESHOOTING'
  | 'BEST_PRACTICE'
  | 'SECURITY'
  | 'INTEGRATION'
  | 'WORKFLOW'
  | 'MAINTENANCE'
  | 'DEVELOPMENT'
  | 'OTHER';

export interface InstructionMetadata {
  tags?: string[];
  relatedApps?: string[];
  prerequisites?: string[];
  estimatedTime?: number; // in minutes
  difficulty?: 'easy' | 'medium' | 'hard';
  [key: string]: any;
}

export interface InstructionCreateInput {
  title: string;
  content: string;
  category: InstructionCategory;
  priority?: PlanPriority;
  metadata?: InstructionMetadata;
}

export interface InstructionUpdateInput {
  title?: string;
  content?: string;
  category?: InstructionCategory;
  priority?: PlanPriority;
  metadata?: InstructionMetadata;
}

export interface InstructionResponse {
  id: string;
  title: string;
  content: string;
  category: InstructionCategory;
  priority: PlanPriority;
  createdAt: Date;
  updatedAt: Date;
  usageCount: number;
  metadata?: InstructionMetadata;
}

// ============================================
// CONTEXT TYPES
// ============================================

export type ContextCategory =
  | 'SYSTEM_CONFIG'
  | 'USER_PREFERENCE'
  | 'ENVIRONMENT'
  | 'BUSINESS_RULE'
  | 'TEMPORARY'
  | 'REFERENCE'
  | 'OTHER';

export interface ContextMetadata {
  scope?: 'global' | 'user' | 'session';
  source?: string;
  reliability?: number; // 0-1 scale
  lastVerified?: Date;
  [key: string]: any;
}

export interface ContextCreateInput {
  key: string;
  value: string;
  category: ContextCategory;
  expiresAt?: Date;
  metadata?: ContextMetadata;
}

export interface ContextUpdateInput {
  value?: string;
  category?: ContextCategory;
  expiresAt?: Date | null;
  metadata?: ContextMetadata;
}

export interface ContextResponse {
  id: string;
  key: string;
  value: string;
  category: ContextCategory;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
  metadata?: ContextMetadata;
}

// ============================================
// KNOWLEDGE BASE TYPES
// ============================================

export type KnowledgeCategory =
  | 'TECHNICAL'
  | 'BUSINESS_PROCESS'
  | 'COMPLIANCE'
  | 'CUSTOMER_INSIGHT'
  | 'BEST_PRACTICE'
  | 'LESSON_LEARNED'
  | 'TROUBLESHOOTING'
  | 'INTEGRATION'
  | 'OTHER';

export interface KnowledgeMetadata {
  relatedEntities?: {
    type: string;
    id: string;
    name: string;
  }[];
  confidence?: number; // 0-1 scale
  version?: string;
  contributors?: string[];
  lastReviewed?: Date;
  [key: string]: any;
}

export interface KnowledgeBaseCreateInput {
  topic: string;
  content: string;
  source?: string;
  category: KnowledgeCategory;
  tags?: string[];
  relevanceScore?: number;
  metadata?: KnowledgeMetadata;
}

export interface KnowledgeBaseUpdateInput {
  topic?: string;
  content?: string;
  source?: string;
  category?: KnowledgeCategory;
  tags?: string[];
  relevanceScore?: number;
  metadata?: KnowledgeMetadata;
}

export interface KnowledgeBaseResponse {
  id: string;
  topic: string;
  content: string;
  source?: string;
  category: KnowledgeCategory;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  relevanceScore: number;
  metadata?: KnowledgeMetadata;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  details?: any;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
