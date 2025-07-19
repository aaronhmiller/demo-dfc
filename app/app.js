// Simple Node.js HTTP Server
// Save this as app.js or server.js
const http = require('http');

// Define the port
const PORT = 3000;

// Create the server
const server = http.createServer((req, res) => {
  // Parse the URL using the WHATWG URL API
  // We need to construct a full URL by combining with the host
  const baseURL = `http://${req.headers.host || 'localhost'}`;
  const myURL = new URL(req.url, baseURL);
  const pathname = myURL.pathname;
  
  // Set response headers
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  
  // Route handling
  if (pathname === '/') {
    res.statusCode = 200;
    res.end(`
      <html>
        <body>
          <h1>Welcome to my Node.js server!</h1>
          <p>The current time is: ${new Date().toLocaleString()}</p>
          <p>Try visiting:</p>
          <ul>
            <li><a href="/about">/about</a></li>
            <li><a href="/api/data">/api/data</a></li>
          </ul>
        </body>
      </html>
    `);
  } else if (pathname === '/about') {
    res.statusCode = 200;
    res.end(`
      <html>
        <body>
          <h1>About Page</h1>
          <p>This is a simple Node.js HTTP server.</p>
          <p><a href="/">Go back home</a></p>
        </body>
      </html>
    `);
  } else if (pathname === '/api/data') {
    // Return JSON data
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify({
      message: 'Hello from the API!',
      timestamp: Date.now(),
      data: {
        users: 42,
        status: 'operational'
      }
    }, null, 2));
  } else {
    // 404 Not Found
    res.statusCode = 404;
    res.end(`
      <html>
        <body>
          <h1>404 - Page Not Found</h1>
          <p>The page "${pathname}" doesn't exist.</p>
          <p><a href="/">Go home</a></p>
        </body>
      </html>
    `);
  }
});

// Track active connections
const connections = new Set();

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/`);
  console.log('Press Ctrl+C to stop the server');
});

// Track connections
server.on('connection', (connection) => {
  connections.add(connection);
  connection.on('close', () => {
    connections.delete(connection);
  });
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
});

// Graceful shutdown with forced exit
let isShuttingDown = false;
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

function shutdown() {
  if (isShuttingDown) return;
  isShuttingDown = true;
  
  console.log('\nShutdown signal received: closing HTTP server');
  
  // Stop accepting new connections
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
  
  // Destroy all open connections
  connections.forEach((connection) => {
    connection.destroy();
  });
  
  // Force close after 3 seconds (reduced from 10)
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 3000);
}
