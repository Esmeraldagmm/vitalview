"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import ModelViewer from "@/components/ui/model-viewer";

const MockData = {
  metadata: {
    version: 4.5,
    type: "BufferGeometry",
    generator: "EnhancedTumorDataGenerator",
  },
  data: {
    attributes: {
      position: {
        itemSize: 3,
        type: "Float32Array",
        array: [
          // Central point
          0.0,
          0.0,
          0.0,

          // Core shape points (scaled up by ~2.5x)
          2.8,
          0.3,
          -0.7, // 1
          2.5,
          2.4,
          1.3, // 2
          -1.2,
          2.7,
          0.9, // 3
          -2.6,
          0.5,
          -0.4, // 4
          -2.0,
          -2.5,
          1.5, // 5
          0.7,
          -3.0,
          2.7, // 6
          2.8,
          -2.2,
          1.9, // 7

          // Additional points for asymmetric bulges (tumor-like)
          1.8,
          1.8,
          3.1, // 8
          -1.5,
          1.3,
          2.8, // 9
          -2.2,
          -0.8,
          2.5, // 10
          0.9,
          -1.5,
          3.3, // 11

          // Protrusions and irregular features
          3.3,
          0.8,
          1.6, // 12
          3.0,
          -0.9,
          0.7, // 13
          2.4,
          0.1,
          2.5, // 14
          -0.8,
          2.9,
          1.8, // 15
          -3.1,
          -1.4,
          0.5, // 16
          -1.1,
          -2.9,
          0.8, // 17
          1.5,
          -2.6,
          0.4, // 18
          0.6,
          1.3,
          3.4, // 19
          -1.9,
          0.2,
          3.0, // 20
        ],
        normalized: false,
      },
      normal: {
        itemSize: 3,
        type: "Float32Array",
        array: [
          0.0,
          0.0,
          1.0, // 0
          0.8,
          0.1,
          0.6, // 1
          0.6,
          0.7,
          0.4, // 2
          -0.4,
          0.8,
          0.4, // 3
          -0.9,
          0.1,
          -0.4, // 4
          -0.6,
          -0.8,
          0.1, // 5
          0.2,
          -0.9,
          0.4, // 6
          0.8,
          -0.6,
          0.2, // 7
          0.4,
          0.4,
          0.8, // 8
          -0.5,
          0.3,
          0.8, // 9
          -0.7,
          -0.2,
          0.7, // 10
          0.3,
          -0.4,
          0.9, // 11
          0.9,
          0.2,
          0.4, // 12
          0.8,
          -0.2,
          0.6, // 13
          0.6,
          0.0,
          0.8, // 14
          -0.2,
          0.8,
          0.6, // 15
          -0.8,
          -0.4,
          0.4, // 16
          -0.3,
          -0.8,
          0.5, // 17
          0.5,
          -0.7,
          0.5, // 18
          0.2,
          0.4,
          0.9, // 19
          -0.6,
          0.1,
          0.8, // 20
        ],
        normalized: false,
      },
    },
    index: {
      type: "Uint16Array",
      array: [
        // Core connections to center
        0, 1, 2, 0, 2, 3, 0, 3, 4, 0, 4, 5, 0, 5, 6, 0, 6, 7, 0, 7, 1,

        // Upper bulge connections
        0, 8, 2, 0, 3, 9, 0, 9, 10, 0, 10, 5, 0, 6, 11, 0, 11, 8,

        // Connect adjacent main vertices
        1, 2, 12, 2, 3, 15, 3, 4, 16, 4, 5, 16, 5, 6, 17, 6, 7, 18, 7, 1, 13,

        // Connect bulges
        2, 8, 19, 3, 9, 15, 5, 10, 16, 6, 11, 17, 8, 11, 19, 9, 10, 20,

        // Additional connections for irregular shape
        1, 12, 14, 12, 2, 14, 2, 15, 19, 15, 3, 9, 4, 16, 20, 16, 5, 10, 5, 17,
        6, 6, 18, 11, 18, 7, 13, 7, 13, 1, 8, 19, 14, 14, 13, 1, 19, 15, 9, 9,
        20, 10, 10, 16, 20, 11, 18, 17, 12, 14, 13,
      ],
    },
  },
};
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
              <ModelViewer tumorData={MockData} />
              {/* <div className="w-80 h-80 bg-gray-300 rounded-lg flex items-center justify-center">
                <p className="text-slate-700">[3D Model Here]</p>
              </div> */}
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}

export default ReportPage;
