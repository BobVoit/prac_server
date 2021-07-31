const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const app = express();
const server = http.createServer(app);
const cors = require('cors');

const SETTINGS = require('./settings');
const { PORT } = SETTINGS;

const DB = require('./application/modules/db/DB');
const Notes = require('./application/modules/notes/Notes');
const Router = require('./application/routers/Router');

const db = new DB();
const notes = new Notes({ db });
const router = new Router({ notes });

app.use(
    bodyParser.urlencoded({ extended: true}),
    express.static(__dirname + '/public'),
);
app.use(bodyParser.json());
app.use(cors());
app.use('/', router);
app.use('/uploads', express.static('uploads')); 

server.listen(PORT, () => console.log(`Server running at port ${PORT}. http://localhost:3001`));