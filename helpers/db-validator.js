const Role = require('../models/role');
const {
  User,
  Category,
  Product
} = require('../models');

const esRolValido = async(rol = '') => {
  const existRole = await Role.findOne({rol});
  if( !existRole){
    throw new Error(`El rol ${ rol } no se encuentra en la db`);
  }
};

const emailExistDB = async( email )=> {
  const exist = await User.findOne({ correo: email });
  if(exist){
    throw new Error(`El correo ${ email } ya existe en la db`);
  }
};

const existIdInDb = async( id )=>{
  const exist = await User.findById( id );
  if(!exist){
    throw new Error(`El id ${id } no existe en la db`);
  }
};

const existCategoryInDb = async( id )=>{
  const exist = await Category.findById(id);
  if(!exist){
    throw new Error(`El id ${id } de categoria no existe en la db`);
  }
};

const existProductInDb = async( id ) => {
  const exist = await Product.findById( id );
  if(!exist){
    throw new Error(`El id: ${ id } de procto no existe en la db`);
  }
};

const coleccionesPermitidas = async( coleccion = '', colecciones = [] ) =>{
  if(!colecciones.includes( coleccion )){
    throw new Error(`La coleccion: ${ coleccion } no es permitida`);
  }
};

module.exports = {
  esRolValido,
  emailExistDB,
  existIdInDb,
  existCategoryInDb,
  existProductInDb,
  coleccionesPermitidas
};