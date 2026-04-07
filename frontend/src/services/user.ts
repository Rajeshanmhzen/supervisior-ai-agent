import { apiRequest, apiUpload } from './api';

export const userService = {
  uploadProfileImage: async (id: string, file: File): Promise<{ profilePic: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiUpload<{ profilePic: string }>(`/user/edit/${id}/profile-image`, formData);
  },

  editPassword: async (id: string, currentPassword: string, newPassword: string) => {
    return apiRequest<{ ok: boolean }>(`/user/edit/${id}/password`, {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  addSubmission: async (file: File, semester: string, university: string, userId: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('semester', semester);
    formData.append('university', university);
    formData.append('userId', userId);
    return apiUpload<{ message: string; submission: Submission }>(`/submissions/add`, formData, 'POST');
  },

  listSubmissions: async (page = 1, limit = 5) => {
    return apiRequest<{
      data: Submission[];
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    }>(`/submissions/list?page=${page}&limit=${limit}`);
  },

  getSubmission: async (id: string) => {
    return apiRequest<{ submission: SubmissionDetail }>(`/submissions/detail/${id}`);
  },

  getSubmissionFileUrl: (id: string) => {
    const base = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
    return `${base}/submissions/file/${id}`;
  },
};

export type Submission = {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  semester: string;
  university: string;
  status: 'UPLOADED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
};

export type SubmissionDetail = Submission & {
  storedName: string;
  path: string;
  analysisResult?: {
    aiFeedback?: Array<{
      pageRange: string;
      summary?: string;
      issues?: Array<{ severity: string; message: string }>;
      suggestions?: string[];
    }>;
  };
  ruleCheck?: {
    passed: boolean;
    issues: Array<{ severity: string; message: string; rule?: string }>;
    summary?: string;
  } | null;
};
