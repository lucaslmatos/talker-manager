const fs = require('fs/promises');
const { join } = require('path');

const getData = async () => {
  const path = './talker.json';
  const content = await fs.readFile(join(__dirname, path), 'utf-8');
  const data = JSON.parse(content);
  return data;
};

const generateToken = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < length; i += 1) {
    const random = Math.floor(Math.random() * characters.length);
    token += characters.charAt(random);
  }
  return token;
};

module.exports = {
 getData,
 generateToken,
};