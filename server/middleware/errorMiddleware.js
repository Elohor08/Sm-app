//UNSUPPORTED ENDPOINTS
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next()
}

const errorHandler = (err, req, res, next) => {
    if(res.headerSent){
        return next(err)
    }
    res.status(err.statusCode || 500).json({message: err.message || "An error occurred"});
}

module.exports = { notFound, errorHandler };