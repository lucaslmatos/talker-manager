const fs = require('fs/promises');
const { join } = require('path');

const getData = async () => {
  const path = './talker.json';
  const content = await fs.readFile(join(__dirname, path), 'utf-8');
  const data = JSON.parse(content);
  return data;
};

const generateToken = (length) => {
  const base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < length; i += 1) {
    const random = Math.floor(Math.random() * base.length);
    token += base.charAt(random);
  }
  return token;
};

const validadeLogin = (req, res, next) => {
  const { email, password } = req.body;
  const rg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email) {
    return res.status(400).json({ message: 'O campo "email" é obrigatório' });
  }
  if (!password) {
    return res.status(400).json({ message: 'O campo "password" é obrigatório' });
  }
  if (!rg.test(email)) {
    return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }
  if (password.length <= 5) {
    return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
  return next();
};

module.exports = {
 getData,
 generateToken,
 validadeLogin,
};