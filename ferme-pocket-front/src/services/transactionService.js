import axios from "@/lib/axios"; // ton axios configuré avec Sanctum

export const transactionService = {
  getAll: () => axios.get("/transactions"),
  getOne: (id) => axios.get(`/transactions/${id}`),
  create: (data) => axios.post("/transactions", data),
  update: (id, data) => axios.put(`/transactions/${id}`, data),
  remove: (id) => axios.delete(`/transactions/${id}`),
};
