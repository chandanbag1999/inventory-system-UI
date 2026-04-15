import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useThemeStore }     from '@/shared/store/themeStore';
import ProtectedRoute        from '@/components/ProtectedRoute';
import DashboardLayout       from '@/components/DashboardLayout';
import { PageSkeleton }      from '@/shared/components/feedback/PageSkeleton';
import { CommandPalette }    from '@/shared/components/navigation/CommandPalette';

import LoginPage          from '@/pages/LoginPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import NotFound           from '@/pages/NotFound';

const DashboardPage        = lazy(() => import('@/pages/DashboardPage'));
const ProductsPage         = lazy(() => import('@/pages/ProductsPage'));
const AddProductPage       = lazy(() => import('@/pages/AddProductPage'));
const EditProductPage      = lazy(() => import('@/pages/EditProductPage'));
const ProductDetailPage    = lazy(() => import('@/pages/ProductDetailPage'));
const OrdersPage           = lazy(() => import('@/pages/OrdersPage'));
const OrderDetailPage      = lazy(() => import('@/pages/OrderDetailPage'));
const EditOrderPage        = lazy(() => import('@/pages/EditOrderPage'));
const InventoryPage        = lazy(() => import('@/pages/InventoryPage'));
const WarehousesPage       = lazy(() => import('@/pages/WarehousesPage'));
const DeliveriesPage       = lazy(() => import('@/pages/DeliveriesPage'));
const StockMovementsPage   = lazy(() => import('@/pages/StockMovementsPage'));
const SellerRevenuePage    = lazy(() => import('@/pages/SellerRevenuePage'));
const DeliveryTasksPage    = lazy(() => import('@/pages/DeliveryTasksPage'));
const DeliveryEarningsPage = lazy(() => import('@/pages/DeliveryEarningsPage'));
const AdminUsersPage       = lazy(() => import('@/pages/AdminUsersPage'));
const AdminSettingsPage    = lazy(() => import('@/pages/AdminSettingsPage'));
const AdminAuditPage       = lazy(() => import('@/pages/AdminAuditPage'));
const ProfilePage          = lazy(() => import('@/pages/ProfilePage'));
const SuppliersPage        = lazy(() => import('@/modules/suppliers/pages/SuppliersPage'));
const ReturnsPage          = lazy(() => import('@/modules/returns/pages/ReturnsPage'));
const AnalyticsPage        = lazy(() => import('@/modules/analytics/pages/AnalyticsPage'));
const CategoriesPage       = lazy(() => import('@/modules/categories/pages/CategoriesPage'));
const AddCategoryPage      = lazy(() => import('@/pages/AddCategoryPage'));
const EditCategoryPage     = lazy(() => import('@/pages/EditCategoryPage'));
const DeletedCategoriesPage  = lazy(() => import('@/pages/DeletedCategoriesPage'));

function ThemeInitializer() {
  const { resolved } = useThemeStore();
  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolved === 'dark');
  }, [resolved]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeInitializer />
      <CommandPalette />
      <Suspense fallback={<PageSkeleton />}>
        <Routes>
          <Route path="/login"           element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
<Route path="/" element={<DashboardPage />} />

            <Route path="/categories"       element={<ProtectedRoute roles={['admin','seller']}><CategoriesPage /></ProtectedRoute>} />
            <Route path="/categories/add"       element={<ProtectedRoute roles={['admin','seller']}><AddCategoryPage /></ProtectedRoute>} />
            <Route path="/categories/:id/edit" element={<ProtectedRoute roles={['admin','seller']}><EditCategoryPage /></ProtectedRoute>} />
            <Route path="/categories/deleted" element={<ProtectedRoute roles={['admin','seller']}><DeletedCategoriesPage /></ProtectedRoute>} />
            <Route path="/products"          element={<ProtectedRoute roles={['admin','seller']}><ProductsPage /></ProtectedRoute>} />
            <Route path="/products/add"      element={<ProtectedRoute roles={['admin','seller']}><AddProductPage /></ProtectedRoute>} />
            <Route path="/products/:id"      element={<ProtectedRoute roles={['admin','seller']}><ProductDetailPage /></ProtectedRoute>} />
            <Route path="/products/:id/edit" element={<ProtectedRoute roles={['admin','seller']}><EditProductPage /></ProtectedRoute>} />

            <Route path="/orders"          element={<ProtectedRoute roles={['admin','seller','warehouse']}><OrdersPage /></ProtectedRoute>} />
            <Route path="/orders/:id"      element={<ProtectedRoute roles={['admin','seller','warehouse']}><OrderDetailPage /></ProtectedRoute>} />
            <Route path="/orders/:id/edit" element={<ProtectedRoute roles={['admin','seller','warehouse']}><EditOrderPage /></ProtectedRoute>} />

            <Route path="/inventory"       element={<ProtectedRoute roles={['admin','warehouse']}><InventoryPage /></ProtectedRoute>} />
            <Route path="/warehouses"      element={<ProtectedRoute roles={['admin','warehouse']}><WarehousesPage /></ProtectedRoute>} />
            <Route path="/deliveries"      element={<ProtectedRoute roles={['admin','delivery']}><DeliveriesPage /></ProtectedRoute>} />
            <Route path="/stock-movements" element={<ProtectedRoute roles={['admin','warehouse']}><StockMovementsPage /></ProtectedRoute>} />

            <Route path="/suppliers"       element={<ProtectedRoute roles={['admin','warehouse']}><SuppliersPage /></ProtectedRoute>} />
            <Route path="/returns"         element={<ProtectedRoute roles={['admin','seller','warehouse']}><ReturnsPage /></ProtectedRoute>} />
            <Route path="/analytics"       element={<ProtectedRoute roles={['admin','seller']}><AnalyticsPage /></ProtectedRoute>} />

            <Route path="/seller/products" element={<ProtectedRoute roles={['seller']}><ProductsPage /></ProtectedRoute>} />
            <Route path="/seller/revenue"  element={<ProtectedRoute roles={['seller']}><SellerRevenuePage /></ProtectedRoute>} />

            <Route path="/delivery/tasks"    element={<ProtectedRoute roles={['delivery']}><DeliveryTasksPage /></ProtectedRoute>} />
            <Route path="/delivery/earnings" element={<ProtectedRoute roles={['delivery']}><DeliveryEarningsPage /></ProtectedRoute>} />

            <Route path="/admin/users"    element={<ProtectedRoute roles={['admin']}><AdminUsersPage /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute roles={['admin']}><AdminSettingsPage /></ProtectedRoute>} />
            <Route path="/admin/audit"    element={<ProtectedRoute roles={['admin']}><AdminAuditPage /></ProtectedRoute>} />

            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
