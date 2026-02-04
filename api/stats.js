// /api/stats.js - Vercel API endpoint
import fetch from 'node-fetch';

const GAME_MODES = ['Neth', 'Pot', 'SMP', 'Sword', 'DiaSMP', 'Axe', 'Crystal', 'UHC', 'Mace'];

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'GET') {
        try {
            // Get player data from update-data endpoint
            const dataResponse = await fetch(`${req.headers.host}/api/update-data`);
            const playerData = await dataResponse.json();
            
            let totalPlayers = 0;
            let totalTests = 0;
            
            Object.values(playerData).forEach(guild => {
                totalPlayers += Object.keys(guild).length;
                Object.values(guild).forEach(player => {
                    if (player.rank && player.rank !== 'Unranked') {
                        totalTests++;
                    }
                });
            });
            
            return res.status(200).json({
                totalPlayers,
                totalTests,
                gamemodes: GAME_MODES.length
            });
        } catch (error) {
            return res.status(200).json({
                totalPlayers: 0,
                totalTests: 0,
                gamemodes: GAME_MODES.length
            });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}