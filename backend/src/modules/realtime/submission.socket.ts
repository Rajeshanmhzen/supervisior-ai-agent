type SocketLike = {
  send: (data: string) => void;
  on: (event: 'close' | 'error', cb: () => void) => void;
  readyState?: number;
};

const clients = new Map<string, Set<SocketLike>>();

const safeSend = (socket: SocketLike, data: string) => {
  try {
    socket.send(data);
  } catch {
    // ignore send errors
  }
};

export const registerSubmissionSocket = (userId: string, socket: SocketLike) => {
  if (!clients.has(userId)) clients.set(userId, new Set());
  clients.get(userId)!.add(socket);

  const cleanup = () => {
    const set = clients.get(userId);
    if (!set) return;
    set.delete(socket);
    if (set.size === 0) clients.delete(userId);
  };

  socket.on('close', cleanup);
  socket.on('error', cleanup);
};

export const emitSubmissionUpdate = (
  userId: string,
  payload: { fileId: string; status: string; progress: number; errorMessage?: string | null }
) => {
  const set = clients.get(userId);
  if (!set || set.size === 0) return;
  const message = JSON.stringify({ type: 'submission.update', payload });
  for (const socket of set) {
    safeSend(socket, message);
  }
};
