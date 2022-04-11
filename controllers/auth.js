const { request, response } = require('express');
const bcrypt = require('bcryptjs');

const generarJWT = require('../helpers/generar-jwt');

const UsuarioModel = require('../models/user');
const { googleVerify } = require('../helpers/google-verify');

const authLogin = async (req = request, res = response) => {
  const { correo, password } = req.body;
  try {
    const UserActiveAndEmailExist = await UsuarioModel.findOne({
      correo,
      estado: true,
    });

    if (!UserActiveAndEmailExist) {
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - verificar',
      });
    }

    const validarPassword = bcrypt.compareSync(
      password,
      UserActiveAndEmailExist.password
    );

    if (!validarPassword) {
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - verificar',
      });
    }

    const token = await generarJWT(UserActiveAndEmailExist.id);

    return res.json({
      UserActiveAndEmailExist,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: 'Hable con el administrador',
    });
  }
};

const googleSignIn = async (req = request, res = response) => {
  const { id_token: idToken } = req.body;

  try {
    const { nombre, img, correo } = await googleVerify(idToken);

    let usuario = await UsuarioModel.findOne({ correo });

    if (!usuario) {
      const data = {
        nombre,
        correo,
        password: ':P',
        img,
        google: true,
        rol: 'USER_ROLE',
      };

      usuario = new UsuarioModel(data);
      await usuario.save();
    }

    if (!usuario.estado) {
      return res
        .status(401)
        .json({ msg: 'Hable con el administrador - usuario no valido' });
    }

    const token = await generarJWT(usuario.id);

    return res.json({
      usuario,
      token,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: 'El token no se pudo verficar',
    });
  }
};

const renovarJWT = async (req = request, res = response) => {
  const { usuario } = req;

  const token = await generarJWT(usuario.id);

  return res.json({
    usuario,
    token,
  });
};

module.exports = {
  authLogin,
  googleSignIn,
  renovarJWT,
};
