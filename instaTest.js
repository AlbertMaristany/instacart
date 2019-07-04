const instacart = require('./src/crawler/instacart')

const test = async () => {
    console.log('================================ SHOP TEST ================================')
    let result = await instacart.getShopInfo('bilbjdfgb@gmail.com', 'bilbjdfgb')
    console.log(result)
    console.log('================================ ITEM TEST ================================')
    result = await instacart.getShopItems('bilbjdfgb@gmail.com', 'bilbjdfgb')
    console.log(result)
    process.exit()
}

test()
