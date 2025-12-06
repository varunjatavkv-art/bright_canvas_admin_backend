// index.js: The entry point for Firebase Functions

// Import V2 HTTP request handler
import {onRequest} from "firebase-functions/v2/https";

// Import V2 global configuration tools
import {setGlobalOptions} from "firebase-functions/v2";
// Note: We are keeping the logger import, but if your linter flags it as unused, 
// you can safely remove the next line if you don't use it globally here.
import {logger} from "firebase-functions/logger"; 

// Set global options for performance and cost control
setGlobalOptions({maxInstances: 10});

// --- IMPORTANT: Load your Express application ---
// This requires the Express app to be exported using 'module.exports = app;' in server.js
import app from "../server.js";

// --- Export the Express App as a Single HTTP Function ---
// The function name will be 'api' (e.g., your-project-id.cloudfunctions.net/api)
export const api = onRequest(
    // OPTIMIZATION: Set memory lower if 256MB is too much.
    // The default is 256 MiB. Try 128 MiB for a very light API.
    {
      timeoutSeconds: 60, // Reduced from 300
      maxInstances: 5,
      region: "us-central1",
      memory: "128MiB" // Explicitly set lower memory
    }, 
    app
);