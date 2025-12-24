export const tracer = (req, res, next) => {
    res.on("finish", () => {
        if (process.env.NODE_ENV === "development") {
            console.log(
                `Request ${req.requestId} trace:\n- ${req.trace.join("\n- ")}`
            );
        }
    });
    next();
};