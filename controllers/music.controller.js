const Music = require('../models/music.model');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
require('dotenv').config();
const path = require('path');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});
// [GET] ALL
module.exports.index = async (req, res) => {
  try {
    const musics = await Music.find();
    return res.status(200).json({
      code: 200,
      message: 'Get all music success',
      data: musics
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: 'Get all music failed',
      error: error.message
    });
  }
};

// [GET] DETAIL
module.exports.detail = async (req, res) => {
  try {
    const { id } = req.params;
    const music = await Music.findById(id);
    return res.status(200).json({
      code: 200,
      message: 'Get music detail success',
      data: music
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: 'Get music detail failed',
      error: error.message
    });
  }
}

// [POST] CREATE
module.exports.create = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        code: 400,
        message: 'Please upload a sound file',
      });
    }
    const musicPath = path.join('/tmp/', req.file.filename);
    // const musicPath = path.join(__dirname, "../tmp/", req.file.filename);
    const fileBuffer = fs.readFileSync(musicPath);

    const checkMusic = await Music.findOne({ title: req.body.title });
    if (checkMusic) {
      await fs.promises.unlink(musicPath);
      return res.status(400).json({
        code: 400,
        message: 'Music title already exists!',
      });
    } else {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: 'video' }, // Audio files are handled as video in Cloudinary
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        streamifier.createReadStream(fileBuffer).pipe(uploadStream);
      });

      const musicUrl = result.secure_url;
      const music = new Music({
        ...req.body,
        fileUrl: musicUrl,
        public_id: result.public_id,
      });

      await music.save();
      res.json({
        code: 200,
        message: 'Creation successful!',
      });

      await fs.promises.unlink(musicPath);
    }
  } catch (error) {
    res.json({
      code: 400,
      message: 'Failed to create music',
      error: error.message,
    });
  }
};

// [PATCH] UPDATE
module.exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const music = await Music.findById(id);
    if (!music) {
      return res.status(404).json({
        message: `Music not found with ID: ${id}`,
      });
    }
    if (req.file) {
      const musicPath = path.join('/tmp/', req.file.filename);
      // const musicPath = path.join(__dirname, "../tmp/", req.file.filename);
      const fileExtension = req.file.filename.split('.').pop().toLowerCase();
      console.log('File extension detected:' + fileExtension);
      await cloudinary.uploader.destroy(music.public_id);
      const result = await cloudinary.uploader.upload(musicPath, { resource_type: 'video' });
      const musicUrl = result.secure_url;
      // Cập nhật thông tin của bài hát
      const updatedMusic = await Music.findByIdAndUpdate(
        id, {
          ...req.body,
          fileUrl: musicUrl,
          public_id: result.public_id,
        }, {
          new: true,
        }
      );
      await fs.promises.unlink(musicPath);
      console.log('File deleted successfully');
    } else {
      const updatedMusic = await Music.findByIdAndUpdate(
        id, {
          ...req.body,
        }, {
          new: true,
        }
      );
    }
    res.json({
      code: 200,
      message: 'Update successful!',
      data: music,
    });
  } catch (error) {
    res.status(400).json({
      code: 400,
      message: 'Update failed!',
      error: error.message,
    });
  }
}

// [DELETE] DELETE
module.exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const music = await Music.findById(id);
    console.log(music);
    if (!music) {
      return res.status(404).json({
        message: `Music not found with ID: ${id}`,
      });
    }
    const result = await cloudinary.uploader.destroy(music.public_id);
    console.log(result);
    const deletedMusic = await music.deleteOne();
    return res.status(200).json({
      code: 200,
      message: 'Delete music success',
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: 'Delete music failed',
      error: error.message
    });
  }
}

