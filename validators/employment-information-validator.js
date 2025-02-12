
const validationUtils = require('./validation-utils')
const lookupDao = require('../dao/lookup-dao')
const employeeDao = require('../dao/employee-dao')


exports.validateEmploymentInformation = async function (employmentInformationDto) {

    let validationResult = { type: 'VALIDATION', didPass: true, errors: [] };

    if (validationUtils.isNullOrEmptyStrict(employmentInformationDto, "manager")) {
        validationResult.didPass = false;
        validationResult.errors.push('Manager should be passed');
    } else {

        let doesEmployeeExists = await employeeDao.checkIfEmployeeExists(employmentInformationDto.manager);
        if (!doesEmployeeExists) {
            validationResult.didPass = false;
            validationResult.errors.push('Manager does not exists');
        }
    }

    if (!validationUtils.isValidDate(new Date(employmentInformationDto.hiringDate))) {

        validationResult.didPass = false;
        validationResult.errors.push('Hiring date is not valid');

    }

    if (validationUtils.isBooleanPresent(employmentInformationDto, "peopleManager")) {

        validationResult.didPass = false;
        validationResult.errors.push('People manager cannot be empty');

    }
    if (validationUtils.isNullOrEmptyStrict(employmentInformationDto, "department")) {

        validationResult.didPass = false;
        validationResult.errors.push('Department cannot be empty');
    } else {
        let department = await lookupDao.getLookupByIdAndType(employmentInformationDto.department, "DEPARTMENT")

        if (department == undefined || department.length == 0) {
            validationResult.didPass = false;
            validationResult.errors.push('Department does not exist');
        }

    }

    if (validationUtils.isNullOrEmptyStrict(employmentInformationDto, "jobRole")) {

        validationResult.didPass = false;
        validationResult.errors.push('Job Role cannot be empty');
    } else {
        let department = await lookupDao.getLookupByIdAndType(employmentInformationDto.jobRole, "JOB_ROLE")

        if (department == undefined || department.length == 0) {
            validationResult.didPass = false;
            validationResult.errors.push('Job Role does not exist');
        }

    }

    if (validationUtils.isNullOrEmptyStrict(employmentInformationDto, "workType")) {

        validationResult.didPass = false;
        validationResult.errors.push('Work type cannot be empty');
    } else {
        let workType = await lookupDao.getLookupByIdAndType(employmentInformationDto.workType, "WORK_TYPE")

        if (workType == undefined || workType.length == 0) {
            validationResult.didPass = false;
            validationResult.errors.push('Work type does not exist');
        }

    }

    if (validationUtils.isNullOrEmptyStrict(employmentInformationDto, "country")) {

        validationResult.didPass = false;
        validationResult.errors.push('Country cannot be empty');
    } else {
        let country = await lookupDao.getLookupByIdAndType(employmentInformationDto.country, "COUNTRY")

        if (country == undefined || country.length == 0) {
            validationResult.didPass = false;
            validationResult.errors.push('Country does not exist');
        }
    }

    if (validationUtils.isNullOrEmptyStrict(employmentInformationDto, "employmentType")) {

        validationResult.didPass = false;
        validationResult.errors.push('Employment type cannot be empty');
    } else {

        let employmentType = await lookupDao.getLookupByIdAndType(employmentInformationDto.employmentType, "EMPLOYMENT_TYPE")

        if (employmentType == undefined || employmentType.length == 0) {
            validationResult.didPass = false;
            validationResult.errors.push('Employment type does not exist');
        }
    }




    return validationResult;
} 