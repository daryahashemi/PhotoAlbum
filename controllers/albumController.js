const Image = require('../models/image');
const  fs = require('fs');

var express = require('express');

var app = express();
app.use(express.json());

const album_details = (req, res) => {
    Image.find()
    .then((images) => {
        res.render('details', { images, title: 'Album Details' });
    })
    .catch(err => {
          res.status(404).render('404', { title: 'Album Not Found' });
    });
}

const allalbum_images = (req,res) => {
    Image.find()
    .then((images) => {
        return res.json({ status: 'Ok', images })
    })
}

const album_deleteone = (req, res) => {
    const id = req.params.id;

    //deleting files
    if(fs.existsSync(`./uploads/images/${id}`)) {
        fs.unlink(`./uploads/images/${id}`, (err) => {
            if(err){
                console.log(err);
            }
            // console.log('file deleted');
        });
    }

    Image.findOneAndDelete({filePath: `images/${id}`})
    .then(result => {
        res.json({ redirect: '/' });
    })
    .catch(err => {
        console.log(err);
    });
}

const album_deletemany = (req, res) => {
    let i;
    const arraylength = req.body.length;
    for (i = 0; i < arraylength ; i++) {
        if(fs.existsSync(`./uploads/${req.body[i]}`)) {
            fs.unlink(`./uploads/${req.body[i]}`, (err) => {
                if(err){
                    console.log(err);
                }
                console.log('file deleted');
            });
        }
    }

    for (i = 0; i < arraylength-1 ; i++) {
        Image.findOneAndDelete({filePath: `${req.body[i]}`})
        .then(result => {
            // res.json({ redirect: '/details' });
        })
        .catch(err => { console.log(err); });
    }

    Image.findOneAndDelete({filePath: `${req.body[arraylength-1]}`})
    .then(result => { res.json({ redirect: '/' }); })
    .catch(err => { console.log(err); });
}

module.exports = {
  album_details, 
  allalbum_images,
  album_deleteone,
  album_deletemany
}