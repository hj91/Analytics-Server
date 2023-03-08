// Logs incoming message that contains IP and localtime at which the message has arrived
// To do - Add some kind of db for more scalabilty and some mechanism to limit incoming messages at fixed rate
// Harshad Joshi, 8 March 2023, Bufferstack.IO Analytics Technology, LLP 


const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/data') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const { ip, localtime } = data;
        var IP = data.IP;
        console.log(data.IP);
        console.log(`Received data from ${IP},${localtime}`);
        // Log data to file
        fs.appendFileSync('data.log', `${IP},${localtime}\n`);

        //fs.appendFileSync('data.log', `${ip},${localtime}\n`);
        res.writeHead(200);
        res.end('Data received');
      } catch (error) {
        console.error('Failed to parse data:', error);
        res.writeHead(400);
        res.end('Invalid data format');
      }
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

