const express = require('express');
const { getData, generateToken, validateLogin, 
  validateToken, validateName, validateAge, validateTalkwatchedAt, 
  validadeTalkRate, addPerson, editPerson, deletePerson, searchPerson } = require('./functions');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar.
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (req, res) => {
  try {
    const data = await getData();
    return res.status(200).json(data) || res.status(200).json([]);
  } catch (e) {
    return res.status(500).send({ message: e.message });
  }
});

app.post('/talker', validateToken, validateName, validateAge,
validateTalkwatchedAt, validadeTalkRate, async (req, res) => {
  addPerson(await getData(), req.body);
  const data = await getData();
  return res.status(201).json(data[data.length - 1]);
});

app.put('/talker/:id', validateToken, validateName, validateAge,
validateTalkwatchedAt, validadeTalkRate, async (req, res) => {
    const { id } = req.params;
    const status = await editPerson(id, req.body);
    if (status === 'ok') {
    const data = await getData();
    const person = data.find((p) => +p.id === +id);
    return res.status(200).json(person);
    }
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
});

app.delete('/talker/:id', validateToken, async (req, res) => {
    const { id } = req.params;
    const status = await deletePerson(id);
    if (status === 'ok') {
    return res.status(204).json();
    }
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
});

app.get('/talker/search', validateToken, async (req, res) => {
  try {
  const searched = req.query.q;
  const response = await searchPerson(searched);
  return res.status(200).json(response); 
  } catch (e) {
  return res.status(500).json({ message: e.message });
  } 
});

app.get('/talker/:id', async (req, res) => {
  try {
  const { id } = req.params;
  const data = await getData();
  const talker = data.find((tk) => tk.id === +id);
  if (talker) {
    return res.status(200).json(talker); 
  } 
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  } 
});

app.post('/login', validateLogin, (req, res) => {
  const atualToken = generateToken(16);
  return res.status(200).json({ token: atualToken });
});

app.listen(PORT, () => {
  console.log('Online');
});
