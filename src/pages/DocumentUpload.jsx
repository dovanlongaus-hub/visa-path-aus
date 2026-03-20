import React, { useState } from "react";

export default function DocumentUpload() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  function handleFileChange(e) {
    setFiles(Array.from(e.target.files));
  }

  function handleUpload() {
    setUploading(true);
    // TODO: Tích hợp upload lên Supabase/S3/server
    setTimeout(() => {
      setUploading(false);
      alert("Upload thành công! (Demo)");
    }, 1200);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 mt-12 mb-24">
        <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">Upload & Lưu Trữ Hồ Sơ</h2>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-blue-400"
        />
        <button
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-lg"
          onClick={handleUpload}
          disabled={uploading || files.length === 0}
        >{uploading ? "Đang upload..." : "Upload"}</button>
        <ul className="mt-6 space-y-2">
          {files.map((file, idx) => (
            <li key={idx} className="text-blue-800 text-sm">{file.name}</li>
          ))}
        </ul>
      </div>
      <div className="fixed bottom-0 left-0 w-full bg-blue-900 text-white text-center py-3 text-sm font-semibold shadow-lg z-50">
        Phiên bản mới: Upload & lưu trữ hồ sơ (DocumentUpload.jsx)
      </div>
    </div>
  );
}
