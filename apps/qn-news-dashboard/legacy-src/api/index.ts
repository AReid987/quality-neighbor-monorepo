import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If we get a 401 error and haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // In a real app, we would refresh the token here
        // For now, just clear auth and redirect to login
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
        return Promise.reject(error);
      } catch (refreshError) {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authApi = {
  login: (data: { username: string; password: string }) => {
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('password', data.password);
    return api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  },
    
  register: (userData: { email: string; username: string; password: string; full_name?: string }) => 
    api.post('/auth/register', userData),
    
  getProfile: () => 
    api.get('/users/me'),
};

// Users API
export const usersApi = {
  getUser: (id: number) => 
    api.get(`/users/${id}`),
    
  updateUser: (id: number, userData: any) => 
    api.patch(`/users/${id}`, userData),
    
  deleteUser: (id: number) => 
    api.delete(`/users/${id}`),
};

// Runs API
export const runsApi = {
  getRuns: (params?: any) => 
    api.get('/runs', { params }),
    
  getRun: (id: number) => 
    api.get(`/runs/${id}`),
    
  createRun: (runData: any) => 
    api.post('/runs', runData),
    
  updateRun: (id: number, runData: any) => 
    api.patch(`/runs/${id}`, runData),
    
  deleteRun: (id: number) => 
    api.delete(`/runs/${id}`),
};

// Sources API
export const sourcesApi = {
  getSources: (params?: any) => 
    api.get('/sources', { params }),
    
  getSource: (id: number) => 
    api.get(`/sources/${id}`),
    
  createSource: (sourceData: any) => 
    api.post('/sources', sourceData),
    
  updateSource: (id: number, sourceData: any) => 
    api.patch(`/sources/${id}`, sourceData),
    
  deleteSource: (id: number) => 
    api.delete(`/sources/${id}`),
};

// Content API
export const contentApi = {
  getContent: (params?: any) => 
    api.get('/content', { params }),
    
  getContentItem: (id: number) => 
    api.get(`/content/${id}`),
    
  createContent: (contentData: any) => 
    api.post('/content', contentData),
    
  updateContent: (id: number, contentData: any) => 
    api.patch(`/content/${id}`, contentData),
    
  deleteContent: (id: number) => 
    api.delete(`/content/${id}`),
    
  publishContent: (id: number, blogConfigId: number) => 
    api.post(`/content/${id}/publish`, { blog_config_id: blogConfigId }),
};

// Blog Configs API
export const blogConfigsApi = {
  getBlogConfigs: (params?: any) => 
    api.get('/blog-configs', { params }),
    
  getBlogConfig: (id: number) => 
    api.get(`/blog-configs/${id}`),
    
  createBlogConfig: (configData: any) => 
    api.post('/blog-configs', configData),
    
  updateBlogConfig: (id: number, configData: any) => 
    api.patch(`/blog-configs/${id}`, configData),
    
  deleteBlogConfig: (id: number) => 
    api.delete(`/blog-configs/${id}`),
    
  testBlogConfig: (id: number) => 
    api.post(`/blog-configs/${id}/test`),
};

// Demographics API
export const demographicsApi = {
  getDemographics: (params?: any) => 
    api.get('/demographics', { params }),
    
  getDemographic: (id: number) => 
    api.get(`/demographics/${id}`),
    
  createDemographic: (demographicData: any) => 
    api.post('/demographics', demographicData),
    
  updateDemographic: (id: number, demographicData: any) => 
    api.patch(`/demographics/${id}`, demographicData),
    
  deleteDemographic: (id: number) => 
    api.delete(`/demographics/${id}`),
};