/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const mongoose = require('mongoose');
var bookModel = mongoose.models?.book || require('../server').bookModel;
var toDeleteId = '';

chai.use(chaiHttp);

suite('Functional Tests', function () {
  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  test('#example Test GET /api/books', function (done) {
    chai
      .request(server)
      .get('/api/books')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(
          res.body[0],
          'commentcount',
          'Books in array should contain commentcount'
        );
        assert.property(
          res.body[0],
          'title',
          'Books in array should contain title'
        );
        assert.property(
          res.body[0],
          '_id',
          'Books in array should contain _id'
        );
        done();
      });
  });
  /*
   * ----[END of EXAMPLE TEST]----
   */

  suite('Routing tests', function () {
    suite(
      'POST /api/books with title => create book object/expect book object',
      function () {
        test('Test POST /api/books with title', function (done) {
          chai
            .request(server)
            .post('/api/books')
            .send({
              title: 'test book title',
            })
            .end(function (err, res) {
              if (err) return console.error(err);
              assert.equal(res.status, 200);
              assert.property(res.body, '_id', 'res.body has _id');
              assert.equal(
                res.body.title,
                'test book title',
                'returned book title is correct'
              );
            });
          done();
        });

        test('Test POST /api/books with no title given', function (done) {
          chai
            .request(server)
            .post('/api/books')
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.isString(res.text, 'res.text is string');
              assert.equal(
                res.text,
                'missing required field title',
                'returned error message is correct'
              );
            });
          done();
        });
      }
    );

    suite('GET /api/books => array of books', function () {
      test('Test GET /api/books', function (done) {
        chai
          .request(server)
          .get('/api/books')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'res.body is an array');
            assert.isObject(res.body[0], 'res.body[0] is an object');
            assert.property(
              res.body[0],
              'comments',
              'res.body[0] has comments property'
            );
            assert.property(
              res.body[0],
              'title',
              'res.body[0] has title property'
            );
            assert.property(
              res.body[0],
              'commentcount',
              'res.body[0] has commentcount property'
            );
          });

        done();
      });
    });

    suite('GET /api/books/[id] => book object with [id]', function () {
      test('Test GET /api/books/[id] with id not in db', function (done) {
        chai
          .request(server)
          .get('/api/books/6449189ab7ffbc0840123456')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isString(res.text, 'res.text is a string');
            assert.equal(
              res.text,
              'no book exists',
              'correct error message given with invalid id'
            );
          });

        done();
      });

      test('Test GET /api/books/[id] with valid id in db', async function () {
        let newBookModel = new bookModel({
          title: 'title for get test',
          comments: ['test comment', 'test comment two'],
          commentcount: 2,
        });
        let newBook = await newBookModel.save();
        if (!newBook) return console.error('!newBook');
        if (newBook) {
          chai
            .request(server)
            .get('/api/books/' + newBook._id)
            .end(function (err, res) {
              assert.equal(res.status, 200, 'res.status');
              assert.isObject(res.body, 'res.body is an object');
              assert.deepEqual(
                res.body,
                {
                  _id: newBook._id.toString(),
                  title: newBook.title,
                  comments: newBook.comments,
                  commentcount: newBook.commentcount,
                  __v: newBook.__v,
                },
                'res.body matches newBook added to database'
              );
            });
        }
      });
    });

    suite(
      'POST /api/books/[id] => add comment/expect book object with id',
      function () {
        test('Test POST /api/books/[id] with comment', async function () {
          let newBookModel = new bookModel({
            title: 'title for post test',
            comments: ['test comment', 'test comment two'],
            commentcount: 2,
          });
          let newBook = await newBookModel.save();
          if (!newBook) return console.error('!newBook');
          if (newBook) {
            toDeleteId = String(newBook._id);
            chai
              .request(server)
              .post('/api/books/' + newBook._id)
              .send({
                comment: 'third comment for test',
              })
              .end(function (err, res) {
                assert.equal(res.status, 200, 'res.status');
                assert.isObject(res.body, 'res.body is an object');
                assert.deepEqual(
                  res.body,
                  {
                    _id: newBook._id.toString(),
                    title: newBook.title,
                    comments: newBook.comments.concat('third comment for test'),
                    commentcount: newBook.commentcount + 1,
                    __v: newBook.__v,
                  },
                  'res.body matches book with new comment added to database'
                );
              });
          }
        });

        test('Test POST /api/books/[id] without comment field', function (done) {
          chai
            .request(server)
            .post('/api/books/anyid')
            .end(function (err, res) {
              assert.equal(res.status, 200, 'res.status');
              assert.isString(res.text, 'res.text is a string');
              assert.equal(
                res.text,
                'missing required field comment',
                'res.text error missing comment is correct'
              );
            });
          done();
        });

        test('Test POST /api/books/[id] with comment, id not in db', function (done) {
          chai
            .request(server)
            .post('/api/books/6449189ab7ffbc084012345')
            .send({
              comment: 'post test comment',
            })
            .end(function (err, res) {
              assert.equal(res.status, 200, 'res.status');
              assert.isString(res.text, 'res.text is a string');
              assert.equal(
                res.text,
                'no book exists',
                'res.text error wrong id is correct'
              );
            });
          done();
        });
      }
    );

    suite('DELETE /api/books/[id] => delete book object id', function () {
      test('Test DELETE /api/books/[id] with valid id in db', async function () {
        chai
          .request(server)
          .delete('/api/books/' + toDeleteId)
          .end(function (err, res) {
            assert.equal(res.status, 200, 'res.status');
            assert.isString(res.text, 'res.text is a string');
            assert.deepEqual(
              res.text,
              'delete successful',
              'res.text string correct'
            );
          });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function (done) {
        assert.equal('test', 'test');
        chai
          .request(server)
          .delete('/api/books/6449189ab7ffbc0840123456')
          .end(function (err, res) {
            assert.equal(res.status, 200, 'res.status');
            assert.isString(res.text, 'res.text is a string');
            assert.deepEqual(
              res.text,
              'no book exists',
              'res.text string correct'
            );
          });
        done();
      });
    });
  });
});
