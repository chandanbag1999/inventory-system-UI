import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Camera, Bell, Lock, Globe, Pencil, Check, X } from 'lucide-react';
import PageTransition, { staggerItem } from '@/components/PageTransition';
import { useAuthStore } from '@/shared/store/authStore';
import { Button }     from '@/components/ui/button';
import { Input }      from '@/components/ui/input';
import { Label }      from '@/components/ui/label';
import { Switch }     from '@/components/ui/switch';
import { Separator }  from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast }      from 'sonner';

const roleMeta: Record<string, { label: string; color: string; description: string }> = {
  admin:     { label: 'Administrator',      color: 'bg-primary/10 text-primary',                                                    description: 'Full system access — users, settings, audit logs'          },
  seller:    { label: 'Seller / Vendor',    color: 'bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]',  description: 'Product catalog, order management, revenue analytics'     },
  warehouse: { label: 'Warehouse Manager',  color: 'bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))]',  description: 'Inventory, stock movements, warehouse operations'          },
  delivery:  { label: 'Delivery Partner',   color: 'bg-[hsl(var(--info))]/10 text-[hsl(var(--info))]',        description: 'Delivery tasks, route tracking, earnings'                 },
};

export default function ProfilePage() {
  const { user }              = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [name, setName]       = useState(user?.name ?? '');
  const [phone, setPhone]     = useState(user?.phone ?? '+91 98765 43210');
  const [timezone, setTimezone] = useState(user?.timezone ?? 'Asia/Kolkata (IST)');

  const [notifications, setNotifications] = useState({
    email:       true,
    push:        true,
    orderUpdates:true,
    stockAlerts: false,
    weeklyReport:true,
  });

  const meta = roleMeta[user?.role ?? 'admin'];

  const handleSave = () => { setEditing(false); toast.success('Profile updated successfully'); };
  const handleCancel = () => { setName(user?.name ?? ''); setEditing(false); };

  return (
    <PageTransition>
      <div className="page-container max-w-4xl">
        <div className="page-header">
          <div>
            <h1 className="page-title">Profile</h1>
            <p className="page-subtitle">Manage your account settings and preferences</p>
          </div>
        </div>

        <motion.div variants={staggerItem} initial="hidden" animate="visible">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="relative group">
                  <div className="h-24 w-24 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary ring-4 ring-background shadow-lg">
                    {user?.name.charAt(0)}
                  </div>
                  <button className="absolute inset-0 rounded-2xl bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="h-5 w-5 text-background" />
                  </button>
                </div>
                <div className="flex-1 min-w-0 space-y-3 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      {editing
                        ? <Input value={name} onChange={(e) => setName(e.target.value)} className="text-lg font-semibold h-9 max-w-xs" autoFocus />
                        : <h2 className="text-xl font-semibold">{user?.name}</h2>
                      }
                      <p className="text-sm text-muted-foreground mt-0.5">{user?.email}</p>
                    </div>
                    <div className="flex gap-2">
                      {editing ? (
                        <>
                          <Button size="sm" variant="outline" onClick={handleCancel}><X className="h-4 w-4 mr-1" /> Cancel</Button>
                          <Button size="sm" onClick={handleSave}><Check className="h-4 w-4 mr-1" /> Save</Button>
                        </>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => setEditing(true)}><Pencil className="h-4 w-4 mr-1" /> Edit Profile</Button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={"inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium " + meta.color}>
                      <Shield className="h-3.5 w-3.5" />{meta.label}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{meta.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={staggerItem} initial="hidden" animate="visible" className="grid gap-5 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" /> Personal Information</CardTitle>
              <CardDescription>Your personal details used across the platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Full Name</Label>
                {editing ? <Input value={name} onChange={(e) => setName(e.target.value)} /> : <p className="text-sm font-medium">{user?.name}</p>}
              </div>
              <Separator />
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Email Address</Label>
                <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /><p className="text-sm font-medium">{user?.email}</p></div>
              </div>
              <Separator />
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Phone Number</Label>
                {editing ? <Input value={phone} onChange={(e) => setPhone(e.target.value)} /> : <p className="text-sm font-medium">{phone}</p>}
              </div>
              <Separator />
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Timezone</Label>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  {editing ? <Input value={timezone} onChange={(e) => setTimezone(e.target.value)} /> : <p className="text-sm font-medium">{timezone}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2"><Lock className="h-4 w-4 text-muted-foreground" /> Security</CardTitle>
              <CardDescription>Password and authentication settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Password</Label>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">••••••••••</p>
                  <Button size="sm" variant="outline">Change</Button>
                </div>
              </div>
              <Separator />
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Two-Factor Authentication</Label>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  <Switch />
                </div>
              </div>
              <Separator />
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Active Sessions</Label>
                <div className="rounded-lg bg-muted/50 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div><p className="text-xs font-medium">Current Session</p><p className="text-[11px] text-muted-foreground">Chrome · Windows · Mumbai, IN</p></div>
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div><p className="text-xs font-medium">Mobile App</p><p className="text-[11px] text-muted-foreground">iOS · Last active 2h ago</p></div>
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={staggerItem} initial="hidden" animate="visible">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2"><Bell className="h-4 w-4 text-muted-foreground" /> Notification Preferences</CardTitle>
              <CardDescription>Choose how and when you want to be notified</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { key: 'email'        as const, label: 'Email Notifications', desc: 'Receive updates via email'    },
                  { key: 'push'         as const, label: 'Push Notifications',  desc: 'Browser and mobile alerts'   },
                  { key: 'orderUpdates' as const, label: 'Order Updates',        desc: 'Status changes on orders'    },
                  { key: 'stockAlerts'  as const, label: 'Low Stock Alerts',     desc: 'When inventory runs low'     },
                  { key: 'weeklyReport' as const, label: 'Weekly Report',        desc: 'Summary every Monday'        },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch checked={notifications[item.key]} onCheckedChange={(v) => setNotifications((n) => ({ ...n, [item.key]: v }))} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={staggerItem} initial="hidden" animate="visible">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Recent Activity</CardTitle>
              <CardDescription>Your latest actions on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { action: 'Updated product pricing',              time: '2 hours ago',       icon: 'package'  },
                  { action: 'Approved order ORD-2024-1847',         time: '5 hours ago',       icon: 'check'    },
                  { action: 'Logged in from Chrome, Mumbai',        time: 'Today, 9:15 AM',    icon: 'lock'     },
                  { action: 'Exported monthly inventory report',    time: 'Yesterday, 4:30 PM',icon: 'chart'    },
                  { action: 'Changed notification preferences',     time: '2 days ago',        icon: 'bell'     },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{item.action}</p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  );
}
