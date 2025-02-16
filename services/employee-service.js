const employeeDao = require('../dao/employee-dao');
const employeeValidator = require('../validators/employee-validator');
const helperUtils = require('../app-modules/helper-utils')
const fs = require('fs');

exports.getEmployeeLookup = async function () {

    let employees = await employeeDao.getEmployeeLookup();

    let employeeLkp = [];

    if (employees) {

        employees.forEach(element => {

            let employeeName = helperUtils.getName(element.first_name, element.middle_name, element.last_name);

            employeeName = employeeName + ` (${element.employee_id})`;
            employeeLkp.push({ id: element.id, visibleValue: employeeName });

        });
    }

    return employeeLkp;
}

exports.getProfileImage = async function (employeeId) {

    return await employeeDao.getProfileImageByEmployeeId(employeeId);


}

exports.saveEmployee = async function (employeeDto) {

    // Validate the employees

    let validationResult = await employeeValidator.employeeValidator(employeeDto);

    // If the validation fails
    if (!validationResult.didPass) {
        const error = new Error("Validation failed");
        error.details = validationResult;
        throw error;

    }

    // Generate the employee Id for this employee
    let employeeId = await employeeDao.generateEmployeeId(employeeDto);

    // Check if the employee Id is already existing or not
    employeeDto.employeeId = employeeId;

    // Save the employee
    return await employeeDao.saveEmployee(employeeDto);
}



exports.getAllEmployees = async function (queryParams) {

    let skip = queryParams.skip;
    let take = queryParams.take;

    skip = skip * take;

    let employes = await employeeDao.getAllEmployees({ skip: skip, take: take });

    return employes.map((item) => {
        return {
            id: item.id,
            employeeId: item.employee_id,
            photoUrl: item.photourl,
            firstName: item.first_name,
            middleName: item.middle_name,
            lastName: item.last_name,
            department: item.department,
            jobRole: item.job_role,
            country: item.country,
            yearsOfService: item.yearsofservice,
            status: item.status,
            fullName: item.full_name
        }
    });
}

exports.getById = async function (id) {

    return await employeeDao.getById(id);
}

exports.updateEmployee = async function(updateEmployeeRequest) {

    let employeeValidation = await employeeValidator.checkIfEmplyoeeExists(updateEmployeeRequest.id);

    if (!employeeValidation.didPass) {
        throw new Error('Employee not found');
    }

    employeeValidation = await employeeValidator.employeeValidator(updateEmployeeRequest);

    if (!employeeValidation.didPass) {
        throw new Error('Validation failed');
    }

    return await employeeDao.updateEmployee(updateEmployeeRequest);
    
}