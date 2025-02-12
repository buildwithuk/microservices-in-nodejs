const pool = require('../app-modules/database');

exports.findById = async function (addressId) {

        const res = await pool.query(`select * from address_master where id = ${addressId}`);
        return res.rows[0];
}

exports.updateEmergencyContactAddress = async function (client, emergencyContactDto, lastUpdatedBy) {

        const updateAddressQuery =
                "Update address_master set street_number = $1, street = $2, unit_number = $3, city = $4, state = $5, postal_code = $6, country_id = $7, last_updated_by = $8, last_updated_date = (SELECT CURRENT_TIMESTAMP)  where id= (select address_id from employee_emergency_contact eec where id = $9)";

        const updateAddressValues = [emergencyContactDto.streetNumber, emergencyContactDto.street, emergencyContactDto.unitNumber, emergencyContactDto.city,
        emergencyContactDto.state, emergencyContactDto.postalCode, emergencyContactDto.country, lastUpdatedBy, emergencyContactDto.id];

        await client.query(updateAddressQuery, updateAddressValues);
}

exports.updateWorksiteAddress = async function (client, worksiteDto, lastUpdatedBy) {

        const updateAddressQuery =
                "Update address_master set street_number = $1, street = $2, unit_number = $3, city = $4, state = $5, postal_code = $6, country_id = $7, last_updated_by = $8, last_updated_date = (SELECT CURRENT_TIMESTAMP)  where id= (select address_id from employee_worksite where id = $9)";

        const updateAddressValues = [worksiteDto.streetNumber, worksiteDto.street, worksiteDto.unitNumber, worksiteDto.city,
                worksiteDto.state, worksiteDto.postalCode, worksiteDto.country, lastUpdatedBy, worksiteDto.id];

        await client.query(updateAddressQuery, updateAddressValues);
}



exports.updateAddress = async function (client, addressDto, lastUpdatedBy) {

        const updateAddressQuery =
                "Update address_master set street_number = $1, street = $2, unit_number = $3, city = $4, state = $5, postal_code = $6, country_id = $7, last_updated_by = $8, last_updated_date = (SELECT CURRENT_TIMESTAMP) where id = $9";

        const updateAddressValues = [addressDto.streetNumber, addressDto.street, addressDto.unitNumber, addressDto.city,
        addressDto.state, addressDto.postalCode, addressDto.country, lastUpdatedBy, addressDto.id];

        await client.query(updateAddressQuery, updateAddressValues);

}

exports.saveAddress = async function (client, addressDto) {


        // Insert into address table
        const employeeHomeAddressInsertionQuery = "insert into address_master(street_number, street, unit_number, city, state, postal_code, country_id, created_by, created_date, last_updated_by, last_updated_date) values ($1, $2, $3, $4, $5, $6, $7, $8, (SELECT CURRENT_TIMESTAMP), $9, (SELECT CURRENT_TIMESTAMP) ) RETURNING id;";

        const employeeHomeAddressInsertionValues = [addressDto.streetNumber, addressDto.street, addressDto.unitNumber, addressDto.city,
        addressDto.state, addressDto.postalCode, addressDto.country, addressDto.createdBy, addressDto.createdBy];

        const homeAddressResponse = await client.query(employeeHomeAddressInsertionQuery, employeeHomeAddressInsertionValues);

        return homeAddressResponse.rows[0].id;


}