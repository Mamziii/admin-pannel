
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const API_BASE = "http://localhost:4000";

const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await axios.post(`${API_BASE}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  if (data.success && data.data?.url) {
    return data.data.url as string;
  }

  throw new Error(data.message || "آپلود ناموفق بود");
};

export const useUploadImage = () => {
  return useMutation({
    mutationFn: uploadFile,
    onError: () => {
      toast.error("خطا در آپلود تصویر");
    },
  });
};

// آپلود چند فایل پشت‌سرهم
export const useUploadImages = () => {
  return useMutation({
    mutationFn: async (files: File[]) => {
      const urls: string[] = [];
      for (const file of files) {
        const url = await uploadFile(file);
        urls.push(url);
      }
      return urls;
    },
    onError: () => {
      toast.error("خطا در آپلود تصاویر");
    },
  });
};