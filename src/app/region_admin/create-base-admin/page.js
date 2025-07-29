
'use client';

import { useState } from 'react';
import endpointroute from '@/app/utils/endpointroute';

const CreateZoneForm = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!fullName.trim() || !email.trim()) {
      setError('All fields are required.');
      return;
    }

    try {
      setLoading(true);
    let res = await endpointroute.post('auth/baseadmin/create-user ', {
        name:fullName,
        email,
      });
console.log(res)
      setSuccessMsg('✅ Base created successfully!');
      setFullName('');
      setEmail('');
    } catch (err) {
      console.error(err);
      setError('❌ Failed to create Base. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white border border-gray-300 rounded-lg p-6 max-w-md mx-auto mt-6">
      <h2 className="text-lg font-semibold text-black mb-4">Create a Base</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Base Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Base'}
        </button>
      </form>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {successMsg && <p className="mt-3 text-sm text-green-600">{successMsg}</p>}
    </section>
  );
};

export default CreateZoneForm;
