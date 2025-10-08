export interface Alert{
  id: string;
  type: string;
  deliveryOrderId: string;
  status: 'Active' | 'Closed';
  createdAt: string;
  closedAt?: string;
  description: string;
}
