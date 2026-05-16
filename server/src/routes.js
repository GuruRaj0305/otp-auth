const express = require("express");

const router = express.Router();



// Health check endpoint, also containes in gateway health check, but this is for direct access to server health check
router.get("/_healthz", (req, res) => {
  console.log("Health check endpoint hit");
  return res.status(200).json({
    success: true,
    message: "Server is running successfully",
  });
});

router.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});


router.use('/auth', require('./routes/auth.routes'));



module.exports = router;
