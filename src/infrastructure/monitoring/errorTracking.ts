// ============================================================
// ERROR TRACKING (Sentry ready)
// src/infrastructure/monitoring/errorTracking.ts
// ============================================================

interface ErrorContext {
  userId?:    string;
  userRole?:  string;
  page?:      string;
  extra?:     Record<string, unknown>;
}

export const errorTracking = {
  init: (): void => {
    // TODO: Initialize Sentry
    // Sentry.init({
    //   dsn: import.meta.env.VITE_SENTRY_DSN,
    //   environment: import.meta.env.MODE,
    //   tracesSampleRate: 1.0,
    // });
    console.log('[Monitoring] Error tracking initialized (mock)');
  },

  captureException: (error: Error, context?: ErrorContext): void => {
    console.error('[Error]', error.message, context);
    // Sentry.captureException(error, { extra: context });
  },

  captureMessage: (message: string, level: 'info' | 'warning' | 'error' = 'info'): void => {
    console.log('[' + level.toUpperCase() + ']', message);
    // Sentry.captureMessage(message, level);
  },

  setUser: (user: { id: string; email: string; role: string }): void => {
    // Sentry.setUser(user);
  },

  clearUser: (): void => {
    // Sentry.setUser(null);
  },
};

export default errorTracking;
