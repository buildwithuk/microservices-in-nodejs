const employeeService = require('../services/employee-service');
const express = require("express");
const router = express.Router();

router.get('/get-employee-lookup', async (req, res) => {
    try {

        let employeesLkp = await employeeService.getEmployeeLookup();

        res.status(200).json(employeesLkp);

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error!" });
    }

});

router.get('/:employeeId', async (req, res) => {

    try {
        let employeeId = req.params.employeeId;

        if (!employeeId || isNaN(employeeId)) {
            return res.status(400).json({ message: 'Invalid employee Id' });
        }

        let employee = await employeeService.getById(employeeId);

        if (employee) {
            res.status(200).json(employee);
        } else {
            res.status(404).json({ message: "No employee found with this id" });
        }
    } catch (e) {
        console.log(e)
        res.status('500').json({ message: "Something mysterious happend!" })
    }
});


router.post('/', async (req, res) => {

    try {
        let employeeRequest = req.body;
        employeeRequest.lastUpdatedBy = req.user.username;

        let updatedEmployee = await employeeService.updateEmployee(employeeRequest);

        res.status(200).json(updatedEmployee);
    } catch (error) {

        console.log(error)

        if (error.message == 'Validation failed') {
            res.status(400).json(error.details.errors);
        } else if (error.message == 'Employee not found') {
            res.status(404).json({ message: 'Employee not found' });
        } else {
            res.status(500).json({ message: "Internal server error" });
        }
    }


});

router.put('/', async (req, res) => {

    try {

        let employeeRequest = req.body;
        employeeRequest.createdBy = req.user.username;

        let employeeSaved = await employeeService.saveEmployee(employeeRequest);

        res.status(201).json(employeeSaved);

    } catch (error) {

        console.log(error)

        if (error.message == 'Validation failed') {
            res.status(400).json(error.details.errors);
        } else {
            res.status(500).json({ message: "Internal server error" });
        }
    }

});

router.get('/', async (req, res) => {

    try {
        if (!req.query.skip) {
            req.query.skip = 0;
        }

        if (!req.query.take) {
            req.query.take = 10;
        }

        let employees = await employeeService.getAllEmployees({ skip: req.query.skip, take: req.query.take });

        res.status(200).json(employees);
    } catch (err) {
        console.log(err);

        res.status(500).json({ message: "Internal server error" });
    }


});

module.exports = router;