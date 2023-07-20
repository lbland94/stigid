import swaggerJSDoc from 'swagger-jsdoc';

export const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Stigid API',
      version: '0.1.0',
      description: 'An API for getting the daily stigid game',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/',
      },
    ],
  },
  apis: ['./src/**/*.ts'],
};

export const swaggerConfig = swaggerJSDoc(options);
