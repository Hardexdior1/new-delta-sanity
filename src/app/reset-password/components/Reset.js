'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';

export default function ResetPassword() {
  const [newPassword, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
console.log(token)
  useEffect(() => {
    if (!token) {
      toast.error('Invalid or missing token');
      router.push('/');
    }
  }, [token, router]);

  const handleReset = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    if (newPassword !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    console.log('trying to change pasword to',token,newPassword)
    try {
      setLoading(true);
      const res = await axios.post(`https://report-backend-xe01.onrender.com/api/auth/reset-password/${token}`, {
  newPassword

},{
    headers: {
      'Content-Type': 'application/json',
    },
  });
      toast.success(res.data.message || 'Password reset successful');
      router.push('/auth');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Reset failed');
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20">
        <ToastContainer />
      <h2 className="text-center text-2xl font-semibold text-gray-800">
        Reset Your Password
      </h2>
            <form onSubmit={handleReset} className="mt-6 space-y-5">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            type={show ? 'text' : 'password'}
            className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newPassword}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-10 text-gray-500"
            tabIndex={-1}
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type={showConfirm ? 'text' : 'password'}
            className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-10 text-gray-500"
            tabIndex={-1}
          >
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition disabled:opacity-50"
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
}
