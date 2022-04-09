const { Schema, model } = require('mongoose');

const UserSchema = Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio']
  },
  correo: {
    type: String,
    unique: true,
    required: [true, 'El correo es obligatorio']
  },
  password: {
    type: String,
    required: [true, 'El password es obligatorio']
  },
  img: {
    type: String,
  },
  rol: {
    type: String,
    required: [true, 'El rol es obligatorio'],
    enum: ['ADMIN_ROLE', 'USER_ROLE']
  },
  estado: {
    type: Boolean,
    default: true
  },
  google: {
    type: Boolean,
    defatul: false
  }

});

// UserSchema.methods.toJSON = function(){
//   const { __v, password, _id, ...usuario } = this.toObject();
//   usuario.uid = _id;
//   return usuario;
// };

UserSchema.set('toJSON',{
  transform: (document, object)=>{
    object.id = object._id;
    delete object._id;
    delete object.__v;
    delete object.password;
  }
});

module.exports = model('Usuario', UserSchema);