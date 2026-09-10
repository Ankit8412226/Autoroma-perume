import api from './api';

export const inquiriesService = {
  getInquiries: async () => {
    const response = await api.get('/inquiries');
    return response.data;
  },
  updateInquiryStatus: async (id: string, statusData: { status?: string; assignedAgentId?: string }) => {
    const response = await api.put(`/inquiries/${id}/status`, statusData);
    return response.data;
  }
};
