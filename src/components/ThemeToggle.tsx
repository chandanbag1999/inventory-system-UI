import { Moon, Sun }      from 'lucide-react';
import { useThemeStore }  from '@/shared/store/themeStore';
import { Button }         from '@/components/ui/button';

export default function ThemeToggle() {
  const { resolved, toggle } = useThemeStore();
  return (
    <Button variant="ghost" size="icon" onClick={toggle} className="h-9 w-9 rounded-lg">
      {resolved === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </Button>
  );
}
