const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const ProductSchema = Schema({
  nombre: {
    type: String,
    required: [true, 'El campo es requerido'],
    unique: true,
  },
  estado: {
    type: Boolean,
    default: true,
    required: true,
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  precio: {
    type: Number,
    default: 0,
  },
  categoria: {
    type: Schema.Types.ObjectId,
    ref: 'Categoria',
    required: true,
  },
  descripcion: {
    type: String,
  },
  disponible: {
    type: Boolean,
    default: true,
  },
  img: {
    type: String,
  },
});

ProductSchema.set('toJSON', {
  transform: (document, object) => {
    object.id = object._id;
    delete object._id;
    delete object.__v;
  },
});

ProductSchema.plugin(mongoosePaginate);

module.exports = model('Producto', ProductSchema);
