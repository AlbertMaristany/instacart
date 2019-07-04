const BelvoError = require('./utils/error')
const instacart = require('./crawler/instacart')

const route = (app) => {

    /**
     * @api {get} /ping Ping
     * @apiGroup Belvo
     *
     * @apiSuccess {Object} success True if server is up
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *          "success": true
     *     }
     *
     */
    app.get('/ping', async (req, res, next) => {
        res.status(200).json({success: true})
    })

    /**
     * @api {get} /store Store
     * @apiGroup Belvo
     *
     * @apiParam {String} email Email of an Instacart user
     * @apiParam {String} password Password of the user
     *
     * @apiSuccess {Object} store Store information (name & logo)
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     "store": {
     *          "name": "LeBeau Nob Hill",
     *          "logo": "https://d2lnr5mha7bycj.cloudfront.net/warehouse/logo/631/2293fb92-3352-4114-8025-c055d198be15.png"
     *      }
     *
     * @apiError (401) Unauthorized {String} Login failed
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 401 Not Found
     *     {
     *       "code": "Unauthorized"
     *       "error": "Login failed"
     *     }
     */
    app.get('/store', async (req, res, next) => {
        try {
            let email = req.query.email
            let password = req.query.password

            if (!email || !password) {
                throw new BelvoError("Missing email or password", "MissingParams", 422)
            }

            let result = await instacart.getShopInfo(email, password)
            if (!result) {
                throw new BelvoError("Info not found", "NotFound", 404)
            } else {
                res.status(200).json({store: result})
            }
        } catch (e) {
            next(e)
        }
    })

    /**
     * @api {get} /store/items Items
     * @apiGroup Belvo
     *
     * @apiParam {String} email Email of an Instacart user
     * @apiParam {String} password Password of the user
     *
     * @apiSuccess {Object} items List of items available in store
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "items": {
     *           "Start with these essentials": [
     *               "Clover Sonoma Organic Whole Milk",
     *               "Avocado"
     *           ],
     *           "Coupons": [
     *               "Pacific Organic Soup White Bean Kale & Millet"
     *           ],
     *           "Snacks": [
     *               "Doritos Nacho Flavored Tortilla Chips"
     *           ]
     *     }
     *
     * @apiError (401) Unauthorized {String} Login failed
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 401 Not Found
     *     {
     *       "code": "Unauthorized"
     *       "error": "Login failed"
     *     }
     */
    app.get('/store/items', async (req, res, next) => {
        try {
            let email = req.query.email
            let password = req.query.password

            if (!email || !password) {
                throw new BelvoError("Missing email or password", "MissingParams", 422)
            }

            let result = await instacart.getShopItems(email, password)
            if (!result) {
                throw new BelvoError("Items not found", "NotFound", 404)
            } else {
                res.status(200).json({items: result})
            }
        } catch (e) {
            next(e)
        }
    })
}

module.exports = {
    route
}