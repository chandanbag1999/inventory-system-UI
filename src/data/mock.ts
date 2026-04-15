// ============================================================
// COMPREHENSIVE MOCK DATA FOR INVENTORY SYSTEM
// Use with MSW for client-side mocking
// ============================================================

import type { Product, Order, Warehouse, Delivery, StockMovement, Supplier, ReturnRequest, Notification, AuditLog, Category, DashboardMetrics } from '@/shared/types/domain.types';
import type { User, UserRole } from '@/modules/auth/types/auth.types';

// ─── USERS ─────────────────────────────────────────────────
export const users: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@nexusops.com', role: 'admin', isActive: true, createdAt: '2025-01-01', lastLoginAt: '2026-04-15T10:30:00Z', phone: '+91-9876543210' },
  { id: '2', name: 'Rajesh Kumar', email: 'rajesh@nexusops.com', role: 'seller', isActive: true, createdAt: '2025-02-15', lastLoginAt: '2026-04-14T09:15:00Z', phone: '+91-9876543211' },
  { id: '3', name: 'Priya Sharma', email: 'priya@nexusops.com', role: 'warehouse', isActive: true, createdAt: '2025-03-10', lastLoginAt: '2026-04-15T08:00:00Z', phone: '+91-9876543212' },
  { id: '4', name: 'Vikram Singh', email: 'vikram@nexusops.com', role: 'delivery', isActive: true, createdAt: '2025-04-05', lastLoginAt: '2026-04-15T07:30:00Z', phone: '+91-9876543213' },
  { id: '5', name: 'Anita Desai', email: 'anita@nexusops.com', role: 'warehouse', isActive: true, createdAt: '2025-05-20', lastLoginAt: '2026-04-14T16:45:00Z', phone: '+91-9876543214' },
];

// ─── PRODUCTS ───────────────────────────────────────────────
export const products: Product[] = [
  { id: '1', name: 'Wireless Bluetooth Headphones', sku: 'WBH-001', barcode: '8901234567890', category: 'Electronics', brand: 'SoundTech', price: 2499, mrp: 2999, costPrice: 1500, stock: 342, reservedStock: 28, status: 'active', warehouse: 'Mumbai Central', hsn: '8518', gstRate: '18', createdAt: '2026-03-15' },
  { id: '2', name: 'Organic Green Tea (100 bags)', sku: 'OGT-042', barcode: '8901234567891', category: 'Beverages', brand: 'TeaMaster', price: 449, mrp: 499, costPrice: 250, stock: 1280, reservedStock: 156, status: 'active', warehouse: 'Delhi Hub', hsn: '0902', gstRate: '5', createdAt: '2026-03-14' },
  { id: '3', name: 'USB-C Fast Charger 65W', sku: 'UCF-103', barcode: '8901234567892', category: 'Electronics', brand: 'PowerMax', price: 1299, mrp: 1599, costPrice: 800, stock: 87, reservedStock: 12, status: 'active', warehouse: 'Mumbai Central', hsn: '8504', gstRate: '18', createdAt: '2026-03-12' },
  { id: '4', name: 'Premium Yoga Mat', sku: 'PYM-067', barcode: '8901234567893', category: 'Sports', brand: 'FitLife', price: 1899, mrp: 2299, costPrice: 1100, stock: 0, reservedStock: 0, status: 'draft', warehouse: 'Bangalore South', hsn: '9506', gstRate: '12', createdAt: '2026-03-11' },
  { id: '5', name: 'Stainless Steel Water Bottle 1L', sku: 'SSW-221', barcode: '8901234567894', category: 'Kitchen', brand: 'HomeEssence', price: 599, mrp: 799, costPrice: 350, stock: 2340, reservedStock: 89, status: 'active', warehouse: 'Delhi Hub', hsn: '7323', gstRate: '18', createdAt: '2026-03-10' },
  { id: '6', name: 'LED Desk Lamp (Adjustable)', sku: 'LDL-055', barcode: '8901234567895', category: 'Home', brand: 'LumiTech', price: 1749, mrp: 2199, costPrice: 1000, stock: 45, reservedStock: 3, status: 'active', warehouse: 'Mumbai Central', hsn: '9405', gstRate: '18', createdAt: '2026-03-09' },
  { id: '7', name: 'Cotton T-Shirt (Pack of 3)', sku: 'CTS-189', barcode: '8901234567896', category: 'Apparel', brand: 'ComfortWear', price: 899, mrp: 1299, costPrice: 450, stock: 4500, reservedStock: 340, status: 'active', warehouse: 'Bangalore South', hsn: '6209', gstRate: '5', createdAt: '2026-03-08' },
  { id: '8', name: 'Portable Power Bank 20000mAh', sku: 'PPB-077', barcode: '8901234567897', category: 'Electronics', brand: 'PowerMax', price: 1599, mrp: 1999, costPrice: 900, stock: 12, reservedStock: 8, status: 'active', warehouse: 'Delhi Hub', hsn: '8507', gstRate: '18', createdAt: '2026-03-07' },
  { id: '9', name: 'Wireless Mouse', sku: 'WLM-044', barcode: '8901234567898', category: 'Electronics', brand: 'TechGear', price: 799, mrp: 999, costPrice: 450, stock: 567, reservedStock: 45, status: 'active', warehouse: 'Mumbai Central', hsn: '8471', gstRate: '18', createdAt: '2026-03-06' },
  { id: '10', name: 'Notebook Set (5 pcs)', sku: 'NBS-112', barcode: '8901234567899', category: 'Stationery', brand: 'PaperCraft', price: 249, mrp: 349, costPrice: 120, stock: 2340, reservedStock: 100, status: 'active', warehouse: 'Delhi Hub', hsn: '4820', gstRate: '12', createdAt: '2026-03-05' },
  { id: '11', name: 'Running Shoes', sku: 'RNS-088', barcode: '8901234567900', category: 'Sports', brand: 'FitLife', price: 2499, mrp: 3499, costPrice: 1500, stock: 234, reservedStock: 34, status: 'active', warehouse: 'Bangalore South', hsn: '6404', gstRate: '18', createdAt: '2026-03-04' },
  { id: '12', name: 'Coffee Maker', sku: 'CFM-023', barcode: '8901234567901', category: 'Kitchen', brand: 'HomeEssence', price: 3999, mrp: 4999, costPrice: 2200, stock: 67, reservedStock: 5, status: 'active', warehouse: 'Mumbai Central', hsn: '8516', gstRate: '18', createdAt: '2026-03-03' },
  { id: '13', name: 'Backpack (40L)', sku: 'BAG-056', barcode: '8901234567902', category: 'Apparel', brand: 'TravelPro', price: 1799, mrp: 2499, costPrice: 900, stock: 456, reservedStock: 78, status: 'active', warehouse: 'Delhi Hub', hsn: '4202', gstRate: '18', createdAt: '2026-03-02' },
  { id: '14', name: 'Fitness Tracker', sku: 'FTT-011', barcode: '8901234567903', category: 'Electronics', brand: 'TechGear', price: 2999, mrp: 3999, costPrice: 1800, stock: 123, reservedStock: 23, status: 'active', warehouse: 'Bangalore South', hsn: '8518', gstRate: '18', createdAt: '2026-03-01' },
  { id: '15', name: 'Water Filter Pitcher', sku: 'WFP-034', barcode: '8901234567904', category: 'Kitchen', brand: 'PureHome', price: 899, mrp: 1299, costPrice: 500, stock: 234, reservedStock: 34, status: 'active', warehouse: 'Mumbai Central', hsn: '8421', gstRate: '18', createdAt: '2026-02-28' },
];

// ─── CATEGORIES ─────────────────────────────────────────────
export const categories: Category[] = [
  { id: '1', name: 'Electronics', slug: 'electronics', description: 'Electronic devices and accessories', parentId: null, fullPath: 'Electronics', displayOrder: 1, isActive: true, productCount: 45, children: [] },
  { id: '2', name: 'Beverages', slug: 'beverages', description: 'Drinks and beverages', parentId: null, fullPath: 'Beverages', displayOrder: 2, isActive: true, productCount: 23, children: [] },
  { id: '3', name: 'Sports', slug: 'sports', description: 'Sports and fitness equipment', parentId: null, fullPath: 'Sports', displayOrder: 3, isActive: true, productCount: 18, children: [] },
  { id: '4', name: 'Kitchen', slug: 'kitchen', description: 'Kitchen appliances and utensils', parentId: null, fullPath: 'Kitchen', displayOrder: 4, isActive: true, productCount: 34, children: [] },
  { id: '5', name: 'Apparel', slug: 'apparel', description: 'Clothing and accessories', parentId: null, fullPath: 'Apparel', displayOrder: 5, isActive: true, productCount: 67, children: [] },
  { id: '6', name: 'Home', slug: 'home', description: 'Home decor and essentials', parentId: null, fullPath: 'Home', displayOrder: 6, isActive: true, productCount: 42, children: [] },
  { id: '7', name: 'Stationery', slug: 'stationery', description: 'Office and school supplies', parentId: null, fullPath: 'Stationery', displayOrder: 7, isActive: true, productCount: 89, children: [] },
];

// ─── ORDERS ─────────────────────────────────────────────────
export const orders: Order[] = [
  { id: '1', orderNumber: 'ORD-7842', customer: 'Meera Kapoor', email: 'meera@email.com', items: 3, total: 4247, status: 'delivered', createdAt: '2026-03-19', deliveryPartner: 'Vikram Singh', warehouse: 'Mumbai Central' },
  { id: '2', orderNumber: 'ORD-7843', customer: 'Arjun Patel', email: 'arjun@email.com', items: 1, total: 2499, status: 'shipped', createdAt: '2026-03-19', deliveryPartner: 'Vikram Singh', warehouse: 'Delhi Hub' },
  { id: '3', orderNumber: 'ORD-7844', customer: 'Sneha Reddy', email: 'sneha@email.com', items: 5, total: 6845, status: 'processing', createdAt: '2026-03-18', warehouse: 'Bangalore South' },
  { id: '4', orderNumber: 'ORD-7845', customer: 'Karan Nair', email: 'karan@email.com', items: 2, total: 3198, status: 'confirmed', createdAt: '2026-03-18', warehouse: 'Mumbai Central' },
  { id: '5', orderNumber: 'ORD-7846', customer: 'Divya Joshi', email: 'divya@email.com', items: 1, total: 1749, status: 'pending', createdAt: '2026-03-17', warehouse: 'Delhi Hub' },
  { id: '6', orderNumber: 'ORD-7847', customer: 'Rohan Gupta', email: 'rohan@email.com', items: 4, total: 5396, status: 'pending', createdAt: '2026-03-17', warehouse: 'Mumbai Central' },
  { id: '7', orderNumber: 'ORD-7848', customer: 'Anjali Sen', email: 'anjali@email.com', items: 2, total: 1798, status: 'cancelled', createdAt: '2026-03-16', warehouse: 'Bangalore South' },
  { id: '8', orderNumber: 'ORD-7849', customer: 'Suresh Kumar', email: 'suresh@email.com', items: 3, total: 4647, status: 'delivered', createdAt: '2026-03-15', deliveryPartner: 'Vikram Singh', warehouse: 'Delhi Hub' },
  { id: '9', orderNumber: 'ORD-7850', customer: 'Priya Mehta', email: 'priya@email.com', items: 2, total: 2198, status: 'delivered', createdAt: '2026-03-14', deliveryPartner: 'Vikram Singh', warehouse: 'Mumbai Central' },
  { id: '10', orderNumber: 'ORD-7851', customer: 'Rahul Verma', email: 'rahul@email.com', items: 1, total: 899, status: 'shipped', createdAt: '2026-03-14', warehouse: 'Bangalore South' },
  { id: '11', orderNumber: 'ORD-7852', customer: 'Neha Gupta', email: 'neha@email.com', items: 3, total: 3845, status: 'processing', createdAt: '2026-03-13', warehouse: 'Delhi Hub' },
  { id: '12', orderNumber: 'ORD-7853', customer: 'Amit Sharma', email: 'amit@email.com', items: 2, total: 2698, status: 'confirmed', createdAt: '2026-03-13', warehouse: 'Mumbai Central' },
  { id: '13', orderNumber: 'ORD-7854', customer: 'Sara Khan', email: 'sara@email.com', items: 4, total: 5996, status: 'pending', createdAt: '2026-03-12', warehouse: 'Bangalore South' },
  { id: '14', orderNumber: 'ORD-7855', customer: 'Deepak Iyer', email: 'deepak@email.com', items: 1, total: 1599, status: 'cancelled', createdAt: '2026-03-11', warehouse: 'Delhi Hub' },
  { id: '15', orderNumber: 'ORD-7856', customer: 'Ananya Rao', email: 'ananya@email.com', items: 5, total: 7845, status: 'delivered', createdAt: '2026-03-10', deliveryPartner: 'Vikram Singh', warehouse: 'Mumbai Central' },
];

// ─── WAREHOUSES ───────────────────────────────────────────────
export const warehouses: Warehouse[] = [
  { id: '1', name: 'Mumbai Central', location: 'Mumbai, Maharashtra', capacity: 50000, utilization: 72, manager: 'Anita Desai', status: 'active' },
  { id: '2', name: 'Delhi Hub', location: 'New Delhi', capacity: 75000, utilization: 58, manager: 'Priya Sharma', status: 'active' },
  { id: '3', name: 'Bangalore South', location: 'Bangalore, Karnataka', capacity: 35000, utilization: 91, manager: 'Mahesh Kumar', status: 'active' },
  { id: '4', name: 'Chennai Port', location: 'Chennai, Tamil Nadu', capacity: 40000, utilization: 15, manager: 'Unassigned', status: 'maintenance' },
  { id: '5', name: 'Kolkata East', location: 'Kolkata, West Bengal', capacity: 25000, utilization: 34, manager: 'Sanjay Das', status: 'active' },
  { id: '6', name: 'Hyderabad Central', location: 'Hyderabad, Telangana', capacity: 45000, utilization: 45, manager: 'Lakshmi Reddy', status: 'active' },
];

// ─── DELIVERIES ───────────────────────────────────────────────
export const deliveries: Delivery[] = [
  { id: '1', orderId: '1', orderNumber: 'ORD-7842', partner: 'Vikram Singh', status: 'delivered', address: '42 MG Road, Bandra, Mumbai', estimatedTime: '2026-03-19 14:00', actualTime: '2026-03-19 13:45', earnings: 120 },
  { id: '2', orderId: '2', orderNumber: 'ORD-7843', partner: 'Vikram Singh', status: 'in_transit', address: '15 Connaught Place, New Delhi', estimatedTime: '2026-03-20 11:00', earnings: 180 },
  { id: '3', orderId: '3', orderNumber: 'ORD-7844', partner: 'Vikram Singh', status: 'assigned', address: '88 Brigade Road, Bangalore', estimatedTime: '2026-03-21 16:00', earnings: 150 },
  { id: '4', orderId: '8', orderNumber: 'ORD-7849', partner: 'Vikram Singh', status: 'delivered', address: '23 Park Street, Kolkata', estimatedTime: '2026-03-15 10:00', actualTime: '2026-03-15 10:22', earnings: 200 },
  { id: '5', orderId: '9', orderNumber: 'ORD-7850', partner: 'Raj Kumar', status: 'delivered', address: '56 Cubbon Road, Bangalore', estimatedTime: '2026-03-14 15:00', actualTime: '2026-03-14 14:30', earnings: 90 },
  { id: '6', orderId: '10', orderNumber: 'ORD-7851', partner: 'Amit Patel', status: 'in_transit', address: '34 Residency Road, Bangalore', estimatedTime: '2026-03-20 12:00', earnings: 75 },
  { id: '7', orderId: '11', orderNumber: 'ORD-7852', partner: 'Raj Kumar', status: 'assigned', address: '12 High Street, Kolkata', estimatedTime: '2026-03-22 10:00', earnings: 110 },
  { id: '8', orderId: '15', orderNumber: 'ORD-7856', partner: 'Vikram Singh', status: 'delivered', address: '78 Marine Drive, Mumbai', estimatedTime: '2026-03-10 16:00', actualTime: '2026-03-10 15:45', earnings: 100 },
];

// ─── STOCK MOVEMENTS ───────────────���────────────────────────────
export const stockMovements: StockMovement[] = [
  { id: '1', product: 'Wireless Bluetooth Headphones', sku: 'WBH-001', type: 'inbound', quantity: 500, toWarehouse: 'Mumbai Central', date: '2026-03-18', reference: 'PO-2241' },
  { id: '2', product: 'Organic Green Tea', sku: 'OGT-042', type: 'outbound', quantity: 156, fromWarehouse: 'Delhi Hub', date: '2026-03-18', reference: 'ORD-BATCH-442' },
  { id: '3', product: 'USB-C Fast Charger', sku: 'UCF-103', type: 'transfer', quantity: 50, fromWarehouse: 'Delhi Hub', toWarehouse: 'Mumbai Central', date: '2026-03-17', reference: 'TRF-0089' },
  { id: '4', product: 'Cotton T-Shirt Pack', sku: 'CTS-189', type: 'inbound', quantity: 2000, toWarehouse: 'Bangalore South', date: '2026-03-16', reference: 'PO-2238' },
  { id: '5', product: 'Portable Power Bank', sku: 'PPB-077', type: 'outbound', quantity: 8, fromWarehouse: 'Delhi Hub', date: '2026-03-16', reference: 'ORD-BATCH-440' },
  { id: '6', product: 'Wireless Mouse', sku: 'WLM-044', type: 'inbound', quantity: 300, toWarehouse: 'Mumbai Central', date: '2026-03-15', reference: 'PO-2237' },
  { id: '7', product: 'Running Shoes', sku: 'RNS-088', type: 'outbound', quantity: 45, fromWarehouse: 'Bangalore South', date: '2026-03-14', reference: 'ORD-BATCH-438' },
  { id: '8', product: 'LED Desk Lamp', sku: 'LDL-055', type: 'adjustment', quantity: -5, fromWarehouse: 'Mumbai Central', date: '2026-03-13', reference: 'ADJ-0045', reason: 'Damaged items' },
  { id: '9', product: 'Coffee Maker', sku: 'CFM-023', type: 'transfer', quantity: 20, fromWarehouse: 'Mumbai Central', toWarehouse: 'Delhi Hub', date: '2026-03-12', reference: 'TRF-0088' },
  { id: '10', product: 'Water Filter Pitcher', sku: 'WFP-034', type: 'inbound', quantity: 150, toWarehouse: 'Mumbai Central', date: '2026-03-11', reference: 'PO-2235' },
];

// ─── SUPPLIERS ─────────────────────────────────────────────────
export const suppliers: Supplier[] = [
  { id: '1', name: 'TechGear Solutions', email: 'orders@techgear.com', phone: '+91-9876543210', gstin: '27AABCT1234A1Z5', paymentTerms: 30, leadTime: 7, rating: 4.5, status: 'active' },
  { id: '2', name: 'FitLife Industries', email: 'sales@fitlife.com', phone: '+91-9876543211', gstin: '29AABCF5678B1Z3', paymentTerms: 45, leadTime: 14, rating: 4.2, status: 'active' },
  { id: '3', name: 'HomeEssence Pvt Ltd', email: 'business@homeessence.com', phone: '+91-9876543212', gstin: '36AABCH1234C1Z9', paymentTerms: 30, leadTime: 10, rating: 4.7, status: 'active' },
  { id: '4', name: 'TeaMaster Exports', email: 'export@teasmaster.com', phone: '+91-9876543213', gstin: '32AABCT9012D1Z7', paymentTerms: 15, leadTime: 5, rating: 4.8, status: 'active' },
  { id: '5', name: 'ComfortWear Ltd', email: 'orders@comfortwear.com', phone: '+91-9876543214', gstin: '29AABCC5678E1Z5', paymentTerms: 60, leadTime: 21, rating: 3.9, status: 'active' },
  { id: '6', name: 'PaperCraft Inc', email: 'sales@papercraft.com', phone: '+91-9876543215', gstin: '27AAGFP1234B1Z3', paymentTerms: 30, leadTime: 7, rating: 4.3, status: 'active' },
  { id: '7', name: 'TravelPro Accessories', email: 'b2b@travelpro.com', phone: '+91-9876543216', gstin: '07AABCT7890F1Z1', paymentTerms: 45, leadTime: 14, rating: 4.0, status: 'inactive' },
  { id: '8', name: 'PureHome Technologies', email: 'orders@purehome.com', phone: '+91-9876543217', gstin: '27AABCP1234G1Z9', paymentTerms: 30, leadTime: 10, rating: 4.6, status: 'active' },
];

// ─── RETURNS ─────────────────────────────────────────────────
export const returns: ReturnRequest[] = [
  { id: '1', rmaNumber: 'RMA-001', orderId: '7', orderNumber: 'ORD-7848', reason: 'Wrong size received', items: [{ productId: '7', productName: 'Cotton T-Shirt (Pack of 3)', sku: 'CTS-189', quantity: 1, reason: 'Wrong size', condition: 'good' }], status: 'approved', refundAmount: 899, createdAt: '2026-03-16' },
  { id: '2', rmaNumber: 'RMA-002', orderId: '14', orderNumber: 'ORD-7855', reason: 'Product defective', items: [{ productId: '8', productName: 'Portable Power Bank', sku: 'PPB-077', quantity: 1, reason: 'Not charging', condition: 'defective' }], status: 'requested', createdAt: '2026-03-12' },
  { id: '3', rmaNumber: 'RMA-003', orderId: '11', orderNumber: 'ORD-7852', reason: 'Changed mind', items: [{ productId: '1', productName: 'Wireless Bluetooth Headphones', sku: 'WBH-001', quantity: 1, reason: 'Changed mind', condition: 'good' }], status: 'rejected', createdAt: '2026-03-14' },
  { id: '4', rmaNumber: 'RMA-004', orderId: '3', orderNumber: 'ORD-7844', reason: 'Missing item', items: [{ productId: '6', productName: 'LED Desk Lamp', sku: 'LDL-055', quantity: 1, reason: 'Missing component', condition: 'damaged' }], status: 'received', createdAt: '2026-03-10' },
  { id: '5', rmaNumber: 'RMA-005', orderId: '5', orderNumber: 'ORD-7846', reason: 'Better price available', items: [{ productId: '3', productName: 'USB-C Fast Charger', sku: 'UCF-103', quantity: 1, reason: 'Better price', condition: 'good' }], status: 'refunded', refundAmount: 1299, createdAt: '2026-03-08' },
];

// ─── NOTIFICATIONS ─────────────────────────────────────────
export const notifications: Notification[] = [
  { id: '1', type: 'order', title: 'New Order Received', message: 'Order ORD-7853 has been placed successfully', read: false, actionUrl: '/orders/7853', createdAt: '2026-04-15T09:30:00Z', priority: 'high' },
  { id: '2', type: 'stock', title: 'Low Stock Alert', message: 'USB-C Fast Charger (WBH-001) is running low (87 units)', read: false, actionUrl: '/products/3', createdAt: '2026-04-15T08:00:00Z', priority: 'medium' },
  { id: '3', type: 'delivery', title: 'Delivery Completed', message: 'Order ORD-7842 has been delivered', read: true, actionUrl: '/deliveries/1', createdAt: '2026-04-14T14:00:00Z', priority: 'low' },
  { id: '4', type: 'system', title: 'System Update', message: 'Scheduled maintenance at midnight', read: false, createdAt: '2026-04-14T10:00:00Z', priority: 'medium' },
  { id: '5', type: 'stock', title: 'Out of Stock', message: 'Premium Yoga Mat (PYM-067) is out of stock', read: false, actionUrl: '/products/4', createdAt: '2026-04-13T16:00:00Z', priority: 'critical' },
  { id: '6', type: 'order', title: 'New Return Request', message: 'Return request RMA-002 needs approval', read: false, actionUrl: '/returns/2', createdAt: '2026-04-12T12:00:00Z', priority: 'medium' },
  { id: '7', type: 'payment', title: 'Payment Received', message: 'Payment of ₹4,247 received for Order ORD-7842', read: true, actionUrl: '/orders/1', createdAt: '2026-04-11T11:00:00Z', priority: 'low' },
  { id: '8', type: 'order', title: 'Order Cancelled', message: 'Order ORD-7855 has been cancelled by customer', read: true, actionUrl: '/orders/14', createdAt: '2026-04-10T09:00:00Z', priority: 'medium' },
];

// ─── AUDIT LOGS ────────────────────────────────────────────────
export const auditLogs: AuditLog[] = [
  { id: '1', userId: '1', userName: 'Admin User', userRole: 'admin', action: 'LOGIN', resource: 'auth', timestamp: '2026-04-15T10:30:00Z', ipAddress: '192.168.1.100' },
  { id: '2', userId: '1', userName: 'Admin User', userRole: 'admin', action: 'CREATE', resource: 'product', resourceId: '1', newValue: { name: 'Wireless Bluetooth Headphones', price: 2499 }, timestamp: '2026-04-15T10:35:00Z', ipAddress: '192.168.1.100' },
  { id: '3', userId: '2', userName: 'Rajesh Kumar', userRole: 'seller', action: 'UPDATE', resource: 'order', resourceId: '2', oldValue: { status: 'pending' }, newValue: { status: 'confirmed' }, timestamp: '2026-04-15T09:20:00Z', ipAddress: '192.168.1.101' },
  { id: '4', userId: '3', userName: 'Priya Sharma', userRole: 'warehouse', action: 'ADJUST', resource: 'inventory', resourceId: '1', newValue: { stock: -5, reason: 'Damaged items' }, timestamp: '2026-04-14T16:45:00Z', ipAddress: '192.168.1.102' },
  { id: '5', userId: '1', userName: 'Admin User', userRole: 'admin', action: 'CREATE', resource: 'user', resourceId: '3', newValue: { name: 'Priya Sharma', role: 'warehouse' }, timestamp: '2026-04-14T10:00:00Z', ipAddress: '192.168.1.100' },
  { id: '6', userId: '4', userName: 'Vikram Singh', userRole: 'delivery', action: 'UPDATE', resource: 'delivery', resourceId: '1', newValue: { status: 'delivered' }, timestamp: '2026-04-14T14:00:00Z', ipAddress: '192.168.1.103' },
  { id: '7', userId: '1', userName: 'Admin User', userRole: 'admin', action: 'DELETE', resource: 'product', resourceId: '10', oldValue: { name: 'Old Product' }, timestamp: '2026-04-13T11:30:00Z', ipAddress: '192.168.1.100' },
  { id: '8', userId: '2', userName: 'Rajesh Kumar', userRole: 'seller', action: 'EXPORT', resource: 'orders', newValue: { format: 'CSV', count: 50 }, timestamp: '2026-04-12T15:00:00Z', ipAddress: '192.168.1.101' },
];

// ─── DASHBOARD METRICS ────────────────────────────────────────────
export const dashboardMetrics: DashboardMetrics = {
  totalRevenue: 4567890,
  revenueChange: 12.5,
  totalOrders: 234,
  ordersChange: 8.3,
  totalProducts: 156,
  lowStockCount: 12,
  pendingDeliveries: 23,
  activeWarehouses: 5,
};

// ─── EXPORT ALL FOR MSW ───────────────────────────────────
export const mockDb = {
  users,
  products,
  categories,
  orders,
  warehouses,
  deliveries,
  stockMovements,
  suppliers,
  returns,
  notifications,
  auditLogs,
  dashboardMetrics,
};

// ─── HELPER FUNCTIONS ────────────────────────────────────────
export const getUserByRole = (role: UserRole): User | undefined => 
  users.find(u => u.role === role);

export const getProductsByWarehouse = (warehouse: string): Product[] => 
  products.filter(p => p.warehouse === warehouse);

export const getOrdersByStatus = (status: Order['status']): Order[] => 
  orders.filter(o => o.status === status);

export const getLowStockProducts = (): Product[] => 
  products.filter(p => (p.stock - p.reservedStock) < 10);

export const getPendingDeliveries = (): Delivery[] => 
  deliveries.filter(d => d.status !== 'delivered' && d.status !== 'failed');