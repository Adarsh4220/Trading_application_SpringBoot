import api from "./api";

export const portfolioService = {
  getPortfolio() {
    return api.get("/portfolio").then((res) => res.data);
  },
};
