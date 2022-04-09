const { request, response } = require('express');

const esAdminRol = (req = request, res= response, next) => {

  if(!req.usuario){
    return res.status(500).json({msg: 'Se intenta verificar el rol sin validar el token'});
  }

  const { rol, nombre } = req.usuario;

  if(rol !== 'ADMIN_ROLE'){
    return res.status(401).json({msg:`${nombre} no tiene el rol perimitido - Admin`});
  }

  next();
};

const tieneRol = (...roles) => {
  return (req = request, res = response, next) =>{
    if(!req.usuario){
      return res.status(500).json({msg: 'Se intenta verificar el rol sin validar el token'});
    }

    if(!roles.includes(req.usuario.rol)){
      return res.status(401).json({msg:`Se debe de tener uno de estos roles ${roles}`});
    }

    next();
  };
};

module.exports = {
  esAdminRol,
  tieneRol
};