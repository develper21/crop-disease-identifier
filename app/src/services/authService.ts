import { apiService } from './apiService';

export interface User {
  id: number;
  email: string;
  fullName?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export async function signUp(email: string, password: string, fullName?: string) {
  const response = await apiService.post<AuthResponse>('/auth/register', {
    email,
    password,
    fullName,
  });

  if (response.data) {
    await apiService.setToken(response.data.token);
  }

  return response;
}

export async function signIn(email: string, password: string) {
  const response = await apiService.post<AuthResponse>('/auth/login', {
    email,
    password,
  });

  if (response.data) {
    await apiService.setToken(response.data.token);
  }

  return response;
}

export async function signOut() {
  await apiService.clearToken();
  return { error: undefined };
}

export async function getUser() {
  const token = apiService.getToken();
  if (!token) {
    return { user: null, error: 'No token found' };
  }

  const response = await apiService.get<{ user: User }>('/auth/me');
  return { user: response.data?.user || null, error: response.error };
}

export async function getSession() {
  const token = apiService.getToken();
  if (!token) {
    return { session: null, error: 'No token found' };
  }

  const response = await apiService.get<{ user: User }>('/auth/me');
  return { 
    session: response.data ? { user: response.data.user, token } : null, 
    error: response.error 
  };
}

export function onAuthStateChange(
  callback: (event: string, session: any) => void
) {
  // For React Native, we'll use a simple interval to check auth state
  // In a real app, you might want to use event emitters or context providers
  let lastToken = apiService.getToken();
  
  const interval = setInterval(async () => {
    const currentToken = apiService.getToken();
    if (currentToken !== lastToken) {
      lastToken = currentToken;
      const session = currentToken ? await getSession() : { session: null };
      callback(currentToken ? 'SIGNED_IN' : 'SIGNED_OUT', session.session);
    }
  }, 1000);

  return {
    unsubscribe: () => clearInterval(interval),
  };
}
