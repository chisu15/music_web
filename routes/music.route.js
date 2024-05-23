/**
 * @swagger
 * components:
 *   schemas:
 *     Music:
 *       type: object
 *       required:
 *         - title
 *         - artist
 *         - fileUrl
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the music track
 *         artist:
 *           type: string
 *           description: The artist of the music track
 *         album:
 *           type: string
 *           description: The album where the music track is from
 *         genre:
 *           type: string
 *           description: The genre of the music track
 *         duration:
 *           type: number
 *           description: The duration of the track in seconds
 *         fileUrl:
 *           type: string
 *           description: URL to access the music file
 *         coverImageUrl:
 *           type: string
 *           description: URL to access the image cover of the track
 *         public_id:
 *           type: string
 *           description: The public ID for the music track on the cloud storage
 *         slug:
 *           type: string
 *           description: A slug generated from the music title
 *       example:
 *         title: "Em của ngày hôm qua"
 *         artist: "Sơn Tùng M-TP"
 *         album: "Chạy ngay đi"
 *         genre: "Pop"
 *         duration: 214
 *         fileUrl: "http://example.com/music/em-cua-ngay-hom-qua.mp3"
 *         coverImageUrl: "http://example.com/covers/em-cua-ngay-hom-qua.jpg"
 *         public_id: "em-cua-ngay-hom-qua"
 *         slug: "em-cua-ngay-hom-qua"
 */

/**
 * @swagger
 * tags:
 *  name: Music
 *  description: The music track API
 * /api/v1/music:
 *   get:
 *     summary: Retrieve a list of music tracks
 *     description: Retrieve a list of music tracks from the database.
 *     responses:
 *       200:
 *         description: A list of music tracks.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Music'
 *   post:
 *     summary: Create a new music track
 *     description: Upload a new music track to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/Music'
 *     responses:
 *       201:
 *         description: Music track created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Music'
 * /api/v1/music/{id}:
 *   get:
 *     summary: Retrieve a specific music track
 *     description: Retrieve details of a specific music track by ID from the database.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the music track to retrieve
 *     responses:
 *       200:
 *         description: Details of a music track.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Music'
 *   patch:
 *     summary: Update an existing music track
 *     description: Update details of an existing music track by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the music track to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/Music'
 *     responses:
 *       200:
 *         description: Music track updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Music'
 *   delete:
 *     summary: Delete a music track
 *     description: Delete a music track by ID from the database.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the music track to delete
 *     responses:
 *       204:
 *         description: Music track deleted successfully.
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const controller = require('../controllers/music.controller');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../tmp/'));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

const audioFilter = function (req, file, cb) {
  if (!file.originalname.match(/\.(mp3|wav|aac)$/)) {
    return cb(new Error('Only audio files are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: audioFilter,
});

router.get('/', controller.index);
router.get("/:id", controller.detail)
router.post('/', upload.single('fileUrl'), controller.create);
router.patch("/:id", upload.single("fileUrl"), controller.update);
router.delete("/:id", controller.delete);
module.exports = router;
