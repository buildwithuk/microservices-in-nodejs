const appServer = require("./app-modules/server");
const lookupController = require('./controllers/lookup-controller');
const dashboardController = require('./controllers/dashboard-controller');
const loginController = require('./controllers/login-controller');
const employeeController = require('./controllers/employee-controller');
const fileController = require('./controllers/file-controller');
const authMiddleware = require('./app-modules/auth-middleware'); // Path to your middleware file
const swagger = require('./app-modules/swagger');
const swaggerUi = require("swagger-ui-express");

// Hello World
appServer.get('/', (req, res) => {

    res.status(200).json({ message: "Hello World" });
});

appServer.use('/api/files', authMiddleware, fileController);

// Login and Token controllers
appServer.use('/api/oauth', loginController);

// Dashboard controllers
appServer.use("/api/dashboard", authMiddleware, dashboardController);

// Employee controller
appServer.use('/api/employees', authMiddleware, employeeController);

// Lookup controller
appServer.use('/api/lookups', authMiddleware, lookupController);

// Swagger UI
appServer.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swagger));

appServer.listen("80", () => {
    console.log("Listening at port 80")
    console.log(`Swagger docs available at http://localhost:80/api-docs`);

});