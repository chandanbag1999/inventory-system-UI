import { Badge } from '@/components/ui/badge';

const statusStyles: Record<string, string> = {
  active: 'badge-success',
  delivered: 'badge-success',
  confirmed: 'badge-info',
  processing: 'badge-info',
  in_transit: 'badge-info',
  shipped: 'badge-info',
  assigned: 'badge-info',
  pending: 'badge-warning',
  picked_up: 'badge-warning',
  draft: 'badge-warning',
  maintenance: 'badge-warning',
  cancelled: 'badge-destructive',
  failed: 'badge-destructive',
  inactive: 'badge-destructive',
  archived: 'badge-destructive',
};

export default function StatusBadge({ status }: { status: string }) {
  const label = status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return (
    <Badge variant="outline" className={`${statusStyles[status] || ''} text-xs font-medium capitalize`}>
      {label}
    </Badge>
  );
}
