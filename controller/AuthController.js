const { getUserDetailsByEmail, getUserDetailsByPhone, addUser } = require('./DatabaseController');
const { SECRET } = require('../config/config');
const { createToken, verifyToken } = require('./JwtController');
const { compareSync } = require('bcrypt');

async function logIn(req, res) {
  // login code goes here
  const { email, phone, password } = req.body;
  if (email && password) {
    const user = await getUserDetailsByEmail(email);
    if (user) {
      if (compareSync(password, user.password)) {
        return res.send({
          message: 'success',
          userID: user.userID,
          token: createToken(user.userID),
          phoneOrEmail: email,
          name: user.name,
          profileLink: user.profileLink
        });
      }
    }
  }
  if (phone && password) {
    const user = await getUserDetailsByPhone(phone);
    if (user) {
      if (compareSync(password, user.password)) {
        return res.send({
          message: 'success',
          userID: user.userID,
          token: createToken(user.userID),
          phoneOrEmail: phone,
          name: user.name,
          profileLink: user.profileLink
        });
      }
    }
  }
  res.send({ message: 'Invalid credentials' });
}

async function signUp(req, res) {
  // signup code goes here
  const { name, email, phone, password, profileLink } = req.body;
  if (email && password && name && profileLink) {
    if (await getUserDetailsByEmail(email)) {
      return res.send({ message: 'Email already taken' });
    }
    await addUser(name, email, '', password, profileLink);
    return res.send({ message: 'success' });
  }
  if (phone && password && name && profileLink) {
    if (await getUserDetailsByPhone(phone)) {
      return res.send({ message: 'Phone already taken' });
    }
    await addUser(name, '', phone, password, profileLink);
    return res.send({ message: 'success' });
  }
  res.send({ message: 'Invalid credentials' });
}

function verify(req, res) {
  const { token, userID } = req.body;
  if (token && userID) {
    if (verifyToken(token, userID)) {
      return res.send({ message: 'success' });
    }
  }
  res.send({ message: 'failure' });
}

function generateOTP(req, res) {
  //todo
}

function verifyOTP(req, res) {
  //todo
}

module.exports = {
  logIn,
  signUp,
  verify
};
