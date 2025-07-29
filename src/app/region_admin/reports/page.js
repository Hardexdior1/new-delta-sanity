
'use client';

import { useEffect, useState } from "react";
import endpointroute from "@/app/utils/endpointroute";
import { MdClose } from "react-icons/md";
import { format } from "date-fns"; 
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { ToastContainer,toast } from "react-toastify";

const Page = () => {

  const [loading, setLoading] = useState(false);
  const [reports, setReport] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [view, setView] = useState(null);
  const [expandedImg, setExpandedImg] = useState(null);
// console.log(reports)

  const [search, setSearch] = useState("");
  const filteredReports = reports.filter((report) =>
    report.place?submittedBy.name().trim('').toLowerCase().includes(search.trim().toLowerCase()):reports)

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const res = await endpointroute.get(`region/summaries`);
        setReport(res.data);
        console.log('reports', res.data)
        setNotFound(false);
      } catch (error) {
        if (error?.response?.status === 404) {
          setNotFound(true);
        } else {
          console.log("Error fetching report:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  const itemsPerPage=6
    
      const [currentPage,setCurrentPage]=useState(1)
    //   const filteredZones=reports
    
      const startIndex=(currentPage-1)*itemsPerPage
    
      const lastIndex=startIndex+itemsPerPage
    
      const paginatedReports=filteredReports.slice(startIndex,lastIndex)
      const total=Math.min(lastIndex, filteredReports.length)

    //   request for a printed report
    const [reportType, setReportType] = useState("full"); 
    const [fromDate, setFromDate] = useState("");
const [toDate, setToDate] = useState("");
const [sending, setSending] = useState(false);
const [responseMsg, setResponseMsg] = useState("");
  const [showForm, setShowForm] = useState(false);

const summary = `region/summary-preview?startDate=${fromDate}&endDate=${toDate}`;
const full = `reports/export-pdf?start=${fromDate}&end=${toDate}`;
const [showSummaryModal, setShowSummaryModal] = useState(false)

const [summaryData, setSummaryData] = useState(null)
// console.log('summary data', summaryData)
const handlePrintRequest = async (api) => {
  if (!fromDate || !toDate) return;
  try {
    setSending(true)
    setResponseMsg("")
    const res = await endpointroute.get(api);
    console.log('response from here', res.data.summary);
setSummaryData(res?.data)
 setShowSummaryModal(true) 
    toast.success(
      `${reportType=='full'?`Report containing all submissions from ${format(
        new Date(fromDate),
        "MMMM d, yyyy"
      )} to ${format(new Date(toDate), "MMMM d, yyyy")} has been sent and opened.`:`Report containing all submissions from ${format(
        new Date(fromDate),
        "MMMM d, yyyy"
      )} to ${format(new Date(toDate), "MMMM d, yyyy")} has been sent`}`
    );
    console.log(res?.data)
    console.log('full report',res?.data)
  } catch (error) {
    console.log("Error fetching PDF:", error);
    setResponseMsg(`${reportType=='full'?`❌ Failed to fetch PDF. Please try again.`:`${error.status==404?`❌ oops.. no report found for that date`:`❌ Failed to fetch PDF. Please try again.`}`}`);
  } finally {
    setSending(false);
  }
};



const handleEachPrintRequest = async () => {
  // e.preventDefault();

  // if (!fromDate || !toDate) return;

  setSending(true);

  try {
    const res = await endpointroute.get(
      `reports/${view?._id}/export-pdf`,
      { responseType: "blob" }
    );

    const pdfBlob = new Blob([res.data], { type: "application/pdf" });
    const blobUrl = URL.createObjectURL(pdfBlob);

    // Open the PDF in a new tab
    window.open(blobUrl, "_blank");
    // Message to user
       toast.success( `✅ Report has been sent and opened. `)

  } catch (error) {
   console.log("Error fetching PDF:", error);
    toast.error("❌ Failed to fetch PDF. Please try again.");
  } finally {
    setSending(false);
  }
};

// const handleSubmitToRegion = async () => {
//   try {
//         setSending(true)
// const payload = {
//   ...summaryData,
//   startDate: fromDate,
//   endDate: toDate,
// };
// console.log('payload',payload)
//     await endpointroute.post("region/forward-summary", payload,{
//       startDate:fromDate,
//       endDate:toDate,
//     })
//     toast.success("Submitted to Region Admin")
//     setShowSummaryModal(false)
//         setSending(false)

//   } catch (error) {
//     toast.error("Submission failed")
//         setSending(false)
//         console.log(error)

//   }
// }
const handleSubmitToRegion = async () => {
  try {
    setSending(true);

    // const payload = {
    //  summaryData,
    
    // };

console.log('from',fromDate,'from', toDate)
  let res=  await endpointroute.post(  `region/forward-summary?startDate=${fromDate}&endDate=${toDate}`); // ✅ ONLY payload here
console.log('response',res)
    toast.success("Submitted to Region Admin");
    setShowSummaryModal(false);
    setSending(false);

  } catch (error) {
    toast.error("Submission failed");
    setSending(false);
    console.log(error);
  }
}

  return (
    <main className="p-4">
    {showSummaryModal && summaryData && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-scroll">
    <div className="bg-white rounded-xl p-6 max-w-lg w-full space-y-4 shadow-lg">
      <h2 className="text-xl font-semibold text-center">Review Summary</h2>
<div className="md:grid grid-cols-2 gap-4">
  
      {Object.entries(summaryData?.total).map(([key,value]) => (
        <div key={key} className="flex flex-col">
          <label className="capitalize">{key.replace(/([A-Z])/g, " $1")}</label>
          <input
            type="text"
            name={key}
            value={value}
            onChange={(e) =>
              setSummaryData((prev) => ({ ...prev, [key]: e.target.value }))
            }
            className="border p-2 rounded"
          />
        </div>
      ))}
</div>

      <button
      disabled={sending}
        onClick={() => handleSubmitToRegion()
          
          }
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
      >
        {sending?"Submitting..":"Submit to Central"}
      </button>

      <button
        onClick={() => setShowSummaryModal(false)}
        className="text-gray-600 text-sm mt-2 underline text-center block"
      >
        Cancel
      </button>
    </div>
  </div>
)}

      <h1 className="text-xl font-bold text-black mb-4"> All Reports Submitted </h1>
            <ToastContainer />

<section className="bg-white border border-gray-300 rounded-lg p-5 mb-6">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setShowForm(!showForm)}
      >
        <h2 className="text-lg font-semibold text-base text-black">Request a Printed Report</h2>
               {/* <div className="flex flex-col gap-2">
                 <button className="text-lg font-semibold text-base text-black">Request full report</button>
                <button className="text-lg font-semibold text-base text-black">Request report summary </button>

               </div> */}

        {showForm ? (
          <FaChevronUp className="text-gray-600" />
        ) : (
          <FaChevronDown className="text-gray-600" />
        )}
      </div>

      {showForm && (
        <>
          <p className="text-sm text-gray-600 mt-2 mb-4">
            To request a printed version of reports, please select the date range below and submit your request. You will receive all reports pdf based on the selected date.
          </p>

          <form
            // onSubmit={}
            onSubmit={((e)=>{
              e.preventDefault()
            })}
            className="space-y-4 md:flex md:items-center md:space-x-4 md:space-y-0"
          >
            <div className="flex flex-col">
              <label htmlFor="fromDate" className="text-sm font-medium text-gray-700 mb-1">From</label>
              <input
                type="date"
                id="fromDate"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                required
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
              {fromDate && (
                <span className="text-xs text-gray-500 mt-1">
                  {format(new Date(fromDate), "EEEE, MMMM d, yyyy")}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <label htmlFor="toDate" className="text-sm font-medium text-gray-700 mb-1">To</label>
              <input
                type="date"
                id="toDate"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                required
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
              {toDate && (
                <span className="text-xs text-gray-500 mt-1">
                  {format(new Date(toDate), "EEEE, MMMM d, yyyy")}
                </span>
              )}
            </div>

            {/* <button
              type="submit"
              disabled={sending}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm disabled:opacity-50"
            >
              {sending ? "Sending..." : "Submit Request"}
            </button> */}
            <div className="flex flex-col items-center gap-2 mb-4 md:flex-row">
  <button
    onClick={() => {
      setReportType("full")
     handlePrintRequest(full)
    }}
     type="submit"
              disabled={sending}
                            className="bg-blue-600 text-sm hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm disabled:opacity-50"

  >
    
                  {sending &&reportType=="full"? "printing..." : "print full report"}

  </button>
  <button
   type="submit"
              disabled={sending}
     onClick={() => {
           setReportType("summary")

     handlePrintRequest(summary)
    }}
                                className="bg-black text-sm hover:bg-black/50-700 text-white px-4 py-2 rounded-md text-sm disabled:opacity-50"

  >
    
                      {sending &&reportType=="summary"? "printing..." : "print report Summary"}

  </button>
</div>

          </form>

          {responseMsg && (
            <p className="text-sm mt-3 text-gray-700">{responseMsg}</p>
          )}
        </>
      )}
    </section>





   <input
        type="text"
        placeholder="Search by base..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md px-4 py-2 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
      />
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : notFound || filteredReports.length === 0  ? (
        <div className="text-center py-10">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">
            No report found 
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Please check again later 
          </p>
        </div>
      ) :  (
        <div  className={`grid gap-4 md:grid-cols-2 ${
    reports.length > 0 ? "2xl:grid-cols-3" : "2xl:grid-cols-2"
  }`}>
          {paginatedReports?.map((report, index) => (
       <div
  key={index}
  className="bg-white border border-black rounded-xl shadow-sm p-4 max-w-xl transition hover:shadow-md duration-200 space-y-3"
>
  <div className="flex flex-col gap-2">
    <h4 className="text-blue-600 font-bold text-lg">
                Submitted by {report.submittedBy.name}
              </h4>
    {/* <h2 className="text-base font-semibold text-black">

      Base: {report.submittedBy.name.charAt(0).toUpperCase() + report.submittedBy.name.slice(1)}
    </h2> */}
    
    <p className="text-sm text-blue-500">
    from  {new Date(report.dateRange.from).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        // hour: "numeric",
        // minute: "numeric",
        hour12: true,
      })} to {new Date(report.dateRange.to).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        // hour: "numeric",
        // minute: "numeric",
        hour12: true,
      })}
    </p>
  </div>

  <div className="grid grid-cols-2 gap-2 text-sm text-black">
    <p><span className="font-medium">AGO:</span> {report.total.AGO}</p>
    <p><span className="font-medium">PMS:</span> {report.total.PMS}</p>
    <p><span className="font-medium">DPK:</span> {report.total.DPK}</p>
    <p><span className="font-medium">Crude Oil:</span> {report.total.CrudeOil}</p>
  </div>

  <div className="pt-3">
    <button
      onClick={() => {
        setShowModal(true);
        setView(report);
      }}
      className="text-sm px-4 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
    >
      View Full Details
    </button>
  </div>
</div>


          ))}
        </div>
      ) }

      {showModal && view && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-white max-h-[90vh] overflow-y-auto p-6 rounded-lg w-11/12 xl:w-3/5 shadow-xl relative print-area">
            <div className="flex justify-between items-center ">
              <h4 className="text-blue-600 font-bold text-lg">
                Submitted by {view.submittedBy.name}
              </h4>
              <div className="flex gap-4">
                <button
                                disabled={sending}
                  onClick={handleEachPrintRequest}
                  className="no-print px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                >
                  {sending?"printing...":"Print"}
                </button>
                <button onClick={() => setShowModal(false)}>
                  <MdClose size={24} className="no-print text-gray-600 hover:text-black" />
                </button>
              </div>
            </div>

            {/* <h4 className="text-black mb-2 font-semibold text-lg">
                Date: {new Date(view.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
              </h4> */}
              
    <p className="text-sm text-blue-500">
    from  {new Date(view.dateRange.from).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        // hour: "numeric",
        // minute: "numeric",
        hour12: true,
      })} to {new Date(view.dateRange.to).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        // hour: "numeric",
        // minute: "numeric",
        hour12: true,
      })}
    </p>

            <form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {/* <div className="md:col-span-2">
                  <label className="block font-medium mb-1">Place</label>
                  <input
                    type="text"
                    value={view.place}
                    disabled
                    className="w-full p-1.5 text-sm bg-gray-100 border border-transparent rounded-md text-gray-700"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">lontitude</label>
                  <input
                    type="text"
                    value={view.lng}
                    disabled
                    className="w-full p-1.5 text-sm bg-gray-100 border border-transparent rounded-md text-gray-700"
                  />
                 
                </div>
                 <div>
                  <label className="block font-medium mb-1">latitude</label>
                  <input
                    type="text"
                    value={view.lat}
                    disabled
                    className="w-full p-1.5 text-sm bg-gray-100 border border-transparent rounded-md text-gray-700"
                  />
                 
                </div> */}


                {[
  "AGO",
  "PMS",
  "DPK",
  "CrudeOil",
  "arrestedSuspects",
  "irsCount",
  "ovenCount",
  "tankCount",
  "woodenBoatCount"
].map((field) => (
  <div key={field} className="mb-4">
    <label className="block font-medium mb-1">
      {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
    </label>
    <input
      type="text"
      value={view?.total?.[field] ?? ''}
      disabled
      className="w-full p-1.5 text-sm bg-gray-100 border border-transparent rounded-md text-gray-700"
    />
  </div>
))}


                {/* <div className="md:col-span-2">
                  <label className="block font-medium mb-1">Remark</label>
                   <textarea
                   rows={6}
                      type="text"
                      value={view.remark}
                      disabled
                      className="w-full p-1.5 text-sm bg-gray-100 border border-transparent rounded-md text-gray-700"
                    />
                 
                </div> */}

                {/* <div className="md:col-span-2 img-zone">
                  <label className="block font-medium mb-2 ">Images</label>
                  {view.images && view.images.length > 0 ? (
                    <div className="flex gap-4 flex-wrap">
                      {view.images.map((img) => (
                        <div
                          key={img}
                          className="relative cursor-pointer"
                          onClick={() => setExpandedImg(img)}
                        >
                          <img
                            src={img}
                            alt="Report Image"
                            className="rounded max-h-[100px]"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No image attached</p>
                  )}
                </div> */}
              </div>
            </form>

            {/* {expandedImg && (
              <div className="fixed img-zone inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                <div className="relative">
                  <button
                    onClick={() => setExpandedImg(null)}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1"
                  >
                    <MdClose size={20} />
                  </button>
                  <img
                    src={expandedImg}
                    alt="Expanded View"
                    className="max-h-[80vh] max-w-full rounded-lg"
                  />
                </div>
              </div>
            )} */}
          </div>
        </div>
      )}



    {!loading&&  <div className="flex flex-col items-center justify-center gap-5 mb-5 py-5 md:flex-row">
  <button
    onClick={() => {
      setCurrentPage(currentPage - 1);
    }}
    disabled={currentPage === 1}
    className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
      currentPage === 1
        ? 'bg-white text-gray-400 border border-gray-300 cursor-not-allowed'
        : 'bg-white text-[#207dff] border border-emerald-600 hover:bg-emerald-600 hover:text-white'
    }`}
  >
    Prev
  </button>

  <h2 className="text-lg font-semibold text-gray-700">
        {`Showing ${total} of ${reports.length} Reports`}


  </h2>
  <button
    onClick={() => {
      setCurrentPage(currentPage + 1);
    }}
    disabled={total === reports.length}
    className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
      total === reports.length
        ? 'bg-white text-gray-400 border border-gray-300 cursor-not-allowed'
        : 'bg-white text-emerald-600 border border-emerald-600 hover:bg-emerald-600 hover:text-white'
    }`}
  >
    Next
  </button>
  
</div>}
    </main>
  );
};

export default Page;
