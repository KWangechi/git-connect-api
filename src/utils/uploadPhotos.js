const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/images");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + ".jpg");
  },
});

const maxSize = 1 * 1000 * 1000;

const multerUpload = multer({
  storage,
  limits: { fileSize: maxSize },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(
      new Error(
        "File upload only supports the following filetypes: jpeg, jpg, png."
      )
    );
  },
}).single("profilePhoto");

const upload = (req) => {
  return new Promise((resolve, reject) => {
    multerUpload(req, null, (err) => {
      if (err) {
        reject(err.message || "Failed to upload file");
      } else if (!req.file) {
        reject("No file uploaded");
      } else {
        const filePath = path
          .join(req.file.destination, req.file.filename)
          .replace(/public\\/g, "")
          .replace(/\\/g, "/");
        resolve(filePath);
      }
    });
  });
};

module.exports = {
  upload,
};
