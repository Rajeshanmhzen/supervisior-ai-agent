import { apiGet } from '@/services/api';

export type SubmissionStatus = 'UPLOADED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export type Submission = {
  id: string;
  originalName: string;
  university: string;
  status: SubmissionStatus;
  progress: number | null;
  createdAt: string;
};

type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function getSubmissions(page = 1, limit = 50) {
  return apiGet<PaginatedResponse<Submission>>(`/submissions/list?page=${page}&limit=${limit}`);
}
