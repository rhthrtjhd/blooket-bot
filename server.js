const express = require('express');
const { gotScraping } = require('got-scraping');
const app = express();

// Serve the index.html and static files
app.use(express.static('.'));
app.use(express.json());

// The stealth proxy route
app.post('/join', async (req, res) => {
  try {
    console.log(`[BOT] Attempting to bypass Cloudflare for game ${req.body.id}...`);

    // gotScraping handles the TLS fingerprinting to look like a real browser
    const response = await gotScraping({
      url: 'https://fb.blooket.com/c/firebase/join',
      method: 'POST',
      json: req.body, // Sends { id: "123456", name: "Nickname" }
      headers: {
        'Origin': 'https://www.blooket.com',
        'Referer': 'https://www.blooket.com/',
        'Accept': 'application/json, text/plain, */*'
      },
      responseType: 'json' // Automatically parse the response as JSON
    });

    console.log('[BOT] ✅ Success! Grabbed Firebase tokens.');
    
    // Send the Blooket tokens back to your index.html
    res.json(response.body);

  } catch (error) {
    console.error('[BOT] ❌ Cloudflare block or network error:', error.message);
    
    // If Cloudflare hits us with the HTML challenge, it usually throws an error here
    res.status(500).json({ 
      success: false, 
      msg: 'Server proxy blocked or game not found.' 
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Stealth Proxy Running on port ${PORT}!`));
