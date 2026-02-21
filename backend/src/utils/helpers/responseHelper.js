/**
 * Response helper functions for consistent API responses
 */

/**
 * Send success response
 * @param {Object} res - Express response object
 * @param {any} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code (default: 200)
 */
const sendSuccess = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {Object} additionalData - Additional error data
 */
const sendError = (res, message = 'Internal server error', statusCode = 500, additionalData = null) => {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString()
  };
  
  if (additionalData) {
    response.error = additionalData;
  }
  
  return res.status(statusCode).json(response);
};

module.exports = {
  sendSuccess,
  sendError
};