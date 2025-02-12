const pool = require('../app-modules/database');

exports.getAllLookups = async function() {

    try {
        let rows = await pool.query('SELECT * FROM lookups');
        return rows.rows;


    } catch(err) {

        console.error(err);

        throw err;
    }
    

}

exports.getLookupByIdAndType = async function(lookupId, lookupType) {

    let rows = await pool.query("SELECT id, lookup_Type, visible_value, hidden_value FROM lookups where id=" + lookupId + " and lookup_type ='" + lookupType + "';");

    return rows.rows;
}

exports.getLookupById = async function(lookupId) {


    let rows = await pool.query("SELECT id, lookup_Type, visible_value, hidden_value FROM lookups where id=" + lookupId + ";");

    return rows.rows;


}
exports.getLookupsByType = async function(lookups) {


    let lookupsDict = new Map();

    for (let a = 0; a < lookups.length; a++) {

        let element = lookups[a];

        let rows = await pool.query("SELECT id, lookup_Type, visible_value, hidden_value FROM lookups where lookup_type='" + element + "';");

        lookupsDict.set(element, rows.rows);
    }

    return lookupsDict;
}