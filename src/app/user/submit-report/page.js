"use client"

import { useState } from "react"
import endpointroute from "../../utils/endpointroute"
import { X } from "lucide-react"
import { ToastContainer, toast } from "react-toastify"
import Image from "next/image"

export default function CreateReport() {
  const [reportData, setReportData] = useState({
    AGO: "",
    PMS: "",
    DPK: "",
    CrudeOil: "",
    ovenCount: "",
    tankCount: "",
    irsCount:"",
    woodenBoatCount: "",
    arrestedSuspects: "",
    remark: "",
    lat: "",
    lng: "",
    place: "",
  })

  const [images, setImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [upload, setUpload] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setReportData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"]
    const filteredFiles = files.filter(file => validTypes.includes(file.type))
    setImages(prev => [...prev, ...filteredFiles])
    const newPreviews = filteredFiles.map(file => URL.createObjectURL(file))
    setImagePreviews(prev => [...prev, ...newPreviews])
  }

  const removeImage = (indexToRemove) => {
    setImages(prev => prev.filter((_, idx) => idx !== indexToRemove))
    setImagePreviews(prev => prev.filter((_, idx) => idx !== indexToRemove))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUpload(true)

    const formData = new FormData()

   formData.append("AGO", reportData.AGO || "0")
formData.append("PMS", reportData.PMS || "0")
formData.append("DPK", reportData.DPK || "0")
formData.append("CrudeOil", reportData.CrudeOil || "0")
    formData.append("ovenCount", reportData.ovenCount || "0")
    formData.append("tankCount", reportData.tankCount || "0")
        formData.append("irsCount", reportData.irsCount || "0")
    formData.append("woodenBoatCount", reportData.woodenBoatCount || "0")
    formData.append("arrestedSuspects", reportData.arrestedSuspects || "0")
    formData.append("remark", reportData.remark|| "")
    formData.append("lat", reportData.lat)
    formData.append("lng", reportData.lng)
    formData.append("place", reportData.place)

    images.forEach((img) => {
      formData.append("images", img)
    })

    try {
      await endpointroute.post("user/submit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      toast.success("Report created successfully!")

      setReportData({
        AGO: "",
        PMS: "",
        DPK: "",
        CrudeOil: "",
        ovenCount: "",
        tankCount: "",
        woodenBoatCount: "",
        arrestedSuspects: "",
        remark: "",
        lat: "",
        lng: "",
        place: "",
        irsCount:""
      })
      setImages([])
      setImagePreviews([])
    } catch (error) {
      console.log("Submission error:", error)
      toast.error(error?.response?.data?.message || "Server error. Please try again.")
    } finally {
      setUpload(false)
    }
  }

  return (
   <div className="max-w-4xl mx-auto p-4 text-black">
  <ToastContainer />
  <h1 className="text-2xl font-bold mb-4 text-blue-600">Submit a Report</h1>
  <form onSubmit={handleSubmit} className="space-y-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

      {/* 🔁 Place First */}
      <div className="col-span-full">
        <label className="block mb-1 font-medium">Place</label>
        <input
          type="text"
          name="place"
          value={reportData.place}
          onChange={handleInputChange}
          placeholder="e.g. Escravos Jetty"
          className="p-2 border rounded w-full"
          required
        />
      </div>

      {/* 🔁 Then Longitude & Latitude */}
      <div>
        <label className="block mb-1 font-medium">Longitude</label>
        <input
          type="number"
          step="any"
          name="lng"
          value={reportData.lng}
          onChange={handleInputChange}
          placeholder="e.g. 3.3792"
          className="p-2 border rounded w-full"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Latitude</label>
        <input
          type="number"
          step="any"
          name="lat"
          value={reportData.lat}
          onChange={handleInputChange}
          placeholder="e.g. 6.5244"
          className="p-2 border rounded w-full"
          required
        />
      </div>

      {/* 🔁 Then Volumes and Counts */}
      {["AGO", "PMS", "DPK", "CrudeOil"].map((key) => (
        <div key={key}>
          <label className="block mb-1 font-medium">{key}</label>
          <div className="flex items-center">
            <input
              type="number"
              name={key}
              value={reportData[key]}
              onChange={handleInputChange}
              placeholder="e.g. 1000"
              className="p-2 border rounded w-full"
              required
            />
            <span className="ml-2">litres</span>
          </div>
        </div>
      ))}

      {["ovenCount", "tankCount", "woodenBoatCount", "arrestedSuspects","irsCount"].map((key) => (
        <div key={key}>
          <label className="block mb-1 font-medium">{key.replace(/([A-Z])/g, " $1")}</label>
          <input
            type="number"
            name={key}
            value={reportData[key]}
            onChange={handleInputChange}
            className="p-2 border rounded w-full"
            required
          />
        </div>
      ))}
    </div>

    {/* Remark */}
    <div>
      <label className="block mb-1 font-medium">Remark</label>
      <textarea
        name="remark"
        value={reportData.remark}
        onChange={handleInputChange}
        placeholder="Enter remarks or findings..."
        className="p-2 border rounded w-full"
        required
      />
    </div>

    {/* Upload Images */}
    <div className="mt-4">
      <label className="block mb-2 font-semibold">Upload Images</label>
      <input
        type="file"
        multiple
        accept="image/png, image/jpeg, image/webp, image/avif"
        onChange={handleImageChange}
        className="p-2 border w-full"
      />
      <div className="flex gap-4 mt-3 flex-wrap">
        {imagePreviews.map((src, idx) => (
          <div key={idx} className="relative group w-24 h-24">
            <Image
              src={src}
              alt={`Preview ${idx}`}
              className="w-full h-full object-cover rounded"
              width={200}
              height={200}
            />
            <button
              type="button"
              onClick={() => removeImage(idx)}
              className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-full group-hover:opacity-100 transition"
              title="Remove image"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>

    <button
      type="submit"
      disabled={upload}
      className={`mt-6 px-6 py-2 rounded transition text-white ${
        upload ? "bg-blue-600 opacity-50 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
      }`}
    >
      {upload ? "Creating..." : "Create Report"}
    </button>
  </form>
</div>

  )
}
