const { request, response } = require('express');
const { Product } =  require('../models');
const productController = {
  getProducts: async(req, res = response ) =>{
    const options = {
      page: 1,
      limit: 10,
      populate: ['usuario', 'categoria']
    };
    const productos = await Product.paginate({}, options);
    res.status(200).json( productos );
  },
  getProduct: async(req = request, res = response )=>{
    const { id } = req.params;
    const producto = await Product.findById( id )
      .populate('usuario')
      .populate('categoria');
    res.status(200).json( producto );
  },
  createProduct: async (req = request, res = response)=>{
    const {  
      precio, 
      descripcion,  
      categoria
    } = req.body;

    const nombre = req.body.nombre.toUpperCase();

    const productoDB = await Product.findOne({ nombre });
    if(productoDB){
      return res.status(400).json({
        msg: `La categoria ${ productoDB.nombre } ya existe`
      });
    }

    const producto = new Product({
      nombre,
      precio,
      descripcion,
      usuario: req.usuario.id,
      categoria
    });

    const newProducto = await producto.save();
    res.status(200).json(newProducto);
  },
  putProduct: async(req = request, res = response ) => {
    const { id } = req.params;
    const { precio, categoria, descripcion } = req.body;
    const nombre = req.body.nombre.toUpperCase();

    const producto = await Product.findByIdAndUpdate(id, {
      nombre,
      precio,
      categoria,
      descripcion,
      usuario: req.usuario.id
    }, { new: true });

    res.status(200).json( producto );
  },
  deleteProduct: async(req = request, res = response ) => {
    const { id } = req.params;
    const deleteSoft = await Product.findByIdAndUpdate(id, { estado: false }, { new: true});
    res.status(200).json( deleteSoft );
  }

};

module.exports = productController;