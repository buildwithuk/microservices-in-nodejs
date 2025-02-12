const validationUtils = require('./validation-utils')
const lookupDao = require('../dao/lookup-dao')

exports.validateAddress = async function (addressDto) {

    let validationResult = { type: 'VALIDATION', didPass: true, errors: [] };


    if (validationUtils.isNullOrEmptyStrict(addressDto, "streetNumber")) {

        validationResult.didPass = false;
        validationResult.errors.push('Street No should not be empty');
    }
    if (validationUtils.isNullOrEmptyStrict(addressDto, "street")) {

        validationResult.didPass = false;
        validationResult.errors.push('Street cannot be empty');
    }

    if (validationUtils.isNullOrEmptyStrict(addressDto, "city")) {

        validationResult.didPass = false;
        validationResult.errors.push('City cannot be empty');
    }


    if (validationUtils.isNullOrEmptyStrict(addressDto, "state")) {

        validationResult.didPass = false;
        validationResult.errors.push('State cannot be empty');
    }


    if (validationUtils.isNullOrEmptyStrict(addressDto, "postalCode")) {

        validationResult.didPass = false;
        validationResult.errors.push('Postal code cannot be empty');
    }


    if (validationUtils.isNullOrEmptyStrict(addressDto, "country")) {

        validationResult.didPass = false;
        validationResult.errors.push('Country cannot be empty');
    } else  {
        let country = await lookupDao.getLookupByIdAndType(addressDto.country, "COUNTRY")

        if (country == undefined || country.length == 0) {
            validationResult.didPass = false;
            validationResult.errors.push('Country does not exists');
        }
        
    }

    return validationResult;
}