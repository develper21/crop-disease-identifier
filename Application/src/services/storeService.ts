import { apiService } from './apiService';

export interface Product {
  id: number;
  name: string;
  category: 'organic' | 'inorganic' | string;
  target_diseases?: string[] | null;
  description?: string | null;
  price?: number | null;
  image_url?: string | null;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

export async function listProducts(params?: { 
  query?: string; 
  category?: string; 
  disease?: string;
  page?: number;
  limit?: number;
}) {
  const searchParams = new URLSearchParams();
  
  if (params?.query) searchParams.append('query', params.query);
  if (params?.category) searchParams.append('category', params.category);
  if (params?.disease) searchParams.append('disease', params.disease);
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());

  const endpoint = `/products${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  
  const response = await apiService.get<ProductListResponse>(endpoint);
  return response.data?.products || [];
}

export async function getProduct(id: number) {
  const response = await apiService.get<Product>(`/products/${id}`);
  return response.data || null;
}

export async function createProduct(product: Omit<Product, 'id'>) {
  const response = await apiService.post<Product>('/products', product);
  return response.data;
}

export async function updateProduct(id: number, product: Partial<Product>) {
  const response = await apiService.put<Product>(`/products/${id}`, product);
  return response.data;
}

export async function deleteProduct(id: number) {
  const response = await apiService.delete(`/products/${id}`);
  return response.data;
}

export async function searchProducts(query: string) {
  return listProducts({ query });
}

export async function getProductsByCategory(category: string) {
  return listProducts({ category });
}

export async function getProductsByDisease(disease: string) {
  return listProducts({ disease });
}



