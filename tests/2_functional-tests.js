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
              assert.isObject(res.body._id, 'res.body._id is object');
              assert.property(res.body._id, '_id', 'res.body has _id');
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
              assert.isString(res.body, 'res.body is string');
              assert.equal(
                res.body,
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
        //done();
      });

      test('Test GET /api/books/[id] with valid id in db', function (done) {
        //done();
      });
    });

    suite(
      'POST /api/books/[id] => add comment/expect book object with id',
      function () {
        test('Test POST /api/books/[id] with comment', function (done) {
          //done();
        });

        test('Test POST /api/books/[id] without comment field', function (done) {
          //done();
        });

        test('Test POST /api/books/[id] with comment, id not in db', function (done) {
          //done();
        });
      }
    );

    suite('DELETE /api/books/[id] => delete book object id', function () {
      test('Test DELETE /api/books/[id] with valid id in db', function (done) {
        //done();
      });

      test('Test DELETE /api/books/[id] with  id not in db', function (done) {
        //done();
      });
    });
  });
});
