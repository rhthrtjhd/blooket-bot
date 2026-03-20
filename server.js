import express from 'express';
import cors from 'cors';
import { gotScraping } from 'got-scraping';

const app = express();

// Enable CORS so your local desktop HTML file can talk to this Render server
app.use(cors());
app.use(express.static('.'));
app.use(express.json());

app.post('/join', async (req, res) => {
  try {
    console.log(`[BOT] Attempting to bypass Cloudflare for game ${req.body.id}...`);

    const response = await gotScraping({
      url: 'https://fb.blooket.com/c/firebase/join',
      method: 'POST',
      json: req.body,
      headers: {
        'Origin': 'https://www.blooket.com',
        'Referer': 'https://www.blooket.com/',
        'Accept': 'application/json, text/plain, */*'
      },
      responseType: 'json'
      proxyUrl: 'http://username:password@proxy-ip-address:port'
    });

    console.log('[BOT] ✅ Success! Grabbed Firebase tokens.');
    res.json(response.body);

  } catch (error) {
    console.error('[BOT] ❌ Cloudflare block or network error:', error.message);
    res.status(500).json({ success: false, msg: 'Proxy error or game not found.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Stealth Proxy Running on port ${PORT}!`));
