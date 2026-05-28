import { useEffect, useRef, useState } from 'react';
import { FiCamera, FiMail, FiSave, FiShield, FiUser } from 'react-icons/fi';
import { authStorage } from '../../services/authStorage';
import { userService, type Submission } from '../../services/user';
import { notifications } from '@mantine/notifications';
import InputField from '../../components/shared/InputField';

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
  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = authStorage.subscribe(() => setUser(authStorage.getUser()));
    return unsubscribe;
  }, []);

  useEffect(() => {
    setFullName(user?.fullName ?? '');
  }, [user?.fullName]);

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
      notifications.show({
        title: 'Profile photo updated',
        message: 'Your new profile photo has been saved.',
        color: 'green',
      });
    } catch (err: any) {
      const message = err.message || 'Upload failed';
      setUploadError(message);
      setImagePreview(user.profilePic ? `${API_BASE_URL.replace('/api/v1', '')}/${user.profilePic}` : null);
      notifications.show({
        title: 'Photo upload failed',
        message,
        color: 'red',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setProfileError('');
    setProfileSuccess('');
    setProfileLoading(true);
    try {
      const res = await userService.editProfile(user.id, fullName);
      const updatedUser = {
        id: res.user.id,
        fullName: res.user.fullName,
        email: res.user.email,
        role: res.user.role,
        profilePic: res.user.profilePic,
      };
      authStorage.setUser(updatedUser);
      setUser(updatedUser);
      setProfileSuccess('Profile updated successfully');
      notifications.show({
        title: 'Profile updated',
        message: 'Your user details have been saved.',
        color: 'green',
      });
    } catch (err: any) {
      const message = err.message || 'Failed to update profile';
      setProfileError(message);
      notifications.show({
        title: 'Profile update failed',
        message,
        color: 'red',
      });
    } finally {
      setProfileLoading(false);
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
      <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <FiUser className="text-slate-500" />
              <h1 className="text-xl font-semibold text-slate-900">User Profile</h1>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Update your account details and profile photo.
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center dark:bg-slate-900">
            <div className="relative mx-auto h-28 w-28">
              <div className="h-28 w-28 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center text-3xl font-bold text-slate-600">
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
                className="absolute bottom-1 right-1 h-9 w-9 rounded-full bg-primary text-white flex items-center justify-center shadow border-2 border-white hover:opacity-90 disabled:opacity-60 dark:border-slate-900"
                aria-label="Upload profile photo"
              >
                <FiCamera size={15} />
              </button>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleImageChange} />
            </div>
            <h2 className="mt-4 text-base font-semibold text-slate-900">{user?.fullName ?? 'User'}</h2>
            <p className="mt-1 truncate text-sm text-slate-500">{user?.email}</p>
            <span className="mt-4 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary capitalize">
              {user?.role?.toLowerCase()}
            </span>
            {uploading && <p className="mt-3 text-xs text-slate-400">Uploading photo...</p>}
            {uploadError && <p className="mt-3 text-xs text-red-500">{uploadError}</p>}
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-5">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Edit Details</h2>
              <p className="mt-1 text-sm text-slate-500">
                Keep your profile information accurate for project records.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <InputField
                  label="Full Name"
                  name="fullName"
                  value={fullName}
                  onChange={setFullName}
                  rightAdornment={<FiUser className="text-slate-400" />}
                />
              </div>

              <div>
                <InputField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={user?.email ?? ''}
                  onChange={() => {}}
                  readOnly
                  rightAdornment={<FiMail className="text-slate-400" />}
                />
              </div>

              <div>
                <InputField
                  label="Role"
                  name="role"
                  value={user?.role?.toLowerCase() ?? ''}
                  onChange={() => {}}
                  readOnly
                  rightAdornment={<FiShield className="text-slate-400" />}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
              <div>
                {profileError && <p className="text-sm text-red-500">{profileError}</p>}
                {profileSuccess && <p className="text-sm text-emerald-600">{profileSuccess}</p>}
              </div>
              <button
                type="submit"
                disabled={profileLoading}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
              >
                <FiSave className="text-base" />
                {profileLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
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
                      <td className="py-3 pr-4 font-medium text-slate-800 max-w-45 truncate">{s.originalName}</td>
                      <td className="py-3 pr-4 text-slate-600">{s.semester}</td>
                      <td className="py-3 pr-4 text-slate-600 max-w-40 truncate">{s.university}</td>
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
