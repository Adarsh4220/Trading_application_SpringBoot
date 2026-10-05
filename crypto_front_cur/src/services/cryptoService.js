import api from "./api";
import { coinPriceFromDetails } from "../utils/format";

export const cryptoService = {
  getMarkets(page = 1, size = 100) {
    return api
      .get("/crypto/markets", { params: { page, size } })
      .then((res) => res.data);
  },

  searchCoins(query) {
    return api
      .get("/crypto/search", { params: { query } })
      .then((res) => res.data);
  },

  getCoinDetails(id) {
    return api.get(`/crypto/${id}`).then((res) => res.data);
  },

  getCoinChart(id, days = 1) {
    return api
      .get(`/crypto/${id}/chart`, { params: { days } })
      .then((res) => res.data);
  },

  async getCurrentPrice(id) {
    const details = await api.get(`/crypto/${id}`).then((res) => res.data);
    return coinPriceFromDetails(details);
  },
};
