// ============================================================
// PROFILE PAGE — real backend data
// GET  /api/v1/auth/me
// POST /api/v1/auth/change-password
// POST /api/v1/users/{id}/profile-image
// src/pages/ProfilePage.tsx
// ============================================================
import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Shield, Camera, Lock, Save, RefreshCw } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import PageTransition, { staggerItem } from '@/components/PageTransition';
import { Button }   from '@/components/ui/button';
import { Input }    from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge }    from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/shared/store/authStore';
import { authService } from '@/shared/services/authService';
import { userApiClient } from '@/modules/users/services/userApi';
import { formatDate } from '@/shared/utils/formatters';

const pwSchema = z.object({
  oldPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'At least 8 characters'),
  confirm:     z.string().min(1, 'Please confirm your password'),
}).refine((d) => d.newPassword === d.confirm, {
  message: 'Passwords do not match',
  path: ['confirm'],
});
type PwValues = z.infer<typeof pwSchema>;

export default function ProfilePage() {
  const { user, getMe } = useAuthStore();
  const [uploading, setUploading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  const pwForm = useForm<PwValues>({
    resolver: zodResolver(pwSchema),
    defaultValues: { oldPassword: '', newPassword: '', confirm: '' },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    setUploading(true);
    try {
      await userApiClient.uploadProfileImage(user.id, file);
      await getMe();
      toast.success('Profile image updated');
    } catch (err: any) {
      toast.error(err?.message ?? 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleChangePassword = async (values: PwValues) => {
    setPwLoading(true);
    try {
      await authService.changePassword(values.oldPassword, values.newPassword);
      toast.success('Password changed successfully');
      pwForm.reset();
    } catch (err: any) {
      toast.error(err?.message ?? 'Password change failed');
    } finally {
      setPwLoading(false);
    }
  };

  if (!user) {
    return (
      <PageTransition>
        <div className="page-container max-w-3xl space-y-6">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </PageTransition>
    );
  }

  const initials = user.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <PageTransition>
      <div className="page-container max-w-3xl">
        <div className="page-header">
          <div>
            <h1 className="page-title">Profile</h1>
            <p className="page-subtitle">Manage your account settings</p>
          </div>
        </div>

        {/* Profile card */}
        <motion.div variants={staggerItem} initial="hidden" animate="visible">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <Avatar className="h-24 w-24 ring-4 ring-background shadow-lg">
                    <AvatarImage src={user.profileImageUrl ?? undefined} alt={user.fullName} />
                    <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <label
                    htmlFor="profile-image-upload"
                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary flex items-center justify-center cursor-pointer shadow-md hover:bg-primary/90 transition-colors"
                  >
                    {uploading
                      ? <RefreshCw className="h-4 w-4 text-primary-foreground animate-spin" />
                      : <Camera className="h-4 w-4 text-primary-foreground" />}
                    <input
                      id="profile-image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                  </label>
                </div>

                {/* Info */}
                <div className="flex-1 text-center sm:text-left space-y-2">
                  <h2 className="text-xl font-bold">{user.fullName}</h2>
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    {user.roles.map((r) => (
                      <Badge key={r} variant="secondary" className="text-xs capitalize">{r}</Badge>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 text-sm text-muted-foreground mt-2">
                    <span className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" /> {user.email}
                    </span>
                    {user.phone && (
                      <span className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5" /> {user.phone}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground pt-1">
                    <span>Joined {formatDate(user.createdAt)}</span>
                    {user.lastLoginAt && <span>Last login {formatDate(user.lastLoginAt)}</span>}
                    <span className={user.isEmailVerified ? 'text-green-600' : 'text-amber-600'}>
                      {user.isEmailVerified ? '✓ Email verified' : '⚠ Email not verified'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Permissions */}
        {user.permissions && user.permissions.length > 0 && (
          <motion.div variants={staggerItem} initial="hidden" animate="visible">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  Permissions
                </CardTitle>
                <CardDescription>Your current access permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {user.permissions.map((p) => (
                    <Badge key={p} variant="outline" className="text-xs font-mono">{p}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Change Password */}
        <motion.div variants={staggerItem} initial="hidden" animate="visible">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                Change Password
              </CardTitle>
              <CardDescription>Update your account password</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...pwForm}>
                <form onSubmit={pwForm.handleSubmit(handleChangePassword)} className="space-y-4">
                  <FormField control={pwForm.control} name="oldPassword" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={pwForm.control} name="newPassword" render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl><Input type="password" placeholder="Min. 8 characters" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={pwForm.control} name="confirm" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" disabled={pwLoading} className="gap-2">
                    <Save className="h-4 w-4" />
                    {pwLoading ? 'Saving…' : 'Change Password'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  );
}
