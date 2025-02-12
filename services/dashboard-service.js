const dashboardDao = require('../dao/dashboard-dao');

exports.getEmployeeTasks = async function() {
    return await dashboardDao.getEmployeeTasks();
}

exports.getEmployeeTasksStatusDistribution = async function() {
    return await dashboardDao.getEmployeeTasksStatusDistribution();
}

exports.getDepartmentDistribution = async function() {

    return await dashboardDao.getDepartmentDistribution();
}

exports.getWorkTypeDistribution = async function() {
    return await dashboardDao.getWorkTypeDistribution();
}

exports.getStats = async function() {
    return await dashboardDao.getStats();
}