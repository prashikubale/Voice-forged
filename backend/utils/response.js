// ============================================================
// Response — Standardized API response format
// ============================================================

class ApiResponse {
    static success(res, { data = null, message = 'Success', statusCode = 200 } = {}) {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
            timestamp: new Date().toISOString(),
        });
    }

    static error(res, { message = 'Internal Server Error', statusCode = 500, errors = null } = {}) {
        const response = {
            success: false,
            message,
            timestamp: new Date().toISOString(),
        };
        if (errors) response.errors = errors;
        return res.status(statusCode).json(response);
    }

    static created(res, { data = null, message = 'Resource created' } = {}) {
        return ApiResponse.success(res, { data, message, statusCode: 201 });
    }

    static badRequest(res, message = 'Bad Request', errors = null) {
        return ApiResponse.error(res, { message, statusCode: 400, errors });
    }

    static unauthorized(res, message = 'Unauthorized') {
        return ApiResponse.error(res, { message, statusCode: 401 });
    }

    static tooMany(res, message = 'Too many requests') {
        return ApiResponse.error(res, { message, statusCode: 429 });
    }
}

module.exports = ApiResponse;
