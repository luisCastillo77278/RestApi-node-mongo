// eslint-disable-next-line max-classes-per-file
class Mensaje {
  constructor(uid, nombre, mensaje) {
    this.uid = uid;
    this.nombre = nombre;
    this.mensaje = mensaje;
  }
}

class ChatMensajes {

  constructor() {
    this.mensajes = [];
    this.usuarios = {};
  }

  get ultimos10() {
    this.mensajes = this.mensajes.splice(0, 10);
    return this.mensajes;
  }

  get usuariosArr() {
    return Object.values(this.usuarios);
  }

  enviarMensaje(uid, nombre, mensaje) {
    this.mensajes.unshift(new Mensaje(uid, nombre, mensaje));
  }

  conectarUsuario(usuario) {
    this.usuarios[usuario.id] = usuario;
  }

  desconectarUsuario(uid) {
    delete this.usuarios[uid];
  }

}

module.exports = ChatMensajes;