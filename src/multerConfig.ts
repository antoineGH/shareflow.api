import multer, { diskStorage, StorageEngine } from "multer";
import fs from "fs";
import moment from "moment";

interface MulterFile {
  originalname: string;
}

const storage: StorageEngine = diskStorage({
  destination: function (req, file: MulterFile, cb) {
    const userId = req.params.userId;
    const dir = `./storage/${userId}`;

    fs.exists(dir, (exists) => {
      if (!exists) {
        return fs.mkdir(dir, (error) => cb(error, dir));
      }
      return cb(null, dir);
    });
  },
  filename: function (req, file: MulterFile, cb) {
    const date = moment().format("YYYY-MM-DD-HH-mm-ss");
    const newFileName = `${date}_${file.originalname}`;
    cb(null, newFileName);
  },
});

const upload = multer({ storage: storage });

export default upload;
