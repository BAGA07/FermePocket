// src/services/financeService.js
import api from '../api/axios';

const financeService = {
  getTransactions: async () => {
    const res = await api.get('/transactions', { withCredentials: true });
    return res.data;
  },
  addTransaction: async (data) => {
    const res = await api.post('/transactions', data, { withCredentials: true });
    return res.data;
  },
  getClients: async () => {
    const res = await api.get('/clients', { withCredentials: true });
    return res.data;
  },
  getFactures: async () => {
    const res = await api.get('/factures', { withCredentials: true });
    return res.data;
  },
  addFacture: async (data) => {
    const res = await api.post('/factures', data, { withCredentials: true });
    return res.data;
  },
  addLigne: async (factureId, data) => {
    const res = await api.post('/lignes-factures', { ...data, facture_id: factureId }, { withCredentials: true });
    return res.data;
  }
};

export default financeService;
