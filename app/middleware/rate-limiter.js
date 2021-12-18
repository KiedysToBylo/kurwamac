import { RateLimiterMemory } from "rate-limiter-flexible";

const rateLimiter = new RateLimiterMemory({
    points:50,//ile zapytań
    duration:1,//przez ile sekund
});

const rateLimiterMiddleware = (req, res, next) =>{
    rateLimiter.consume(req.ip)
    .then(() => {
        next();
    })
    .catch(() => {
        req.status(429).send('Too Many Requests')
    });
}

export default rateLimiterMiddleware;