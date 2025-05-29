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
  return async (req, res, next) => {
    try {
      console.log(req[target]);
      const validated = await schema.validate(req[target], {
        abortEarly: false,
        stripUnknown: true,
      });

      Object.defineProperty(req, target, {
        value: validated,
        writable: true,
        configurable: true,
        enumerable: true,
      });

      next();
    } catch (error) {
      if (error.name === "ValidationError") {
        return errorResponse({
          res,
          status: 400,
          message: error.errors[0],
        });
      }
      console.log(`❌ Error validating request ${target}: `, error);
      return errorResponse({
        res,
        status: 500,
        message: `Internal Server Error while validating request ${target}.`,
      });
    }
  };
};
