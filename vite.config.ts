import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import type { ServerResponse } from 'http';

function queueSyncPlugin(): Plugin {
  let tickets: unknown[] = [];
  const clients: Set<ServerResponse> = new Set();

  return {
    name: 'vite-queue-sync-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

        if (url.pathname === '/api/queue/stream') {
          res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
          });
          res.write(`data: ${JSON.stringify({ type: 'INIT', tickets })}\n\n`);
          clients.add(res);

          req.on('close', () => {
            clients.delete(res);
          });
          return;
        }

        if (url.pathname === '/api/queue' && req.method === 'GET') {
          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          });
          res.end(JSON.stringify(tickets));
          return;
        }

        if (url.pathname === '/api/queue/action' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              if (Array.isArray(data.tickets)) {
                tickets = data.tickets;
              }

              // Broadcast update to all connected MacBooks & TV via SSE
              const payload = JSON.stringify({
                type: data.type || 'UPDATE',
                tickets,
                event: data.event,
              });
              const sseMessage = `data: ${payload}\n\n`;

              for (const client of clients) {
                try {
                  client.write(sseMessage);
                } catch {
                  clients.delete(client);
                }
              }

              res.writeHead(200, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              });
              res.end(JSON.stringify({ success: true }));
            } catch {
              res.writeHead(400, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              });
              res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
            }
          });
          return;
        }

        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), queueSyncPlugin()],
  server: {
    host: true, // Listens on all local network interfaces (0.0.0.0) for MacBook / TV Wi-Fi access
    port: 5173,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
