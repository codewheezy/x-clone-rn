import { aj } from "../config/arcjet.js"
import { HttpStatus } from "../constant/http-status.js";

export const arcjetMiddleware = async (req, res, next) => {
  try {
    const decision = await aj.protect(req, {
      requested: 1 // each request consumes 1 token
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({
          error: "Too Many Requests",
          message: "Rate limit exceeded. Please try again later."
        })
      } else if (decision.reason.isBot()) {
        return res.status(HttpStatus.FORBIDDEN).json({
          error: "No bots allowed",
          message: "Automated requests are not allowed."
        })
      } else {
        return res.status(HttpStatus.FORBIDDEN).json({
          error: "Forbidden",
          message: "Access denied by security policy"
        })
      }
    }

    if (decision.results.some((result) => results.reason.isBot() && result.reason.isSpoofed())) {
      return res.status(HttpStatus.FORBIDDEN).json({
        error: "Spoofed bot detected",
        message: "Malicious bot activity detected.",
      })
    }
  } catch (error) {

  }
}