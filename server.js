const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const users = [
  { username: 'admin', password: '123456' },
  { username: 'demo', password: 'demo123' }
];

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

function serveStaticFile(res, filePath, contentType) {
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('服务器错误');
      return;
    }

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
}

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    return serveStaticFile(res, path.join(__dirname, 'public', 'index.html'), 'text/html; charset=utf-8');
  }

  if (req.method === 'POST' && req.url === '/api/login') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const { username, password } = JSON.parse(body || '{}');
        const user = users.find((item) => item.username === username && item.password === password);

        if (!user) {
          return sendJson(res, 401, {
            success: false,
            message: '用户名或密码错误'
          });
        }

        return sendJson(res, 200, {
          success: true,
          message: '登录成功',
          token: `token-${Buffer.from(`${username}:${Date.now()}`).toString('base64')}`
        });
      } catch (error) {
        return sendJson(res, 400, {
          success: false,
          message: '请求格式错误'
        });
      }
    });

    return;
  }

  sendJson(res, 404, {
    success: false,
    message: '接口不存在'
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
