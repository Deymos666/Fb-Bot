
const bby = require('bestbuy')('TGp7jkZIbKOzfRTDzkofjo2O')
const skuKey = [1014213];

return new Promise( (resolve, reject) => {
  bby.products(`sku=${skuKey}`, {show:'plot,name,sku,image'})
  .then(function(data){
    if (data === 0) console.log('No products found');
    else resolve(data.products);
    console.log(data.products);
  })
  .then(function(err){
    reject(err);
  });
})