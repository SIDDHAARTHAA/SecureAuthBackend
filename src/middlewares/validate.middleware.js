export const validate = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            // result.error contains the Zod failure details
            const err = new Error(result.error.issues[0]?.message || "Validation failed");
            err.statusCode = 400;
            return next(err); // Pass the error to the next error-handling middleware
        }

        req.body = result.data;
        next();
    };
};