const path = require('path');
const fs = require('fs');
const { request, response } = require('express');

const cloudinary = require('cloudinary').v2;

const { cargarArchivo  } = require('../helpers');
const { User, Product } = require('../models');

cloudinary.config( process.env.CLOUDINARY_URL );

const uploadsController = {

  cargarArchivo: async(req = request, res = response)=>{
      
    if(!req.files || Object.keys(req.files).length === 0){
      return res.status(400).json({
        msg: 'Hubo un error, no se encontro archivo'
      });
    }

    if(!req.files.archivo){
      return res.status(400).json({
        msg: 'No hubo archivo que subir'
      });
    }

    try{
      const nameFile = await cargarArchivo(req.files, undefined ,'img');      
      res.status(200).json({
        msg: `El archivo es ${ nameFile }`
      });

    }catch( err ) {
      console.log(err);
      res.status(500).json({
        err
      });

    }
  },
  actualizarImagen: async(req = request, res = response)=>{
    const { coleccion, id } = req.params;

    let model;

    switch( coleccion ){
    case 'user':

      model = await User.findById(id);
      if (!model){
        return res.status(400).json({
          msg: `No existe usuario con el id: ${id}`
        });
      }
      break;
    case 'productos':
      model = await Product.findById(id);
      if(!model){
        return res.status(400).json({
          msg: `No existe producto con el id: ${ id }`
        });
      }
      break;
    default:
      return res.status(400).json({
        msg: 'Error problema de implementación'
      });
    }


    try{

      if(model.img){
        const pathFile = path.join(__dirname, '../upload', coleccion, model.img);
        if(fs.existsSync(pathFile)){
          fs.unlinkSync(pathFile);
        }
      }

      model.img = await cargarArchivo(req.files, undefined, coleccion);
      model.save();
      
      res.json({
        model
      });

    }catch( err ){
      console.log(err);
      res.status(400).json({
        msg: err
      });
    }

  },
  actualizarImagenCloudinary: async(req = request, res = response)=>{
    const { coleccion, id } = req.params;

    let model;

    switch( coleccion ){
    case 'user':

      model = await User.findById(id);
      if (!model){
        return res.status(400).json({
          msg: `No existe usuario con el id: ${id}`
        });
      }
      break;
    case 'productos':
      model = await Product.findById(id);
      if(!model){
        return res.status(400).json({
          msg: `No existe producto con el id: ${ id }`
        });
      }
      break;
    default:
      return res.status(400).json({
        msg: 'Error problema de implementación'
      });
    }


    try{

      if(model.img){
        const urls = model.img.split('/');
        const name = urls[ urls.length - 1];
        const [ public_id ] = name.split('.');
      
        await cloudinary.uploader.destroy( public_id );
      }


      const { tempFilePath } = req.files.archivo;
      const resp = await cloudinary.uploader.upload( tempFilePath );

      model.img = resp.secure_url;
      model.save();

      res.json({
        model
      });

    }catch( err ){
      console.log(err);
      res.status(400).json({
        msg: err
      });
    }

  },
  mostrarImagen: async( req = request, res = response ) => {
    const { coleccion, id } = req.params;

    let model;
    switch( coleccion ){
    case 'user':
  
      model = await User.findById(id);
      if (!model){
        return res.status(400).json({
          msg: `No existe usuario con el id: ${id}`
        });
      }
      break;
    case 'productos':
      model = await Product.findById(id);
      if(!model){
        return res.status(400).json({
          msg: `No existe producto con el id: ${ id }`
        });
      }
      break;
    default:
      return res.status(500).json({
        msg: 'Error problema de implementación'
      });
    }
    
    if(model.img){
      const pathFile = path.join(__dirname, '../upload', coleccion, model.img);
      if(fs.existsSync(pathFile)){
        return res.sendFile( pathFile );
      }
    }

    res.sendFile( path.join(__dirname, '../assets/no-image.jpg' ));
  }

};

module.exports = uploadsController;