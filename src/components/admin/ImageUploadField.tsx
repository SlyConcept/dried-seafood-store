"use client";

import { useState } from "react";

export default function ImageUploadField({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Upload failed");
      } else {
        onChange(data.url);
      }
    } catch {
      setError("Upload failed — check your connection");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="sm:col-span-2">
      <label className="block text-sm font-medium text-slate-700 mb-1">
        Product image
      </label>
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt="Preview"
            className="w-28 h-28 object-cover rounded-lg border border-slate-200"
          />
        ) : (
          <div className="w-28 h-28 rounded-lg border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-xs text-slate-400">
            No image
          </div>
        )}
        <div className="flex-1 space-y-2 w-full">
          <label className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 cursor-pointer text-sm font-medium text-slate-800 px-4 py-2.5 rounded-lg transition">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
                e.target.value = "";
              }}
            />
            {uploading ? "Uploading..." : "Upload image"}
          </label>
          <p className="text-xs text-slate-500">
            JPEG, PNG, WebP or GIF · max 4.5MB
          </p>
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Or paste image URL"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
