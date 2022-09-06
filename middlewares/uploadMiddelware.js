const multer = require('multer');
const { join } = require('path');

const upload = multer({
    dest: join(__dirname, '..', 'images')
});

module.exports = upload