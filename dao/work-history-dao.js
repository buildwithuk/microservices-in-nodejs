const pool = require('../app-modules/database');

exports.getByEmployeeId = async function (employeeId) {

    let res = await pool.query(`select * from employee_work_history ewh where employee_id  = ${employeeId}`);
    return res.rows;

}

exports.saveWorkHistory = async function (client, who, createdBy) {

    const workHistoryInsertionQuery = "insert into employee_work_history (company_name, job_title, start_date, end_date, employee_id, created_by, created_date, last_updated_by, last_updated_date) values($1, $2, $3, $4, $5, $6, (SELECT CURRENT_TIMESTAMP), $7,  (SELECT CURRENT_TIMESTAMP) )";

    const workHistoryInsertionQueryValues = [who.companyName, who.jobTitle, who.startDate, who.endDate,
    who.employeeId, createdBy, createdBy];

    await client.query(workHistoryInsertionQuery, workHistoryInsertionQueryValues);
}

exports.updateWorkHistory = async function (client, item, lastUpdatedBy) {

    const updateWorkHistoryQuery =
        "Update employee_work_history set company_name = $1, job_title = $2, start_date = TO_DATE($3,'YYYY-MM-DD'), end_date = TO_DATE($4,'YYYY-MM-DD'), last_updated_by = $5, last_updated_date = (SELECT CURRENT_TIMESTAMP)  where id= $6;";

    const updateWorkHistoryValues = [item.companyName, item.jobTitle, item.startDate, item.endDate, lastUpdatedBy, item.id];

    await client.query(updateWorkHistoryQuery, updateWorkHistoryValues);

}

exports.deleteById = async function (client, workHistoryId) {


    const deleteWorkHistoryQuery = "delete from employee_work_history where id = $1";

    const deleteWorkHistoryValues = [workHistoryId];

    await client.query(deleteWorkHistoryQuery, deleteWorkHistoryValues);
}