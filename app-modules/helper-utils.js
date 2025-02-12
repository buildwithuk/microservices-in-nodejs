const validationUtls = require('../validators/validation-utils')

exports.getCreatedDate = function () {


    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    const formattedTime = `${hours}:${minutes}:${seconds}`;
    const formattedDateTime = `${formattedDate} ${formattedTime}`;
    
    return formattedDateTime;
}

exports.getName = function (firstName, middleName, lastName) {

    let name = "";

    if (! validationUtls.isNullOrEmptyStrictByObject(middleName)) {

        name = firstName + " " + middleName;
    }

    name = name + " " + lastName;
    
    return name.trim();

}
