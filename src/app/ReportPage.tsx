function ReportPage() {
  return (
    <div className="bg-slate-50 items-center justify-items-center min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-4xl mx-auto py-10 px-4 space-y-0">
        <h1 className="text-3xl text-center font-semibold text-slate-900">
          Upload Your CT Scans
        </h1>
      </div>
      <div className="flex flex-col items-center jsutify-center p-10 border-4 border-dashed rounded-xl coursor-pointer border-salte-300 bg-white">
        <input
          accept=".dcm,.nii,.nii.gz,.png,.jpg,.jpeg"
          type="file"
          id="file-upload"
          className="hidden"
        />
        <label
          htmlFor="file-upload"
          className="text-lg text-slate-700 text-center cursor-pointer"
        >
          Drag and drop your CT image here, or click to select files
        </label>
      </div>
    </div>
  );
}

export default ReportPage;
