const express = require("express");
const dashboardService = require('../services/dashboard-service');
const router = express.Router();

router.get('/department-distribution', async (req, res) => {

    try {

        let data = await dashboardService.getDepartmentDistribution();

        res.status(200).json(data);

    } catch (err) {
        console.log(err);

        res.status(500).json({ message: "Internal server error" });
    }

});

router.get('/employee-tasks-status-distribution', async (req, res) => {

    try {

        let data = await dashboardService.getEmployeeTasksStatusDistribution();

        res.status(200).json(data);

    } catch (err) {
        console.log(err);

        res.status(500).json({ message: "Internal server error" });
    }
});


router.get('/worktype-distribution', async (req, res) => {

    try {

        let data = await dashboardService.getWorkTypeDistribution();

        res.status(200).json(data);

    } catch (err) {
        console.log(err);

        res.status(500).json({ message: "Internal server error" });
    }
});

router.get('/employee-tasks', async (req, res) => {

    try {

        let data = await dashboardService.getEmployeeTasks();

        res.status(200).json(data);

    } catch (err) {
        console.log(err);

        res.status(500).json({ message: "Internal server error" });
    }
});

router.get('/get-stats', async (req, res) => {

    try {

        let data = await dashboardService.getStats();

        res.status(200).json(data);

    } catch (err) {
        console.log(err);

        res.status(500).json({ message: "Internal server error" });
    }

});


module.exports = router;