const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
require('dotenv').config();

app.use(express.json());

const API_BASE_URL = 'https://api.planningcenteronline.com/people/v2';

const getAuthHeader = () => {
    const authString = `${process.env.PLANNING_CENTER_APP_ID}:${process.env.PLANNING_CENTER_SECRET}`;
    const base64Auth = Buffer.from(authString).toString('base64');
    return `Basic ${base64Auth}`;
};

// Add a new member
app.post('/add-member', async(req, res) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/people`, {
            data: {
                type: 'Person',
                attributes: {
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                }
            }
        }, {
            headers: {
                Authorization: getAuthHeader(),
                'Content-Type': 'application/json'
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error adding member:', error.response ? error.response.data : error.message);
        res.status(500).send(error.message);
    }
});

// Fetch members
app.get('/get-members', async(req, res) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/people`, {
            headers: {
                Authorization: getAuthHeader(),
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, () => console.log('Server running on http://localhost:3000'));