const Album = require('../models/album.model');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
require('dotenv').config();
const path = require('path');
const {
  message
} = require('statuses');

cloudinary.config({
  cloud_title: process.env.CLOUD_title,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

module.exports.index = async (req, res) => {
  try {
    const album = await Album.find();
    res.status(200).json({
      code: 200,
      message: "Get all Album success!",
      data: album,
    })
  } catch (error) {
    res.status(400).json({
      code: 400,
      message: "Get all Album fail",
      error: error.message,
    })
  }
}

module.exports.detail = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const album = await Album.findById(id);
    res.status(200).json({
      code: 200,
      message: "Get Album success!",
      data: album
    })
  } catch (error) {
    res.status(400).json({
      code: 400,
      message: "Get Album fail",
      error: error.message,
    })
  }
}

module.exports.create = async (req, res) => {
  try {
    const {
      title
    } = req.body;
    if (!title) {
      return res.status(400).json({
        message: "Album title is required"
      });
    }

    const albumExisted = await Album.findOne({
      title: title
    });

    if (albumExisted) {
      return res.status(400).json({
        message: "Album already exists"
      });
    }

    const newAlbum = new Album({
      ...req.body,
    });

    await newAlbum.save();

    res.status(201).json({
      code: 200,
      message: "Create Album success!",
    });
  } catch (error) {
    res.status(400).json({
      code: 400,
      message: "Create fail",
      error: error.message
    });
  }
};

module.exports.update = async (req, res)=>{
  try {
    const {id} = req.params;
    const album = await Album.findByIdAndUpdate(id, {
      ...req.body,
    }, {
      new: true
    })
    res.status(200).json({
      code: 200,
      message: "Update success!",
    })
  } catch (error) {
    res.status(400).json({
      code: 400,
      message: "Update fail",
      error: error.message
    });
  }
}

module.exports.delete = async (req, res) => {
  try {
    const {id} = req.params;
    const album = await Album.findById(id);
    if (!album) {
      return res.status(400).json({
        code: 400,
        message: "Not found album!"
      })
    }
    await album.deleteOne();
  } catch (error) {
    
  }
}