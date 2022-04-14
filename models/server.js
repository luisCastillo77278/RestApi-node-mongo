const path = require('path');
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJSdoc = require('swagger-jsdoc');
const fileUpload = require('express-fileupload');
const swaggerOptions = require('../config/optionsSwagger');
const { connectionDB } = require('../database/config');
const socketController = require('../sockets/sockets');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.serve = require('http').createServer(this.app);
    this.io = require('socket.io')(this.serve);

    this.userPath = '/api/user';
    this.authPath = '/api/auth';
    this.categoriesPath = '/api/categories';
    this.productPath = '/api/productos';
    this.searchPath = '/api/buscar';
    this.filePath = '/api/uploads';
    this.docs = '/api/docs';
    this.swaggerSpec = swaggerJSdoc(swaggerOptions);

    // conexion db -> mongo
    this.conexionDB();

    // middlewares
    this.middlewares();

    // routes
    this.routes();

    // sockets
    this.socketsEvent();
  }

  // eslint-disable-next-line class-methods-use-this
  async conexionDB() {
    await connectionDB();
  }

  middlewares() {
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: '/tmp/',
        createParentPath: true,
      })
    );

    this.app.use(this.docs, swaggerUi.serve, swaggerUi.setup(this.swaggerSpec));
    this.app.use(cors());
    this.app.use(express.static(path.join(__dirname, '../public')));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  routes() {
    this.app.use(this.userPath, require('../routes/user'));
    this.app.use(this.authPath, require('../routes/auth'));
    this.app.use(this.categoriesPath, require('../routes/category'));
    this.app.use(this.productPath, require('../routes/product'));
    this.app.use(this.searchPath, require('../routes/search'));
    this.app.use(this.filePath, require('../routes/uploads'));
  }

  socketsEvent() {
    this.io.on('connection', socketController);
  }

  listen() {
    this.serve.listen(this.port, () =>
      console.log(`Servidor corriendo en el puerto: ${this.port}`)
    );
  }
}

module.exports = Server;
