import { apiService } from './apiService';

export interface DiseaseSolution {
  id: number;
  name: string;
  commonNames?: string[] | null;
  description?: string | null;
  solutions?: string[] | null;
  createdAt?: string;
}

export interface DiseaseListResponse {
  diseases: DiseaseSolution[];
  total: number;
  page: number;
  limit: number;
}

export async function searchDiseaseSolutions(query: string, params?: { page?: number; limit?: number }) {
  const searchParams = new URLSearchParams();
  searchParams.append('query', query);
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());

  const endpoint = `/diseases/search?${searchParams.toString()}`;
  const response = await apiService.get<DiseaseListResponse>(endpoint);
  return response.data?.diseases || [];
}

export async function getAllDiseases(params?: { page?: number; limit?: number }) {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());

  const endpoint = `/diseases${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  const response = await apiService.get<DiseaseListResponse>(endpoint);
  return response.data?.diseases || [];
}

export async function getDiseaseById(id: number) {
  const response = await apiService.get<DiseaseSolution>(`/diseases/${id}`);
  return response.data || null;
}

export async function createDisease(disease: Omit<DiseaseSolution, 'id' | 'createdAt'>) {
  const response = await apiService.post<DiseaseSolution>('/diseases', disease);
  return response.data;
}

export async function updateDisease(id: number, updates: Partial<DiseaseSolution>) {
  const response = await apiService.put<DiseaseSolution>(`/diseases/${id}`, updates);
  return response.data;
}

export async function deleteDisease(id: number) {
  const response = await apiService.delete(`/diseases/${id}`);
  return response.data;
}

export async function getDiseasesByCommonName(commonName: string) {
  const response = await apiService.get<DiseaseListResponse>(`/diseases/common/${encodeURIComponent(commonName)}`);
  return response.data?.diseases || [];
}



