const pool = require('../app-modules/database');

exports.getById = async function(employeeId) {

    let res = await pool.query(`Select * from employment_information   where employee_id  = ${employeeId}`);

    return res.rows;
}