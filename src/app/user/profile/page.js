"use client";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import endpointroute from "@/app/utils/endpointroute";
import { toast, ToastContainer } from "react-toastify";

export default function AdminProfile() {
  const { handleLogout} = useAuth();
const [loadingPassword,setLoadingPassWord]=useState(false)

  const [tab, setTab] = useState("password");
  
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });



  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (passwordData.oldPassword && passwordData.newPassword) {
      try {
        setLoadingPassWord(true)
      await endpointroute.post("auth/change-password",{
         oldPassword:passwordData.oldPassword,
         newPassword:passwordData.newPassword
      },
      {
           headers: {
      'Content-Type': 'application/json',
    }
      }
     );
     setLoadingPassWord(false)
        toast.success("Password updated successfully!");
        setPasswordData({ oldPassword: "", newPassword: "" });
                await handleLogout();

        // router.push("/auth")
      } catch (error) {
        toast.error(error?.response?.data?.message|| "Failed to update password.");
        setLoadingPassWord(false)
      }
    } else {
      toast.error("Please fill in both password fields.");
      setLoadingPassWord(false)
    }
  };
const [showOldPassword, setShowOldPassword] = useState(false);
const [showNewPassword, setShowNewPassword] = useState(false);

  return (
    <div className="max-w-xl mx-auto p-6">
      <ToastContainer />
      <div className="mb-4 flex space-x-4">
       
        <button
          onClick={() => setTab("password")}
          className={`px-4 py-2 rounded-md font-medium ${
            tab === "password"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-black"
          }`}
        >
          Password
        </button>
      </div>

     
      {tab === "password" && (
        <form
          onSubmit={handlePasswordSave}
          className="space-y-5 bg-white p-6 rounded-xl shadow-md border border-gray-200"
        >
         <div className="relative">
  <input
    type={showOldPassword ? "text" : "password"}
    name="oldPassword"
    value={passwordData.oldPassword}
    placeholder="old-password"
    onChange={handlePasswordChange}
    className="w-full px-4 py-2 rounded-md border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
  />
  <button
    type="button"
    onClick={() => setShowOldPassword(!showOldPassword)}
    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
  >
    {showOldPassword ? "🙈" : "👁️"}
  </button>
</div>


        <div className="relative">
  <input
    type={showNewPassword ? "text" : "password"}
    name="newPassword"
    value={passwordData.newPassword}
    onChange={handlePasswordChange}
    placeholder="new-password"
    className="w-full px-4 py-2 rounded-md border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
  />
  <button
    type="button"
    onClick={() => setShowNewPassword(!showNewPassword)}
    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
  >
    {showNewPassword ? "🙈" : "👁️"}
  </button>
</div>


         <button
  type="submit"
  disabled={loadingPassword}
  className={`w-full py-2 rounded-md text-white transition duration-200
    ${loadingPassword ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}
  `}
>
  {loadingPassword ? "Changing..." : "Change Password"}
</button>
        </form>
      )}
    </div>
  );
}




