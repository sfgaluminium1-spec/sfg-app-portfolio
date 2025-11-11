
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
  }
}

export interface DashboardData {
  revenue: number;
  efficiency: number;
  documentsProcessed: number;
  activeModels: number;
}

export interface FinancialMetric {
  date: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface AIUsageData {
  name: string;
  value: number;
  requests: number;
}

export interface AnalyticsData {
  category: string;
  current: number;
  target: number;
  previous: number;
}
