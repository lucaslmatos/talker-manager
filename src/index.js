const express = require('express');
const fs = require('fs/promises');
const { join } = require('path');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar.
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

const getData = async () => {
  const path = '/talker.json';
  const content = await fs.readFile(join(__dirname, path), 'utf-8');
  const data = JSON.parse(content);
  return data;
};

app.get('/talker', async (req, res) => {
  const data = await getData();
    return res.status(200).json(data) || res.status(200).json([]);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const data = await getData();
  const talker = data.find((tk) => tk.id === +id);
  if (talker) {
    return res.status(200).json(talker); 
  } 
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
});

app.listen(PORT, () => {
  console.log('Online');
});
