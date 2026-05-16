const crypto = require("crypto");
const { ACCESS_TOKEN_EXPIRES_IN, JWT_SECRET } = require("../config/config");

const jwtSecret = JWT_SECRET || "change-this-jwt-secret";

const base64UrlEncode = (value) => Buffer
  .from(JSON.stringify(value))
  .toString("base64url");

const signAccessToken = (payload) => {
  const now = Math.floor(Date.now() / 1000);
  const header = {
    alg: "HS256",
    typ: "JWT",
  };
  const tokenPayload = {
    ...payload,
    iat: now,
    exp: now + ACCESS_TOKEN_EXPIRES_IN,
  };
  const unsignedToken = `${base64UrlEncode(header)}.${base64UrlEncode(tokenPayload)}`;
  const signature = crypto
    .createHmac("sha256", jwtSecret)
    .update(unsignedToken)
    .digest("base64url");

  return `${unsignedToken}.${signature}`;
};

const verifyAccessToken = (token) => {
  try {
    const [encodedHeader, encodedPayload, signature] = String(token || "").split(".");

    if (!encodedHeader || !encodedPayload || !signature) return null;

    const expectedSignature = crypto
      .createHmac("sha256", jwtSecret)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest("base64url");

    const signatureBuffer = Buffer.from(signature);
    const expectedSignatureBuffer = Buffer.from(expectedSignature);

    if (
      signatureBuffer.length !== expectedSignatureBuffer.length ||
      !crypto.timingSafeEqual(signatureBuffer, expectedSignatureBuffer)
    ) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));

    if (!payload.exp || payload.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch (error) {
    return null;
  }
};

module.exports = {
  signAccessToken,
  verifyAccessToken,
};
