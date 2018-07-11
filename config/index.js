/* importar o módulo do framework express */
const express = require('express');

/* importar o módulo do consign */
const consign = require('consign');

/* importar o módulo do body-parser */
const bodyParser = require('body-parser');

//  Variaveis de ambiente.
const env = require('dotenv');

/* importar o módulo do express-validator */
const expressValidator = require('express-validator');

/* Importar o módulo do express-session. */
const expressSession = require('express-session');

//  Importando o módulo do mongoose.
const mongoose = require('mongoose');

/* Importar o módulo do express-fileupload. */
const fileUpload = require('express-fileupload');

/* iniciar o objeto do express */
const app = express();

const MongoDBStore = require('connect-mongodb-session')(expressSession);

/* setar as variáveis 'view engine' e 'views' do express */
app.set('view engine', 'ejs');
app.set('views', './src/views');

/* configurar o middleware express.static */
app.use(express.static(__dirname + '/../src/public'));
app.use('/static', express.static(__dirname + '/../src/public'));

/*Configurando o fileUpload*/
app.use(fileUpload({
    limits: { fileSize: 15 * 1024 * 1024 },
    safeFileNames: true, preserveExtension: true
}));

/* configurar o middleware body-parser */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* configurar o middleware express-validator */
app.use(expressValidator());

//  Extraindo variaveis de ambiente.
env.config({ path: 'variables.env' });

const store = new MongoDBStore({
    uri: process.env.DATABASE,
    collection: 'sessions'
});

store.on('connected', function() {
    store.client; // The underlying MongoClient object from the MongoDB driver
});

// Catch errors
store.on('error', function(error) {
    assert.ifError(error);
    assert.ok(false);
});

/* Configurar o middleware express-session */
app.use(expressSession({
    secret: '80d499cac5e64c17620654587ec37dc5',
    resave: true,
    saveUninitialized: true,
    cookie: {expires: new Date(253402300000000)},
    store: store
}))

/* efetua o autoload das rotas, dos models e dos controllers para o objeto app */
consign().include('src/models')
    .then('src/routes')
    .then('src/controllers').into(app);

//  Conecta com o banco de dados e lida com problemas de conexão
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise; // → Queremos que o mongoose utilize promises ES6
mongoose.connection.on('error', err => {
    console.log(`🙅 🚫 → ${err.message}`);
});

/* exportar o objeto app */
module.exports = app;
