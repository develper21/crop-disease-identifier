import { apiService } from './apiService';

export interface ScanRecord {
  id?: number;
  userId: number;
  imageUrl: string;
  prediction: any;
  confidence: number;
  notes?: string;
  isLowConf?: boolean;
  createdAt?: string;
}

export interface ScanListResponse {
  scans: ScanRecord[];
  total: number;
  page: number;
  limit: number;
}

export async function uploadImage(userId: number, localUri: string): Promise<{ publicURL: string }> {
  const formData = new FormData();
  formData.append('image', {
    uri: localUri,
    type: 'image/jpeg',
    name: 'scan.jpg',
  } as any);
  formData.append('userId', userId.toString());

  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/scans/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${apiService.getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return { publicURL: data.imageUrl };
  } catch (error) {
    console.error('Upload error:', error);
    // Fallback to a placeholder or return the local URI
    return { publicURL: localUri };
  }
}

export async function saveScanRecord(scan: Omit<ScanRecord, 'id' | 'createdAt'>) {
  const response = await apiService.post<ScanRecord>('/scans', scan);
  return response.data;
}

export async function getUserScans(userId: number, params?: { page?: number; limit?: number }) {
  const searchParams = new URLSearchParams();
  searchParams.append('userId', userId.toString());
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());

  const endpoint = `/scans?${searchParams.toString()}`;
  const response = await apiService.get<ScanListResponse>(endpoint);
  return response.data?.scans || [];
}

export async function getScanById(scanId: number) {
  const response = await apiService.get<ScanRecord>(`/scans/${scanId}`);
  return response.data || null;
}

export async function updateScanRecord(scanId: number, updates: Partial<ScanRecord>) {
  const response = await apiService.put<ScanRecord>(`/scans/${scanId}`, updates);
  return response.data;
}

export async function deleteScanRecord(scanId: number) {
  const response = await apiService.delete(`/scans/${scanId}`);
  return response.data;
}

export async function getRecentScans(userId: number, limit: number = 10) {
  return getUserScans(userId, { page: 1, limit });
}

