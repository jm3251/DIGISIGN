const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const port = Number(process.env.PORT || 3000);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8' };

function safePath(urlPath) {
  const pathname = decodeURIComponent((urlPath || '/').split('?')[0]);
  const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const resolved = path.resolve(root, relative);
  return resolved.startsWith(root + path.sep) ? resolved : null;
}

const server = http.createServer((req, res) => {
  const target = safePath(req.url);
  if (!target) { res.writeHead(400); res.end('Bad request'); return; }
  fs.readFile(target, (error, data) => {
    if (error) { res.writeHead(error.code === 'ENOENT' ? 404 : 500, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end(error.code === 'ENOENT' ? 'Not found' : 'Server error'); return; }
    const contentType = types[path.extname(target)] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType, 'Cache-Control': 'no-store' });
    res.end(data);
  });
});

server.listen(port, '0.0.0.0', () => console.log(`Secure Preview Demo listening on ${port}`));
