const { v4: uuidv4 } = require('uuid');
const path = require('path');

const cargarArchivo = (
  files, 
  extendsValidations = ['png', 'jpg', 'jpeg', 'gif'], 
  carpeta = '') =>{

  return new Promise( (resolve, reject) => {
    const { archivo } = files;
    
    const nameFile = archivo.name.split('.');
    const extension = nameFile[ nameFile.length - 1 ];
  
  
    if(!extendsValidations.includes(extension)){
      return reject( `La extension ${ extension } no es valida, ${ extendsValidations }`);
    }
  
    const nameTemp = `${ uuidv4() }.${ extension }`;
    const pathFileUpload = path.join(__dirname, '../upload/', carpeta ,nameTemp ); 
  
    archivo.mv( pathFileUpload, (err)=>{
      if(err){
        return reject(err);
      }

      resolve(nameTemp);
    });

  });

};

module.exports = {
  cargarArchivo
};