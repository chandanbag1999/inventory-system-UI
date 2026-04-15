import { useState }   from 'react';
import { motion }     from 'framer-motion';
import { Settings, Bell, Shield, Database, Globe, Palette, Save } from 'lucide-react';
import PageTransition, { staggerItem } from '@/components/PageTransition';
import { Button }     from '@/components/ui/button';
import { Input }      from '@/components/ui/input';
import { Label }      from '@/components/ui/label';
import { Switch }     from '@/components/ui/switch';
import { Separator }  from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast }      from 'sonner';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    appName:          'StockPulse',
    supportEmail:     'support@stockpulse.com',
    timezone:         'Asia/Kolkata',
    currency:         'INR',
    language:         'en',
    lowStockThreshold: 50,
    sessionTimeout:   24,
    twoFactorAuth:    false,
    emailNotifications: true,
    pushNotifications:  true,
    autoBackup:         true,
    maintenanceMode:    false,
    debugMode:          false,
  });

  const update = (key: string, value: unknown) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => toast.success('Settings saved successfully');

  const sections = [
    {
      title: 'General', icon: Settings, desc: 'Basic application configuration',
      content: (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Application Name</Label>
            <Input value={settings.appName} onChange={(e) => update('appName', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Support Email</Label>
            <Input type="email" value={settings.supportEmail} onChange={(e) => update('supportEmail', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Timezone</Label>
            <Select value={settings.timezone} onValueChange={(v) => update('timezone', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {['Asia/Kolkata','Asia/Dubai','Europe/London','America/New_York'].map((tz) => (
                  <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Currency</Label>
            <Select value={settings.currency} onValueChange={(v) => update('currency', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {['INR','USD','EUR','GBP'].map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Low Stock Threshold</Label>
            <Input type="number" value={settings.lowStockThreshold}
              onChange={(e) => update('lowStockThreshold', Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <Label>Session Timeout (hours)</Label>
            <Input type="number" value={settings.sessionTimeout}
              onChange={(e) => update('sessionTimeout', Number(e.target.value))} />
          </div>
        </div>
      ),
    },
    {
      title: 'Security', icon: Shield, desc: 'Authentication and access control',
      content: (
        <div className="space-y-4">
          {[
            { key:'twoFactorAuth',   label:'Two-Factor Authentication', desc:'Require 2FA for all admin accounts' },
            { key:'maintenanceMode', label:'Maintenance Mode',           desc:'Temporarily disable user access'    },
            { key:'debugMode',       label:'Debug Mode',                 desc:'Enable detailed error logging'      },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <Switch
                checked={settings[item.key as keyof typeof settings] as boolean}
                onCheckedChange={(v) => update(item.key, v)}
              />
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Notifications', icon: Bell, desc: 'System notification preferences',
      content: (
        <div className="space-y-4">
          {[
            { key:'emailNotifications', label:'Email Notifications', desc:'Send system alerts via email'  },
            { key:'pushNotifications',  label:'Push Notifications',  desc:'Browser push notifications'    },
            { key:'autoBackup',         label:'Auto Backup',         desc:'Daily automatic data backup'   },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <Switch
                checked={settings[item.key as keyof typeof settings] as boolean}
                onCheckedChange={(v) => update(item.key, v)}
              />
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <PageTransition>
      <div className="page-container max-w-4xl">
        <div className="page-header">
          <div>
            <h1 className="page-title">Settings</h1>
            <p className="page-subtitle">System configuration and preferences</p>
          </div>
          <Button className="h-9 gap-2" onClick={handleSave}>
            <Save className="h-4 w-4" /> Save Changes
          </Button>
        </div>

        <div className="space-y-5">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <motion.div key={section.title} variants={staggerItem} initial="hidden" animate="visible">
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      {section.title}
                    </CardTitle>
                    <CardDescription>{section.desc}</CardDescription>
                  </CardHeader>
                  <CardContent>{section.content}</CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PageTransition>
  );
}
