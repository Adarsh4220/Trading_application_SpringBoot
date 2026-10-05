import api from "./api";

export const tradingService = {
  buy({ coinId, amount }) {
    return api.post("/trading/buy", { coinId, amount }).then((res) => res.data);
  },

  sell({ coinId, quantity }) {
    return api.post("/trading/sell", { coinId, quantity }).then((res) => res.data);
  },
};
