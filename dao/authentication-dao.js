const pool = require('../app-modules/database');

exports.getUserById = async function (userId) {

    // Use the pool to query the database
    const res = await pool.query(`SELECT * FROM user_management where id=${userId}; `);


    if (res.rows.length == 0) {
        return null;
    } else {
        return res.rows[0]
    }

}

exports.authenticateUserByUsernameAndPassword = async function (username, password) {


    // Use the pool to query the database
    const res = await pool.query(`SELECT * FROM user_management where username='${username}' and password = '${password}'; `);


    if (res.rows.length == 0) {
        return null;
    } else {
        return res.rows[0]
    }


}