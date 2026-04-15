// src/shared/hooks/useKeyboardShortcuts.ts
import { useEffect } from 'react';

interface Shortcut {
  key:      string;
  ctrl?:    boolean;
  meta?:    boolean;
  shift?:   boolean;
  alt?:     boolean;
  handler:  () => void;
  prevent?: boolean;
}

export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const keyMatch   = e.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch  = !shortcut.ctrl  || e.ctrlKey;
        const metaMatch  = !shortcut.meta  || e.metaKey;
        const shiftMatch = !shortcut.shift || e.shiftKey;
        const altMatch   = !shortcut.alt   || e.altKey;

        if (keyMatch && ctrlMatch && metaMatch && shiftMatch && altMatch) {
          if (shortcut.prevent !== false) e.preventDefault();
          shortcut.handler();
          break;
        }
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [shortcuts]);
}
