export const trace = (req, step) => {
    if(process.env.NODE_ENV === "development") {
        req.trace.push(step);
        console.log(`Trace: ${step}`);
    }
}