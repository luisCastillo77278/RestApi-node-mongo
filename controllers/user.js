const { response, request } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/user');

const userGetAll = async (req = request, res = response )=>{
  const {limite = 5, desde = 0} = req.query;
  const query = {estado: true};

  const [total, usuarios ] = await Promise.all([ 
    Usuario.countDocuments(query), 
    Usuario.find(query).skip( Number(desde)).limit(Number(limite))
  ]);
    
  res.json({
    total,
    usuarios
  });
};

const userGet = async( req = request, res = response) =>{
  const { id } = req.params;

  const usuario = await Usuario.findById( id );

  res.json( usuario );
};

const userPost = async (req = request, res = response ) =>{
  const { id, nombre, correo, rol, password } = req.body;
  const usuario = new Usuario({nombre, correo, rol, password});

  // encriptar la contraseña 
  const salt = bcrypt.genSaltSync(); // por defecto esta en 10
  usuario.password = bcrypt.hashSync( password, salt);
    
  // guardar en la base de datos
  await usuario.save();

  res.json({
    msg: 'Post user - controller', 
    usuario
  });
};

const userPut = async (req = request, res = response ) => {
  const { id } = req.params;
  const { password, correo, google, ...resto } = req.body;
  if( password ){
    const selt = bcrypt.genSaltSync();
    resto.password = bcrypt.hashSync( password, selt);
  }

  const usuario = await Usuario.findByIdAndUpdate( id, resto, { new: true });

  res.json({ usuario });
};

const userDelete = async (req = request, res = response ) =>{

  const { id } = req.params;
  // const usuario = await Usuario.findByIdAndDelete(id); forma de borrado fisica
  const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });
  // const usuarioAuthenticado = req.usuario;
  res.json({usuario});
};
const userPatch = (req, res = response ) =>{
  res.json({ msg: 'Patch user - controller'});
};

module.exports = {
  userGetAll,
  userGet,
  userPost,
  userPut,
  userDelete,
  userPatch
};