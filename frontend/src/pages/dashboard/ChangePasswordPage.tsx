import { useState } from 'react';
import { FiLock } from 'react-icons/fi';
import { authStorage } from '../../services/authStorage';
import { userService } from '../../services/user';
import { notifications } from '@mantine/notifications';
import InputField from '../../components/shared/InputField';

const ChangePasswordPage = () => {
  const user = authStorage.getUser();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError('');
    setSuccess('');
    if (newPassword !== confirmPassword) {
      const message = 'New password and confirm password do not match';
      setError(message);
      notifications.show({
        title: 'Password not updated',
        message,
        color: 'red',
      });
      return;
    }
    setLoading(true);
    try {
      await userService.editPassword(user.id, currentPassword, newPassword);
      setSuccess('Password updated successfully');
      notifications.show({
        title: 'Password updated',
        message: 'Your password has been changed successfully.',
        color: 'green',
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      const message = err.message || 'Failed to update password';
      setError(message);
      notifications.show({
        title: 'Password update failed',
        message,
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <FiLock className="text-slate-500" />
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Change Password</h1>
          <p className="mt-1 text-sm text-slate-500">Update your account password securely.</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <InputField
          label="Current Password"
          name="currentPassword"
          type="password"
          value={currentPassword}
          onChange={setCurrentPassword}
        />
        <InputField
          label="New Password"
          name="newPassword"
          type="password"
          value={newPassword}
          onChange={setNewPassword}
        />
        <InputField
          label="Confirm New Password"
          name="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        {success && <p className="text-xs text-emerald-600">{success}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordPage;
