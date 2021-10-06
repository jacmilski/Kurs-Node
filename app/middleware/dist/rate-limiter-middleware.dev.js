"use strict";

var _require = require('rate-limiter-flexible'),
    RateLimiterMemory = _require.RateLimiterMemory; // bardzo dobrze opisana biblioteka na homePage


var rateLimiter = new RateLimiterMemory({
  points: 10,
  // ile połączeń
  duration: 1 // w ciągu 1s

});

var rateLimiterMiddleware = function rateLimiterMiddleware(req, res, next) {
  rateLimiter.consume(req.ip).then(function () {
    next();
  })["catch"](function () {
    res.status(429).send('Too many requests'); // 429 - zbyt wiele połączeń
  });
};

module.exports = rateLimiterMiddleware;