import { useState, useRef } from "react";
import { Upload, Loader2, FileSpreadsheet } from "lucide-react";
import { toast } from "react-toastify";
import { api } from "../api/base";

const ExtractData = () => {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so user can re-upload the same file if needed
    e.target.value = "";

    const formData = new FormData();
    formData.append("upload_file", file);

    setLoading(true);

    try {
      const response = await api.post("/api/v1/extract/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob", // Crucial for receiving binary Excel files
      });

      // Extract filename from response headers or fallback
      const contentDisposition = response.headers["content-disposition"];
      let filename = `extracted_${file.name}`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match?.[1]) filename = match[1];
      }

      // Create downloadable Blob URL
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const downloadUrl = window.URL.createObjectURL(blob);

      // Trigger automatic browser download
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      toast.success("File processed and downloaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to extract data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".xlsx, .xls"
        className="hidden"
      />

      {/* Large Center Upload Card/Button */}
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
        className={`group relative flex flex-col items-center justify-center w-full max-w-xl h-80 p-8 border-2 border-dashed rounded-3xl transition-all duration-300 ${
          loading
            ? "border-blue-300 bg-blue-50/50 cursor-not-allowed"
            : "border-slate-300 bg-white hover:border-blue-500 hover:bg-blue-50/30 hover:shadow-xl cursor-pointer"
        }`}
      >
        {loading ? (
          <div className="flex flex-col items-center gap-4 text-blue-600">
            <Loader2 className="w-16 h-16 animate-spin" />
            <p className="text-lg font-semibold animate-pulse">
              Processing & Extracting Data...
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 text-slate-600 group-hover:text-blue-600 transition-colors">
            <div className="p-5 bg-slate-100 rounded-2xl group-hover:bg-blue-100 transition-colors">
              <FileSpreadsheet className="w-12 h-12 text-slate-700 group-hover:text-blue-600" />
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-slate-800 group-hover:text-blue-600">
                Click to Upload Excel File
              </p>
              <p className="text-sm text-slate-400 mt-1">
                Supports .xlsx or .xls files
              </p>
            </div>
            <span className="inline-flex items-center gap-2 mt-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium shadow-md group-hover:bg-blue-700 transition">
              <Upload className="w-4 h-4" /> Choose File
            </span>
          </div>
        )}
      </button>
    </div>
  );
};

export default ExtractData;
