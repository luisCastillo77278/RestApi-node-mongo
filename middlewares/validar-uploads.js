
const validarUploads = (req, res , next) =>{
  
  if(!req.files || 
    Object.keys(req.files).length === 0 || 
    !req.files.archivo ){
    
    return res.status(400).json({
      msg: 'Hubo un error al intentar subir el archivo, el archivo no se encontro'
    });
  }

  next();

};

module.exports = {
  validarUploads
};