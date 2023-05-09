/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

module.exports = function (app) {
  const mongoose = require('mongoose');
  var bookModel = mongoose.models?.book || require('../server').bookModel;

  app
    .route('/api/books')
    .get(async function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      let allBooks = await bookModel.find();
      if (!allBooks) return console.error('!allBooks');
      if (allBooks) res.json(allBooks);
    })

    .post(async function (req, res) {
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (title == undefined) {
        return res.send('missing required field title');
      } else {
        let newBookSearch = new bookModel({
          title: title,
          comments: [],
          commentcount: 0,
        });
        let newBook = await newBookSearch.save();
        if (!newBook) return console.error(err);
        if (newBook) {
          res.json({
            _id: newBook._id,
            title: newBook.title,
          });
        }
      }
    })

    .delete(async function (req, res) {
      //if successful response will be 'complete delete successful'
      await bookModel.deleteMany();
      if (bookModel) {
        return res.send('complete delete successful');
      }
    });

  app
    .route('/api/books/:id')
    .get(async function (req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      let bookModelSearch = await bookModel.findById(bookid);
      if (!bookModelSearch) return res.send('no book exists');
      if (bookModelSearch) {
        res.json({
          _id: bookModelSearch._id,
          title: bookModelSearch.title,
          comments: bookModelSearch.comments,
          commentcount: bookModelSearch.commentcount,
          __v: bookModelSearch.__v,
        });
      }
    })

    .post(async function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if (comment === undefined) {
        return res.send('missing required field comment');
      }
      let bookModelSearch = await bookModel.findByIdAndUpdate(
        bookid,
        {
          $push: { comments: comment },
          $inc: { commentcount: 1 },
        },
        { new: true }
      );
      if (!bookModelSearch) {
        return res.send('no book exists');
      } else if (bookModelSearch) {
        res.json({
          _id: bookModelSearch._id,
          title: bookModelSearch.title,
          comments: bookModelSearch.comments,
          commentcount: bookModelSearch.commentcount,
          __v: bookModelSearch.__v,
        });
      }
    })

    .delete(async function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      let deletedBook = await bookModel.findByIdAndDelete(bookid);
      if (deletedBook) {
        if (String(deletedBook._id) !== bookid) {
          return res.send('no book exists');
        } else {
          return res.send('delete successful');
        }
      } else if (!deletedBook) {
        return res.send('no book exists');
      }
    });
};
