// ============================================================
// ADMIN USERS PAGE — real backend data
// GET   /api/v1/users
// POST  /api/v1/users
// PATCH /api/v1/users/{id}/activate|deactivate
// POST  /api/v1/users/{id}/assign-role
// DELETE /api/v1/users/{id}
// GET   /api/v1/roles
// src/pages/AdminUsersPage.tsx
// ============================================================
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, MoreHorizontal, UserCheck, UserX, Trash2, Shield, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import PageTransition, { staggerItem, staggerContainer } from '@/components/PageTransition';
import StatCard from '@/components/StatCard';
import { DataTable, type Column } from '@/shared/components/tables/DataTable';
import { Button } from '@/components/ui/button';
import { Badge }  from '@/components/ui/badge';
import { Input }  from '@/components/ui/input';
import { Label }  from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useUsers, useCreateUser, useDeleteUser,
  useActivateUser, useDeactivateUser, useAssignRole, useRoles,
} from '@/modules/users/services/userApi';
import { formatDate } from '@/shared/utils/formatters';
import { cn } from '@/lib/utils';

interface CreateForm { fullName: string; email: string; password: string; phone: string; roleId: string; }

export default function AdminUsersPage() {
  const [showCreate, setShowCreate]   = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [form, setForm]               = useState<CreateForm>({ fullName: '', email: '', password: '', phone: '', roleId: '' });

  const { data: usersData, isLoading, error, refetch } = useUsers({ pageSize: 100 });
  const { data: roles = [] }    = useRoles();
  const createUser    = useCreateUser();
  const deleteUser    = useDeleteUser();
  const activateUser  = useActivateUser();
  const deactivateUser = useDeactivateUser();
  const assignRole    = useAssignRole();

  const users = Array.isArray(usersData) ? usersData : (usersData as any)?.items ?? [];

  const stats = {
    total:    users.length,
    active:   users.filter((u: any) => u.status === 'Active').length,
    inactive: users.filter((u: any) => u.status !== 'Active').length,
  };

  const handleCreate = async () => {
    if (!form.fullName || !form.email || !form.password) { toast.error('Fill all required fields'); return; }
    try {
      const newUser = await createUser.mutateAsync({ fullName: form.fullName, email: form.email, password: form.password, phone: form.phone || undefined });
      if (form.roleId && newUser?.id) {
        await assignRole.mutateAsync({ id: newUser.id, roleId: form.roleId });
      }
      toast.success('User created');
      setShowCreate(false);
      setForm({ fullName: '', email: '', password: '', phone: '', roleId: '' });
    } catch (err: any) {
      toast.error(err?.message ?? 'Create failed');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUser.mutateAsync(id);
      toast.success('User deleted');
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err?.message ?? 'Delete failed');
    }
  };

  const handleToggleStatus = async (user: any) => {
    try {
      if (user.status === 'Active') {
        await deactivateUser.mutateAsync(user.id);
        toast.success('User deactivated');
      } else {
        await activateUser.mutateAsync(user.id);
        toast.success('User activated');
      }
    } catch (err: any) {
      toast.error(err?.message ?? 'Status change failed');
    }
  };

  const columns: Column<any>[] = [
    {
      key: 'fullName', label: 'User',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={row.profileImageUrl} />
            <AvatarFallback className="text-xs bg-primary/10 text-primary">
              {row.fullName?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">{row.fullName}</p>
            <p className="text-xs text-muted-foreground">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'roles', label: 'Roles',
      render: (val) => (
        <div className="flex flex-wrap gap-1">
          {((val as string[]) ?? []).map((r) => (
            <Badge key={r} variant="secondary" className="text-xs">{r}</Badge>
          ))}
        </div>
      ),
    },
    {
      key: 'status', label: 'Status',
      render: (val) => (
        <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium',
          val === 'Active' ? 'bg-green-500/10 text-green-600' : 'bg-muted text-muted-foreground')}>
          {val as string}
        </span>
      ),
    },
    {
      key: 'isEmailVerified', label: 'Email',
      render: (val) => (
        <span className={cn('text-xs', val ? 'text-green-600' : 'text-amber-600')}>
          {val ? '✓ Verified' : '⚠ Unverified'}
        </span>
      ),
    },
    { key: 'createdAt', label: 'Joined', render: (val) => <span className="text-xs text-muted-foreground">{formatDate(val as string)}</span> },
  ];

  if (error) return (
    <PageTransition>
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-destructive">Failed to load users</p>
        <Button onClick={() => refetch()}><RefreshCw className="h-4 w-4 mr-2" />Retry</Button>
      </div>
    </PageTransition>
  );

  return (
    <PageTransition>
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Users</h1>
            <p className="page-subtitle">{isLoading ? '...' : `${stats.total} users`}</p>
          </div>
          <Button size="sm" className="h-9 gap-2" onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4" /> Add User
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
          </div>
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible"
            className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard title="Total Users" value={String(stats.total)}    icon={Shield}    changeType="neutral"  change="Registered" />
            <StatCard title="Active"       value={String(stats.active)}   icon={UserCheck} changeType="positive" change="Can login" />
            <StatCard title="Inactive"     value={String(stats.inactive)} icon={UserX}     changeType="neutral"  change="Suspended" />
          </motion.div>
        )}

        <motion.div variants={staggerItem} initial="hidden" animate="visible">
          <DataTable
            data={users}
            columns={columns}
            isLoading={isLoading}
            searchable
            searchPlaceholder="Search by name, email..."
            emptyMessage="No users found."
            actions={(row) => (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={() => handleToggleStatus(row)}>
                    {row.status === 'Active'
                      ? <><UserX className="h-4 w-4 mr-2" /> Deactivate</>
                      : <><UserCheck className="h-4 w-4 mr-2" /> Activate</>}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive" onClick={() => setDeleteTarget({ id: row.id, name: row.fullName })}>
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          />
        </motion.div>

        {/* Create User Dialog */}
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader><DialogTitle>Create User</DialogTitle></DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label>Full Name <span className="text-destructive">*</span></Label>
                <Input value={form.fullName} onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))} placeholder="John Doe" />
              </div>
              <div className="space-y-1.5">
                <Label>Email <span className="text-destructive">*</span></Label>
                <Input type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} placeholder="user@company.com" />
              </div>
              <div className="space-y-1.5">
                <Label>Password <span className="text-destructive">*</span></Label>
                <Input type="password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} placeholder="Min. 8 characters" />
              </div>
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} placeholder="+91 98000 00000" />
              </div>
              <div className="space-y-1.5">
                <Label>Assign Role</Label>
                <Select value={form.roleId} onValueChange={(v) => setForm((p) => ({ ...p, roleId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select role (optional)" /></SelectTrigger>
                  <SelectContent>
                    {(roles as any[]).map((r) => (
                      <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={createUser.isPending}>
                {createUser.isPending ? 'Creating…' : 'Create User'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete User</AlertDialogTitle>
              <AlertDialogDescription>Delete "{deleteTarget?.name}"? This cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteTarget && handleDelete(deleteTarget.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PageTransition>
  );
}
