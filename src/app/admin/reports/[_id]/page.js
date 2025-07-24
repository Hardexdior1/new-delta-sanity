'use client';

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import endpointroute from "@/app/utils/endpointroute";
import { MdClose } from "react-icons/md";
import { ToastContainer,toast } from "react-toastify";

const Page = () => {
  const route = usePathname();
  const splittedRoute = route.split('/')[3];
  console.log('splitted',splittedRoute)
  const searchParams = useSearchParams();
 const name = searchParams.get('name')
  const [loading, setLoading] = useState(false);
  const [reports, setReport] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [view, setView] = useState(null);
  const [expandedImg, setExpandedImg] = useState(null);
  // base/user/686a417d2fb94cce533ae897/reports
  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const res = await endpointroute.get(`base/user/${splittedRoute}/reports`);
        setReport(res.data);
        setNotFound(false);
        console.log(res)
      } catch (error) {
        if (error?.response?.status === 404) {
          setNotFound(true);
          console.log(error)
        } else {
          console.log("Error fetching report:", error);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [splittedRoute]);

  const [sending,setSending]=useState(false)
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
  const itemsPerPage=6
    const [search, setSearch] = useState("");
  const filteredReports = reports.filter((report) =>
    report.place?.toLowerCase().includes(search.trim().toLowerCase())
  );

      const [currentPage,setCurrentPage]=useState(1)
    
      const startIndex=(currentPage-1)*itemsPerPage
    
      const lastIndex=startIndex+itemsPerPage
    
    const paginatedReports=filteredReports.slice(startIndex,lastIndex)
    
      const total=Math.min(lastIndex, paginatedReports.length)

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold text-black mb-4"> All Reports From {name }  </h1>
      <ToastContainer />
<input
        type="text"
        placeholder="Search by place..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md px-4 py-2 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
      />
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : notFound ||filteredReports.length === 0? (
        <div className="text-center py-10">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">
            No report found for this units
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Please check again later or select a different unit.
          </p>
        </div>
      ) :   
        <div className={`grid gap-4 md:grid-cols-2 lg:${reports.length>2?`grid-cols-3`:`grid-cols-2`}`}>
          {reports.map((report, index) => (
       <div
  key={index}
  className="bg-white border border-black rounded-xl shadow-sm p-4 max-w-xl transition hover:shadow-md duration-200 space-y-3"
>
  <div className="flex flex-col gap-2">
    <h2 className="text-base font-semibold text-black">
      Place: {report.place.charAt(0).toUpperCase() + report.place.slice(1)}
    </h2>
    <p className="text-sm text-blue-500">
      {new Date(report.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })}
    </p>
  </div>

  <div className="grid grid-cols-2 gap-2 text-sm text-black">
    <p><span className="font-medium">AGO:</span> {report.AGO}</p>
    <p><span className="font-medium">PMS:</span> {report.PMS}</p>
    <p><span className="font-medium">DPK:</span> {report.DPK}</p>
    <p><span className="font-medium">Crude Oil:</span> {report.CrudeOil}</p>
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
        }

      {showModal && view && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-white max-h-[90vh] overflow-y-auto p-6 rounded-lg w-11/12 xl:w-3/5 shadow-xl relative print-area">
            <div className="flex justify-between items-center ">
              <h4 className="text-blue-600 font-bold text-lg">
                Submitted by {name}
              </h4>
              <div className="flex gap-4">
                <button
                disabled={sending}
                  onClick={handleEachPrintRequest }
                  className="no-print px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                >
                 {sending?"printing..":"print"}
                </button>
                <button onClick={() => setShowModal(false)}>
                  <MdClose size={24} className="no-print text-gray-600 hover:text-black" />
                </button>
              </div>
            </div>

            <h4 className="text-black mb-2 font-semibold text-lg">
                Date: {new Date(view.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
              </h4>

            <form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="md:col-span-2">
                  <label className="block font-medium mb-1">Place</label>
                  <input
                    type="text"
                    value={view.place}
                    disabled
                    className="w-full p-1.5 text-sm bg-gray-100 border border-transparent rounded-md text-gray-700"
                  />
                </div>

                {["AGO", "PMS", "DPK", "CrudeOil", "arrestedSuspects", "irsCount", "ovenCount", "tankCount", "woodenBoatCount"].map((field) => (
                  <div key={field}>
                    <label className="block font-medium mb-1">{field.replace(/([A-Z])/g, ' $1')}</label>
                    <input
                      type="text"
                      value={view[field]}
                      disabled
                      className="w-full p-1.5 text-sm bg-gray-100 border border-transparent rounded-md text-gray-700"
                    />
                  </div>
                ))}

                <div className="md:col-span-2">
                  <label className="block font-medium mb-1">Remark</label>
                   <textarea
                   rows={6}
                      type="text"
                      value={view.remark}
                      disabled
                      className="w-full p-1.5 text-sm bg-gray-100 border border-transparent rounded-md text-gray-700"
                    />
                 
                </div>

                <div className="md:col-span-2 img-zone">
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
                </div>
              </div>
            </form>

            {expandedImg && (
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
            )}
          </div>
        </div>
      )}



      <div className="flex flex-col items-center justify-center gap-5 mb-5 py-5 md:flex-row">
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
  
</div>
    </main>
  );
};

export default Page;
