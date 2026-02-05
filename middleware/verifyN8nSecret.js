
import 'dotenv/config.js';
export const verifyN8nSecret = (req, res, next) => { 
    const incomingKey = req.headers['x-n8n-secret']; 
    const storedKey = process.env.N8N_WEBHOOK_SECRET; 
    
    if (!incomingKey || incomingKey !== storedKey) { 
      console.warn(`[Security] Unauthorized webhook attempt from IP ${req.ip}`); 
      return res.status(401).json({ error: 'Unauthorized: Invalid Secret' }); 
    } 
   
    next(); 
  }; 
   
