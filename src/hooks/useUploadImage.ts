import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "../config/api";

const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await axios.post(`${API_URL}/upload`, formData);

  if (data.success && data.data?.url) {
    return data.data.url as string;
  }

  throw new Error(data.message || "آپلود ناموفق بود");
};

export const useUploadImage = () => {
  return useMutation({
    mutationFn: uploadFile,
    onError: () => toast.error("خطا در آپلود تصویر"),
  });
};

export const useUploadImages = () => {
  return useMutation({
    mutationFn: async (files: File[]) => {
      const urls: string[] = [];
      for (const file of files) {
        urls.push(await uploadFile(file));
      }
      return urls;
    },
    onError: () => toast.error("خطا در آپلود تصاویر"),
  });
};