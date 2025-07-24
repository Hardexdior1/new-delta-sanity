export const User_Routes = [
  {
    path: "/user",
    label: "Overview",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z" />
    </svg>
    
    )
  },
  
 
  {
    path: "/user/profile",
    label: "Profile",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5s-3 1.343-3 3 1.343 3 3 3zm0 2c-2.667 0-8 1.333-8 4v3h16v-3c0-2.667-5.333-4-8-4z" />
      </svg>
    )
  },
  {
    path: "/user/submit-report",
    label: "Submit Report",
     icon:<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-3-3v6m4 4H5a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z" />
</svg>

  },
//   {
//     path: "/user/reports",
//     label: "View Reports",
//      icon:<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
// </svg>

//   },
  
];
