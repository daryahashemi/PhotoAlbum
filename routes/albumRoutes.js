const express = require('express');
const albumController = require('../controllers/albumController');

var app = express()
app.use(express.json());
const router = express.Router();

router.get('/', albumController.album_details); 
router.get('/images', albumController.allalbum_images);
router.delete('/images/:id', albumController.album_deleteone);
router.delete('/images', albumController.album_deletemany);

module.exports = router;