"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        }
        catch (error) {
            if (error && error.name === 'ZodError') {
                return res.status(400).json({
                    status: 'fail',
                    errors: error.errors
                });
            }
            next(error);
        }
    };
};
exports.validate = validate;
