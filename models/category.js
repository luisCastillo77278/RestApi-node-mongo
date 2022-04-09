const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const CategorySchema = Schema({
  nombre: {
    type: String,
    required: [ true, 'El campo es requerido'],
    unique: true
  },
  estado:{
    type: Boolean,
    default: true,
    required: true
  },
  usuario: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Usuario'
  }
});

CategorySchema.set('toJSON',{
  transform: (document, object)=>{
    object.id = object._id;
    delete object.__v;
    delete object._id;
  }
});

CategorySchema.plugin(mongoosePaginate);

module.exports = model('Categoria', CategorySchema);