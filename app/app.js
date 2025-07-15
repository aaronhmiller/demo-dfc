// Simple Node.js HTTP Server
// Save this as app.js or server.js

const http = require('http');
const url = require('url');

// Define the port
const PORT = 3000;

// Create the server
const server = http.createServer((req, res) => {
  // Parse the URL
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  
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

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/`);
  console.log('Press Ctrl+C to stop the server');
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
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
}
