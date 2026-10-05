import api from "./api";

export const transactionService = {
  getTransactions() {
    return api.get("/wallet/transactions").then((res) => res.data);
  },
};
