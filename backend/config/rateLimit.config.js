export const rateLimitConfig = {
    keyGenerator: function (request) {
        if (request.user.userId && request.ip)
            return request.user.userId;
        return request.ip;
    },
    max: 100,
    timeWindow: '1 minute',
    errorResponseBuilder: () => ({
        error: "TOO_MANY_REQUESTS",
        message: "Rate limit exceeded, please slow down"
    })
};