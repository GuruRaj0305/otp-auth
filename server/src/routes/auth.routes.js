const express = require("express");

const {
  ACCESS_TOKEN_COOKIE_OPTIONS,
  getMe,
  requestOtp,
  verifyOtp,
} = require("../services/auth.service");

const router = express.Router();

router.post("/request-otp", async (req, res, next) => {
  try {
    const result = await requestOtp(req.body);
    return res.status(result.status).json(result.body);
  } catch (error) {
    return next(error);
  }
});

router.post("/verify-otp", async (req, res, next) => {
  try {
    const result = await verifyOtp(req.body);

    if (result.cookie) {
      res.cookie(result.cookie.name, result.cookie.value, result.cookie.options);
    }

    return res.status(result.status).json(result.body);
  } catch (error) {
    return next(error);
  }
});

router.get("/me", async (req, res, next) => {
  try {
    const result = await getMe(req);

    if (result.clearCookie) {
      res.clearCookie("accessToken", {
        path: ACCESS_TOKEN_COOKIE_OPTIONS.path,
        sameSite: ACCESS_TOKEN_COOKIE_OPTIONS.sameSite,
        secure: ACCESS_TOKEN_COOKIE_OPTIONS.secure,
        httpOnly: ACCESS_TOKEN_COOKIE_OPTIONS.httpOnly,
      });
    }

    return res.status(result.status).json(result.body);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
