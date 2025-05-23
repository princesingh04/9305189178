const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();
const { getToken } = require('./tokenManager');

const app = express();
const PORT = process.env.PORT || 5000;

const BASE_URL = 'http://20.244.56.144/evaluation-service';

app.use(cors());
app.use(express.json());

async function fetchWithAuthRetry(url) {
    try {
        let token = await getToken();
        let response;

        try {
            response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } catch (err) {
            if (err.response && err.response.status === 401) {
                token = await getToken();
                response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            } else {
                throw err;
            }
        }

        return response.data;
    } catch (error) {
        console.error('Error during fetchWithAuthRetry:', error.message);
        throw error;
    }
}

app.get('/api/stocks', async (req, res) => {
    try {
        const data = await fetchWithAuthRetry(`${BASE_URL}/stocks`);
        res.json(data);
    } catch (error) {
        console.error('Failed to fetch stock list:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch stock list' });
    }
});

app.get('/api/stocks/:ticker', async (req, res) => {
    const { ticker } = req.params;
    try {
        const data = await fetchWithAuthRetry(`${BASE_URL}/stocks/${ticker}`);
        res.json(data);
    } catch (error) {
        console.error('Failed to fetch stock details:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch stock details' });
    }
});

app.get('/api/stockcorrelation', async (req, res) => {
    const { stock1, stock2, minutes } = req.query;

    if (!stock1 || !stock2 || !minutes) {
        return res.status(400).json({ error: 'Both stock1, stock2, and minutes are required' });
    }

    try {
        const [data1, data2] = await Promise.all([
            fetchWithAuthRetry(`${BASE_URL}/stocks/${stock1}?minutes=${minutes}`),
            fetchWithAuthRetry(`${BASE_URL}/stocks/${stock2}?minutes=${minutes}`)
        ]);

        const map1 = new Map(data1.map(p => [p.lastUpdatedAt, p.price]));
        const map2 = new Map(data2.map(p => [p.lastUpdatedAt, p.price]));
        const commonTimestamps = [...map1.keys()].filter(ts => map2.has(ts));

        if (commonTimestamps.length < 2) {
            return res.status(400).json({ error: 'Not enough common data points for correlation' });
        }

        const prices1 = commonTimestamps.map(ts => map1.get(ts));
        const prices2 = commonTimestamps.map(ts => map2.get(ts));

        const mean = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
        const std = arr => Math.sqrt(arr.reduce((sum, v) => sum + Math.pow(v - mean(arr), 2), 0) / (arr.length - 1));
        const covariance = (a, b) => {
            const avgA = mean(a), avgB = mean(b);
            return a.reduce((sum, v, i) => sum + (v - avgA) * (b[i] - avgB), 0) / (a.length - 1);
        };
        const correlation = (a, b) => covariance(a, b) / (std(a) * std(b));

        const corr = correlation(prices1, prices2);

        res.json({
            correlation: corr,
            stocks: {
                [stock1]: { priceHistory: data1 },
                [stock2]: { priceHistory: data2 }
            }
        });
    } catch (error) {
        console.error('Failed to fetch stock correlation:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch stock correlation' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
