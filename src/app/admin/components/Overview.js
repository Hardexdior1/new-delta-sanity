
'use client'
import { useEffect, useState } from "react";
import { Users, CalendarCheck } from "lucide-react";
import endpointroute from "@/app/utils/endpointroute";
import Link from "next/link";

const Overview = () => {
  const [reports, SetReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [newEmail, setNewEmail] = useState("");
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchAllBookings = async () => {
      try {
        setLoading(true);
        const [reportsRes, usersRes] = await Promise.all([
          endpointroute.get("base/reports"),
          endpointroute.get("base/users "),
        ]);
        SetReports(reportsRes.data);
        setUsers(usersRes.data);
      } catch (error) {
        console.log("Error fetching bookings:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllBookings();
  }, []);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!newEmail.trim()) {
      setError("Email is required");
      return;
    }
    try {
      setLoading(true);
      await endpointroute.put(`user/admin-edit/${selectedUser._id}`, {
        newEmail,
      });
      setSuccessMsg("✅ Email updated successfully");
      setShowEditModal(false);
      setNewEmail("");
    } catch (err) {
      console.error(err);
      setError("❌ Failed to update email. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const overviewStats = [
    {
      title: "Total Registered Units",
      count: loading ? "calculating..." : users?.length,
      icon: <Users />,
    },
    {
      title: "Total Reports submitted",
      count: loading ? "calculating..." : reports?.length,
      icon: <CalendarCheck />,
    },
  ];

  const startIndex = (currentPage - 1) * itemsPerPage;
  const lastIndex = startIndex + itemsPerPage;
  const filteredZones = users;
  console.log('filtered',filteredZones)
  const allZones = filteredZones.slice(startIndex, lastIndex);
  const total = Math.min(lastIndex, filteredZones.length);

  return (
    <main className="mt-5 lg:mt-0">
      {/* Overview cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 mb-10">
        {overviewStats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md border flex items-center gap-4">
            <div className="bg-blue-200 p-3 rounded-full text-blue-500">{stat.icon}</div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">{stat.title}</h4>
              <p className="text-2xl font-bold text-gray-800">{stat.count}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Commands section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold text-blue-500">Bases</h3>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm animate-pulse">
                <div className="h-5 bg-gray-300 w-3/4 mb-4 rounded"></div>
                <div className="h-8 bg-gray-200 w-full rounded mb-2"></div>
                <div className="h-8 bg-gray-200 w-full rounded"></div>
              </div>
            ))
          ) : filteredZones.length === 0 || error?.response?.status === 404 ? (
            <p className="text-center col-span-full text-gray-500">No report found for this Unit.</p>
          ) : (
            allZones.map((zone, index) => (
              <div key={index} className="bg-white border border-black rounded-xl p-5 shadow-sm">
                
                {/* <h2 className="text-lg font-bold text-blue-500">{zone.base}</h2> */}
                                <h2 className="text-lg font-bold text-blue-500">{zone.name}</h2>

                <div className="grid gap-2">
                  <Link href={`/admin/reports/${zone._id}?name=${zone.name}`}>
                    <button className="mt-4 text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 w-full">
                      View Details
                    </button>
                  </Link>
                  <button
                    onClick={() => {
                      setSelectedUser(zone);
                      setShowEditModal(true);
                    }}
                    className="mt-2 text-sm px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination – only if not loading and data exists */}
      {!loading && filteredZones.length > 0 && (
        <div className="flex justify-center items-center gap-5 mb-6">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-md text-sm bg-white text-black disabled:opacity-50"
          >
            Prev
          </button>
          <h2 className="text-sm font-medium text-black">
            Showing {total} of {filteredZones.length} Units
          </h2>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={total === filteredZones.length}
            className="px-4 py-2 border rounded-md text-sm bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Edit Email Modal */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Email for {selectedUser.fullName}</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Enter new email"
                required
              />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                {loading ? 'Updating...' : 'Update Email'}
              </button>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="ml-2 text-sm text-gray-500 hover:text-black"
              >
                Cancel
              </button>
            </form>
            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
            {successMsg && <p className="text-sm text-green-600 mt-2">{successMsg}</p>}
          </div>
        </div>
      )}
    </main>
  );
};

export default Overview;
