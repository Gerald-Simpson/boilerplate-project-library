/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

module.exports = function (app, bookModel) {
  app
    .route('/api/books')
    .get(async function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      try {
        bookModel.find({});
      } catch (err) {
        return console.error(err);
      }
      res.json({
        _id: bookModel._id,
        title: bookModel.title,
        commentcount: bookModel.commentcount,
      });
    })

    .post(async function (req, res) {
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (title == undefined) {
        return res.text('missing required field title');
      } else {
        let newBook = new bookModel({
          title: title,
          comments: [],
          commentcount: 0,
        });
        try {
          newBook = await newBook.save();
        } catch (err) {
          return console.error(err);
        }
        res.json({
          _id: newBook._id,
          title: newBook.title,
        });
      }
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
    });

  app
    .route('/api/books/:id')
    .get(function (req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
};
