'use client';
import { useState } from 'react';
import { ToastContainer } from "react-toastify"
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Image from 'next/image';
const FiEye = ({ size }) => <span style={{ fontSize: size }}>👁️</span>;
const FiEyeOff = ({ size }) => <span style={{ fontSize: size }}>🙈</span>;



// --- Components for different views ---

function LoginForm({ onToggleView }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const {handleLogin,loadingLogin} = useAuth();

 const onSubmit = (e) => {
    e.preventDefault();
    handleLogin(email, password); // Pass local state to handleLogin
  };
  return (
    <form onSubmit={onSubmit} className="space-y-5">
            <ToastContainer />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition"
          placeholder="Enter your email"
          required
        />
      </div>

      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition pr-10"
          placeholder="Enter your password"
          required
        />
        <button
          type="button"
          className="absolute right-3 top-9 text-gray-500 hover:text-gray-800"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </button>
      </div>

      <button
        type="submit"
        disabled={loadingLogin}
        className={`w-full py-3 px-4 rounded-lg font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 transition ${
          loadingLogin ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {loadingLogin ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Logging in...
          </span>
        ) : (
          'Login'
        )}
      </button>

      <div className="text-center text-sm">
        <a
          href="#"
          onClick={() => onToggleView('forgotPassword')}
          className="text-blue-700 hover:underline font-medium"
        >
          Forgot password?
        </a>
      </div>
    </form>
  );
}



function ForgotPasswordForm({ onToggleView }) {
  const { handlePasswordReset, loadingReset } = useAuth();
  const [email,setEmail]=useState('')

  const onSubmit =async (e) => {
    e.preventDefault();
   const success = await handlePasswordReset(email);

  if (success) {
    onToggleView('resetMessage'); 
  }
  //  onToggleView('resetMessage');
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
            <ToastContainer />

     
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition"
          placeholder="Enter your email"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loadingReset}
        className={`w-full py-3 px-4 rounded-lg font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 transition ${
          loadingReset ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {loadingReset ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Sending...
          </span>
        ) : (
          'Send Reset Link'
        )}
      </button>

      <div className="text-center text-sm mt-3">
        <a
          href="#"
          onClick={() => onToggleView('login')}
          className="text-blue-700 hover:underline font-medium"
        >
          Back to Login
        </a>
      </div>
    </form>
  );
}

function ResetMessage({ onToggleView }) {
  return (
    <div className="text-center space-y-6">
      {/* <h2 className="text-xl font-semibold text-gray-800">
        Password Reset Sent!
      </h2>
      <p className="text-sm text-gray-500">
       
      </p> */}
      <button
        onClick={() => onToggleView('login')}
        className="w-full py-3 px-4 rounded-lg font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 transition"
      >
        Back to Login
      </button>
    </div>
  );
}

export default function AuthPage() {
  const [currentView, setCurrentView] = useState('login'); // 'login', 'signup', 'forgotPassword', 'resetMessage'

  const renderForm = () => {
    switch (currentView) {
      case 'login':
        return <LoginForm onToggleView={setCurrentView} />;
     
      case 'forgotPassword':
        return <ForgotPasswordForm onToggleView={setCurrentView} />;
      case 'resetMessage':
        return <ResetMessage onToggleView={setCurrentView} />;

      default:
        return <LoginForm onToggleView={setCurrentView} />;
    }
  };

  const getWelcomeMessage = () => {
    switch (currentView) {
      case 'login':
        return {
          title: 'Welcome Back',
          subtitle: 'Login to manage your account',
        };
     
      case 'forgotPassword':
        return {
          title: 'Reset Your Password',
          subtitle: 'Enter your email to receive a password reset link',
        };
      case 'resetMessage':
        return {
          title: ' Password Reset Link Sent!',
           subtitle: `Please check your email for a password reset link.\nIf you don't see it, check your spam folder or retry.`,
        };
      
      default:
        return {
          title: 'Welcome Back',
          subtitle: 'Login to manage bookings and guests',
        };
    }
  };

  const { title, subtitle } = getWelcomeMessage();

  return (
//     <div className="min-h-screen py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-50 flex items-center justify-center px-4">
//             <ToastContainer />

//       <div className="w-full max-w-md flex flex-col items-center justify-center">
      
// <Image src="/navy.jpg" alt="navy-logo" width={100} height={100} />
//         <motion.div
//           key={currentView} // Key for re-animating on view change
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -20 }}
//           transition={{ duration: 0.3, ease: 'easeOut' }}
//           className="bg-white bg-opacity-95 backdrop-blur-xl shadow-2xl rounded-3xl p-8 space-y-6 border border-blue-100"
//         >
//           <div className="text-center">
//               <h1 className="text-xl  font-bold text-gray-800 mb-3  md:text-2xl">
//               Delta Sanity Report Hub
//             </h1>
//             <h2 className="text-xl font-semibold text-gray-800">
//               {title}
//             </h2>
//             <p className="text-sm text-gray-500">
//               {subtitle}
//             </p>
           
//           </div>

//           {renderForm()}
//         </motion.div>

//       </div>
//     </div>


<div className="min-h-screen py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-50 flex items-center justify-center px-4 relative overflow-hidden">
    {/* Background watermark image */}
    <div
        className="absolute inset-0 bg-no-repeat bg-center object-cover bg-contain opacity-10" // Adjust opacity as needed
        style={{ backgroundImage: 'url(/navy.jpg)' }}
    ></div>

    <ToastContainer />

    <div className="w-full max-w-md flex flex-col items-center justify-center relative z-10">
        <Image src="/navy.jpg" alt="navy-logo" width={100} height={100} />
        <motion.div
            key={currentView} // Key for re-animating on view change
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="bg-white bg-opacity-95 backdrop-blur-xl shadow-2xl rounded-3xl p-8 space-y-6 border border-blue-100"
        >
            <div className="text-center">
                <h1 className="text-xl font-bold text-gray-800 mb-3 md:text-2xl">
                    Delta Sanity Report Hub
                </h1>
                <h2 className="text-xl font-semibold text-gray-800">
                    {title}
                </h2>
                <p className="text-sm text-gray-500">
                    {subtitle}
                </p>
            </div>
            {renderForm()}
        </motion.div>
    </div>
</div>
  );
}