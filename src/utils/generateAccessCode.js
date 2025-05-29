/**
 * Generate a random 6-digit numeric access code as a string.
 *
 * @function generateAccessCode
 * 
 * @returns {string} A random 6-digit string
 */
export const generateAccessCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();
