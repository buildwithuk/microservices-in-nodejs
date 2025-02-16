const pool = require('../app-modules/database');
const addressDao = require('./address-dao')
const workHistoryDao = require('./work-history-dao')
const worksiteDao = require('./worksite-dao')
const employmentInformationDao = require('./employee-information-dao');
const employeeEmergencyContactDao = require('./employee-emergency-contact-dao')

exports.getEmployeeLookup = async function () {


    const res = await pool.query('select id, first_name, middle_name, last_name, employee_id from employee_master');
    return res.rows;


}

exports.checkIfEmployeeExists = async function (employeeId) {

    const res = await pool.query(`SELECT COUNT(*) FROM employee_master WHERE id = ${employeeId};`);

    if (res && res.rows && res.rows.length == 1 && res.rows[0].count == 1) {
        return true;
    } else {
        return false;
    }
}

exports.getProfileImageByEmployeeId = async function (employeeId) {

    const res = await pool.query('select image_url from employee_master where id = ' + employeeId);
    return res.rows[0].image_url;

}

exports.generateEmployeeId = async function (employeeDto) {

    const sequenceQueryResult = await pool.query("SELECT nextval('employee_id_sequence');");

    const firstLetterOfFirstName = employeeDto.firstName[0];
    const firstLetterOfLastName = employeeDto.lastName[0];
    const sequenceVal = sequenceQueryResult.rows[0].nextval

    const generatedEmployeeId = firstLetterOfFirstName + firstLetterOfLastName + sequenceVal;

    return generatedEmployeeId;


}

exports.saveEmployee = async function (employeeDto) {

    const client = await pool.connect(); // Get a client from the pool

    const homeAddressDto = employeeDto.homeAddress;

    try {


        await client.query('BEGIN'); // Start the transaction

        homeAddressDto.createdBy = employeeDto.createdBy;

        const homeAddressId = await addressDao.saveAddress(client, homeAddressDto);

        const employeeInsertionQuery = "insert into employee_master(first_name, last_name, middle_name, date_of_birth, cell_phone, home_phone, personal_email, image_url, employee_id, created_by, created_date, last_updated_by, last_updated_date, home_address_id) values($1, $2, $3, TO_DATE($4,'YYYY-MM-DD'), $5, $6, $7, $8, $9, $10,  (SELECT CURRENT_TIMESTAMP), $11,  (SELECT CURRENT_TIMESTAMP ), $12) RETURNING id;";

        const employeeInsertionValues = [employeeDto.firstName, employeeDto.lastName, employeeDto.middleName, employeeDto.dateOfBirth,
        employeeDto.cellPhone, employeeDto.homePhone, employeeDto.personalEmail, employeeDto.imageURL, employeeDto.employeeId, employeeDto.createdBy, employeeDto.createdBy, homeAddressId];

        const employeeInsertionResponse = await client.query(employeeInsertionQuery, employeeInsertionValues);

        const employeeId = employeeInsertionResponse.rows[0].id;

        let emergencyContactDto = employeeDto.emergencyContact;
        emergencyContactDto.createdBy = employeeDto.createdBy;

        // First insert the address of the emergecy contact dto
        const emergencyContactAddressId = await addressDao.saveAddress(client, emergencyContactDto);


        const employeeEmergencyInsertionQuery = "insert into employee_emergency_contact(name, relationship, phone, address_id, created_by, created_date, employee_id, last_updated_by, last_updated_date) values($1, $2, $3, $4, $5, (SELECT CURRENT_TIMESTAMP), $6, $7,  (SELECT CURRENT_TIMESTAMP))";

        const employeeEmergencyInsertionValues = [emergencyContactDto.name, emergencyContactDto.relationship, emergencyContactDto.phone, emergencyContactAddressId, employeeDto.createdBy, employeeId, employeeDto.createdBy];

        await client.query(employeeEmergencyInsertionQuery, employeeEmergencyInsertionValues);


        let employmentInformation = employeeDto.employmentInformation;
        // Now insert the employment information
        const employmentInformationInsertionQuery = "insert into employment_information(department_id, job_role_id, work_type_id, hiring_date, country_id, people_manager, employment_type, employee_id, created_by, created_date, last_updated_by, last_updated_date, manager_id) values($1, $2, $3, $4, $5, $6, $7, $8, $9,  (SELECT CURRENT_TIMESTAMP), $10, (SELECT CURRENT_TIMESTAMP), $11);";

        const employmentInformationInsertionValues = [employmentInformation.department, employmentInformation.jobRole, employmentInformation.workType, employmentInformation.hiringDate, employmentInformation.country, employmentInformation.peopleManager,
        employmentInformation.employmentType, employeeId, employeeDto.createdBy, employeeDto.createdBy, employmentInformation.manager];

        await client.query(employmentInformationInsertionQuery, employmentInformationInsertionValues);

        // Now insert the worksite information



        if (employeeDto.worksiteInformation) {
            let worksiteInformationDto = employeeDto.worksiteInformation;
            worksiteInformationDto.createdBy = employeeDto.createdBy;
;
            const worksiteAddressId = await addressDao.saveAddress(client, worksiteInformationDto);
            const worksiteInsertionQuery = "insert into employee_worksite(worksite_name, worksite_phone, address_id, employee_id, created_by, created_date, last_updated_by, last_updated_date) values($1, $2, $3, $4, $5,  (SELECT CURRENT_TIMESTAMP), $6,  (SELECT CURRENT_TIMESTAMP));";

            const worksiteInsertionValues = [worksiteInformationDto.worksiteName, worksiteInformationDto.worksitePhone, worksiteAddressId, employeeId, worksiteInformationDto.createdBy, worksiteInformationDto.createdBy];

            await client.query(worksiteInsertionQuery, worksiteInsertionValues);

        }


        // Now insert the work place history 
        if (employeeDto.workhistory && Array.isArray(employeeDto.workhistory)) {

            employeeDto.workhistory.forEach(async who => {
                who.employeeId = employeeId;
                workHistoryDao.saveWorkHistory(client, who, employeeDto.createdBy);
            });

        }

        await client.query('COMMIT'); // Commit the transaction

        return { id: employeeId };

    } catch (err) {

        await client.query('ROLLBACK'); // Rollback the transaction on error
        throw err;
    } finally {
        client.release();
    }

}

exports.getById = async function (employeeId) {

    const res = await pool.query(`select * from employee_master where id=${employeeId}`);

    if (!res || res.rows == null || res.rows.length == 0) {
        return null;
    }

    employee = res.rows[0];

    let employmentInformation = await employmentInformationDao.getById(employee.id);

    let worksiteInformation = await worksiteDao.getById(employee.id);

    let workHistory = await workHistoryDao.getByEmployeeId(employee.id);

    let emergencyContact = await employeeEmergencyContactDao.getById(employee.id);

    // Find the home address
    let homeAddress = await addressDao.findById(employee.home_address_id);

    let employeeToReturn = {

        id: employee.id,
        firstName: employee.first_name,
        lastMame: employee.last_name,
        middleName: employee.middle_name,
        dateOfBirth: employee.date_of_birth,
        cellPhone: employee.cell_phone,
        homePhone: employee.home_phone,
        email: employee.personal_email,
        photoUrl: employee.image_url,
        employeeId: employee.employee_id,
        homeAddressId: employee.home_address_id
    };

    if (homeAddress) {
        employeeToReturn.homeAddress = {

            id: homeAddress.id,
            street: homeAddress.street,
            country: homeAddress.country_id,
            postalCode: homeAddress.postal_code,
            city: homeAddress.city,
            state: homeAddress.state,
            streetNumber: homeAddress.street_number,
            unitNumber: homeAddress.unit_number
        };
    }

    if (workHistory) {
        employeeToReturn.workAddress = [];

        workHistory.forEach(item => {
            employeeToReturn.workAddress.push({
                id: item.id,
                companyName: item.company_name,
                jobTitle: item.job_title,
                startDate: item.start_date,
                endDate: item.end_date,
                employeeId: item.employee_id
            });
        });
    }

    if (emergencyContact) {
        emergencyContact = emergencyContact[0];

        let emergencyContactAddress = await addressDao.findById(emergencyContact.address_id);

        employeeToReturn.emergencyContact = {
            id: emergencyContact.id,
            name: emergencyContact.name,
            relationship: emergencyContact.relationship,
            phone: emergencyContact.phone
        };

        if (emergencyContactAddress) {

            employeeToReturn.emergencyContact.address = {};
            
            employeeToReturn.emergencyContact.address.addressId = emergencyContact.address_id;
            employeeToReturn.emergencyContact.address.street = emergencyContactAddress.street;
            employeeToReturn.emergencyContact.address.country = emergencyContactAddress.country_id;
            employeeToReturn.emergencyContact.address.postalCode = emergencyContactAddress.postal_code;
            employeeToReturn.emergencyContact.address.city = emergencyContactAddress.city;
            employeeToReturn.emergencyContact.address.state = emergencyContactAddress.state;
            employeeToReturn.emergencyContact.address.streetNumber = emergencyContactAddress.street_number;
            employeeToReturn.emergencyContact.address.unitNumber = emergencyContactAddress.unit_number;
        }
    }


    if (worksiteInformation && worksiteInformation.length > 0) {
        worksiteInformation = worksiteInformation[0];


        employeeToReturn.worksiteInformation = {
            id: worksiteInformation.id,
            worksiteName: worksiteInformation.worksite_name,
            worksitePhone: worksiteInformation.worksite_phone,
            employeeId: worksiteInformation.employee_id
        };

        let worksiteAddress = await addressDao.findById(worksiteInformation.address_id);

        if (worksiteAddress) {

            employeeToReturn.worksiteInformation.address = {};

            employeeToReturn.worksiteInformation.address.addressId = worksiteInformation.address_id,
            employeeToReturn.worksiteInformation.address.street = worksiteAddress.street;
            employeeToReturn.worksiteInformation.address.country = worksiteAddress.country_id;
            employeeToReturn.worksiteInformation.address.postalCode = worksiteAddress.postal_code;
            employeeToReturn.worksiteInformation.address.city = worksiteAddress.city;
            employeeToReturn.worksiteInformation.address.state = worksiteAddress.state;
            employeeToReturn.worksiteInformation.address.streetNumber = worksiteAddress.street_number;
            employeeToReturn.worksiteInformation.address.unitNumber = worksiteAddress.unit_number;

        }
    }

    if (employmentInformation) {
        employmentInformation = employmentInformation[0];
        employeeToReturn.employmentInformation = {
            id: employmentInformation.id,
            department: employmentInformation.department_id,
            jobRole: employmentInformation.job_role_id,
            workType: employmentInformation.work_type_id,
            hiringDate: employmentInformation.hiring_date,
            country: employmentInformation.country_id,
            peopleManager: employmentInformation.people_manager,
            employmentType: employmentInformation.employment_type,
            employee: employmentInformation.employee_id,
            manager: employmentInformation.manager_id
        };
    }

    return employeeToReturn;
}

exports.getSpecificUser = async function () {

    let specificUser = {};
    try {
        // Use the pool to query the database
        const res = await pool.query('SELECT * FROM employee');

        specificUser = res.rows[0];
        return specificUser;

    } catch (e) {

        return null;
    }

}

exports.getAllEmployees = async function (limits) {

    const res = await pool.query(`select * from employee_grid_vw OFFSET ${limits.skip} LIMIT ${limits.take}`);
    return res.rows;

}

exports.updateEmployee = async function (updateEmployeeRequest) {



    const client = await pool.connect(); // Get a client from the pool


    try {

        await client.query('BEGIN'); // Start the transaction

        const updateEmployeeMasterQuery = "Update employee_master set first_name = $1, last_name = $2, middle_name = $3, date_of_birth= TO_DATE($4,'YYYY-MM-DD'), cell_phone = $5, home_phone = $6, personal_email = $7, image_url = $8, last_updated_by = $9, last_updated_date = (SELECT CURRENT_TIMESTAMP) where id = $10";

        const updateEmployeeMasterValues = [updateEmployeeRequest.firstName, updateEmployeeRequest.lastName, updateEmployeeRequest.middleName, updateEmployeeRequest.dateOfBirth, updateEmployeeRequest.cellPhone, updateEmployeeRequest.homePhone, updateEmployeeRequest.personalEmail, updateEmployeeRequest.imageURL, updateEmployeeRequest.lastUpdatedBy, updateEmployeeRequest.id];

        await client.query(updateEmployeeMasterQuery, updateEmployeeMasterValues);

        let employmentInformation = updateEmployeeRequest.employmentInformation;

        const updateEmploymentInformationQuery = "Update employment_information set department_id = $1, job_role_id= $2, work_type_id = $3, hiring_date  = to_date($4,'YYYY-MM-DD' ), country_id = $5, people_manager = $6, employment_type = $7, last_updated_by = $8, last_updated_date = (SELECT CURRENT_TIMESTAMP), manager_id = $9 where employee_id = $10; ";

        const updateEmploymentInformationValues = [employmentInformation.department, employmentInformation.jobRole, employmentInformation.workType, employmentInformation.hiringDate, employmentInformation.country, employmentInformation.peopleManager,
        employmentInformation.employmentType, updateEmployeeRequest.lastUpdatedBy, employmentInformation.manager, updateEmployeeRequest.id];

        await client.query(updateEmploymentInformationQuery, updateEmploymentInformationValues);

        // Update the home address
        const homeAddress = updateEmployeeRequest.homeAddress;
        await addressDao.updateAddress(client, homeAddress, updateEmployeeRequest.lastUpdatedBy);

        // Update the emergency contact
        const emergencyContact = updateEmployeeRequest.emergencyContact;
        const updateEmergencyContactQuery = "Update employee_emergency_contact set name = $1, relationship = $2, phone = $3, last_updated_by = $4, last_updated_date = (SELECT CURRENT_TIMESTAMP) where employee_id = $5";

        const updateEmergencyContactValues = [emergencyContact.name, emergencyContact.relationship, emergencyContact.phone, updateEmployeeRequest.lastUpdatedBy, updateEmployeeRequest.id];

        await client.query(updateEmergencyContactQuery, updateEmergencyContactValues);

        await addressDao.updateEmergencyContactAddress(client, emergencyContact, updateEmployeeRequest.lastUpdatedBy);

        // Update the worksite information
        const worksiteDto = updateEmployeeRequest.worksiteInformation;

        const updateWorksiteQuery = "Update employee_worksite set worksite_name= $1, worksite_phone = $2, last_updated_by = $3, last_updated_date = (SELECT CURRENT_TIMESTAMP) where id = $4;";

        const updateWorksiteValues = [worksiteDto.worksiteName, worksiteDto.worksitePhone, updateEmployeeRequest.lastUpdatedBy, worksiteDto.id];

        await client.query(updateWorksiteQuery, updateWorksiteValues);

        await addressDao.updateWorksiteAddress(client, worksiteDto, updateEmployeeRequest.lastUpdatedBy);

        // Process workhistory
        const workHistoryArray = updateEmployeeRequest.workhistory;

        if (workHistoryArray && workHistoryArray.length > 0) {

            workHistoryArray.forEach((item) => {

                if (item.state == 'DELETED') {
                    workHistoryDao.deleteById(client, item.id);
                } else if (item.state == 'UPDATED') {
                    workHistoryDao.updateWorkHistory(client, item, updateEmployeeRequest.lastUpdatedBy);
                } else if (item.state == 'ADDED') {
                    workHistoryDao.saveWorkHistory(client, item, updateEmployeeRequest.lastUpdatedBy);
                }
            });
        }

        await client.query('COMMIT');

        return { id: updateEmployeeRequest.id };

    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }



}

