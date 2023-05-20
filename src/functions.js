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

const validateLogin = (req, res, next) => {
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

const validateToken = (req, res, next) => {
  try {
  const { authorization } = req.headers;
  if (authorization.length === 16 && typeof (authorization) === 'string') {
    return next();
  }
  return !authorization ? res.status(401).json({ message: 'Token não encontrado' }) 
  : res.status(401).json({ message: 'Token inválido' });
  } catch (e) {
    return res.status(401).json({ message: 'Token não encontrado' });
  }
};

const validateName = (req, res, next) => {
  try {
    const { name } = req.body;
  if (name.length >= 3 && typeof (name) === 'string') {
    return next();
  }
  return !name ? res.status(400).json({ message: 'O campo "name" é obrigatório' }) 
  : res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
} catch (e) {
  return res.status(400).json({ message: 'O campo "name" é obrigatório' });
}
};

const validateAge = (req, res, next) => {
  try {
    const { age } = req.body;
  if (Number.isInteger(age) && age >= 18) {
    return next();
  }
  return !age ? res.status(400).json({ message: 'O campo "age" é obrigatório' }) 
  : res.status(400).json({ message: 
    'O campo "age" deve ser um número inteiro igual ou maior que 18' });
} catch (e) {
  return res.status(400).json({ message: 'O campo "age" é obrigatório' });
}
};

const validateTalkwatchedAt = (req, res, next) => {
  const rg = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  try {
    const { talk } = req.body;
  if (rg.test(talk.watchedAt)) {
    return next();
  } 
  if (!talk.watchedAt) {
    return res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
  }
  return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
} catch (e) {
  return res.status(400).json({ message: 'O campo "talk" é obrigatório' });
}
};

const validadeRate = (rate) => rate >= 1 && rate <= 5;

const validadeTalkRate = (req, res, next) => {
  try {
    const { talk } = req.body;
  if (Number.isInteger(talk.rate) && validadeRate(talk.rate)) {
    return next();
  }
  if (talk.rate === undefined) {
    return res.status(400).json({ message: 'O campo "rate" é obrigatório' });
  }
  return res.status(400).json({ message: 'O campo "rate" deve ser um número inteiro entre 1 e 5' });
} catch (e) {
  return res.status(400).json({ message: 'O campo "talk" é obrigatório' });
}
};

const addPerson = async (data, newPerson) => {
  const atualId = data[data.length - 1].id + 1;
  const atualPerson = { ...newPerson, id: atualId };
  const atualData = [...data, atualPerson];
  await fs.writeFile(join(__dirname, './talker.json'), JSON.stringify(atualData));
  return 'oi';
};

module.exports = {
 getData,
 generateToken,
 validateLogin,
 validateToken,
 validateName,
 validateAge,
 validateTalkwatchedAt,
 validadeTalkRate,
 addPerson,
};