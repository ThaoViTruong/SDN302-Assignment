const axios = require("axios");
const https = require("https");

const API_URL = process.env.API_URL || `http://localhost:${process.env.PORT || 3000}`;

const clientConfig = {
    baseURL: `${API_URL}/api`
};

if (API_URL.startsWith("https://")) {
    clientConfig.httpsAgent = new https.Agent({
        rejectUnauthorized: false
    });
}

module.exports = axios.create(clientConfig);
