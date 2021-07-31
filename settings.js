const path = require('path');

const SETTINGS = {
    HOST: 'http://localhost:3001',
    PORT: 3001,
    UPLOADS: {
        IMAGES: 'uploads/images'
    },
    PATH_TO_DIR: path.dirname(__filename), 
    PATH_TO_DB: './application/modules/db/notes.db',
    PATH_TO_IMAGES: `http://localhost:3001/uploads/images/`,
    PATH_TO_IMAGES_SYSTEM: `${path.dirname(__filename)}/uploads/images/`,
}

module.exports = SETTINGS;