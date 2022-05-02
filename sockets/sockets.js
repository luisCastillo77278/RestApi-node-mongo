const { Socket } = require('socket.io');
const comprovarJWT = require('../helpers/comprobar-jwt');

const { ChatMensaje } = require('../models');

const chatMensaje = new ChatMensaje();

// eslint-disable-next-line default-param-last
const socketController = async (socket = new Socket(), io) => {
  console.log(socket.handshake.headers['x-token']);
  const user = await comprovarJWT(socket.handshake.headers['x-token'])

  if (!user) return socket.disconnect();

  console.log(`Se conencto ${user.nombre}`);
  chatMensaje.conectarUsuario(user);
  io.emit('usuarios-activos', chatMensaje.usuariosArr);
  socket.emit('resibir-mensaje', chatMensaje.ultimos10);

  socket.join(user.id);

  socket.on('disconnect', () => {
    chatMensaje.desconectarUsuario(user.id);
    io.emit('usuarios-activos', chatMensaje.usuariosArr);
  });

  socket.on('enviar-mensaje', ({ uid, mensaje }) => {
    if (uid) {
      socket.to(uid).emit('mensaje-privado', { de: user.nombre, mensaje });
      return;
    }

    chatMensaje.enviarMensaje(user.id, user.nombre, mensaje);
    io.emit('resibir-mensaje', chatMensaje.ultimos10);
  });

  return 0;

};

module.exports = socketController;
