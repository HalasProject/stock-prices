'use strict';
const axios = require('axios');
const Stock = require('../models/stock');

async function getStockPrice(stock, like, ip) {
  const response = await axios.get(process.env.STOCK_API.replace('SYMBOL',stock));
  const { close, symbol} = response.data;
  const regex = new RegExp('^' + stock + '$', "i");    
  let doc = await Stock.findOne({'stock': { $regex : regex } });
  if (!doc){
    doc = new Stock({stock: stock.trim(), likes: []});
    if (like) doc.likes.push(ip);
    doc.save(function (err) {
      if (err) return handleError(err);
      // saved!
    });
  } else {
    if (like && !doc.likes.includes(ip)){
      doc.likes.push(ip);
    }
    if (like == false && doc.likes.includes(ip)){
      var index = doc.likes.indexOf(ip);
      doc.likes.splice(index, 1);
    }
    doc.save(function (err) {
      if (err) return handleError(err);
      // saved!
    });
  }
  return {
    stock: symbol,
    price: close,
    likes: doc.likes ? doc.likes.length : 0
  };
}


module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(async function (req, res){
      const {stock,like} = req.query;
      let isLikeTrue = (like === 'true')
      const ip = req.ip;
      let result = [];
      if (typeof(stock) === 'object' && stock.length > 1) {
        for (const stc of stock){
          let response = await getStockPrice(stc, isLikeTrue, ip)
          response.rel_likes = response.likes;
          delete response.likes
          result.push(response)
        }
      } else {
        result = await getStockPrice(stock, isLikeTrue, ip)
      };
      console.log(result);
      res.json({stockData:result});
  });
};
