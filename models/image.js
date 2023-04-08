const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const albumSchema = new Schema({
    filePath: {
        type: String,
    }
}, {timestamps: true});

const Image = mongoose.model('Image', albumSchema);
module.exports = Image;
