import limiter from "express-rate-limit";

const limit = limiter({
  windowMs: 5 * 60 * 1000,
  max: 100,
  message: "Excessive amount of requests, blocked for 5 minutes.",
  standardHeaders: true,
});


export default limit