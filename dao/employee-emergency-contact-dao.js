const pool = require('../app-modules/database');

exports.getById = async function (employeeId) {

    let res = await pool.query(`select * from employee_emergency_contact where employee_id = ${employeeId}`);

    return res.rows;
}