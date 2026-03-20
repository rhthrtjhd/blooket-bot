const express = require('express');
const https = require('https');
const app = express();

app.use(express.static('.'));
app.use(express.json());

// Proxy Blooket API calls to avoid CORS
app.get('/api/game/:id', (req, res) => {
  const options = {
    hostname: 'fb.blooket.com',
    path: `/c/firebase/id?id=${req.params.id}`,
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0' }
  };
  https.get(options, (r) => {
    let data = '';
    r.on('data', chunk => data += chunk);
    r.on('end', () => {
      try { res.json(JSON.parse(data)); }
      catch(e) { res.status(500).json({ error: 'Parse error' }); }
    });
  }).on('error', e => res.status(500).json({ error: e.message }));
});

app.get('/api/token', (req, res) => {
  const options = {
    hostname: 'fb.blooket.com',
    path: '/c/firebase/token',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0',
      'Cookie': req.headers.cookie || ''
    }
  };
  https.get(options, (r) => {
    let data = '';
    r.on('data', chunk => data += chunk);
    r.on('end', () => {
      try { res.json(JSON.parse(data)); }
      catch(e) { res.status(500).json({ error: 'Parse error' }); }
    });
  }).on('error', e => res.status(500).json({ error: e.message }));
});

app.listen(process.env.PORT || 3000, () => console.log('Running!'));
