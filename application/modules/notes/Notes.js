const Answer = require('../../routers/Answer');
const getTimeNow = require('../../../utils/getDateNow');
const SETTINGS = require('../../../settings');
const fs = require('fs');

class Notes {
    constructor({ db }) {
        this.db = db;
        this.answer = new Answer();
        this.SETTINGS = SETTINGS;
    }

    // Получить все записи.
    async getAllNotes() {
        const resultFromDB = await this.db.getAllNotes();
        if (resultFromDB) {
            const result = resultFromDB.map(note => {
                if (note.image) {
                    const { PATH_TO_IMAGES } = this.SETTINGS;
                    return {
                        ...note,
                        image: PATH_TO_IMAGES + note.image
                    }
                }
                return note;
            })
            return result;
        }
        return null;
    }
    
    // Добавить новую записку.
    async addNewNote(data) {
        const { text, importance, image } = data;
        if (text) {
            const date = getTimeNow();
            const result = await this.db.addNewNote({ 
                text, 
                importance: this.setTmportance(importance), 
                date
            });
            if (result) {
                const note = await this.db.getNoteByDate(date);
                if (image) {
                    const result = await this.db.setImage(image.filename, note.id);
                    if (result) {
                        const { PATH_TO_IMAGES } = this.SETTINGS;
                        return {
                            ...note,
                            image: PATH_TO_IMAGES + image.filename
                        };
                    }
                }
                return { 
                    ...note,
                    image: null
                };
            }
        }
        return false;
    }

    // Обнавить записку.
    async updateNoteById(data) {
        const { id, text, importance } = data;
        if (id && text && importance) {
            const date = getTimeNow();
            const result = await this.db.updateNoteById({ 
                id, 
                text, 
                importance: this.setTmportance(importance),
                date 
            });
            if (result) {
                return true;
            }
        }
        return false;
    }

    // Удалить записку.
    async deleteNote(data) {
        const { id } = data;
        if (id) {
            const result = await this.db.deleteNote(id);
            if (result) {
                const image = await this.db.getImage(id);
                if (image) {
                    await this.db.deleteImage(id);
                    this.deleteImageFromSystem(image.name);
                }
                return true;
            }
        }
        return false;
    }

    // Обнавить, что задание выполнено.
    async changeCompleted(data) {
        const { id, completed } = data;
        if (id) {
            const numberOfCompleted = completed ? 1 : 0;
            const result = await this.db.changeCompleted(id, numberOfCompleted);
            if (result) {
                await this.db.updateTime(id);
                return true;
            }
        }
        return false;
    }

    // Обновление изображения для заметки.
    async updateImage(data) {
        const { id, image } = data;
        console.log(data);
        const imageFilename = await this.db.getImage(id);
        await this.db.deleteImage(id);
        if (imageFilename) {
            this.deleteImageFromSystem(imageFilename.name);
        }
        const resultSaveImage = await this.db.setImage(image.filename, id);
        if (resultSaveImage) {
            await this.db.updateTime(id);
            const { PATH_TO_IMAGES } = this.SETTINGS;
            return PATH_TO_IMAGES + image.filename;
        }
        return null;
    }

    // Удалить изоюражение у заметки.
    async deleteImageForNote(data) {
        const { id } = data;
        if (id) {
            const image = await this.db.getImage(id);
            const resultDeleteFromDB = await this.db.deleteImage(id);
            if (resultDeleteFromDB) {
                const resultDeleteFromSystem = this.deleteImageFromSystem(image.name);
                if (resultDeleteFromSystem) {
                    await this.db.updateTime(id);
                    return true;
                }
            }
        }
        return false;
    }

    // Удаления изоюражения из системы.
    deleteImageFromSystem(image) {
        const { PATH_TO_IMAGES_SYSTEM } = this.SETTINGS;
        try {
            fs.unlinkSync(PATH_TO_IMAGES_SYSTEM + image);
            return true;
        } catch (err) {
            console.error(err);
        }
        return false;
    }

    setTmportance(importance) {
        const importanceNumber = importance - 0;
        if (importanceNumber < 0) {
            return 0;
        } else if (importanceNumber > 5) {
            return 5;
        } else {
            return importanceNumber;
        }
    }
}

module.exports = Notes;