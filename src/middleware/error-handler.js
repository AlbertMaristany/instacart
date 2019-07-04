const BelvoError = require('../utils/error')

const errorHandler = (err, req, res, next) => {
    if (err instanceof BelvoError) {
        return res.status(err.httpCode).json({ code: err.name, error: err.message })
    }

    return res.status(500).json({ message: err.message })
}

module.exports = errorHandler