const express = require('express');
const https = require('https');
const app = express();

app.use(express.static('.'));
app.use(express.json());

// Proxy the join endpoint to Blooket's server
app.post('/join', (req, res) => {
  const body = JSON.stringify(req.body);
  const options = {
    hostname: 'fb.blooket.com',
    path: '/c/firebase/join',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
      'User-Agent': 'Mozilla/5.0',
      'Origin': 'https://www.blooket.com',
      'Referer': 'https://www.blooket.com/',
    }
  };

  const request = https.request(options, (r) => {
    let data = '';
    r.on('data', chunk => data += chunk);
    r.on('end', () => {
      try { res.json(JSON.parse(data)); }
      catch(e) { res.status(500).json({ success: false, msg: 'Parse error: ' + data }); }
    });
  });

  request.on('error', e => res.status(500).json({ success: false, msg: e.message }));
  request.write(body);
  request.end();
});

app.listen(process.env.PORT || 3000, () => console.log('Running!'));
