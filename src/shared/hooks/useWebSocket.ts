// ============================================================
// USE WEBSOCKET HOOK
// src/shared/hooks/useWebSocket.ts
// ============================================================

import { useEffect, useRef, useState, useCallback } from 'react';
import { WS_EVENTS } from '@/shared/utils/constants';

type WSStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

interface WSMessage {
  type:    string;
  payload: unknown;
}

interface UseWebSocketOptions {
  url?:            string;
  enabled?:        boolean;
  reconnectDelay?: number;
  maxRetries?:     number;
  onMessage?:      (msg: WSMessage) => void;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const {
    url            = import.meta.env.VITE_WS_URL ?? 'ws://localhost:5000/ws',
    enabled        = false, // Disabled by default - enable when backend ready
    reconnectDelay = 3000,
    maxRetries     = 5,
    onMessage,
  } = options;

  const wsRef       = useRef<WebSocket | null>(null);
  const retriesRef  = useRef(0);
  const timerRef    = useRef<ReturnType<typeof setTimeout>>();

  const [status, setStatus]   = useState<WSStatus>('disconnected');
  const [lastMsg, setLastMsg] = useState<WSMessage | null>(null);

  const connect = useCallback(() => {
    if (!enabled) return;
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    setStatus('connecting');

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        setStatus('connected');
        retriesRef.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const msg: WSMessage = JSON.parse(event.data);
          setLastMsg(msg);
          onMessage?.(msg);
        } catch {
          console.warn('[WS] Failed to parse message');
        }
      };

      ws.onerror = () => setStatus('error');

      ws.onclose = () => {
        setStatus('disconnected');
        // Auto-reconnect
        if (retriesRef.current < maxRetries) {
          retriesRef.current += 1;
          timerRef.current = setTimeout(connect, reconnectDelay);
        }
      };
    } catch (err) {
      setStatus('error');
    }
  }, [url, enabled, reconnectDelay, maxRetries, onMessage]);

  const disconnect = useCallback(() => {
    clearTimeout(timerRef.current);
    wsRef.current?.close();
    wsRef.current = null;
    setStatus('disconnected');
  }, []);

  const send = useCallback((type: string, payload: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type, payload }));
    }
  }, []);

  useEffect(() => {
    if (enabled) connect();
    return disconnect;
  }, [enabled, connect, disconnect]);

  return { status, lastMsg, send, connect, disconnect };
}
