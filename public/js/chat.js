const url = window.location.hostname.includes('localhost')
  ? 'http://localhost:3000/api/auth'
  : 'https://rest-node-api-mongo.herokuapp.com/api/auth';

// eslint-disable-next-line no-unused-vars
let user;
// eslint-disable-next-line no-unused-vars
let socket = null;

// referencias html
const txtUid = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensaje = document.querySelector('#ulMensaje');
const btnSalir = document.querySelector('#btnSalir');

const dibujarUsuarios = (usuarios = []) => {
  let liHtml = '';
  usuarios.forEach(({ nombre, id }) => {
    liHtml += `
      <li>
        <p>
          <h5 class="text-success">${nombre}</h5>
          <span class="fs-6 text-muted">${id}</span>
        </p>
      </li>
    `;
  });
  ulUsuarios.innerHTML = liHtml;
}

const dibujarMensajes = (mensajes = []) => {
  let liHtml = '';
  mensajes.forEach(({ nombre, mensaje }) => {
    liHtml += `
      <li>
        <p>
          <span class="text-primary">${nombre}</span>
          <span class="fs-6 text-muted">${mensaje}</span>
        </p>
      </li>
    `;
  });
  ulMensaje.innerHTML = liHtml;
}


const conectarSocket = () => {
  socket = io({
    'extraHeaders': {
      'x-token': localStorage.getItem('token')
    }
  });

  socket.on('connect', () => console.log('Socket online'));
  socket.on('disconnect', () => console.log('Socket offline'));

  socket.on('resibir-mensaje', dibujarMensajes);

  socket.on('usuarios-activos', dibujarUsuarios);

  socket.on('mensaje-privado', (payload) => {
    // todo mensaje privado
    console.log({ payload });
  });
}

const validarJWT = async () => {
  const token = localStorage.getItem('token') || '';

  if (token.length <= 10) {
    window.location = 'index.html';
    throw new Error('no hay token valido');
  }

  const { usuario: userDB, token: tokenDB } = await fetch(url, {
    headers: {
      'x-token': token,
    },
  }).then((resp) => resp.json());

  localStorage.setItem('token', tokenDB);
  user = userDB;
  document.title = user.nombre;

  await conectarSocket();

};

txtMensaje.addEventListener('keyup', ({ keyCode }) => {
  const mensaje = txtMensaje.value;
  const uid = txtUid.value;
  if (keyCode !== 13) return;
  if (mensaje.length === 0) return;
  console.log(mensaje);

  socket.emit('enviar-mensaje', { mensaje, uid });
  txtMensaje.value = '';
});


btnSalir.addEventListener('click', () => {
  localStorage.clear();
  window.location = 'index.html';
});

const main = async () => {
  await validarJWT();
};

main();
