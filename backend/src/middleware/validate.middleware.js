import { ZodError } from "zod";
import { HttpStatus } from "../constant/http-status.js";

/**
 * Generates an Express middleware that validates a part of the request using a Zod schema.
 *
 * @param {import('zod').ZodTypeAny} schema - Zod schema to validate against
 * @param {'body'|'params'|'query'|'headers'} source - Which part of req to validate
 */
export function validate(schema, source = "body") {
  return (req, res, next) => {
    try {
      const data = req[source] ?? {};
      const parsed = schema.parse(data);
      // assign parsed data back to request to use refined/transformed values downstream
      req[source] = parsed;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: "Invalid request",
          details: err.errors.map((e) => ({
            path: e.path.join("."),
            message: e.message,
          })),
        });
      }
      next(err);
    }
  };
}
