#!/usr/bin/env node
const http = require('http');
const fs = require('fs');
const path = require('path');

const studentsPath = path.join(__dirname, '../src/data/students.json');

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/api/students') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body || '[]');
        fs.writeFile(studentsPath, JSON.stringify(data, null, 2) + '\n', (err) => {
          if (err) {
            res.writeHead(500);
            res.end('Failed to write file');
            return;
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'ok' }));
        });
      } catch {
        res.writeHead(400);
        res.end('Invalid JSON');
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Student API listening on port ${PORT}`);
});
