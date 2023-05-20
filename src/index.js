const express = require('express');
const { getData, generateToken, validadeLogin } = require('./functions');

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
    return res.status(500).send({ message: e.message });
  } 
});

app.post('/login', validadeLogin, (req, res) => {
  const atualToken = generateToken(16);
  return res.status(200).json({ token: atualToken });
});

app.listen(PORT, () => {
  console.log('Online');
});
