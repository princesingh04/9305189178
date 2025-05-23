const axios = require('axios');
require('dotenv').config();

let bearerToken = null;
let tokenExpiry = null;

async function fetchToken() {
    try {
        const response = await axios.post(process.env.AUTH_URL, {
    email: "princekumarsinghvbs_cse22@its.edu.in",
    name: "prince kumar singh",
    rollNo: "2202220100135",
    accessCode: "gdCUHf",
    clientID: "809c6092-6148-4e0b-8f3d-af9ba00a941c",
    clientSecret: "mEATgwUNfwmncsgz"

        });

        bearerToken = response.data.access_token;
        tokenExpiry = Date.now() + 9 * 60 * 1000; 

        console.log("🔑 Fetched new token!");
        return bearerToken;
    } catch (err) {
        console.error("❌ Failed to fetch token:", err.message);
        throw err;
    }
}

async function getToken() {
    if (!bearerToken || Date.now() > tokenExpiry) {
        return await fetchToken();
    }
    return bearerToken;
}
console.log('Auth URL:', process.env.AUTH_URL);


module.exports = { getToken };
