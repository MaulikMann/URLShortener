const express = require('express');
const bodyParser = require('body-parser');
const shortid = require('shortid');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

// In-memory database to store mappings between short codes and long URLs
const urlDatabase = {};

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Endpoint to create a short URL
app.post('/shorten', (req, res) => {
    const { longUrl } = req.body;

    // Check if the long URL is provided
    if (!longUrl) {
        return res.status(400).json({ error: 'Long URL is required' });
    }

    // Generate a unique short code using nanoid
    const shortCode = shortid.generate();

    // Store the mapping in the database
    urlDatabase[shortCode] = longUrl;

    // Construct the short URL
    const shortUrl = `http://localhost:${PORT}/${shortCode}`;

    // Return the short URL
    res.json({ shortUrl });
});

// Endpoint to redirect to the original URL
app.get('/:shortCode', (req, res) => {
    const { shortCode } = req.params;
    const longUrl = urlDatabase[shortCode];

    // Check if the short code exists in the database
    if (!longUrl) {
        return res.status(404).json({ error: 'Short URL not found' });
    }

    // Redirect to the original URL
    res.redirect(longUrl);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
