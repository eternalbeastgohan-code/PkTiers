// /api/update-data.js - Vercel API endpoint
let playerData = {};

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        // Verify API secret
        const authHeader = req.headers.authorization;
        const expectedSecret = process.env.API_SECRET || 'your-secret-key';
        
        if (!authHeader || authHeader !== `Bearer ${expectedSecret}`) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Update player data from bot
        playerData = req.body.playerData || {};
        
        return res.status(200).json({ success: true, message: 'Data updated successfully' });
    }

    if (req.method === 'GET') {
        // Return current player data
        return res.status(200).json(playerData);
    }

    return res.status(405).json({ error: 'Method not allowed' });
}