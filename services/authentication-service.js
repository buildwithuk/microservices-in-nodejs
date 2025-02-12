const { JWT_SECRET, JWT_REFRESH_SECRET, TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } = require('../app-modules/constants');
const jwt = require('jsonwebtoken');
const authenticationDao = require('../dao/authentication-dao');
const validationUtils = require('../validators/validation-utils')

exports.doLogin = async function (req, res) {


    const { username, password } = req.body;

    // Check if the username is valid
    // Check if the password is valid
    if (validationUtils.isNullOrEmptyStrict(req.body, 'username') || validationUtils.isNullOrEmptyStrict(req.body, 'password'))
        throw new Error("Username or password is required");

    let user = await authenticationDao.authenticateUserByUsernameAndPassword(username, password);

    if (user == null || user == undefined) {
        throw new Error("Invalid username or password");
    }

    let uname = user.username;
    let id = user.id;

    // Find the user
    // Generate a JWT token
    // const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' })
    const token = jwt.sign({ id: id, username: uname }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY })

    // Generate refresh token (long-lived, e.g., 7 days)
    const refreshToken = jwt.sign({ id: id }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });


    res.json({ token, refreshToken });
};

exports.doRefreshToken = async function (req, res) {


    const { refreshToken } = req.body;

    // Verify the token
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

    // Find the user by the decoded id
    let userFromDB = await authenticationDao.getUserById(decoded.id);

    if (userFromDB == null || userFromDB == undefined)
         throw new Error('Invalid request. Login again');


    // Find the user
    // Generate a JWT token
    const newToken = jwt.sign({ id: userFromDB.id, username: userFromDB.username }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY })
    
    // Generate refresh token (long-lived, e.g., 7 days)
    const newRefreshToken = jwt.sign({ id: userFromDB.id }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });


    res.json({ token: newToken, refreshToken: newRefreshToken });
};