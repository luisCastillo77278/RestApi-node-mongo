const mongoose = require('mongoose');

const connectionDB = async()=>{

  try {
    await mongoose.connect(process.env.MONGODB_CNN);
    console.log('Base de datos -> conexion exitosa');
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }

};


module.exports = { connectionDB };