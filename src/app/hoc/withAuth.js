
'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import endpointroute from "../utils/endpointroute";
const withAuth = (WrappedComponent, allowedRoles = []) => {
  const ComponentWithAuth = (props) => {
    const router = useRouter();
    const [checked, setChecked] = useState(false);
    useEffect (() => {
        const checkStatus=async () => {
           try {
          const response=await endpointroute.get('auth/status')
          const loggedinUser = response.data;
          
          if(!loggedinUser ||!allowedRoles.includes(loggedinUser.user.role)){
             toast.error("Unauthorized access");
          router.push("/auth");
          return;
          }


        
          setChecked(true); 
        } catch (error) {
         toast.error(error?.response?.data?.message || "Unauthorized access");

         console.log(error)
          router.push("/auth");
        }
        }
        checkStatus()
    }, [router]);

    if ( !checked) {
      return (
        <div className="bg-black opacity-2">
          <div className="flex items-center justify-center h-screen">
            <div className="z-10 w-16 h-16 border-8 border-t-blue-600 border-r-white border-b-blue-600 border-l-white rounded-full animate-spin"></div>
          </div>
                    <ToastContainer />

        </div>
        
      );
    }

    return <WrappedComponent {...props} />;
  };

  ComponentWithAuth.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return ComponentWithAuth;
};

export default withAuth;
