// ============================================================
// DASHBOARD PAGE — only calls working backend endpoints
// Working: auth/me, categories, products, suppliers,
//          warehouses, stocks/low-stock-alerts, users, roles
// Missing: sales-orders, purchase-orders
// src/pages/DashboardPage.tsx
// ============================================================
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Package, AlertTriangle, Warehouse, RefreshCw,
  TrendingUp, ShoppingCart, ArrowRight,
} from 'lucide-react';
import PageTransition, { staggerItem, staggerContainer } from '@/components/PageTransition';
import StatCard   from '@/components/StatCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge }    from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore }    from '@/shared/store/authStore';
import { useProducts }     from '@/modules/products/services/productApi';
import { useWarehouses }   from '@/modules/warehouses/services/warehouseApi';
import { useLowStockAlerts } from '@/modules/inventory/services/inventoryService';
import { useSuppliers }    from '@/modules/suppliers/services/supplierApi';
import { useCategories }   from '@/modules/categories/services/categoryApi';

export default function DashboardPage() {
  const navigate     = useNavigate();
  const { user }     = useAuthStore();

  const { data: productsData,   isLoading: pLoad }  = useProducts({ pageSize: 100 });
  const { data: warehousesData, isLoading: wLoad }  = useWarehouses({ pageSize: 100 });
  const { data: lowStock = [],   isLoading: sLoad } = useLowStockAlerts();
  const { data: suppliersData,   isLoading: supLoad } = useSuppliers();
  const { data: categories = [], isLoading: cLoad } = useCategories();

  const products   = productsData?.items ?? [];
  const warehouses = warehousesData?.items ?? [];
  const suppliers  = Array.isArray(suppliersData) ? suppliersData : (suppliersData as any)?.items ?? [];

  const stats = useMemo(() => ({
    totalProducts:  productsData?.totalCount ?? products.length,
    activeProducts: products.filter((p) => p.status === 'Active').length,
    lowStockCount:  lowStock.length,
    criticalStock:  lowStock.filter((s) => s.quantityAvailable === 0).length,
    activeWarehouses: warehouses.filter((w) => w.isActive).length,
    totalWarehouses:  warehouses.length,
    totalSuppliers: suppliers.length,
    totalCategories: Array.isArray(categories) ? categories.length : 0,
  }), [products, lowStock, warehouses, suppliers, categories, productsData, suppliersData, warehousesData]);

  const isLoading = pLoad || wLoad || sLoad || supLoad || cLoad;

  return (
    <PageTransition>
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},
              {' '}{user?.fullName?.split(' ')[0] ?? 'there'} 👋
            </h1>
            <p className="page-subtitle">Here's what's happening in your inventory today</p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
          </div>
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible"
            className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Products" value={String(stats.totalProducts)}
              icon={Package} changeType="positive"
              change={`${stats.activeProducts} active`}
              onClick={() => navigate('/products')}
            />
            <StatCard
              title="Low Stock Alerts" value={String(stats.lowStockCount)}
              icon={AlertTriangle}
              changeType={stats.criticalStock > 0 ? 'negative' : 'neutral'}
              change={stats.criticalStock > 0 ? `${stats.criticalStock} out of stock` : 'All stocked'}
              onClick={() => navigate('/inventory')}
            />
            <StatCard
              title="Active Warehouses" value={String(stats.activeWarehouses)}
              icon={Warehouse} changeType="positive"
              change={`of ${stats.totalWarehouses} total`}
              onClick={() => navigate('/warehouses')}
            />
            <StatCard
              title="Suppliers" value={String(stats.totalSuppliers)}
              icon={TrendingUp} changeType="neutral"
              change={`${stats.totalCategories} categories`}
              onClick={() => navigate('/suppliers')}
            />
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Low Stock Alerts */}
          <motion.div variants={staggerItem} initial="hidden" animate="visible">
            <Card>
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  Low Stock Alerts
                </CardTitle>
                <Button variant="ghost" size="sm" className="gap-1 h-8 text-xs"
                  onClick={() => navigate('/inventory')}>
                  Manage <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                {sLoad ? (
                  <div className="p-4 space-y-3">
                    {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-10 rounded-lg" />)}
                  </div>
                ) : lowStock.length === 0 ? (
                  <div className="py-10 text-center text-sm text-muted-foreground">
                    🎉 All items are well stocked!
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {lowStock.slice(0, 6).map((s) => (
                      <div key={s.id} className="flex items-center justify-between px-4 py-3">
                        <div>
                          <p className="text-sm font-medium">{s.productName}</p>
                          <p className="text-xs text-muted-foreground">{s.warehouseName} · SKU: {s.productSku}</p>
                        </div>
                        <Badge className={'text-xs ' + (
                          s.quantityAvailable === 0
                            ? 'bg-red-500/10 text-red-600 border-0'
                            : 'bg-amber-500/10 text-amber-600 border-0')}>
                          {s.quantityAvailable === 0 ? 'Out of stock' : `${s.quantityAvailable} left`}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Warehouses quick view */}
          <motion.div variants={staggerItem} initial="hidden" animate="visible">
            <Card>
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-base">Warehouses</CardTitle>
                <Button variant="ghost" size="sm" className="gap-1 h-8 text-xs"
                  onClick={() => navigate('/warehouses')}>
                  Manage <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </CardHeader>
              <CardContent>
                {wLoad ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-10 rounded-lg" />)}
                  </div>
                ) : warehouses.length === 0 ? (
                  <div className="py-10 text-center text-sm text-muted-foreground">
                    No warehouses configured yet
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {warehouses.slice(0, 6).map((w) => (
                      <div key={w.id} className="p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                          <Warehouse className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="text-sm font-medium truncate">{w.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {w.addressString || 'Location not set'}
                        </p>
                        <Badge className={'mt-2 text-xs border-0 ' + (
                          w.isActive ? 'bg-green-500/10 text-green-600' : 'bg-muted text-muted-foreground')}>
                          {w.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
