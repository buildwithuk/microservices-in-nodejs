const lookupService = require('../services/lookup-service');
const express = require("express");
const router = express.Router();

router.get('/', async (req, res) => {

    try {
        let lookups = await lookupService.getAllLookups();
       
        res.status(200).json(Object.fromEntries(lookups));

    } catch(err) {

        return res.status(500).json({ message: "Server ran into unexpected error!" });
    }
});

router.get('/:lookupType', async (req, res) => {

    try {
        let lookups = req.params.lookupType;

        if (!lookups) {
            return res.status(400).json({message: "Lookup type is needed!"});
        }

        if (isNaN(lookups)) {
            let lookupData =  await lookupService.getLookupsByType(lookups);
    
            return res.status(200).json(Object.fromEntries(lookupData));
        } else {
            let lookupData =  await lookupService.getLookupById(lookups);
    
            return res.status(200).json(lookupData);
        }
        
    } catch(err) {

        return res.status(500).json({ message: "Server ran into unexpected error!" });
    }
    
});


module.exports = router;