const logger = (req, res, next) => {
  const now = new Date().toISOString();
  const method = req.method;
  const url = req.url;

  console.log(`📋 [${now}] ${method} ${url}`);

  next(); // Always call next!
};

export default logger;