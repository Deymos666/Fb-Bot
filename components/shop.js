// const bestBuy = require('bestbuy')("TGp7jkZIbKOzfRTDzkofjo2O")
const bbyApiKey = process.env.bby_api_key
const bby = require('bestbuy')(bbyApiKey)




// module.exports.findProduct = async function(){
//   return new Promise( (resolve, reject) => {
//     bby.products('type=Movie', {show:'image,name,sku',page:7,pageSize:7})
//     .then(function(data){
//       if (data === 0) console.log('No products found');
//       else resolve(data.products);
//     })
//     .then(function(err){
//       reject(err);
//     });
//   })

// };

module.exports.findProduct = async () => {
  try {
    const products = await bby.products('type=Movie', {show:'image,name,sku',page:7,pageSize:7});
    return products.products;
  } catch (error) {
    return error;
  }
  

};


module.exports.viewProduct = async function(payloadFavouriteSKU)  {
  return new Promise( (resolve, reject) => {
    bby.products(`sku=${payloadFavouriteSKU}`, {show:'plot,name,sku,image'})
    .then(function(data){
      console.log(data);
      if (data === 0) console.log('No products found');
      else resolve(data.products);
      console.log(data.products);
    })
    .then(function(err){
      reject(err);
    });
  })
};


