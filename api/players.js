// /api/players.js - Vercel API endpoint
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
            
            const players = [];
            
            Object.entries(playerData).forEach(([guildId, guildPlayers]) => {
                Object.entries(guildPlayers).forEach(([userId, data]) => {
                    const tiers = {};
                    
                    // Map gamemode-specific ranks to tiers object
                    GAME_MODES.forEach(mode => {
                        const modeKey = mode.toLowerCase();
                        if (data[modeKey] && data[modeKey] !== 'Unranked') {
                            tiers[modeKey] = data[modeKey];
                        }
                    });
                    
                    // Check if player has premium account for skin
                    const isPremium = data.account_type === 'Premium';
                    const skinUrl = isPremium ? 
                        `https://mc-heads.net/avatar/${data.minecraft_name}/64` : 
                        'https://mc-heads.net/avatar/steve/64';
                    
                    players.push({
                        _id: userId,
                        name: data.minecraft_name || 'Unknown',
                        region: data.country === 'Pakistan' ? 'AS' : 'OTHER',
                        avatar: skinUrl,
                        tiers: tiers
                    });
                });
            });
            
            return res.status(200).json(players);
        } catch (error) {
            return res.status(500).json({ error: 'Failed to fetch player data' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}