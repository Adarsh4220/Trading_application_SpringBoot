import api from "./api";
import { AI_ENDPOINT } from "../config/apiConfig";

export const aiService = {
  isConfigured() {
    return Boolean(AI_ENDPOINT);
  },

  async sendMessage(message) {
    if (!AI_ENDPOINT) {
      const error = new Error(
        "CryptoX AI is not connected. The Spring Boot backend does not currently expose an AI assistant endpoint."
      );
      error.code = "AI_NOT_CONFIGURED";
      throw error;
    }

    const response = await api.post(AI_ENDPOINT, { message });
    return response.data;
  },
};
