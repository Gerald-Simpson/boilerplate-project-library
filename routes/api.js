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
      let [err, allBooks] = await bookModel.find().then(
        (allBooks) => [null, allBooks],
        (err) => [err, null]
      );
      if (err) return console.error(err);
      if (allBooks) res.json(allBooks);
    })

    .post(async function (req, res) {
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (title == undefined) {
        return res.text('missing required field title');
      } else {
        let newBookSearch = new bookModel({
          title: title,
          comments: [],
          commentcount: 0,
        });
        let [err, newBook] = await newBookSearch.save().then(
          (newBook) => [null, newBook],
          (err) => [err, null]
        );
        if (err) return console.error(err);
        if (newBook) {
          res.json({
            _id: newBook._id,
            title: newBook.title,
          });
        }
      }
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
    });

  app
    .route('/api/books/:id')
    .get(async function (req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      let [err, bookModelSearch] = await bookModel.findById(bookid).then(
        (bookModelSearch) => [null, bookModelSearch],
        (err) => [err, null]
      );
      if (err) res.text('no book exists');
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
