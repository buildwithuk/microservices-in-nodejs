exports.isValidDate = function (date) {
    return date instanceof Date && !isNaN(date);
}


exports.isNullOrEmptyStrict = function (obj, key) {
    return obj[key] === null || obj[key] === undefined || (typeof obj[key] === "string" && obj[key].trim() === "");
}



exports.isNullOrEmptyStrictByObject = function (obj) {
    return obj === null || obj === undefined || (typeof obj === "string" && obj.trim() === "");
}

exports.isBooleanPresent = function(obj, key) {


    return obj[key] == null || obj[key] == undefined;
}

exports.isValidEmail = function (email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
