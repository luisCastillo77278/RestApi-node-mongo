const jwt = require('jsonwebtoken');
const { User: UserModel } = require('../models');

const comprovarJWT = async (token = '') => {

  try {

    if (token.length < 10) return null;

    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const user = await UserModel.findById(uid);

    if (!user || !user.estado) return null;
    // if(!user.estado) return null;

    return user;

  } catch (error) {
    return null;
  }

}

module.exports = comprovarJWT;
