const fs = require('fs/promises');
require('path');
const { join } = require('path');

const path2 = './talker.json';

const getData = async () => {
  const content = await fs.readFile(join(__dirname, path2), 'utf-8');
  if (content) {
    const data = JSON.parse(content);
    return data;
  }
  return '[]';
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
  if (!email) { return res.status(400).json({ message: 'O campo "email" é obrigatório' }); }
  if (!password) { return res.status(400).json({ message: 'O campo "password" é obrigatório' }); }
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

const validadePatchRate = (req, res, next) => {
  try {
    const { rate } = req.body;
  if (Number.isInteger(rate) && validadeRate(rate)) {
    return next();
  }
  if (rate === undefined) {
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
};

const editPerson = async (personId, person) => {
  const editedData = await getData();
  const editedIn = editedData.findIndex((p) => +p.id === +personId);
  if (editedIn !== -1) {
    editedData[editedIn].name = person.name;
    editedData[editedIn].age = person.age;
    editedData[editedIn].talk.watchedAt = person.talk.watchedAt;
    editedData[editedIn].talk.rate = person.talk.rate;
    await fs.writeFile(join(__dirname, './talker.json'), JSON.stringify(editedData));
    return 'ok';
  }
  return 'erro';
};

const deletePerson = async (personId) => {
  const editedData = await getData();
  const editedIn = editedData.findIndex((p) => +p.id === +personId);
  if (editedIn !== -1) {
     delete editedData[editedIn];
    await fs.writeFile(join(__dirname, './talker.json'), JSON.stringify(editedData));
    return 'ok';
  }
  return 'erro';
};

const checkRate = (rate) => {
  if (rate && (!validadeRate(rate) || !Number.isInteger(+rate))) {
    return true;
  }
};

const checkDate = (date) => {
  const rg = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  if (date && !rg.test(date)) {
    return true;
  }
};

const finalList = (list, q, r, d) => {
  const listByName = q ? list.filter((p) => p.name.includes(q)) : list;
  const listByRate = r ? listByName.filter((p) => +p.talk.rate === +r) : listByName;
  const finList = d ? listByRate.filter((p) => p.talk.watchedAt === d) : listByRate;
  return finList;
};

const searchPerson = async (personName, personRate, personDate) => {
  const list = await getData();
  if (checkRate(personRate)) {
    return 'rError';
  }
  if (checkDate(personDate)) {
    return 'dError';
  }
  const searchedList = finalList(list, personName, personRate, personDate);
  return searchedList;
};

const editId = async (personId, rate) => {
  const editedData = await getData();
  const editedIn = editedData.findIndex((p) => +p.id === +personId);
  if (editedIn !== -1) {
    editedData[editedIn].talk.rate = rate.rate;
    await fs.writeFile(join(__dirname, path2), JSON.stringify(editedData));
    return 'ok';
  }
  return 'erro';
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
 validadePatchRate,
 addPerson,
 editPerson,
 deletePerson,
 searchPerson,
 editId,
};
