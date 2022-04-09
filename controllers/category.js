const { request, response } = require('express');
const { Category } = require('../models');
const categoriesControllers = {
  
  //* obtener todas las categorias publico
  categories: async(req, res)=>{

    const options = {
      page: 1,
      limit: 10,
      populate: 'usuario'
    };

    const categoria = await Category.paginate({}, options);
    res.json(categoria);
  },
  //* obtener una categoria por ID
  categoryById: async(req = request, res = response)=>{
    const { id } = req.params;
    const categoria = await Category.findById(id).populate('usuario');
    res.status(200).json(categoria);
  },
  //* crear categoria, cualquier persona con un token valido
  createCategorie: async(req = request, res = response)=>{
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Category.findOne({nombre});
    if(categoriaDB){
      return res.status(400).json({
        msg: `La categoria ${ categoriaDB.nombre } ya existe`
      });
    }
    
    const categoria = new Category({ 
      nombre, 
      usuario: req.usuario.id
    });
    const newCategoria = await categoria.save();

    res.json( newCategoria );
  },
  //* modificar categoria, cualquier persona con un token valido
  putCategorie: async(req = request, res = response)=>{
    const { id } = req.params;
    const nombre = req.body.nombre.toUpperCase();

    const updateCategory = await Category.findByIdAndUpdate( id, {
      nombre,
      usuario: req.usuario.id 
    }, { new: true});
    res.json(updateCategory);
  },
  //* eliminar categoria, cualquier persona con un token valido
  deleteCategorie: async(req = request, res = response)=>{
    const { id } = req.params;
    const deleteSoft = await Category.findByIdAndUpdate( id, { estado: false }, {new: true});
    res.json(deleteSoft);
  }
};

module.exports = categoriesControllers;