"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

function ReportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState([
    "AI generate General Description",
    "AI generate Detailed Analysis",
  ]);
  const [scan, setScan] = useState();

  // Handle file upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen p-8 sm:p-20 flex flex-col items-center">
      <div className="max-w-4xl mx-auto py-10 px-4 text-center">
        {!file && (
          <h1 className="text-3xl font-semibold text-slate-900">
            Upload Your CT Scans
          </h1>
        )}
      </div>

      {/* Drag & Drop Upload or Click to upload */}
      {/* TODO: CHANGE '!FILE' TO 'FILE' SO IT ONLY SHOWS ONCE FILE HAS BEEN UPLOADED */}
      {!file && (
        <div className="flex flex-col items-center justify-center mb-10 p-12 border-4 border-dashed rounded-xl cursor-pointer border-slate-300 bg-white">
          <input
            accept=".dcm,.nii,.nii.gz,.png,.jpg,.jpeg"
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileChange}
          />
          <label
            htmlFor="file-upload"
            className="text-lg text-slate-700 text-center cursor-pointer"
          >
            Click or Drag and Drop to Upload CT Scan
          </label>
        </div>
      )}

      {/* Display AI Analysis & 3D Model After Upload */}
      {!file && (
        <>
          {/* title that will remain the same no matter the scan */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl font-bold text-slate-900">
              View Your Vitals
            </h1>
            <p className="text-lg text-slate-600">
              Upload your scan to visualize and analyze.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 w-full max-w-6xl">
            {/* AI Analysis - Slide in from Left */}
            {/* uses framer-motion */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="bg-white shadow-lg rounded-lg p-6"
            >
              <h2 className="text-xl text-center font-semibold text-slate-900 mb-4">
                Analysis Report
              </h2>
              <p className="text-slate-600">{description[0]}</p>
              {/* Here is the section to add the AI from the backend */}
              <ul className="mt-4 text-slate-700 mb-5">
                {/* dummy text */}
                <li> {description[1]}</li>
              </ul>
              {/* option to download report */}
              <Button
                variant="ghost"
                size="lg"
                className="flex items-center gap-2 bg-violet-100 text-stone-800 mb-10"
              >
                <span className="lg:inline">Download Report</span>
              </Button>
            </motion.div>

            {/* 3D Lung Visualization - Slide in from Right */}
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="bg-white shadow-lg rounded-lg p-6 flex justify-center"
            >
              {/* Here is the section to add 3D model */}
              <div className="w-80 h-80 bg-gray-300 rounded-lg flex items-center justify-center">
                <p className="text-slate-700">[3D Model Here]</p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}

export default ReportPage;
