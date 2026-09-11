import api from './api';
import { ListingProperty } from '../types';

export async function fetchProperties(): Promise<ListingProperty[]> {
  const res = await api.get('/properties');
  return Array.isArray(res.data) ? res.data : [];
}

export async function createProperty(payload: Partial<ListingProperty>) {
  const res = await api.post('/properties', payload);
  return res.data;
}

export async function updateProperty(id: string, payload: Partial<ListingProperty>) {
  const res = await api.put(`/properties/${id}`, payload);
  return res.data;
}

export async function deleteProperty(id: string) {
  const res = await api.delete(`/properties/${id}`);
  return res.data;
}
