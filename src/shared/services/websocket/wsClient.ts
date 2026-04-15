// ============================================================
// WEBSOCKET CLIENT
// src/shared/services/websocket/wsClient.ts
// ============================================================
import { WS_EVENTS } from '@/shared/utils/constants';

class WebSocketClient {
  private ws:       WebSocket | null = null;
  private url:      string;
  private handlers: Map<string, Set<(payload: unknown) => void>> = new Map();
  private retries   = 0;
  private maxRetries= 5;
  private delay     = 3000;
  private timer:    ReturnType<typeof setTimeout> | null = null;
  private enabled   = false;

  constructor(url: string) {
    this.url = url;
  }

  connect(token?: string): void {
    if (!this.enabled) return;
    if (this.ws?.readyState === WebSocket.OPEN) return;

    const wsUrl = token ? this.url + '?token=' + token : this.url;
    this.ws     = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('[WS] Connected');
      this.retries = 0;
    };

    this.ws.onmessage = (event) => {
      try {
        const { type, payload } = JSON.parse(event.data);
        const handlers = this.handlers.get(type);
        handlers?.forEach((h) => h(payload));
        // Also trigger wildcard
        this.handlers.get('*')?.forEach((h) => h({ type, payload }));
      } catch {
        console.warn('[WS] Parse error');
      }
    };

    this.ws.onclose = () => {
      console.log('[WS] Disconnected');
      if (this.enabled && this.retries < this.maxRetries) {
        this.retries++;
        this.timer = setTimeout(() => this.connect(token), this.delay);
      }
    };

    this.ws.onerror = () => console.error('[WS] Error');
  }

  disconnect(): void {
    this.enabled = false;
    if (this.timer) clearTimeout(this.timer);
    this.ws?.close();
    this.ws = null;
  }

  enable(): void   { this.enabled = true; }
  disable(): void  { this.enabled = false; }

  on(event: string, handler: (payload: unknown) => void): () => void {
    if (!this.handlers.has(event)) this.handlers.set(event, new Set());
    this.handlers.get(event)!.add(handler);
    return () => this.handlers.get(event)?.delete(handler);
  }

  send(type: string, payload: unknown): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
    }
  }

  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

const WS_URL = import.meta.env.VITE_WS_URL ?? 'ws://localhost:5000/ws';
export const wsClient = new WebSocketClient(WS_URL);
export default wsClient;
