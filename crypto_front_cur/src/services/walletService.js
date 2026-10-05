import api from "./api";

export const walletService = {
  getWallet() {
    return api.get("/wallet").then((res) => res.data);
  },

  deposit(amount) {
    return api.post("/wallet/deposit", { amount }).then((res) => res.data);
  },

  withdraw(amount) {
    return api.post("/wallet/withdraw", { amount }).then((res) => res.data);
  },
};
