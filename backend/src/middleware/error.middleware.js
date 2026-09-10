const errmiddleware = async (err, req, res, next) => {
    const statuscode = err.statusCode || err.statuscode || 500;
    const message = err.message || "internal server error";

    res.status(statuscode).json({
        success: false,
        message,
    });
};

export default errmiddleware;