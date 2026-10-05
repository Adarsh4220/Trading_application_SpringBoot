import api from "./api";

function asText(data) {
  if (data === null || data === undefined) return "";
  if (typeof data === "string") return data;
  return String(data);
}

export const authService = {
  register(payload) {
    return api.post("/auth/register", {
      name: payload.name,
      email: payload.email,
      password: payload.password,
    }).then((res) => asText(res.data));
  },

  login(payload) {
    return api.post("/auth/login", {
      email: payload.email,
      password: payload.password,
    }).then((res) => asText(res.data));
  },

  sendOtp(email) {
    return api
      .post("/auth/send-otp", null, { params: { email } })
      .then((res) => asText(res.data));
  },

  verifyOtp({ email, otp }) {
    return api
      .post("/auth/verify-otp", { email, otp })
      .then((res) => asText(res.data));
  },

  verifyLoginOtp({ email, otp }) {
    return api
      .post("/auth/verify-login-otp", { email, otp })
      .then((res) => asText(res.data));
  },

  forgotPassword(email) {
    return api
      .post("/auth/forgot-password", { email })
      .then((res) => asText(res.data));
  },

  resetPassword({ email, otp, newPassword }) {
    return api
      .post("/auth/reset-password", { email, otp, newPassword })
      .then((res) => asText(res.data));
  },

  enableTwoFactor() {
    return api.post("/auth/2fa/enable").then((res) => asText(res.data));
  },
};
