import React, { useState } from "react";
import { Upload, FileText, X, CheckCircle } from "lucide-react"; // Using Lucide for clean icons
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext";
import Papa from "papaparse";

export default function UploadCSV() {
  const navigate = useNavigate();
  const { setFileData } = useData();
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const uploadedFile = e.dataTransfer.files[0];
    if (uploadedFile?.type === "text/csv") {
      setFile(uploadedFile);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Please upload a CSV file");
      return;
    }

    setIsLoading(true);

    try {
      // Parse CSV
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,

        complete: async (results) => {
          try {
            console.log("Parsed CSV:", results.data);
            setData(results.data);
            const formData = new FormData();
            formData.append("file", file);

            const response = await axios.post(
              `${import.meta.env.VITE_BACKEND_URL}/api/analyze`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              },
            );

            // Save file in context
            setFileData({
              file,
              rows: results.data,
            });

            console.log("Analysis Data:", response.data);

            // Send parsed rows + analytics
            navigate("/dashboard", {
              state: {
                analyticsData: response.data,
                csvRows: results.data,
              },
            });
          } catch (err) {
            console.error("Upload failed:", err);
            alert("Error uploading file");
          } finally {
            setIsLoading(false);
          }
        },

        error: (err) => {
          console.error("CSV Parsing Error:", err);
          alert("Error reading CSV file");
          setIsLoading(false);
        },
      });
    } catch (error) {
      console.error("Unexpected Error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-sans">
      {/* Background Decorative Blobs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="relative w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 transition-all">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Upload Dataset</h1>
          <p className="text-slate-400">
            Upload your CSV file to begin the data diagnostic analysis.
          </p>
        </div>

        {/* Upload Zone */}
        {!file ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`
              relative group cursor-pointer
              border-2 border-dashed rounded-2xl p-12
              flex flex-col items-center justify-center
              transition-all duration-300
              ${isDragging ? "border-blue-400 bg-blue-400/10" : "border-slate-700 hover:border-slate-500 bg-white/5"}
            `}
          >
            <div className="p-4 bg-blue-500/20 rounded-full mb-4 group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8 text-blue-400" />
            </div>
            <p className="text-lg text-slate-200 font-medium">
              Drag & drop your CSV here
            </p>
            <p className="text-sm text-slate-500 mt-2">
              or <span className="text-blue-400 underline">browse files</span>
            </p>
            <input
              type="file"
              accept=".csv"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
        ) : (
          /* File Selected State */
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <FileText className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-white font-medium">{file.name}</p>
                  <p className="text-xs text-slate-500">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={() => setFile(null)}
                className="p-2 hover:bg-white/10 rounded-full text-slate-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <button
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center space-x-2"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              <CheckCircle className="w-5 h-5" />
              <span>Proceed to Analytics</span>
            </button>
          </div>
        )}

        {/* Footer info */}
        <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/5 pt-6 text-center">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider">
              Format
            </p>
            <p className="text-sm text-slate-300 mt-1 font-mono">.CSV only</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider">
              Max Size
            </p>
            <p className="text-sm text-slate-300 mt-1 font-mono">50MB</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider">
              Security
            </p>
            <p className="text-sm text-slate-300 mt-1 font-mono">AES-256</p>
          </div>
        </div>
      </div>
    </div>
  );
}
