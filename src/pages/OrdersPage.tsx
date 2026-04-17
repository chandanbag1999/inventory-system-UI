// ============================================================
// ORDERS PAGE — sales-orders endpoint not yet available
// Shows coming-soon state until backend adds the controller
// src/pages/OrdersPage.tsx
// ============================================================
import { motion } from 'framer-motion';
import { ShoppingCart, Construction } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { Card, CardContent } from '@/components/ui/card';

export default function OrdersPage() {
  return (
    <PageTransition>
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Sales Orders</h1>
            <p className="page-subtitle">Order management</p>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="py-20 flex flex-col items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Construction className="h-8 w-8 text-primary" />
              </div>
              <div className="text-center">
                <h2 className="text-lg font-semibold">Sales Orders — Coming Soon</h2>
                <p className="text-sm text-muted-foreground mt-1 max-w-md">
                  The sales orders module is being built on the backend. 
                  Once the controller is added, this page will automatically show your orders.
                </p>
              </div>
              <div className="flex gap-2 mt-2">
                <span className="px-2.5 py-1 rounded-full text-xs bg-green-500/10 text-green-600 font-medium">
                  Backend endpoint pending
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs bg-blue-500/10 text-blue-600 font-medium">
                  Frontend ready
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  );
}
