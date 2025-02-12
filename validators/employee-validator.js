
const validationUtils = require('./validation-utils')
const addressValidator = require('./address-validator');
const employeeDao = require('../dao/employee-dao');
const employmentInformationValidator = require('./employment-information-validator')

exports.checkIfEmplyoeeExists = async function(employeeId) {

    let validationResult = { type: 'VALIDATION', didPass: true, errors: [] };
    validationResult.didPass = await employeeDao.checkIfEmployeeExists(employeeId)
    return validationResult;
    
}

exports.employeeValidator = async function (employeeDto) {

    let validationResult = { type: 'VALIDATION', didPass: true, errors: [] };

    if (validationUtils.isNullOrEmptyStrict(employeeDto, "firstName")) {

        validationResult.didPass = false;
        validationResult.errors.push('First name should not be empty');
    }

    if (validationUtils.isNullOrEmptyStrict(employeeDto, "lastName")) {


        validationResult.didPass = false;
        validationResult.errors.push('Last name should not be empty');
    }

    if (validationUtils.isNullOrEmptyStrict(employeeDto, "dateOfBirth")) {


        validationResult.didPass = false;
        validationResult.errors.push('Date of birth should not be empty');
    } else if (!validationUtils.isValidDate(new Date(employeeDto.dateOfBirth))) {

        validationResult.didPass = false;
        validationResult.errors.push('Date of birth needs to be valid');
    }



    if (validationUtils.isNullOrEmptyStrict(employeeDto, "cellPhone")) {


        validationResult.didPass = false;
        validationResult.errors.push('Cell Phone should not be empty');
    }

    if (validationUtils.isNullOrEmptyStrict(employeeDto, "personalEmail")) {


        validationResult.didPass = false;
        validationResult.errors.push('Personal email cannot be empty');

    } else if (!validationUtils.isValidEmail(employeeDto.personalEmail)) {

        validationResult.didPass = false;
        validationResult.errors.push('Personal email needs to be valid');
    }

    let emergencyContactDto = employeeDto.emergencyContact;

    if (!emergencyContactDto) {
        validationResult.didPass = false;
        validationResult.errors.push('Emergency contact needs to be passed');
    } else {

        if (validationUtils.isNullOrEmptyStrict(emergencyContactDto, "name")) {
            validationResult.didPass = false;
            validationResult.errors.push('Emergency Contact | Personal email cannot be empty');
        }
        if (validationUtils.isNullOrEmptyStrict(emergencyContactDto, "relationship")) {
            validationResult.didPass = false;
            validationResult.errors.push('Emergency Contact | Relationship cannot be empty');
        }

        if (validationUtils.isNullOrEmptyStrict(emergencyContactDto, "phone")) {
            validationResult.didPass = false;
            validationResult.errors.push('Emergency Contact | Phone cannot be empty');
        }

        let validationResultForEmergencyContact = await addressValidator.validateAddress(emergencyContactDto);

        validationResult.didPass = validationResult.didPass && validationResultForEmergencyContact.didPass;

        validationResultForEmergencyContact.errors.forEach(error => {

            validationResult.errors.push("Emergency Contact | " + error);
        });



    }

    let homeAddressDto = employeeDto.homeAddress;

    if (!homeAddressDto) {
        validationResult.didPass = false;
        validationResult.errors.push('Home Address needs to be passed');
    } else {

        let validationResultForAddress = await addressValidator.validateAddress(homeAddressDto);

        validationResult.didPass = validationResult.didPass && validationResultForAddress.didPass;

        validationResultForAddress.errors.forEach(error => {

            validationResult.errors.push("Address | " + error);
        });
    }

    let worksiteInformationDto = employeeDto.worksiteInformation;

    if (!worksiteInformationDto) {
        validationResult.didPass = false;
        validationResult.errors.push('Worksite Information needs to be passed.');
    } else {

        if (validationUtils.isNullOrEmptyStrict(worksiteInformationDto, "worksitePhone")) {
            validationResult.didPass = false;
            validationResult.errors.push('Worksite Information | Worksite Phone cannot be empty');
        }
        if (validationUtils.isNullOrEmptyStrict(worksiteInformationDto, "worksiteName")) {
            validationResult.didPass = false;
            validationResult.errors.push('Worksite Information | Worksite Name cannot be empty');
        }

        let validationResultForWorksiteInformation = await addressValidator.validateAddress(worksiteInformationDto);

        validationResult.didPass = validationResult.didPass && validationResultForWorksiteInformation.didPass;

        validationResultForWorksiteInformation.errors.forEach(error => {

            validationResult.errors.push("Worksite Information | " + error);
        });

    }

    let employmentInformation = employeeDto.employmentInformation;


    if (!employmentInformation) {
        validationResult.didPass = false;
        validationResult.errors.push("Employment Information needs to be passed");
    } else {

        let validationResultForEmploymentInformation= await employmentInformationValidator.validateEmploymentInformation(employmentInformation)


        validationResult.didPass = validationResult.didPass && validationResultForEmploymentInformation.didPass;

        validationResultForEmploymentInformation.errors.forEach(error => {

            validationResult.errors.push("Employment Information | " + error);
        });




    }

    let workHistoryArray = employeeDto.workhistory;

    if (workHistoryArray && !Array.isArray(workHistoryArray)) {
        validationResult.didPass = false;
        validationResult.errors.push("Work History | Work History needs to be passed as array");


    } else {
        workHistoryArray.forEach((item, index) => {

            if (!validationUtils.isValidDate(new Date(item.startDate))) {
                validationResult.didPass = false;
                validationResult.errors.push(`Work History #${index + 1} | Work History start date is not valid`);
            }
            if (!validationUtils.isValidDate(new Date(item.endDate))) {
                validationResult.didPass = false;
                validationResult.errors.push(`Work History #${index + 1} | Work History end date is not valid`);
            }
        })
    }

    return validationResult;
}