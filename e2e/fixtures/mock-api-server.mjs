import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FIXTURE_PATH = path.join(__dirname, 'mock-products.json');

function json(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json' });
  res.end(JSON.stringify(body));
}

export async function startMockApiServer({ port = 4000 } = {}) {
  const raw = await readFile(FIXTURE_PATH, 'utf8');
  const products = JSON.parse(raw);

  const server = http.createServer((req, res) => {
    const url = new URL(req.url ?? '/', `http://${req.headers.host ?? '127.0.0.1'}`);
    const pathname = url.pathname.replace(/\/$/, '');

    if (req.method !== 'GET') {
      res.writeHead(405);
      res.end();
      return;
    }

    if (pathname === '/api/v1/products') {
      json(res, 200, products);
      return;
    }

    const detail = /^\/api\/v1\/products\/(\d+)$/.exec(pathname);
    if (detail) {
      const id = Number(detail[1]);
      const row = products.find((p) => p.id === id);
      if (!row) {
        json(res, 404, {});
        return;
      }
      json(res, 200, row);
      return;
    }

    json(res, 404, { error: 'not found' });
  });

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', resolve);
  });

  return {
    port,
    close: () => new Promise((resolve, reject) => server.close((err) => (err ? reject(err) : resolve()))),
  };
}

