const path = require('path');
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express'); 
const swaggerJSdoc = require('swagger-jsdoc');
const swaggerOptions = require('../config/optionsSwagger');
const { connectionDB } = require('../database/config');
const fileUpload = require('express-fileupload');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.userPath = '/api/user';
    this.authPath = '/api/auth';
    this.categoriesPath = '/api/categories';
    this.productPath = '/api/productos';
    this.searchPath = '/api/buscar';
    this.filePath = '/api/uploads';
    this.docs = '/api/docs';
    this.swaggerSpec = swaggerJSdoc(swaggerOptions);
    
    //conexion db -> mongo
    this.conexionDB();

    //middlewares
    this.middlewares();

    //routes
    this.routes();
  }

  async conexionDB() {
    await connectionDB();
  }

  middlewares() {

    this.app.use(fileUpload({
      useTempFiles: true,
      tempFileDir: '/tmp/',
      createParentPath: true
    }));

    this.app.use(
      this.docs, 
      swaggerUi.serve, 
      swaggerUi.setup(this.swaggerSpec)
    );
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
    //handling errors
    this.app.use((req, res) => {
      return res.status(404).json({ errors: '404 not found' });
    });
  }

  listen() {
    this.app.listen(this.port, () =>
      console.log(`Servidor corriendo en el puerto: ${this.port}`)
    );
  }
}

module.exports = Server;
