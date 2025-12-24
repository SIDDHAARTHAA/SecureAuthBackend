export const errorHandler = (err, req, res, next) => {
    console.error({
        level: "error",
        message: err.message,
        statusCode: err.statusCode || 500,
        route: req.originalUrl,
        method: req.method,
        requestId: req.requestId,
    })

    return res.status(err.statusCode || 500).json({
        message: err.message
    });
};