import { errorResponse } from "../helpers/responses/response.js";

/**
 * Middleware to validate request data (body, query, or params) against a Yup schema.
 *
 * @param {Object} schema - A Yup schema object used to validate the incoming request data.
 * @param {string} [target="body"] - The request property to validate: 'body', 'query', or 'params'.
 * @returns {Function} Express middleware function that validates the specified part of the request.
 *
 * @example
 * app.post('/example', validateSchema(exampleSchema), controllerFunction);
 */
export const validateSchema = (schema, target = "body") => {
  // target = 'body', 'query', or 'params'
  return async (req, res, next) => {
    try {
      const data = req[target];
      const validated = await schema.validate(data, {
        abortEarly: false,
        stripUnknown: true,
      });
      req[target] = validated;
      next();
    } catch (error) {
      if (error.name === "ValidationError") {
        return errorResponse({
          res,
          status: 400,
          success: false,
          message: "Validation failed",
          error: error.errors[0],
        });
      }

      next(error);
    }
  };
};
