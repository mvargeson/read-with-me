var Book = require('../models/Book.js');
var Promise = require('bluebird');
var fs = require('fs');
fs.readFile = Promise.promisify(fs.readFile);
fs.readdir = Promise.promisify(fs.readdir);

var archiveHelper = require('../../database/PublicBooksLoader/archiveHelper.js');
module.exports = {
  getAllBooks: function (req, res) {
    Book.find({}, function (err, books) {
      if (err) return res.status(500).send(err);
      return res.json(books);
    });
  },

  getOneBook: function (req, res) {
    Book.findOne({ "_id": req.body.bookId }).then(book => {
      res.json(book);
    });
  },

  // add all sample books data, called from get '/api/addAllBooks'
  addAllSampleBooks: function (req, res) {
    console.log('add sample books');
    var filePath = archiveHelper.paths.sampleData;
    Book.remove({}).then(function() {
      fs.readdir(filePath).then(function(files) {
        if (files.length) {
          while (files.indexOf('.DS_Store') > -1) {
            files.splice(files.indexOf('.DS_Store'), 1);
          }
          var allBooks = [];
          var importData = function(i) {
            fs.readFile(filePath + '/' + files[i])
              .then(function(content) { return JSON.parse(content); })
              .then(function(book) {
                allBooks.push(book);
              })
              .then(function() {
                if (i === files.length - 1) {
                  Book.insertMany(allBooks);
                  console.log('all books added');
                  res.json({ message: 'sample books added' });
                } else {
                  importData(i + 1);
                }
              });
          };
          importData(0);
        }
      });
    });
  }
};
