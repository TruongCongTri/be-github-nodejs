

/**
 * Generate SMS message with access code and time limit.
 * @param {string} accessCode - One time use access code.
 * @param {string} expiresInMs - Time limit before access code expires.
 * 
 * @returns {string}
 */
export const createAccessMessage = (accessCode, expiresInMs) => {
  const minutes = Math.floor(expiresInMs / 60000);
  return `Your access code is: ${accessCode}. Only valid within ${minutes} minutes`;
};