const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Api Rest cafeDB',
      version: '0.1.0',
      description:
        'Api Rest para la creacion de un producto para una cafeteria.',
      contact: {
        name: 'Luis jesus villegas castillo',
        email: 'lc77278@gmail.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
        description: 'development',
      },
      {
        url: 'https://heroku',
        description: 'production',
      },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-token',
        },
      },
    },
  },
  apis: ['**/*.yaml'],
};

module.exports = options;
