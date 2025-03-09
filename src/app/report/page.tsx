"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import ModelViewer from "@/components/ui/model-viewer";
import { Calendar, ArrowRight } from "lucide-react";

function AnalysisReport() {
  const [loading, setLoading] = useState(true);
  const pageRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    // Simulate a loading process (2 seconds delay)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer); // Cleanup the timer when the component unmounts
  }, [setLoading]);

  if (loading) {
    return (
      <div className="flex justify-center items-center ">
        <div className="animate-spin rounded-full border-t-4 border-blue-500 h-12 w-12"></div>
      </div>
    );
  }
  const openPrintDialog = () => {
    if (pageRef.current) {
      window.print(); // This opens the browser's print dialog
    }
  };
  return (
    <div className="space-y-6" ref={pageRef}>
      <h3 className="font-semibold text-lg mb-3">Detailed Analysis</h3>

      <div className="space-y-4">
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h4 className="font-medium text-[#2d6ca7]">Nodule Characteristics</h4>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div>
              <p className="text-sm text-gray-500">Size</p>
              <p className="font-medium">0.9cm</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Density</p>
              <p className="font-medium">Solid</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h4 className="font-medium text-[#2d6ca7]">Cancer Risk Assessment</h4>
          <div className="mt-2 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Low Risk</span>
              <span className="text-sm">High Risk</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full">
              <div className="bg-amber-500 h-2 rounded-full w-[55%]"></div>
            </div>
            <p className="text-sm text-gray-600">
              Based on nodule characteristics, location, and history
            </p>
          </div>
        </div>
      </div>

      {/* Comparison with previous scans */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <h3 className="font-semibold mb-3">Comparison with Previous Scans</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm">Dec 10, 2024</span>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-500" />
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm">Mar 9, 2025</span>
          </div>
        </div>
        <div className="mt-3">
          <p className="text-sm text-gray-700">
            <span className="font-medium text-amber-700">Growth detected:</span>{" "}
            Primary nodule has increased in size by 0.2cm since previous scan
            (.7cm → 0.9cm)
          </p>
        </div>
      </div>
      {/* option to download report */}

      <Button
        variant="ghost"
        size="lg"
        className="flex items-center gap-2 bg-violet-100 text-stone-800 mb-10"
        onClick={openPrintDialog} // Call openPrintDialog on button click
      >
        <span className="lg:inline">Print Report</span>
      </Button>
    </div>
  );
}

function ReportPage() {
  const [file, setFile] = useState<File | null>(null);

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
      {file && (
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
              <AnalysisReport />
            </motion.div>

            {/* 3D Lung Visualization - Slide in from Right */}
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="bg-white shadow-lg rounded-lg p-6 flex justify-center"
            >
              {/* Here is the section to add 3D model */}
              <div className="w-full h-80 bg-gray-300 rounded-lg flex items-center justify-center">
                <ModelViewer />
              </div>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}

export default ReportPage;
