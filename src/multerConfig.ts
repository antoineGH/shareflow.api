import multer, { diskStorage, StorageEngine } from "multer";
import moment from "moment";

interface MulterFile {
  originalname: string;
}

const storage: StorageEngine = diskStorage({
  destination: function (req, file: MulterFile, cb) {
    cb(null, "./storage/");
  },
  filename: function (req, file: MulterFile, cb) {
    const date = moment().format("YYYY-MM-DD-HH-mm-ss");
    const newFileName = `${date}_${file.originalname}`;
    cb(null, newFileName);
  },
});

const upload = multer({ storage: storage });

export default upload;
