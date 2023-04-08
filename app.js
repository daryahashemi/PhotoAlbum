const express = require('express');
const multer = require('multer');
const uuid = require('uuid').v4;
const path = require('path');
const mongoose = require('mongoose');
const Image = require('./models/image');
const albumRoutes = require('./routes/albumRoutes');
const fs = require('fs');

// express app
const app = express();

// middleware & static files
app.use(express.static('public'));
app.use(express.static('uploads'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//register view engine
app.set('view engine', 'ejs');

// connect to mongodb
const PORT = 3000 || process.env.PORT;
const dbURI = 'mongodb://127.0.0.1:27017/mongoimages';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(result => {
    app.listen(PORT, () => {
    console.log(`Listening for requests on port ${PORT}...`)});
    console.log('connected to db');
})
.catch(err => console.log(err));

const connection = mongoose.connection;
connection.on('error', console.log);

// multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => { 
        cb(null, 'uploads'); 
    }, 
    filename: (req, file, cb) => { 
        const ext = path.extname(file.originalname); 
        const id = uuid();
        const filePath = `images/${id}${ext}`;
        Image.create({ filePath })
        .then(() => {
            cb (null, filePath);  
        });        
    }
})

const upload = multer({ storage });

// routes
app.post('/upload', upload.array('avatar'), (req,res) => { 
    return res.redirect('/');
})

// blog routes
app.use(albumRoutes); 

// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
});
