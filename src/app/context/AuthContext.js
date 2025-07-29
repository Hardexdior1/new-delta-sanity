
'use client'

import { createContext,useState,useContext ,useEffect} from "react";
import endpointroute from "../utils/endpointroute";
import "react-toastify/dist/ReactToastify.css";
import {  toast } from "react-toastify";
import { useRouter } from "next/navigation";


const AuthContext =createContext()

export const AuthProvider=({children})=>{
    const [user,setUser]=useState(null)
const [loadingLogin, setLoadingLogin] = useState(false);
    const [loadingSignUp,setLoadingSignUp]=useState(false)
        const [loadingReset,setLoadingReset]=useState(false)


    
      

    const router = useRouter();


useEffect(() => {
  try {
    const savedUser = localStorage.getItem("user");
    if (savedUser && savedUser !== "undefined") {
      setUser(JSON.parse(savedUser));
    }
  } catch (err) {
    console.error("Failed to parse user from localStorage:", err);
    localStorage.removeItem("user"); // clean up
  }
}, []);

    const handleLogin = async (email,password) => {
      const loginData={
        email,
        password
      }
      try {
              setLoadingLogin(true);
        const response = await endpointroute.post("auth/login",loginData);
        const loggedinUser = response?.data;
        console.log('user', response?.data)
        localStorage.setItem("user",JSON.stringify(loggedinUser))
        localStorage.setItem("token",loggedinUser.token)
        setUser(loggedinUser);
        router.push(loggedinUser.user.role=='base_admin'?'/admin':loggedinUser.user.role);
        toast.success("Login successful! Redirecting...");
        setLoadingLogin(false)
      } catch (error) {
        console.log("Login failed:", error);
        // toast.error(error|| " Login failed. Please try again.");
                        toast.error(error?.response?.data?.message||'oops, an error occured, please try again')

      } finally {
        setLoadingLogin(false);
      }
    };
   
    
      const handleSignUp =async(firstName,lastName,email,password) => {
         const signUpData={
        firstName,
        lastName,
        email,
        password
      }
              // console.log('Attempting signup with:',signUpData);

        try {
        setLoadingSignUp(true);
          const res=await endpointroute.post('auth/register',signUpData)
         setLoadingSignUp(false);
        toast.success(res.data.message||'account created successfully')
        return true;
        } catch (error) {
          console.log(error)
                toast.error(error?.response?.data?.message||'oops, an error occured, please try again')
                setLoadingSignUp(false);
                return false;
        }
      };
    
      const handlePasswordReset = async(email) => {
        console.log('Attempting password reset for:', email);
        try {
                  setLoadingReset(true);
           await endpointroute.post('auth/forgot-password',{
            email:email,
          },{
            headers:{
              'Content-Type':'application/json'
            }
          })
          // console.log(response)
            setLoadingReset(false);
          // Api/auth/reset-password
           return true;
        } catch (error) {
          console.log(error)
                    setLoadingReset(false);
                    toast.error(error?.response?.data?.message||"opps something went wrong, try again")
          return false;
        }
      };

      // handlePasswordReset()
      const [loadingLogOut,setLoadingLogOut]=useState(false)
      const [showLogOut,setShowLogout]=useState(false)

   const handleLogout=async()=>{

    try { 
      setLoadingLogOut(true)
const response=await endpointroute.post('auth/logout ')
toast.success(response.data.message||"Logout successful")
setShowLogout(false)
setLoadingLogOut(false)
localStorage.removeItem('user')
localStorage.removeItem('token')
router.push('/auth')
setUser(null)
// setUser(null)

      
    } catch (error) {
      console.log(error?.response?.data?.message||"oops. something went wrong, try again.")
      console.log(error)
      setLoadingLogOut(false)
      setShowLogout(false)
      toast.error(error?.response?.data?.message||"oops. something went wrong, try again.")

    }
   }

      
    return <AuthContext.Provider value={{user,handleLogin, handleSignUp,handlePasswordReset,handleLogout, loadingLogOut, loadingLogin,loadingSignUp,loadingReset,showLogOut,setShowLogout,setUser}}>
{children}
    </AuthContext.Provider>
}

export const useAuth=()=>useContext(AuthContext)