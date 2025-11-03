
export interface JobData {
  id: string;
  jobNumber: string;
  orderNumber?: string;
  date: Date;
  client: string;
  site?: string;
  description: string;
  value?: number;
  status: string;
  priority: string;
  drawingStatus: string;
  approvalStatus: string;
  glassOrderStatus: string;
  cutStatus: string;
  preparedStatus: string;
  coatingStatus: string;
  assemblyStatus: string;
  installStatus: string;
  fabricationDate?: Date;
  installationDate?: Date;
  completionDate?: Date;
}

export interface QuoteData {
  id: string;
  quoteNumber: string;
  revision: number;
  customer: string;
  projectName?: string;
  contactName?: string;
  productType?: string;
  quotedBy?: string;
  quoteDate: Date;
  dueDate?: Date;
  value: number;
  revisedPrice?: number;
  status: string;
  quoteType: string;
}

export interface OrderData {
  id: string;
  orderNumber: string;
  date: Date;
  supplier: string;
  description: string;
  price?: number;
  orderedBy?: string;
  jobId: string;
}

export interface ChatCommand {
  command: string;
  parameters: Record<string, any>;
  response: string;
}

export interface DashboardStats {
  totalJobs: number;
  activeJobs: number;
  completedJobs: number;
  totalQuotes: number;
  quotesWon: number;
  quotesValue: number;
  totalOrders: number;
  ordersValue: number;
  recentActivities: any[];
}
