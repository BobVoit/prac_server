const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const SETTINGS = require('../../../settings');
const getTimeNow = require('../../../utils/getDateNow');

// Класс для управления базой данных.
class DB {
    constructor() {
        // connect to database
        (async () => {
            // open database
            this.db = await open({
                filename: SETTINGS.PATH_TO_DB,
                driver: sqlite3.Database
            })
        })();
    }

    // Получить все записи.
    getAllNotes() {
        const result = this.db.all('SELECT notes.*, images.name AS image FROM notes LEFT JOIN images ON notes.id = images.noteId', []);
        return result;
    }

    // Добавить новую записку.
    addNewNote({ text, importance, date }) {
        const result = this.db.run(
            'INSERT INTO notes(text, dateCreated, dateUpdated, importance, completed) VALUES (?, ?, ?, ?, ?)', 
            [text, date, date, importance, 0]
        );
        return result;
    }

    // Получить записать по id.
    getNoteById(id) {
        const result = this.db.get('SELECT * FROM notes WHERE id = ?', [id]);
        return result;
    }

    // Получить записать по дате создания.
    getNoteByDate(date) {
        const result = this.db.get('SELECT * FROM notes WHERE dateCreated = ?', [date]);
        return result;
    }

    // Обнавить записку.
    updateNoteById({ id, text, importance, date }) {
        const result = this.db.run(
            'UPDATE notes SET text=?, dateUpdated=?, importance=? WHERE id=?', 
            [text, date, importance, id],
        );
        return result;
    }

    // Удалить записку.
    deleteNote(id) {
        const result = this.db.run('DELETE FROM notes WHERE id=?', [id]);
        return result;
    }

    // Указать, что замнетка выполнена или нет.
    changeCompleted(id, completed) {
        const result = this.db.run('UPDATE notes SET completed=? WHERE id=?', [completed, id]);
        return result;
    }

    // Установить изображение для заметки.
    setImage(filename, id) {
        const result = this.db.run('INSERT INTO images (name, noteId) VALUES (?, ?)', [filename, id]);
        return result;
    }

    // Получить изображение к заметке по id. 
    getImage(id) {
        const result = this.db.get('SELECT name FROM images WHERE noteId=?', [id]);
        return result;
    }

    // Удалить изображение. 
    deleteImage(id) {
        const result = this.db.get('DELETE FROM images WHERE noteId=?', [id]);
        return result;
    }

    updateTime(id) {
        const date = getTimeNow();
        const result = this.db.run(
            'UPDATE notes SET dateUpdated=? WHERE id=?', 
            [date, id],
        );
        return result;
    }
}

module.exports = DB;