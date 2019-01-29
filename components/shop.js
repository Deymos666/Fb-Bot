const bestBuy = require('bestbuy')("TGp7jkZIbKOzfRTDzkofjo2O")




module.exports.findProduct = async function(){
  return new Promise( (resolve, reject) => {
    bestBuy.products('type=Movie', {show:'image,name,sku',page:7,pageSize:7})
    .then(function(data){
      if (data === 0) console.log('No products found');
      else resolve(data.products);
    })
    .then(function(err){
      reject(err);
    });
  })

};
