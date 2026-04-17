import { Menu, Search }        from 'lucide-react';
import ThemeToggle             from '@/components/ThemeToggle';
import { useAuthStore }        from '@/shared/store/authStore';
import { useUIStore }          from '@/shared/store/uiStore';
import { NotificationCenter }  from '@/modules/notifications/components/NotificationCenter';
import { useState }            from 'react';
import MobileNav               from './MobileNav';
import { Link }                from 'react-router-dom';

export default function TopBar() {
  const { user }          = useAuthStore();
  const togglePalette     = useUIStore((s) => s.toggleCommandPalette);
  const [mobileOpen, setMobileOpen] = useState(false);

  const displayName = user?.fullName ?? 'User';
  const userRole = user?.role ?? 'viewer';
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <>
      <header className="h-14 border-b border-border bg-card/80 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between px-4 md:px-6">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors">
            <Menu className="h-5 w-5" />
          </button>
          <span className="md:hidden font-bold text-base">NexusOps</span>

          {/* Search trigger */}
          <button onClick={togglePalette}
            className="hidden md:flex items-center gap-2 h-9 px-3 rounded-lg border border-border bg-secondary/50 text-sm text-muted-foreground hover:bg-secondary transition-colors min-w-[200px]">
            <Search className="h-3.5 w-3.5" />
            <span>Search...</span>
            <kbd className="ml-auto text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono">Ctrl+K</kbd>
          </button>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <NotificationCenter />
          <ThemeToggle />

          {/* User */}
          <div className="hidden md:flex items-center gap-2 ml-2 pl-2 border-l border-border">
            <Link to="/profile"
              className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary hover:ring-2 hover:ring-primary/30 transition-all">
              {initials}
            </Link>
            <div className="text-sm">
              <p className="font-medium leading-none">{displayName}</p>
              <p className="text-xs text-muted-foreground capitalize mt-0.5">{userRole}</p>
            </div>
          </div>
        </div>
      </header>
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
