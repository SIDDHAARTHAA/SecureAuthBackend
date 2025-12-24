//a utility function to log with details

export const log = ({ level, message, req, meta = {} }) => {
    const logEntry = {
        level,
        message,
        requestId: req?.requestId,
        method: req?.method,
        path: req?.originalUrl,
        ...meta,
        timestamp: new Date().toISOString()
    };

    console.log(JSON.stringify(logEntry));
};
