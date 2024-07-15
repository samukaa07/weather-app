const express = require('express');
const cors = require('cors');
const request = require('request');
const path = require('path');
const app = express();

app.use(cors());

app.use('/weather', (req, res) => {
    const url = `https://api.hgbrasil.com/weather${req.url}`;
    req.pipe(request(url)).pipe(res);
});

// Serve a página HTML principal
app.use(express.static(path.join(__dirname, '.')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`CORS proxy server running on port ${PORT}`);
});
