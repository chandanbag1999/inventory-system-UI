// ============================================================
// ANALYTICS TRACKING (PostHog / Mixpanel ready)
// src/infrastructure/analytics/tracking.ts
// ============================================================

export const analytics = {
  init: (): void => {
    console.log('[Analytics] Initialized (mock)');
    // posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
    //   api_host: 'https://app.posthog.com',
    // });
  },

  identify: (userId: string, traits?: Record<string, unknown>): void => {
    console.log('[Analytics] Identify:', userId, traits);
    // posthog.identify(userId, traits);
  },

  track: (event: string, properties?: Record<string, unknown>): void => {
    console.log('[Analytics] Track:', event, properties);
    // posthog.capture(event, properties);
  },

  page: (name: string): void => {
    console.log('[Analytics] Page:', name);
    // posthog.capture('$pageview', { page: name });
  },

  reset: (): void => {
    // posthog.reset();
  },
};

export const EVENTS = {
  USER_LOGIN:        'user_login',
  USER_LOGOUT:       'user_logout',
  PRODUCT_CREATED:   'product_created',
  PRODUCT_UPDATED:   'product_updated',
  ORDER_STATUS_CHANGED:'order_status_changed',
  EXPORT_TRIGGERED:  'export_triggered',
  SEARCH_PERFORMED:  'search_performed',
} as const;

export default analytics;
