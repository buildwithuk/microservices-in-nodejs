// constants.js
const API_URL = "https://api.example.com";
const PORT = 3000;

const ERROR_MESSAGES = {
  NOT_FOUND: "Resource not found",
  SERVER_ERROR: "Internal server error",
};

const STATUS_CODES = {
  SUCCESS: 200,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

const TOKEN_EXPIRY = '12h';
const REFRESH_TOKEN_EXPIRY = '7d';
const JWT_SECRET = 'helplogic-secret';
const JWT_REFRESH_SECRET = 'helplogic-refresh-secret';

module.exports = { TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY, API_URL, PORT, ERROR_MESSAGES, STATUS_CODES, JWT_SECRET, JWT_REFRESH_SECRET };
