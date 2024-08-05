// index.js

require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const authenticationRouter = require('./routes/authentication');
const imagesRouter = require('./routes/images');
const countriesRouter = require('./routes/countries');
const statesRouter = require('./routes/states');
const citiesRouter = require('./routes/cities');
const tagsRouter = require('./routes/tags');
const cors = require('cors');

const app = express();
app.use(cors());
const port = process.env.PORT || 3000;

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(`mongodb://${process.env.MONGOUSER}:${process.env.MONGOPASS}@localhost:27017/${process.env.MONGODBNAME}`, {});
    console.log('Conexão com o MongoDB estabelecida.');
  } catch (err) {
    console.error('Erro ao conectar ao MongoDB:', err);
  }
};

connectToMongoDB();

app.use(express.json());

app.use('/images', imagesRouter);
app.use('/countries', countriesRouter);
app.use('/states', statesRouter);
app.use('/cities', citiesRouter);
app.use('/tags', tagsRouter);
app.use('/authentication', authenticationRouter);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
