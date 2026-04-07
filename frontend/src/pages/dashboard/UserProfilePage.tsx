import { useEffect, useRef, useState } from 'react';
import { FiCamera, FiLock, FiUser } from 'react-icons/fi';
import { authStorage } from '../../services/authStorage';
import { userService, type Submission } from '../../services/user';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

const statusColors: Record<Submission['status'], string> = {
  UPLOADED: 'bg-blue-50 text-blue-600',
  PROCESSING: 'bg-yellow-50 text-yellow-600',
  COMPLETED: 'bg-emerald-50 text-emerald-600',
  FAILED: 'bg-red-50 text-red-600',
};

const formatSize = (size: number) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
};

const UserProfilePage = () => {
  const [user, setUser] = useState(() => authStorage.getUser());
  const [imagePreview, setImagePreview] = useState<string | null>(user?.profilePic ? `${API_BASE_URL.replace('/api/v1', '')}/${user.profilePic}` : null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = authStorage.subscribe(() => setUser(authStorage.getUser()));
    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchSubmissions = async () => {
      setSubmissionsLoading(true);
      try {
        const res = await userService.listSubmissions(page, 5);
        setSubmissions(res.data);
        setTotalPages(res.totalPages);
      } catch {
        // ignore
      } finally {
        setSubmissionsLoading(false);
      }
    };
    fetchSubmissions();
  }, [page]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploadError('');
    setImagePreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const res = await userService.uploadProfileImage(user.id, file);
      const updatedUser = { ...user, profilePic: res.profilePic };
      authStorage.setUser(updatedUser);
      setUser(updatedUser);
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed');
      setImagePreview(user.profilePic ? `${API_BASE_URL.replace('/api/v1', '')}/${user.profilePic}` : null);
    } finally {
      setUploading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setPasswordError('');
    setPasswordSuccess('');
    setPasswordLoading(true);
    try {
      await userService.editPassword(user.id, currentPassword, newPassword);
      setPasswordSuccess('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const initials = user?.fullName
    ?.split(' ')
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() ?? 'U';

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <FiUser className="text-slate-500" />
          <h2 className="text-base font-semibold text-slate-900">Profile</h2>
        </div>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="h-24 w-24 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center text-2xl font-bold text-slate-600">
              {imagePreview ? (
                <img src={imagePreview} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center shadow border-2 border-white hover:opacity-90 disabled:opacity-60"
            >
              <FiCamera size={14} />
            </button>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleImageChange} />
          </div>
          {/* Info */}
          <div className="flex-1 space-y-1 text-center sm:text-left">
            <p className="text-xl font-semibold text-slate-900">{user?.fullName}</p>
            <p className="text-sm text-slate-500">{user?.email}</p>
            <span className="inline-block mt-1 rounded-full bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary capitalize">
              {user?.role?.toLowerCase()}
            </span>
            {uploading && <p className="text-xs text-slate-400 mt-1">Uploading...</p>}
            {uploadError && <p className="text-xs text-red-500 mt-1">{uploadError}</p>}
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <FiLock className="text-slate-500" />
          <h2 className="text-base font-semibold text-slate-900">Change Password</h2>
        </div>
        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>
          {passwordError && <p className="text-xs text-red-500">{passwordError}</p>}
          {passwordSuccess && <p className="text-xs text-emerald-600">{passwordSuccess}</p>}
          <button
            type="submit"
            disabled={passwordLoading}
            className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            {passwordLoading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Submissions */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900 mb-6">My Submissions</h2>
        {submissionsLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-14 rounded-2xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : submissions.length === 0 ? (
          <p className="text-sm text-slate-500">No submissions yet.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    <th className="pb-3 pr-4">File</th>
                    <th className="pb-3 pr-4">Semester</th>
                    <th className="pb-3 pr-4">University</th>
                    <th className="pb-3 pr-4">Size</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {submissions.map((s) => (
                    <tr key={s.id}>
                      <td className="py-3 pr-4 font-medium text-slate-800 max-w-[180px] truncate">{s.originalName}</td>
                      <td className="py-3 pr-4 text-slate-600">{s.semester}</td>
                      <td className="py-3 pr-4 text-slate-600 max-w-[160px] truncate">{s.university}</td>
                      <td className="py-3 pr-4 text-slate-500">{formatSize(s.size)}</td>
                      <td className="py-3 pr-4">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColors[s.status]}`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3 text-slate-500">{new Date(s.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                >
                  Prev
                </button>
                <span className="text-xs text-slate-500">{page} / {totalPages}</span>
                <button
                  type="button"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
