export const rateLimitConfig = {
    max: 500,
    timeWindow: '1 minute',
    errorResponseBuilder: () => ({
        error: "TOO_MANY_REQUESTS",
        message: "Rate limit exceeded, please slow down"
    })
};