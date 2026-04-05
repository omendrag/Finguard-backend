"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errors_1 = require("../utils/errors");
const errorHandler = (err, req, res, next) => {
    console.error(err);
    if (err instanceof errors_1.AppError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message
        });
    }
    if (err.name === 'ZodError') {
        return res.status(400).json({
            status: 'fail',
            errors: err.errors
        });
    }
    return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error'
    });
};
exports.errorHandler = errorHandler;
