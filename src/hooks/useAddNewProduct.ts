// src/hooks/useAddNewProduct.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import type { UseFormReset } from "react-hook-form";

export interface AddNewProductFormType {
  category: string;
  title: string;
  mainImage: string;
  price: string;
  desc: string;
  images: string; // کاما جدا شده
  colors: string; // کاما جدا شده
  sizes: string; // کاما جدا شده
  quantity: string;
  rate: string;
  discount: string;
  date: string;
  type?: string;
}

const API_URL = "http://localhost:4000/products";

export const useAddNewProduct = (reset: UseFormReset<AddNewProductFormType>) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: AddNewProductFormType) => {
      // تبدیل داده‌های فرم به فرمت مورد نیاز بک‌اند
      const payload = {
        category: data.category.trim(),
        title: data.title.trim(),
        mainImage: data.mainImage,
        price: Number(data.price),
        desc: data.desc.trim(),
        images: data.images
          ? data.images.split(",").map((img) => img.trim()).filter(Boolean)
          : [],
        colors: data.colors
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
        sizes: data.sizes
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        quantity: Number(data.quantity),
        rate: Number(data.rate),
        discount: Number(data.discount),
        date: data.date,
        type: data.type?.trim() || "",
      };

      const res = await axios.post(API_URL, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("محصول با موفقیت اضافه شد");
      reset(); // پاک کردن فرم
    },
    onError: () => {
      toast.error("خطا در افزودن محصول. لطفاً دوباره تلاش کنید.");
    },
  });

  const onSubmit = (data: AddNewProductFormType) => {
    mutation.mutate(data);
  };

  return { onSubmit, mutation };
};