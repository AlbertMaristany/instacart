class BelvoError extends Error {
    constructor(message, name, httpCode) {
        super(message)
        this.name = name || "BadRequest"
        this.httpCode = httpCode || 400
    }
}

module.exports = BelvoError