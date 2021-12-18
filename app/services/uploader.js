import multer from 'multer';
import path from 'path';

const storage =multer.diskStorage({
    destination: function(req, file, cb)
    {
        cb(null, "public/upload/");
    },
    filename: function(req, file, cb)
    {
        const name = Date.now() + path.extname(file.originalname);
        cb(null, name);
    }
});
const upload = multer({storage});

export default upload