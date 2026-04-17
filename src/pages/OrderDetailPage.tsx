// ============================================================
// ORDER DETAIL PAGE — fallback until backend adds sales-orders
// src/pages/OrderDetailPage.tsx
// ============================================================
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Construction } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function OrderDetailPage() {
  const { id }   = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="page-container max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/orders')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="page-title mb-0">Order {id}</h1>
            <p className="text-sm text-muted-foreground">Sales orders module coming soon</p>
          </div>
        </div>
        <Card>
          <CardContent className="py-16 flex flex-col items-center gap-4">
            <Construction className="h-12 w-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Order details will be available once the sales orders backend is ready.
            </p>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}
