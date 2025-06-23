const multer = require("multer");
const cloudinary = require("cloudinary").v2; // thư viện đẩy ảnh lên cloud
const streamifier = require("streamifier");

// cloudinary
(async function () {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET, // Click 'View API Keys' above to copy your API secret
  });
})();
// end cloudinary

const upload = multer();

module.exports.upload = async (req, res, next) => {
    // nếu có file gửi lên thì mới chạy vào luồng này
    if (req.file) {
      let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
          let stream = cloudinary.uploader.upload_stream((error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          });

          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };

      async function upload(req) {
        let result = await streamUpload(req);
        req.body[req.file.fieldname] = result.url; // lấy tên bằng ảnh mà người dùng gửi lên
        next();
      }
      upload(req);

    }else{
      next();
    }
    // không được next gộp cho cả 2 TH để tránh chưa upload ảnh xong 
    // mà đã next sang bên controller thì lúc đấy db sẽ ko lấy dc key thumbnail
  }