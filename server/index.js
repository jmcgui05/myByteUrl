const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const crypto = require('crypto');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const SERVER_PORT = 8000;

const urlMap = {};

// POST endpoint to shorten a URL
app.post('/url', (req, res) => {
    const url = req.query.url;
    const code = crypto.randomBytes(5).toString('hex');
    urlMap[code] = url;
    console.log('Current urlMap: ', urlMap);

    const shortenedUrl = `http://localhost::${SERVER_PORT}/${code}`;
    sendToClient(shortenedUrl);

    // Send response to the client's POST request
    return res.status(200).json({ message: 'URL shortened successfully.' });
});

app.get('/url', (req, res) => {
    const url = req.query.url;
    
    if (url === null || url === undefined) {
        return res.send(400)
    }

    const id = url.split('/').pop();
    if (Object.keys(urlMap).length === 0 || urlMap[id] === undefined) {
        return res.send(404)
    }

    return res.send({'url': urlMap[id]});
})

wss.on('connection', (ws) => {
  console.log('A Client has connected')
  ws.send('Hello Client')

  ws.on('message', (message, isBinary) => {
    /**
     * We can use this to test client side ws code
     * which would send an ack
     */
    const ack = message.toString();
    if (ack === 'ack') {
      console.log('Client acknowledged receipt.');
    }
  });
});

server.listen(SERVER_PORT, () => {
  console.log(`Server running on port ${SERVER_PORT}`);
});

function sendToClient (shortenedUrl) {
    // Establish WebSocket connection with the client
    const ws = new WebSocket(`ws://localhost:${SERVER_PORT}`);

    // Send the shortened URL to the client through WebSocket
    ws.on('open', () => {
        console.log('Sending the shortenedUrl: ', { 'shortenedURL': shortenedUrl })
        ws.send(JSON.stringify({ 'shortenedURL': shortenedUrl }));
    });

    ws.on('message', (message, isBinary) => {
        let isDelivered = true// message.status;
        let number = 1;
        while(!isDelivered) {
            console.log('Sending number ' + number)
            ws.send(message);
            number++;
        }
        isDelivered = true;
        ws.close();
    });

    ws.on('close', () => {
        console.log('WebSocket connection closed.');
    });
}

module.exports = server;
