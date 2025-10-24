import React, { useState, useRef } from "react";
import { FaFileCsv, FaUpload } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const FileUploadForm = ({ handleOnChangeFile, handleOnSubmitFile }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const onFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    handleOnChangeFile(e);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setProgress(0);

    // Simulate upload progress (replace with your real upload logic)
    const fakeUpload = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(fakeUpload);
          setUploading(false);
          setSelectedFile(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
        return prev + 1;
      });
    }, 200);

    // Call your real upload handler
    handleOnSubmitFile(e);
  };

  return (
    <div className="flex justify-left items-center min-h-[10vh]">
      <form
        onSubmit={onSubmit}
        className="flex flex-row bg-white shadow-md rounded-2xl p-5 border border-gray-200 max-w-lg items-center justify-between gap-3 sm:w-auto"
      >
        {/* File Input */}
        <label
          htmlFor="csvFileInput"
          title="Select a CSV file to upload"
          className={`flex items-center gap-2 cursor-pointer font-semibold px-3 py-2 rounded-lg transition justify-center ${
            selectedFile
              ? "bg-green-500 text-white hover:bg-green-600"
              : "bg-amber-400 text-white hover:bg-amber-500"
          }`}
        >
          <FaFileCsv className="text-lg" />
          <span alt="Select file">{selectedFile ? selectedFile.name : "Select CSV File"}</span>
        </label>

        <input
          ref={fileInputRef}
          type="file"
          id="csvFileInput"
          accept=".csv"
          onChange={onFileChange}
          className="hidden"
        />

        {/* Import Button */}
        <button
          type="submit"
          title="Upload File"
          disabled={!selectedFile || uploading}
          className={`flex items-center gap-2 font-semibold px-4 py-2.5 rounded-lg transition justify-center
            ${
              selectedFile && !uploading
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
        >
          {uploading ? (
            <div className="flex items-center gap-2">
              <AiOutlineLoading3Quarters className="animate-spin text-lg" />
              <span>Uploading {progress}%</span>
            </div>
          ) : (
            <>
              <FaUpload className="text-lg" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default FileUploadForm;
