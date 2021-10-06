const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads'); // w miejscu null zwykle jest error jako parametr
    },
    filename: function(req, file, cb) {
        const name = Date.now() + path.extname(file.originalname);
                         //pobiera rozszerzenie pliku 
        cb(null, name)
    }
})
const upload = multer({ storage }); // konfiguracja: dest: 'public/uploads/' będzie zawarta w store
// multer to middleware z npm dla Node'a do ładowania plików metodą multipart/form-data

module.exports = upload;