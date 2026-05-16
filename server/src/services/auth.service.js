const {
  ACCESS_TOKEN_COOKIE_OPTIONS,
  BLOCK_DURATION,
  MAX_OTP_ATTEMPTS,
  OTP_EXPIRATION_TIME,
} = require("../config/config");
const { User, Otp } = require("../models/index.model");
const {
  getRetryAfterSeconds,
  getUserSearch,
  hashValue,
  isEmail,
  isPhone,
  normalizeValue,
  sendOtp,
} = require("../util/auth");
const { signAccessToken, verifyAccessToken } = require("../util/jwt");
const { generateAndValidateOtp } = require("../util/otp");

const invalidTokenResponse = {
  status: 401,
  clearCookie: true,
  body: {
    success: false,
    message: "Invalid or expired access token",
  },
};

const getAccessToken = (req) => {
  if (req.headers.authorization?.startsWith("Bearer ")) {
    return req.headers.authorization.slice("Bearer ".length);
  }

  return req.cookies?.accessToken;
};

const requestOtp = async (body = {}) => {
  const identifier = String(body.identifier || "").trim();

  if (!identifier || (!isEmail(identifier) && !isPhone(identifier))) {
    return {
      status: 400,
      body: {
        success: false,
        message: "Please provide a valid email or phone number",
      },
    };
  }

  console.log(`OTP request received for identifier: ${identifier}`);
  console.log(`Searching for user with ${ getUserSearch(identifier).emailId ? "emailId" : "phoneNumber" } = ${identifier}`);

  const user = await User.findOne({ where: getUserSearch(identifier) });

  console.log(`User ${user ? "found" : "not found"} for identifier: ${identifier}`);

  if (!user) {
    return {
      status: 404,
      body: {
        success: false,
        message: "User not found",
      },
    };
  }

  if (user.blockedUntil && user.blockedUntil.getTime() > Date.now()) {
    return {
      status: 409,
      body: {
        success: false,
        message: "Too many attempts. Wait for some time and try again.",
      },
    };
  }

  const otp = generateAndValidateOtp();

  await Otp.upsert({
    userId: user.id,
    otpHash: hashValue(otp),
    attempts: 0,
    expiresAt: new Date(Date.now() + OTP_EXPIRATION_TIME),
  });

  sendOtp(identifier, otp);

  return {
    status: 200,
    body: {
      success: true,
      message: "OTP sent successfully for your " + identifier,
    },
  };
};

const verifyOtp = async (body = {}) => {
  const identifier =  String(body.identifier || "").trim();
  const otp = String(body.otp || "").trim();

  if (!identifier || !otp) {
    return {
      status: 400,
      body: {
        success: false,
        message: "Identifier and OTP are required",
      },
    };
  }

  const user = await User.findOne({ where: getUserSearch(identifier) });

  if (!user) {
    return {
      status: 404,
      body: {
        success: false,
        message: "User not found",
      },
    };
  }

  const record = await Otp.findOne({ where: { userId: user.id } });

  if (user?.blockedUntil && user.blockedUntil.getTime() > Date.now()) {
    return {
      status: 423,
      body: {
        success: false,
        message: "Too many invalid attempts. Try again later.",
        retryAfterSeconds: getRetryAfterSeconds(user.blockedUntil.getTime()),
      },
    };
  }

  if (!record) {
    return {
      status: 400,
      body: {
        success: false,
        message: "OTP not requested or expired",
      },
    };
  }

  if (record.expiresAt.getTime() <= Date.now()) {
    await record.destroy();

    return {
      status: 400,
      body: {
        success: false,
        message: "OTP has expired",
      },
    };
  }

  if (record.otpHash !== hashValue(otp)) {
    const attempts = record.attempts + 1;

    if (attempts >= MAX_OTP_ATTEMPTS) {
      const blockedUntil = new Date(Date.now() + BLOCK_DURATION);

      await record.update({
        otpHash: null,
        attempts: attempts,
        expiresAt: blockedUntil,
      });
      await user.update({ blockedUntil });

      return {
        status: 423,
        body: {
          success: false,
          message: "Too many invalid attempts. Identifier blocked for 10 minutes.",
          retryAfterSeconds: getRetryAfterSeconds(blockedUntil.getTime()),
        },
      };
    }

    await record.update({ attempts });

    return {
      status: 401,
      body: {
        success: false,
        message: "Invalid OTP",
        attemptsRemaining: MAX_OTP_ATTEMPTS - attempts,
      },
    };
  }

  await record.destroy();
  await user.update({ blockedUntil: null });

  const token = signAccessToken({
    userId: user.id,
    emailId: user.emailId,
    phoneNumber: user.phoneNumber,
  });

  return {
    status: 200,
    cookie: {
      name: "accessToken",
      value: token,
      options: ACCESS_TOKEN_COOKIE_OPTIONS,
    },
    body: {
      success: true,
      message: "OTP verified successfully",
      token,
    },
  };
};

const getMe = async (req) => {
  const payload = verifyAccessToken(getAccessToken(req));

  if (!payload?.userId) {
    return invalidTokenResponse;
  }

  const user = await User.findByPk(payload.userId, {
    attributes: ["id", "name", "gender", "emailId", "phoneNumber"],
  });

  if (!user) {
    return invalidTokenResponse;
  }

  return {
    status: 200,
    body: {
      success: true,
      user,
    },
  };
};

module.exports = {
  ACCESS_TOKEN_COOKIE_OPTIONS,
  getMe,
  requestOtp,
  verifyOtp,
};
