//makes error res in json format
const errorHandler = (err, req, res, next) =>{
    const statusCode = res.statusCode ? res.statusCode : 500

    res.status(statusCode)

    res.json({
        message : err.message,
        stack : process.env.NODE_ENV === 'production' ? null : err.stack // if code is in product stack will be null otherwise it will tell you where the error is
    })
}

module.exports = {
    errorHandler,
}