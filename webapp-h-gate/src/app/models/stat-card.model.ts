export interface StatCard {
  title: string;
  value: number | string;
  icon: string;
  color: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  change?: string;
  trend?: 'up' | 'down';
}