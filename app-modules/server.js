const express = require("express")
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const appServer = express()
appServer.use(bodyParser.json());

module.exports = appServer;