const express = require('express');
const router = express.Router();
const Answer = require('./Answer');
const uploadImage = require('../modules/multer/multer');

function Router({ notes }) {
    const answer = new Answer();

    const upload = uploadImage;

    // Получить все заметки.
    router.get('/notes/all', async (req, res) => {
        const value = await notes.getAllNotes();
        res.json(answer.good(value));
    });

    // Добавить новую запись
    router.post('/notes/add', upload, async (req, res) => {
        const value = await notes.addNewNote({ ...req.body, image: req.file });
        res.json(answer.good(value));
    });

    // Обновить запись.
    router.post('/notes/update/:id', async (req, res) => {
        const value = await notes.updateNoteById({ ...req.params, ...req.body });
        res.json(answer.good(value));
    });

    // Удалить запись
    router.get('/notes/delete/:id', async (req, res) => {
        const value = await notes.deleteNote(req.params);
        res.json(answer.good(value));
    });

    // Уставоить, что запись выполнена или нетй
    router.post('/notes/completed/:id', async (req, res) => {
        const value = await notes.changeCompleted({ ...req.params, ...req.body });
        res.json(answer.good(value));
    });

    // Обновить изображение к картинке.
    router.post('/notes/image/update/:id', upload, async (req, res) => {
        const value = await notes.updateImage({ ...req.params, image: req.file });
        res.json(answer.good(value));
    });

    // Удалить изображение к картинке.
    router.get('/notes/image/delete/:id', upload, async (req, res) => {
        const value = await notes.updateImage(req.params);
        res.json(answer.good(value));
    });

    return router;
}

module.exports = Router;