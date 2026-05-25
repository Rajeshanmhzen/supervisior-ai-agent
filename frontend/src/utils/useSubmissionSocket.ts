import { useEffect, useRef, useCallback } from 'react';
import { authStorage } from '../services/authStorage';

export type SocketEvent =
  | { type: 'connected' }
  | { type: 'submission.update'; payload: { fileId: string; status: string; progress: number; errorMessage?: string | null } }
  | { type: 'review.complete'; payload: { fileId: string; status: 'COMPLETED' | 'FAILED'; documentName: string; totalScore?: number; issueCount?: number; formatting?: number; structure?: number; content?: number; errorMessage?: string | null } };

type Options = {
  onUpdate?: (payload: SocketEvent & { type: 'submission.update' }) => void;
  onReviewComplete?: (payload: SocketEvent & { type: 'review.complete' }) => void;
  enabled?: boolean;
};

const WS_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1')
  .replace(/^http/, 'ws');

export const useSubmissionSocket = ({ onUpdate, onReviewComplete, enabled = true }: Options) => {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  const connect = useCallback(() => {
    if (!enabled || !mountedRef.current) return;
    const token = authStorage.getAccessToken();
    if (!token) return;

    // Pass token as query param — browser WS API doesn't support custom headers
    const ws = new WebSocket(`${WS_BASE}/submissions/stream?token=${encodeURIComponent(token)}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as SocketEvent;
        if (data.type === 'submission.update') {
          onUpdate?.(data as any);
        } else if (data.type === 'review.complete') {
          onReviewComplete?.(data as any);
        }
      } catch { /* ignore parse errors */ }
    };

    ws.onclose = () => {
      if (!mountedRef.current) return;
      // Reconnect after 3s
      reconnectRef.current = setTimeout(() => {
        if (mountedRef.current) connect();
      }, 3000);
    };

    ws.onerror = () => {
      ws.close();
    };
  }, [enabled, onUpdate, onReviewComplete]);

  useEffect(() => {
    mountedRef.current = true;
    connect();
    return () => {
      mountedRef.current = false;
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [connect]);
};
