// ============================================================
// COMPREHENSIVE MSW HANDLERS FOR INVENTORY SYSTEM
// Handles all API endpoints with mock data
// ============================================================

import { http, HttpResponse, delay } from 'msw';
import { 
  users, products, categories, orders, warehouses, deliveries, 
  stockMovements, suppliers, returns, notifications, auditLogs, dashboardMetrics, mockDb 
} from '@/data/mock';
import type { UserRole } from '@/modules/auth/types/auth.types';

const BASE = 'http://localhost:5000/api/v1';

const ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: ['dashboard:view', 'products:read', 'products:write', 'products:delete', 'orders:read', 'orders:write', 'orders:update', 'inventory:read', 'inventory:write', 'warehouses:read', 'warehouses:write', 'deliveries:read', 'deliveries:write', 'suppliers:read', 'suppliers:write', 'returns:read', 'returns:write', 'analytics:read', 'users:read', 'users:write', 'settings:read', 'settings:write', 'audit:read'],
  seller: ['dashboard:view', 'products:read', 'products:write', 'orders:read', 'orders:write', 'analytics:read'],
  warehouse: ['dashboard:view', 'products:read', 'orders:read', 'orders:write', 'inventory:read', 'inventory:write', 'warehouses:read', ' deliveries:read'],
  delivery: ['dashboard:view', 'deliveries:read', 'deliveries:write'],
};

function generatePaginatedResponse<T>(data: T[], page = 1, pageSize = 10) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedData = data.slice(start, end);
  return {
    success: true,
    data: paginatedData,
    total: data.length,
    page,
    pageSize,
    totalPages: Math.ceil(data.length / pageSize),
  };
}

// ─── AUTH HANDLERS ───────────────────────────────────────────
export const authHandlers = [
  http.post(BASE + '/auth/login', async ({ request }) => {
    await delay(300);
    const body = await request.json() as { email: string; password: string };
    const email = body.email?.toLowerCase() || '';
    
    let role: UserRole = 'admin';
    if (email.includes('seller') || email.includes('rajesh')) role = 'seller';
    else if (email.includes('warehouse') || email.includes('priya')) role = 'warehouse';
    else if (email.includes('delivery') || email.includes('vikram')) role = 'delivery';
    
    const user = mockDb.users.find(u => u.email === email) || { 
      id: '1', name: 'Demo User', email, role, isActive: true, createdAt: '2025-01-01' 
    };

    return HttpResponse.json({
      success: true,
      data: {
        user: { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          role: user.role,
          roles: [user.role],
          firstName: user.name.split(' ')[0],
          lastName: user.name.split(' ').slice(1).join(' '),
          isActive: user.isActive, 
          createdAt: user.createdAt,
          lastLoginAt: new Date().toISOString(),
          permissions: ROLE_PERMISSIONS[user.role] || ROLE_PERMISSIONS['admin'],
        },
        accessToken: 'mock-access-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
        accessTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        refreshTokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    });
  }),

  http.post(BASE + '/auth/register', async ({ request }) => {
    await delay(300);
    const body = await request.json() as any;
    const firstName = body.firstName || '';
    const lastName = body.lastName || '';
    const name = `${firstName} ${lastName}`.trim() || 'New User';
    const role = body.role || 'admin';

    return HttpResponse.json({
      success: true,
      data: {
        user: { 
          id: String(mockDb.users.length + 1), 
          name, 
          email: body.email || 'newuser@test.com', 
          role,
          roles: [role],
          firstName,
          lastName,
          isActive: true, 
          createdAt: new Date().toISOString(),
          permissions: ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS['admin'],
        },
        accessToken: 'mock-access-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
        accessTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        refreshTokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    });
  }),

  http.post(BASE + '/auth/logout', async () => {
    await delay(100);
    return HttpResponse.json({ success: true });
  }),

  http.post(BASE + '/auth/refresh', async ({ request }) => {
    await delay(100);
    return HttpResponse.json({
      success: true,
      data: {
        accessToken: 'mock-access-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
        accessTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        refreshTokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    });
  }),

  http.get(BASE + '/auth/me', async () => {
    const user = mockDb.users[0];
    return HttpResponse.json({
      success: true,
      data: {
        id: user.id,
        fullName: user.name,
        email: user.email,
        roles: [user.role],
        role: user.role,
        permissions: ROLE_PERMISSIONS[user.role] || ROLE_PERMISSIONS['admin'],
        lastLoginAt: user.lastLoginAt,
      },
    });
  }),
];

// ─── PRODUCTS HANDLERS ─────────────────────────────────────
export const productHandlers = [
  http.get(BASE + '/products', async ({ request }) => {
    await delay(200);
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
    const search = url.searchParams.get('search')?.toLowerCase();
    const status = url.searchParams.get('status');
    const category = url.searchParams.get('category');

    let filtered = [...products];
    if (search) filtered = filtered.filter(p => p.name.toLowerCase().includes(search) || p.sku.toLowerCase().includes(search));
    if (status) filtered = filtered.filter(p => p.status === status);
    if (category) filtered = filtered.filter(p => p.category === category);

    return HttpResponse.json(generatePaginatedResponse(filtered, page, pageSize));
  }),

  http.get(BASE + '/products/:id', async ({ params }) => {
    await delay(100);
    const product = products.find(p => p.id === params.id);
    return HttpResponse.json({ success: true, data: product });
  }),

  http.post(BASE + '/products', async ({ request }) => {
    await delay(200);
    const body = await request.json() as any;
    const newProduct = { ...body, id: String(products.length + 1), createdAt: new Date().toISOString() };
    return HttpResponse.json({ success: true, data: newProduct });
  }),

  http.put(BASE + '/products/:id', async ({ params, request }) => {
    await delay(150);
    const body = await request.json() as any;
    return HttpResponse.json({ success: true, data: { ...body, id: params.id } });
  }),

  http.delete(BASE + '/products/:id', async ({ params }) => {
    await delay(100);
    return HttpResponse.json({ success: true, message: 'Product deleted' });
  }),
];

// ─── CATEGORIES HANDLERS ───────────────────���─��──────────────
export const categoryHandlers = [
  http.get(BASE + '/categories', async () => {
    await delay(100);
    return HttpResponse.json({ success: true, data: categories, total: categories.length });
  }),

  http.get(BASE + '/categories/:id', async ({ params }) => {
    await delay(100);
    const category = categories.find(c => c.id === params.id);
    return HttpResponse.json({ success: true, data: category });
  }),

  http.post(BASE + '/categories', async ({ request }) => {
    await delay(150);
    const body = await request.json() as any;
    return HttpResponse.json({ success: true, data: { ...body, id: String(categories.length + 1) } });
  }),

  http.put(BASE + '/categories/:id', async ({ params, request }) => {
    await delay(100);
    const body = await request.json() as any;
    return HttpResponse.json({ success: true, data: { ...body, id: params.id } });
  }),

  http.delete(BASE + '/categories/:id', async ({ params }) => {
    await delay(100);
    return HttpResponse.json({ success: true, message: 'Category deleted' });
  }),
];

// ─── ORDERS HANDLERS ────────────────────────────────────────────
export const orderHandlers = [
  http.get(BASE + '/orders', async ({ request }) => {
    await delay(200);
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
    const status = url.searchParams.get('status');

    let filtered = [...orders];
    if (status) filtered = filtered.filter(o => o.status === status);

    return HttpResponse.json(generatePaginatedResponse(filtered, page, pageSize));
  }),

  http.get(BASE + '/orders/:id', async ({ params }) => {
    await delay(100);
    const order = orders.find(o => o.id === params.id);
    return HttpResponse.json({ success: true, data: order });
  }),

  http.post(BASE + '/orders', async ({ request }) => {
    await delay(200);
    const body = await request.json() as any;
    return HttpResponse.json({ success: true, data: { ...body, id: String(orders.length + 1) } });
  }),

  http.put(BASE + '/orders/:id', async ({ params, request }) => {
    await delay(150);
    const body = await request.json() as any;
    return HttpResponse.json({ success: true, data: { ...body, id: params.id } });
  }),
];

// ─── INVENTORY HANDLERS ──────────────────────────────────
export const inventoryHandlers = [
  http.get(BASE + '/inventory', async ({ request }) => {
    await delay(200);
    const inventoryData = products.map(p => ({
      productId: p.id,
      productName: p.name,
      sku: p.sku,
      warehouse: p.warehouse,
      availableStock: p.stock - p.reservedStock,
      reservedStock: p.reservedStock,
      totalStock: p.stock,
      lastUpdated: p.createdAt,
    }));
    return HttpResponse.json({ success: true, data: inventoryData });
  }),

  http.get(BASE + '/inventory/movements', async ({ request }) => {
    await delay(150);
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
    return HttpResponse.json(generatePaginatedResponse(stockMovements, page, pageSize));
  }),

  http.post(BASE + '/inventory/adjust', async ({ request }) => {
    await delay(200);
    const body = await request.json() as any;
    return HttpResponse.json({ success: true, data: { ...body, id: String(stockMovements.length + 1) } });
  }),
];

// ─── WAREHOUSES HANDLERS ─────────────────────────────────
export const warehouseHandlers = [
  http.get(BASE + '/warehouses', async ({ request }) => {
    await delay(150);
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
    return HttpResponse.json(generatePaginatedResponse(warehouses, page, pageSize));
  }),

  http.get(BASE + '/warehouses/:id', async ({ params }) => {
    await delay(100);
    const warehouse = warehouses.find(w => w.id === params.id);
    return HttpResponse.json({ success: true, data: warehouse });
  }),

  http.post(BASE + '/warehouses', async ({ request }) => {
    await delay(150);
    const body = await request.json() as any;
    return HttpResponse.json({ success: true, data: { ...body, id: String(warehouses.length + 1) } });
  }),

  http.put(BASE + '/warehouses/:id', async ({ params, request }) => {
    await delay(150);
    const body = await request.json() as any;
    return HttpResponse.json({ success: true, data: { ...body, id: params.id } });
  }),

  http.delete(BASE + '/warehouses/:id', async () => {
    await delay(100);
    return HttpResponse.json({ success: true, message: 'Warehouse deleted' });
  }),
];

// ─── DELIVERIES HANDLERS ────────────────────────────────────
export const deliveryHandlers = [
  http.get(BASE + '/deliveries', async ({ request }) => {
    await delay(150);
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
    const status = url.searchParams.get('status');

    let filtered = [...deliveries];
    if (status) filtered = filtered.filter(d => d.status === status);

    return HttpResponse.json(generatePaginatedResponse(filtered, page, pageSize));
  }),

  http.get(BASE + '/deliveries/:id', async ({ params }) => {
    await delay(100);
    const delivery = deliveries.find(d => d.id === params.id);
    return HttpResponse.json({ success: true, data: delivery });
  }),

  http.put(BASE + '/deliveries/:id', async ({ params, request }) => {
    await delay(150);
    const body = await request.json() as any;
    return HttpResponse.json({ success: true, data: { ...body, id: params.id } });
  }),

  http.get(BASE + '/deliveries/earnings', async () => {
    const totalEarnings = deliveries.reduce((sum, d) => sum + d.earnings, 0);
    return HttpResponse.json({ success: true, data: { total: totalEarnings, deliveries: deliveries.length } });
  }),
];

// ─── SUPPLIERS HANDLERS ────────────────────────────────────────
export const supplierHandlers = [
  http.get(BASE + '/suppliers', async () => {
    await delay(150);
    return HttpResponse.json({ success: true, data: suppliers, total: suppliers.length });
  }),

  http.get(BASE + '/suppliers/:id', async ({ params }) => {
    await delay(100);
    const supplier = suppliers.find(s => s.id === params.id);
    return HttpResponse.json({ success: true, data: supplier });
  }),

  http.post(BASE + '/suppliers', async ({ request }) => {
    await delay(150);
    const body = await request.json() as any;
    return HttpResponse.json({ success: true, data: { ...body, id: String(suppliers.length + 1) } });
  }),

  http.put(BASE + '/suppliers/:id', async ({ params, request }) => {
    await delay(150);
    const body = await request.json() as any;
    return HttpResponse.json({ success: true, data: { ...body, id: params.id } });
  }),

  http.delete(BASE + '/suppliers/:id', async () => {
    await delay(100);
    return HttpResponse.json({ success: true, message: 'Supplier deleted' });
  }),
];

// ─── RETURNS HANDLERS ────────────────────────────────────────
export const returnHandlers = [
  http.get(BASE + '/returns', async () => {
    await delay(150);
    return HttpResponse.json({ success: true, data: returns, total: returns.length });
  }),

  http.get(BASE + '/returns/:id', async ({ params }) => {
    await delay(100);
    const ret = returns.find(r => r.id === params.id);
    return HttpResponse.json({ success: true, data: ret });
  }),

  http.post(BASE + '/returns/:id/approve', async ({ params }) => {
    await delay(150);
    return HttpResponse.json({ success: true, message: 'Return approved' });
  }),

  http.post(BASE + '/returns/:id/reject', async ({ params }) => {
    await delay(150);
    return HttpResponse.json({ success: true, message: 'Return rejected' });
  }),
];

// ─── NOTIFICATIONS HANDLERS ──────────────────────────────────
export const notificationHandlers = [
  http.get(BASE + '/notifications', async () => {
    await delay(100);
    return HttpResponse.json({ success: true, data: notifications, total: notifications.length });
  }),

  http.post(BASE + '/notifications/:id/read', async ({ params }) => {
    await delay(50);
    return HttpResponse.json({ success: true, message: 'Notification marked as read' });
  }),

  http.post(BASE + '/notifications/read-all', async () => {
    await delay(100);
    return HttpResponse.json({ success: true, message: 'All notifications marked as read' });
  }),
];

// ─── ANALYTICS HANDLERS ────────────────────────────────────────
export const analyticsHandlers = [
  http.get(BASE + '/analytics/dashboard', async () => {
    await delay(200);
    return HttpResponse.json({ success: true, data: dashboardMetrics });
  }),

  http.get(BASE + '/analytics/revenue', async () => {
    const monthlyRevenue = [
      { month: 'Jan', revenue: 320000, orders: 45 },
      { month: 'Feb', revenue: 380000, orders: 52 },
      { month: 'Mar', revenue: 420000, orders: 58 },
      { month: 'Apr', revenue: 456789, orders: 67 },
    ];
    return HttpResponse.json({ success: true, data: monthlyRevenue });
  }),

  http.get(BASE + '/analytics/orders', async () => {
    const orderStats = [
      { status: 'pending', count: 12 },
      { status: 'confirmed', count: 8 },
      { status: 'processing', count: 15 },
      { status: 'shipped', count: 23 },
      { status: 'delivered', count: 156 },
      { status: 'cancelled', count: 20 },
    ];
    return HttpResponse.json({ success: true, data: orderStats });
  }),

  http.get(BASE + '/analytics/inventory', async () => {
    return HttpResponse.json({ success: true, data: { totalProducts: products.length, lowStock: 12, outOfStock: 1 } });
  }),
];

// ─── ADMIN HANDLERS ────────────────────────────────────────────
export const adminHandlers = [
  http.get(BASE + '/admin/users', async () => {
    await delay(150);
    return HttpResponse.json({ success: true, data: users, total: users.length });
  }),

  http.get(BASE + '/admin/users/:id', async ({ params }) => {
    await delay(100);
    const user = users.find(u => u.id === params.id);
    return HttpResponse.json({ success: true, data: user });
  }),

  http.post(BASE + '/admin/users', async ({ request }) => {
    await delay(150);
    const body = await request.json() as any;
    return HttpResponse.json({ success: true, data: { ...body, id: String(users.length + 1) } });
  }),

  http.put(BASE + '/admin/users/:id', async ({ params, request }) => {
    await delay(150);
    const body = await request.json() as any;
    return HttpResponse.json({ success: true, data: { ...body, id: params.id } });
  }),

  http.delete(BASE + '/admin/users/:id', async () => {
    await delay(100);
    return HttpResponse.json({ success: true, message: 'User deleted' });
  }),

  http.get(BASE + '/admin/audit-logs', async ({ request }) => {
    await delay(150);
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
    return HttpResponse.json(generatePaginatedResponse(auditLogs, page, pageSize));
  }),

  http.get(BASE + '/admin/settings', async () => {
    await delay(100);
    return HttpResponse.json({
      success: true,
      data: {
        companyName: 'StockPulse',
        timezone: 'Asia/Kolkata',
        currency: 'INR',
        taxRate: 18,
        lowStockThreshold: 10,
      },
    });
  }),
];

// ─── PROFILE HANDLERS ────────────────────────────────────────────
export const profileHandlers = [
  http.get(BASE + '/profile', async () => {
    await delay(100);
    return HttpResponse.json({ success: true, data: users[0] });
  }),

  http.put(BASE + '/profile', async ({ request }) => {
    await delay(150);
    const body = await request.json() as any;
    return HttpResponse.json({ success: true, data: body });
  }),

  http.post(BASE + '/profile/password', async ({ request }) => {
    await delay(150);
    return HttpResponse.json({ success: true, message: 'Password updated' });
  }),
];

// ─── EXPORT ALL HANDLERS ──────────────────────────────────
export const handlers = [
  ...authHandlers,
  ...productHandlers,
  ...categoryHandlers,
  ...orderHandlers,
  ...inventoryHandlers,
  ...warehouseHandlers,
  ...deliveryHandlers,
  ...supplierHandlers,
  ...returnHandlers,
  ...notificationHandlers,
  ...analyticsHandlers,
  ...adminHandlers,
  ...profileHandlers,
];