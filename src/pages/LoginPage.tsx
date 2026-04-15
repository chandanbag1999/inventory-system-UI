import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/shared/store/authStore';
import type { UserRole } from '@/modules/auth/types/auth.types';
import { Shield, Store, Warehouse, Truck, ArrowLeft, Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { toast } from 'sonner';

const roles: { role: UserRole; label: string; desc: string; icon: typeof Shield }[] = [
  { role: 'admin',     label: 'Admin',             desc: 'Full system access, user management, analytics',  icon: Shield    },
  { role: 'seller',    label: 'Seller / Vendor',   desc: 'Product management, orders, revenue',             icon: Store     },
  { role: 'warehouse', label: 'Warehouse Manager', desc: 'Inventory, stock, warehouses',                    icon: Warehouse },
  { role: 'delivery',  label: 'Delivery Partner',  desc: 'Deliveries, tracking, earnings',                  icon: Truck     },
];

const socialProviders = [
  {
    name: 'Google',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      </svg>
    ),
  },
  {
    name: 'Microsoft',
    icon: (
      <svg viewBox="0 0 21 21" className="h-5 w-5">
        <rect x="1"  y="1"  width="9" height="9" fill="#F25022" />
        <rect x="11" y="1"  width="9" height="9" fill="#7FBA00" />
        <rect x="1"  y="11" width="9" height="9" fill="#00A4EF" />
        <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
      </svg>
    ),
  },
  {
    name: 'GitHub',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-foreground">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2" />
      </svg>
    ),
  },
];

type Step     = 'role' | 'auth';
type AuthMode = 'login' | 'register';

export default function LoginPage() {
  const [step,            setStep]            = useState<Step>('role');
  const [selected,        setSelected]        = useState<UserRole | null>(null);
  const [authMode,        setAuthMode]        = useState<AuthMode>('login');
  const [name,            setName]            = useState('');
  const [email,           setEmail]           = useState('');
  const [password,        setPassword]        = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword,    setShowPassword]    = useState(false);
  const [loading,         setLoading]         = useState(false);

  const login    = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);
  const isLoading = useAuthStore((s) => s.isLoading);
  const navigate = useNavigate();

  const handleRoleSelect = (role: UserRole) => setSelected(role);
  const handleContinue   = () => { if (selected) setStep('auth'); };
  const handleBack       = () => {
    setStep('role');
    setEmail(''); setPassword(''); setConfirmPassword(''); setName('');
  };

  const handleSocialLogin = (provider: string) => {
    if (!selected) return;
    toast.info(`Social login with ${provider} is not implemented yet`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    if (!email.trim() || !password.trim()) { toast.error('Please fill in all fields'); return; }
    if (authMode === 'register') {
      if (!name.trim())               { toast.error('Please enter your full name');       return; }
      if (password.length < 6)        { toast.error('Password must be at least 6 characters'); return; }
      if (password !== confirmPassword){ toast.error('Passwords do not match');           return; }
    }
    
    setLoading(true);
    
    try {
      if (authMode === 'login') {
        const success = await login({ email, password });
        if (success) {
          toast.success('Welcome back!');
          navigate('/');
        } else {
          toast.error('Invalid email or password');
        }
      } else {
        const nameParts = name.trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        const roleMap: Record<UserRole, string> = {
          admin: 'Admin',
          seller: 'SalesManager',
          warehouse: 'InventoryManager',
          delivery: 'Staff',
        };
        
        const success = await register({
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
          role: roleMap[selected],
        });
        if (success) {
          toast.success('Account created successfully!');
          navigate('/');
        } else {
          toast.error('Registration failed. Please try again.');
        }
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const slideVariants = {
    enter:  (dir: number) => ({ x: dir > 0 ?  300 : -300, opacity: 0 }),
    center:              () => ({ x: 0,                    opacity: 1 }),
    exit:   (dir: number) => ({ x: dir < 0 ?  300 : -300, opacity: 0 }),
  };
  const direction = step === 'auth' ? 1 : -1;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold tracking-tight">StockPulse</h1>
          <p className="text-muted-foreground mt-2 text-sm">Enterprise Inventory & Logistics Platform</p>
        </motion.div>

        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            {step === 'role' ? (
              <motion.div
                key="role"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
                className="glass-card rounded-2xl p-6 space-y-4"
              >
                <p className="text-sm font-medium text-muted-foreground">Select your role to continue</p>
                <div className="space-y-2">
                  {roles.map(({ role, label, desc, icon: Icon }) => (
                    <button
                      key={role}
                      onClick={() => handleRoleSelect(role)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        selected === role
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-transparent bg-secondary/50 hover:bg-secondary'
                      }`}
                    >
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                        selected === role ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleContinue}
                  disabled={!selected}
                  className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-medium text-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="auth"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
                className="glass-card rounded-2xl p-6 space-y-5"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleBack}
                    className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  {selected && (() => {
                    const r = roles.find((r) => r.role === selected);
                    if (!r) return null;
                    const Icon = r.icon;
                    return (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                        <Icon className="h-3 w-3" />{r.label}
                      </span>
                    );
                  })()}
                </div>

                <div className="flex rounded-xl bg-secondary/50 p-1">
                  {(['login', 'register'] as AuthMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setAuthMode(mode)}
                      className={`flex-1 text-sm font-medium py-2 rounded-lg transition-all duration-200 ${
                        authMode === mode
                          ? 'bg-background shadow-sm text-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {mode === 'login' ? 'Sign In' : 'Register'}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {socialProviders.map((provider) => (
                    <button
                      key={provider.name}
                      type="button"
                      onClick={() => handleSocialLogin(provider.name)}
                      disabled={loading}
                      className="h-11 rounded-xl border border-border bg-background flex items-center justify-center hover:bg-secondary/80 transition-all duration-200 active:scale-95 disabled:opacity-50"
                      title={`Sign in with ${provider.name}`}
                    >
                      {provider.icon}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground">or continue with email</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <AnimatePresence mode="wait">
                    {authMode === 'register' && (
                      <motion.div
                        key="name-field"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <input type="text" placeholder="Full Name" value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input type="email" placeholder="Email address" value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-11 pl-10 pr-11 rounded-xl border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  <AnimatePresence mode="wait">
                    {authMode === 'register' && (
                      <motion.div
                        key="confirm-field"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <input type={showPassword ? 'text' : 'password'} placeholder="Confirm Password"
                            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {authMode === 'login' && (
                    <div className="flex justify-end">
                      <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-medium text-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                      />
                    ) : authMode === 'login' ? 'Sign In' : 'Create Account'}
                  </button>
                </form>

                <p className="text-[11px] text-center text-muted-foreground">
                  Demo mode — any credentials will work
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
