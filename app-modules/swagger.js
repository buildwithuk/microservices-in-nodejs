// swagger.js
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Swagger definition
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Node.js API Documentation",
            version: "1.0.0",
            description: "API documentation for the Node.js application",
        },
        servers: [
            {
                url: "https://microservices-in-nodejs.vercel.app" // Change this to your API base URL
            },
        ],
    },
    apis: ["../controllers/*.js"], // Path to the API routes (update as needed)
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = swaggerSpec;
