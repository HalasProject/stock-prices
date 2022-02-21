const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const { expect } = require('chai');
const Stock = require('../models/stock');

chai.use(chaiHttp);

suite('Functional Tests', function() {

    this.beforeAll(function (done){
        Stock.deleteMany({}, (err) => {
          if (err) {
            console.error('Error deleting all documents from collection');
            throw err;
          }
          done();
        });
      });
  

    test('Should viewing one stock',function(done) {
        // viewing one stock: GET request to /api/stock-prices/
        chai.request(server).get('/api/stock-prices?stock=goog').end(function(err, res){
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            assert.equal(res.body.stockData.stock, 'GOOG');
            assert.equal(res.body.stockData.price, '2609.35');
            done();
        });
    })
   

   
    test("Should viewing one stock and liking it",function (done){
        chai.request(server).get('/api/stock-prices?stock=goog&like=true').end(function(err, res){
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            assert.equal(res.body.stockData.stock, 'GOOG');
            assert.equal(res.body.stockData.price, '2609.35');
            assert.isNumber(res.body.stockData.likes);
            done();
        });
    })
  

    test('Should viewing the same stock and liking it again',function (done) {
        chai.request(server).get('/api/stock-prices?stock=goog&like=true').end(function(err, res){
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            assert.equal(res.body.stockData.stock, 'GOOG');
            assert.equal(res.body.stockData.price, '2609.35');
            assert.isNumber(res.body.stockData.likes);
            done();
        });
    });
 

    test("Should viewing two stocks",function (done) {
        chai.request(server).get('/api/stock-prices?stock=goog&stock=msft').end(function(err, res){
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            assert.equal(res.body.stockData[0].stock, 'GOOG');
            assert.equal(res.body.stockData[0].price, '2609.35');
            assert.equal(res.body.stockData[1].stock, 'MSFT');
            assert.equal(res.body.stockData[1].price, '287.93');
            done();
        });
    });
    

    test("Should viewing two stocks and liking them",function(done) {
        chai.request(server).get('/api/stock-prices?stock=goog&stock=msft&like=true').end(function(err, res){
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            assert.equal(res.body.stockData[0].stock, 'GOOG');
            assert.equal(res.body.stockData[0].price, '2609.35');
            assert.isNumber(res.body.stockData[0].rel_likes);
            assert.equal(res.body.stockData[1].stock, 'MSFT');
            assert.equal(res.body.stockData[1].price, '287.93');
            assert.isNumber(res.body.stockData[1].rel_likes);
            done();
        });
    })
});
