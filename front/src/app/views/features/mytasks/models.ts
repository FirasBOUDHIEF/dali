export interface Task {
  id?: any;
  title: string;
  description: string;
  status: TaskStatus;
  clientId: number;
  freelancerId?: number;
  budgetType: 'fixed' | 'hourly';
  minAmount: number;
  maxAmount: number;
  currency: string;
  category: string;
  createdAt?: Date;
  updatedAt?: Date;
  competences: TaskCompetence[];
}

export interface TaskCompetence {
  id?: number;
  name: string;
}

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OPEN';
