const lookupDao = require('../dao/lookup-dao');

exports.getLookupById = async function(lookupId) {


    let obj = await lookupDao.getLookupById(lookupId);

    let itemToReturn = [];

    obj.forEach(item => {

        itemToReturn.push({

            "id": item.id,
            "lookupType": item.lookup_type,
            "hiddenValue": item.hidden_value,
            "visibleValue": item.visible_value
    
        });


    })


    return itemToReturn;
}


exports.getAllLookups = async function () {


    let lookups = await lookupDao.getAllLookups();

    let lookupDict = new Map();

    lookups.forEach(obj => {

        if (lookupDict.has(obj.lookup_type)) {

            let itemArray = lookupDict.get(obj.lookup_type);

            itemArray.push({

                "id": obj.id,
                "lookupType": obj.lookup_type,
                "hiddenValue": obj.hidden_value,
                "visibleValue": obj.visible_value
    
            });

            lookupDict.set(obj.lookup_type, itemArray);

        } else {

            let itemArray = [];

            itemArray.push({

                "id": obj.id,
                "lookupType": obj.lookup_type,
                "hiddenValue": obj.hidden_value,
                "visibleValue": obj.visible_value
    
            });


            lookupDict.set(obj.lookup_type, itemArray);
        }

    });

    return lookupDict;
}

exports.getLookupsByType = async function (lookupTypes) {

    try {

        const lookupTypesSplitted = lookupTypes.split(',');


        // Do something error

        return await lookupDao.getLookupsByType(lookupTypesSplitted);

    } catch (err) {

        console.error(err);

        throw err;
    }
}

