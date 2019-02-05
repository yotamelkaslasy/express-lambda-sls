// Handle not found errors
const notFound = (req, res, next) => {
  res.status(404);
  res.json({
    success: false,
    message: 'Requested Resource Not Found (404)'
  });
  res.end();
};

// Handle internal server errors
const internalServerError = (err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    errors: err
  });
  res.end();
};

module.exports = {
  notFound,
  internalServerError
}
