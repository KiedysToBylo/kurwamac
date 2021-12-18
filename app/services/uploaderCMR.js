import multer from 'multer';
import path from 'path';

const storage =multer.diskStorage({
    destination: function(req, file, cb)
    {
        cb(null, "public/upload/cmr/");
    },
    filename: function(req, file, cb)
    {
        const taskId = req.headers.taskid
        const name = taskId+"-"+ Date.now() + path.extname(file.originalname);
        cb(null, name);
    }
});
const uploadCMR = multer({storage});

export default uploadCMR