import type { NavGroup } from '@/shared/types';

export const navigation: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { title:'Dashboard', href:'/',          icon:'LayoutDashboard', roles:['admin','seller','warehouse','delivery'] },
      { title:'Analytics', href:'/analytics', icon:'TrendingUp',      roles:['admin','seller'] },
    ],
  },
  {
    label: 'Commerce',
    items: [
      { title:'Categories', href:'/categories', icon:'FolderTree',    roles:['admin','seller'] },
      { title:'Products',   href:'/products',  icon:'Package',       roles:['admin','seller'] },
      { title:'Orders',     href:'/orders',    icon:'ShoppingCart',  roles:['admin','seller','warehouse']  },
      { title:'Returns',    href:'/returns',   icon:'RotateCcw',     roles:['admin','seller','warehouse']  },
      { title:'Inventory',  href:'/inventory', icon:'Boxes',         roles:['admin','warehouse'] },
    ],
  },
  {
    label: 'Operations',
    items: [
      { title:'Warehouses',      href:'/warehouses',      icon:'Warehouse',      roles:['admin','warehouse'] },
      { title:'Deliveries',      href:'/deliveries',      icon:'Truck',          roles:['admin','delivery']  },
      { title:'Stock Movements', href:'/stock-movements', icon:'ArrowLeftRight', roles:['admin','warehouse'] },
      { title:'Suppliers',       href:'/suppliers',       icon:'Users',          roles:['admin','warehouse'] },
    ],
  },
  {
    label: 'Seller',
    items: [
      { title:'My Products', href:'/seller/products', icon:'Store',      roles:['seller'] },
      { title:'Revenue',     href:'/seller/revenue',  icon:'TrendingUp', roles:['seller'] },
    ],
  },
  {
    label: 'Delivery',
    items: [
      { title:'My Deliveries', href:'/delivery/tasks',    icon:'MapPin', roles:['delivery'] },
      { title:'Earnings',      href:'/delivery/earnings', icon:'Wallet', roles:['delivery'] },
    ],
  },
  {
    label: 'Administration',
    items: [
      { title:'Users',     href:'/admin/users',    icon:'Users',    roles:['admin'] },
      { title:'Settings',  href:'/admin/settings', icon:'Settings', roles:['admin'] },
      { title:'Audit Log', href:'/admin/audit',    icon:'Shield',   roles:['admin'] },
    ],
  },
];
