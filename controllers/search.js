const { request, response } = require('express');
const { ObjectId } = require('mongoose').Types;
const { User, Product, Category } = require('../models');

const COLLECTION = {
  user: async (termino = '', res = response) => {
    const mongoId = ObjectId.isValid(termino);
    if (mongoId) {
      const user = await User.findById(termino);
      return res.status(200).json({
        results: user ? [user] : [],
      });
    }

    const regexp = new RegExp(termino, 'i');
    const user = await User.find({
      $or: [{ nombre: regexp }, { correo: regexp }],
      $and: [{ estado: true }],
    });

    return res.status(200).json({
      results: user || [],
    });
  },
  productos: async (termino = '', res = response) => {
    const mongoId = ObjectId.isValid(termino);
    if (mongoId) {
      const producto = await Product.findById(termino);
      return res.status(200).json({
        results: producto ? [producto] : [],
      });
    }

    const regexp = new RegExp(termino, 'i');

    const producto = await Product.find({
      nombre: regexp,
      estado: true,
    })
      .populate('usuario')
      .populate('categoria', { usuario: 0 });

    return res.status(200).json({
      results: producto,
    });
  },
  categorias: async (termino = '', res = response) => {
    const mongoId = ObjectId.isValid(termino);
    if (mongoId) {
      const categoria = await Category.findById(termino);
      return res.status(200).json({
        results: categoria ? [categoria] : [],
      });
    }

    const regexp = new RegExp(termino, 'i');
    const categoria = await Category.find({
      nombre: regexp,
      estado: true,
    }).populate('usuario');

    return res.status(200).json({
      results: categoria,
    });
  },
  default: (termino = '', res = response) => {
    console.log('error');
    return res.status(200).json({
      msg: `La categoria no esta implementada y termino: ${termino} no se encontrara.`,
    });
  },
};

const searchController = {
  search: (req = request, res = response) => {
    const { coleccion, termino } = req.params;

    if (!COLLECTION[coleccion]) {
      return res.status(400).json({
        msg: `La coleccion ${coleccion} no fue encontrada `,
      });
    }

    const handle = COLLECTION[coleccion] || COLLECTION.default;
    return handle(termino, res);
  },
};

module.exports = searchController;
