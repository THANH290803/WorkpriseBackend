const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Workprise API',
      version: '1.0.0',
      description: 'Tài liệu API cho Workprise',
    },
    servers: [
      {
        url: 'http://localhost:5001/api',
        description: 'Local Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: 'Auth',
        description: 'Xác thực người dùng',
      },
      {
        name: 'Users',
        description: 'Quản lý người dùng',
      },
    ],
  },
  apis: ['app/routes/*.js'],
};

module.exports = swaggerJsDoc(options);
