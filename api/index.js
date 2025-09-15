// Simple CommonJS handler for Vercel
// Set VERCEL environment variable for the app to know it's running on Vercel
process.env.VERCEL = 'true';

// Import the compiled CommonJS app
const app = require('../dist/index.js').default || require('../dist/index.js');

// Export the Express app for Vercel
module.exports = app;