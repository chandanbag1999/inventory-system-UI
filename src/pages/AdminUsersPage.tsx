import { useState }    from 'react';
import { motion }      from 'framer-motion';
import { Shield, Users, Activity, AlertTriangle, Plus, MoreHorizontal, Edit, Trash2, UserCheck, UserX } from 'lucide-react';
import PageTransition, { staggerContainer, staggerItem } from '@/components/PageTransition';
import StatCard        from '@/components/StatCard';
import { DataTable, type Column } from '@/shared/components/tables/DataTable';
import { Button }      from '@/components/ui/button';
import { Badge }       from '@/components/ui/badge';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Input }       from '@/components/ui/input';
import { Label }       from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast }       from 'sonner';
import { cn }          from '@/lib/utils';

interface UserRow {
  id:         string;
  name:       string;
  email:      string;
  role:       string;
  status:     string;
  lastActive: string;
  createdAt:  string;
}

const initialUsers: UserRow[] = [
  { id:'1', name:'Priya Sharma',  email:'priya@nexusops.com',    role:'admin',     status:'active',   lastActive:'2 min ago',   createdAt:'2025-01-01' },
  { id:'2', name:'Rahul Mehta',   email:'rahul@vendor.com',      role:'seller',    status:'active',   lastActive:'15 min ago',  createdAt:'2025-01-15' },
  { id:'3', name:'Anita Desai',   email:'anita@warehouse.com',   role:'warehouse', status:'active',   lastActive:'1 hr ago',    createdAt:'2025-02-01' },
  { id:'4', name:'Vikram Singh',  email:'vikram@delivery.com',   role:'delivery',  status:'active',   lastActive:'3 hrs ago',   createdAt:'2025-02-10' },
  { id:'5', name:'Neha Kapoor',   email:'neha@vendor.com',       role:'seller',    status:'inactive', lastActive:'2 days ago',  createdAt:'2025-03-01' },
  { id:'6', name:'Suresh Kumar',  email:'suresh@warehouse.com',  role:'warehouse', status:'active',   lastActive:'30 min ago',  createdAt:'2025-03-15' },
  { id:'7', name:'Divya Joshi',   email:'divya@delivery.com',    role:'delivery',  status:'active',   lastActive:'1 day ago',   createdAt:'2025-04-01' },
  { id:'8', name:'Arjun Patel',   email:'arjun@vendor.com',      role:'seller',    status:'inactive', lastActive:'1 week ago',  createdAt:'2025-04-10' },
];

const roleColors: Record<string, string> = {
  admin:     'bg-purple-500/10 text-purple-600 border-purple-200',
  seller:    'bg-blue-500/10 text-blue-600 border-blue-200',
  warehouse: 'bg-amber-500/10 text-amber-600 border-amber-200',
  delivery:  'bg-green-500/10 text-green-600 border-green-200',
};

export default function AdminUsersPage() {
  const [users, setUsers]             = useState<UserRow[]>(initialUsers);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showAdd, setShowAdd]         = useState(false);
  const [newUser, setNewUser]         = useState({ name:'', email:'', role:'seller' });

  const active   = users.filter((u) => u.status === 'active').length;
  const inactive = users.filter((u) => u.status === 'inactive').length;

  const toggleStatus = (id: string) => {
    setUsers((prev) => prev.map((u) =>
      u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
    ));
    toast.success('User status updated');
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    toast.success('User deleted');
  };

  const addUser = () => {
    if (!newUser.name || !newUser.email) { toast.error('Fill all fields'); return; }
    const u: UserRow = {
      id:         crypto.randomUUID(),
      name:       newUser.name,
      email:      newUser.email,
      role:       newUser.role,
      status:     'active',
      lastActive: 'Just now',
      createdAt:  new Date().toISOString().split('T')[0],
    };
    setUsers((prev) => [u, ...prev]);
    setShowAdd(false);
    setNewUser({ name:'', email:'', role:'seller' });
    toast.success('User added successfully');
  };

  const columns: Column<UserRow>[] = [
    {
      key: 'name', label: 'User',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
            {row.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-sm">{row.name}</p>
            <p className="text-xs text-muted-foreground">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role', label: 'Role',
      render: (val) => (
        <Badge variant="outline" className={cn('text-xs capitalize', roleColors[val as string])}>
          {val as string}
        </Badge>
      ),
    },
    {
      key: 'status', label: 'Status',
      render: (val) => (
        <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
          val === 'active' ? 'bg-green-500/10 text-green-600' : 'bg-muted text-muted-foreground')}>
          <span className={cn('h-1.5 w-1.5 rounded-full', val === 'active' ? 'bg-green-500' : 'bg-muted-foreground')} />
          {val === 'active' ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    { key: 'lastActive', label: 'Last Active', render: (val) => <span className="text-muted-foreground text-sm">{val as string}</span> },
    { key: 'createdAt',  label: 'Joined',       render: (val) => <span className="text-muted-foreground text-sm">{new Date(val as string).toLocaleDateString('en-IN')}</span> },
  ];

  return (
    <PageTransition>
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">User Management</h1>
            <p className="page-subtitle">{users.length} total users across all roles</p>
          </div>
          <Button className="h-9 gap-2 rounded-lg" onClick={() => setShowAdd(true)}>
            <Plus className="h-4 w-4" /> Add User
          </Button>
        </div>

        <motion.div variants={staggerContainer} initial="hidden" animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title:'Total Users',   value:String(users.length), icon:Users,         changeType:'neutral'  as const, change:'All roles'    },
            { title:'Active',        value:String(active),       icon:UserCheck,     changeType:'positive' as const, change:'Online users' },
            { title:'Inactive',      value:String(inactive),     icon:UserX,         changeType:'negative' as const, change:'Disabled'     },
            { title:'Admins',        value:String(users.filter(u=>u.role==='admin').length), icon:Shield, changeType:'neutral' as const, change:'Full access' },
          ].map((s) => <StatCard key={s.title} {...s} />)}
        </motion.div>

        <motion.div variants={staggerItem} initial="hidden" animate="visible">
          <DataTable
            data={users}
            columns={columns}
            searchable
            searchPlaceholder="Search users by name or email..."
            selectedIds={selectedIds}
            onSelect={(id) => setSelectedIds((prev) => prev.includes(id) ? prev.filter((i)=>i!==id) : [...prev,id])}
            onSelectAll={(ids) => setSelectedIds(ids)}
            actions={(row) => (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1 rounded hover:bg-accent opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem onClick={() => toggleStatus(row.id)}>
                    {row.status === 'active'
                      ? <><UserX className="h-4 w-4 mr-2" /> Deactivate</>
                      : <><UserCheck className="h-4 w-4 mr-2" /> Activate</>
                    }
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteUser(row.id)}>
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            emptyMessage="No users found."
          />
        </motion.div>
      </div>

      {/* Add User Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input placeholder="Enter full name" value={newUser.name}
                onChange={(e) => setNewUser((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input type="email" placeholder="Enter email" value={newUser.email}
                onChange={(e) => setNewUser((p) => ({ ...p, email: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={newUser.role} onValueChange={(v) => setNewUser((p) => ({ ...p, role: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['admin','seller','warehouse','delivery'].map((r) => (
                    <SelectItem key={r} value={r} className="capitalize">{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button onClick={addUser}>Add User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
}
