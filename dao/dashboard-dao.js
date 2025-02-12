const pool = require('../app-modules/database');

exports.getStats = async function () {

    return {
        totalEmployees: 10,
        partTimeEmployees: 1,
        fullTimeEmployees: 23,
        totalLeaveDays: 19,
        leavesUsedDays: 22
    };
}

exports.getDepartmentDistribution = async function () {

    const res = await pool.query("select  count, l.visible_value as Department from (select department_id, count(*) from employment_information ei group by department_id) e inner join lookups l on l.id = e.department_id;");

    let departmentDistribution = [];

    if (res.rows && res.rows.length > 0) {

        res.rows.forEach((item) => {

            console.log(item);
            departmentDistribution.push({ department: item.count, employeeCount: item.department });

        });
    }

    return departmentDistribution;

}

exports.getWorkTypeDistribution = async function () {

    const res = await pool.query("select count, l.visible_value as Work_Type from (select work_type_id, count(*) from employment_information ei group by work_type_id) e inner join lookups l on e.work_type_id = l.id;");


    let workTypeDistribution = [];

    if (res.rows && res.rows.length > 0) {

        res.rows.forEach((item) => {

            console.log(item);
            workTypeDistribution.push({ department: item.count, employeeCount: item.work_type });

        });
    }

    return workTypeDistribution;


}

exports.getEmployeeTasksStatusDistribution = async function () {

    return {
        Alex: { active: 40, closed: 20 },
        Christine: { active: 25, closed: 75 },
        Dave: { active: 15, closed: 15 },
        Emily: { active: 55, closed: 65 },
        Jack: { active: 85, closed: 35 },
        Jenn: { active: 70, closed: 50 },
        'Mike S': { active: 30, closed: 40 },
    };
}

exports.getEmployeeTasks = async function () {
    return {
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        createdTasks: [65, 59, 80, 81, 56, 55, 40],
        closedTasks: [28, 48, 40, 19, 86, 27, 90]
    };
}