const { RateLimiterMemory } = require('rate-limiter-flexible');
// bardzo dobrze opisana biblioteka na homePage

const rateLimiter = new RateLimiterMemory({
    points: 10, // ile połączeń
    duration: 1, // w ciągu 1s
});

const rateLimiterMiddleware = (req, res, next) => {
    rateLimiter.consume(req.ip)
        .then(() => {
            next();
        })
        .catch(() => {
            res.status(429).send('Too many requests'); // 429 - zbyt wiele połączeń
        })
}

module.exports = rateLimiterMiddleware;