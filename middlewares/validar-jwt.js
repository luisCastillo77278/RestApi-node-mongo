const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');

const validarjWT = async (req = request, res = response, next) => {

  const token = req.header('x-token');
  if(!token){
    return res.status(401).json({msg: 'No hay token en la peticion'});
  }

  try{
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    //req.uid = uid;
    const usuario = await UserModel.findById(uid); 
        
    if(!usuario){
      return res.status(401).json({msg: 'El usuario no existe en la DB'});
    }

    if(!usuario.estado){
      return res.status(401).json({msg: 'El usuario no existe estado => false'});
    }

    req.usuario = usuario;
    next();
  }catch(err){
    return res.status(401).json({msg: 'token no valido'});
  }
};

module.exports = {
  validarjWT
};