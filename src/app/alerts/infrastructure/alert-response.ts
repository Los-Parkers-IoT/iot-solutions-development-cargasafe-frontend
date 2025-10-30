export interface AlertResource{
  id: number;
  type: string;
  deliveryOrderId: string;
  status: 'Active' | 'Closed';
  createdAt: string;
  closedAt?: string | null;
  description: string;
}

export interface AlertResponse{
  alerts: AlertResource[];
}
