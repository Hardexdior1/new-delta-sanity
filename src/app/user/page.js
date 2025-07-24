
'use client'
import Link from "next/link";
import endpointroute from "../utils/endpointroute";
import {  useEffect, useState } from "react";
import Bookings from './components/Bookings'
import { useRouter } from "next/navigation";
const Page = () => {
  const [bookings,setBookings]=useState([])
    // const [users,setUsers]=useState([])
console.log(bookings)
  const router=useRouter()
  const [activeTab, setActiveTab] = useState('upcoming'); 
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState(null);
   useEffect(()=>{
      setIsLoading(true); 
      setError(null);
    const fetchUserBookings = async () => {
           try {
            const res = await endpointroute.get("user/my-reports",)
                        // const response = await endpointroute.get("auth/status",)
                        // setUsers(response.data)
          // console.log(response.data)
          setBookings(res.data)
          } catch (error) {
           console.log("Failed to fetch data:", error)
            if(error.status==401){
           toast.error("Login expired, please login again")
            router.push('/auth')
          setBookings([]); 
          setError("Failed to load your bookings. Please try again.")
        }
    
           }finally {
        setIsLoading(false); 
      }
        }
        fetchUserBookings()
  },[router])


    // useEffect (() => {
    //        const checkStatus=async () => {
    //           try {
    //          const response=await endpointroute.get('auth/status')
    //         //  const loggedinUser = response.data;
    //          console.log(response)
    //         //  if(!loggedinUser ||!allowedRoles.includes(loggedinUser.role)){
    //         //     toast.error("Unauthorized access");
    //         //  router.push("/auth");
    //         //  return;
    //         //  }
   
   
           
    //         //  setChecked(true); 
    //        } catch (error) {
    //         toast.error(error?.response?.data?.message || "Unauthorized access");
   
    //         console.log(error)
    //          // router.push("/auth");
    //        }
    //        }
    //        checkStatus()
    //    }, [router]);
  
  const infoCards = [
    {
      label: "Total Report Submitted",
      value: isLoading?'calculating..':bookings?.length, 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 6h18M4 14h16v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5z" />
        </svg>
      )
    },
   
  ];

  const userRoutes = [
    {
      path: "user/submit-report",
      label: "Submit Report",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6h6v6m2 4H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2z" />
        </svg>
      )
    },
    
  ];




 
  return (
   <main className="flex flex-col gap-10 ">
     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-5 lg:mt-0">
      {/* Static Info Cards */}
      {infoCards.map((card, idx) => (
        <div
          key={idx}
          className="group flex flex-col items-center justify-center p-6 rounded-2xl shadow-md bg-white border border-blue-100"
        >
          <div className="p-3 rounded-full bg-blue-600/10">
            <div className="text-blue-600">{card.icon}</div>
          </div>
          <h2 className="mt-3 text-xl font-semibold text-gray-800">{card.value}</h2>
          <span className="text-sm font-medium text-gray-500">{card.label}</span>
        </div>
      ))}

      {/* Navigational Cards */}
      {userRoutes.map((route) => (
        <Link
          key={route.path}
          href={route.path}
          className="group flex flex-col items-center justify-center p-6 rounded-2xl shadow-md bg-white border border-blue-100 hover:bg-blue-600 hover:shadow-lg transition-all duration-200"
        >
          <div className="p-3 rounded-full bg-blue-600/10 group-hover:bg-white transition-all duration-200">
            <div className="text-blue-700 group-hover:text-blue-800">{route.icon}</div>
          </div>
          <span className="mt-3 text-sm font-medium text-gray-800 group-hover:text-white transition-all duration-200">
            {route.label}
          </span>
        </Link>
      ))}
    </div>

    <div>
      <Bookings allBookings={bookings} activeTab={activeTab} setActiveTab={setActiveTab} isLoading={isLoading} error={error} />
    </div>
   </main>
  );
};

export default Page;
