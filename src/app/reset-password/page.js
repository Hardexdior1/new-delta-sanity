import Reset from './components/Reset'
import { Suspense } from 'react';

export const metadata = {
  title: 'Delta sanity Report hub',
  description: 'Securely reset your password for your Delta sanity Report hub account'
};



const Page=()=>{
  return (
        <Suspense fallback={ <div className="bg-black opacity-2">
          <div className="flex items-center justify-center h-screen">
            <div className="z-10 w-16 h-16 border-8 border-t-blue-600 border-r-white border-b-blue-600 border-l-white rounded-full animate-spin"></div>
          </div>

        </div>}>

<Reset />

 </Suspense>
  )

}
export default Page