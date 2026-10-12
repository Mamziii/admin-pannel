import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  useAddNewProduct,
  type AddNewProductFormType,
} from "../hooks/useAddNewProduct";
import {
  PlusCircle,
  Upload,
  Loader2,
  Image as ImageIcon,
  X,
} from "lucide-react";


const IMGHOSTING_API_KEY = "sk_live_r9fc88smp3da6p5lo9k2k";

export default function AddNewProduct() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AddNewProductFormType>({
    mode: "onChange",
  });

  const [uploading, setUploading] = useState(false);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [extraImagesPreview, setExtraImagesPreview] = useState<string[]>([]);

  const { onSubmit, mutation } = useAddNewProduct((values) => {
    reset(values);
    setMainImagePreview(null);
    setExtraImagesPreview([]);
  });

  // آپلود عکس اصلی
  const handleMainImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const url = await uploadToImgHosting(file);
    if (url) {
      setValue("mainImage", url, { shouldValidate: true });
      setMainImagePreview(url);
    }
    setUploading(false);
  };

  // آپلود عکس‌های اضافی
  const handleExtraImagesUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const urls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const url = await uploadToImgHosting(files[i]);
      if (url) urls.push(url);
    }

    setValue("images", urls.join(", "), { shouldValidate: true });
    setExtraImagesPreview(urls);
    setUploading(false);
  };

  // حذف عکس اضافی
  const removeExtraImage = (index: number) => {
    const newPreviews = extraImagesPreview.filter((_, i) => i !== index);
    setExtraImagesPreview(newPreviews);
    setValue("images", newPreviews.join(", "));
  };

  // آپلود به imghosting.in
  const uploadToImgHosting = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file); // اسم فیلد باید "file" باشد

    try {
      const res = await fetch("https://api.imghosting.in/upload", {
        method: "POST",
        headers: {
          "X-Free-API-Key": IMGHOSTING_API_KEY,
        },
        body: formData,
      });

      const data = await res.json();

      if (data.success && data.data?.url) {
        return data.data.url;
      }

      console.error("Upload failed:", data);
      return null;
    } catch (error) {
      console.error("Upload error:", error);
      return null;
    }
  };

  const inputClass =
    "w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-500";

  const labelClass = "block text-sm font-medium text-slate-300 mb-2";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
          <PlusCircle className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">افزودن محصول جدید</h2>
          <p className="text-sm text-slate-400">اطلاعات محصول را وارد کنید</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* دسته‌بندی */}
            <div>
              <label htmlFor="category" className={labelClass}>
                دسته‌بندی محصول
              </label>
              <input
                {...register("category", {
                  required: "وارد کردن دسته‌بندی اجباری است",
                })}
                type="text"
                id="category"
                placeholder="مثلاً: پیراهن"
                className={inputClass}
              />
              {errors.category && (
                <p className="text-red-400 text-xs mt-1.5">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* عنوان */}
            <div>
              <label htmlFor="title" className={labelClass}>
                عنوان محصول
              </label>
              <input
                {...register("title", {
                  required: "وارد کردن عنوان محصول اجباری است",
                })}
                type="text"
                id="title"
                placeholder="مثلاً: پیراهن کبریتی 92320"
                className={inputClass}
              />
              {errors.title && (
                <p className="text-red-400 text-xs mt-1.5">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* قیمت */}
            <div>
              <label htmlFor="price" className={labelClass}>
                قیمت (تومان)
              </label>
              <input
                {...register("price", {
                  required: "وارد کردن قیمت اجباری است",
                  pattern: {
                    value: /^\d+$/,
                    message: "فقط عدد وارد کنید",
                  },
                })}
                type="text"
                id="price"
                placeholder="مثلاً: 3520000"
                className={inputClass}
              />
              {errors.price && (
                <p className="text-red-400 text-xs mt-1.5">
                  {errors.price.message}
                </p>
              )}
            </div>

            {/* تعداد */}
            <div>
              <label htmlFor="quantity" className={labelClass}>
                تعداد موجودی
              </label>
              <input
                {...register("quantity", {
                  required: "وارد کردن تعداد اجباری است",
                  pattern: {
                    value: /^\d+$/,
                    message: "فقط عدد وارد کنید",
                  },
                })}
                type="text"
                id="quantity"
                placeholder="مثلاً: 54"
                className={inputClass}
              />
              {errors.quantity && (
                <p className="text-red-400 text-xs mt-1.5">
                  {errors.quantity.message}
                </p>
              )}
            </div>

            {/* امتیاز */}
            <div>
              <label htmlFor="rate" className={labelClass}>
                امتیاز (از ۵)
              </label>
              <input
                {...register("rate", {
                  required: "وارد کردن امتیاز اجباری است",
                  pattern: {
                    value: /^\d(\.\d)?$/,
                    message: "مثلاً: ۳.۵",
                  },
                })}
                type="text"
                id="rate"
                placeholder="مثلاً: 3.5"
                className={inputClass}
              />
              {errors.rate && (
                <p className="text-red-400 text-xs mt-1.5">
                  {errors.rate.message}
                </p>
              )}
            </div>

            {/* تخفیف */}
            <div>
              <label htmlFor="discount" className={labelClass}>
                درصد تخفیف
              </label>
              <input
                {...register("discount", {
                  required: "وارد کردن تخفیف اجباری است",
                  pattern: {
                    value: /^\d+$/,
                    message: "فقط عدد وارد کنید",
                  },
                })}
                type="text"
                id="discount"
                placeholder="مثلاً: 10 (اگر ندارد 0 بگذارید)"
                className={inputClass}
              />
              {errors.discount && (
                <p className="text-red-400 text-xs mt-1.5">
                  {errors.discount.message}
                </p>
              )}
            </div>

            {/* رنگ‌ها */}
            <div>
              <label htmlFor="colors" className={labelClass}>
                رنگ‌های محصول
              </label>
              <input
                {...register("colors", {
                  required: "وارد کردن رنگ‌ها اجباری است",
                })}
                type="text"
                id="colors"
                placeholder="مثلاً: #8F9E7E, #FFFDD0, #FAF3E0"
                className={inputClass}
              />
              {errors.colors && (
                <p className="text-red-400 text-xs mt-1.5">
                  {errors.colors.message}
                </p>
              )}
            </div>

            {/* سایزها */}
            <div>
              <label htmlFor="sizes" className={labelClass}>
                سایزهای محصول
              </label>
              <input
                {...register("sizes", {
                  required: "وارد کردن سایزها اجباری است",
                })}
                type="text"
                id="sizes"
                placeholder="مثلاً: M, L, XL"
                className={inputClass}
              />
              {errors.sizes && (
                <p className="text-red-400 text-xs mt-1.5">
                  {errors.sizes.message}
                </p>
              )}
            </div>

            {/* تاریخ */}
            <div>
              <label htmlFor="date" className={labelClass}>
                تاریخ افزودن
              </label>
              <input
                {...register("date", {
                  required: "وارد کردن تاریخ اجباری است",
                })}
                type="date"
                id="date"
                className={inputClass}
              />
              {errors.date && (
                <p className="text-red-400 text-xs mt-1.5">
                  {errors.date.message}
                </p>
              )}
            </div>

            {/* نوع (اختیاری) */}
            <div>
              <label htmlFor="type" className={labelClass}>
                نوع محصول (اختیاری)
              </label>
              <input
                {...register("type")}
                type="text"
                id="type"
                placeholder="مثلاً: bag"
                className={inputClass}
              />
            </div>
          </div>

          {/* توضیحات - تمام عرض */}
          <div>
            <label htmlFor="desc" className={labelClass}>
              توضیحات محصول
            </label>
            <textarea
              {...register("desc", {
                required: "وارد کردن توضیحات اجباری است",
              })}
              id="desc"
              rows={3}
              placeholder="توضیحات کامل محصول را بنویسید..."
              className={`${inputClass} resize-none`}
            />
            {errors.desc && (
              <p className="text-red-400 text-xs mt-1.5">
                {errors.desc.message}
              </p>
            )}
          </div>

          {/* آپلود عکس اصلی */}
          <div>
            <label className={labelClass}>عکس اصلی محصول</label>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <label className="flex flex-col items-center justify-center w-full sm:w-48 h-36 border-2 border-dashed border-white/15 rounded-xl cursor-pointer hover:border-indigo-500/50 hover:bg-white/5 transition-all">
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  {uploading ? (
                    <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                  ) : (
                    <Upload className="w-6 h-6" />
                  )}
                  <span className="text-xs">
                    {uploading ? "در حال آپلود..." : "انتخاب عکس"}
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMainImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>

              {mainImagePreview && (
                <div className="relative">
                  <img
                    src={mainImagePreview}
                    alt="پیش‌نمایش"
                    className="w-36 h-36 object-cover rounded-xl border border-white/10"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setMainImagePreview(null);
                      setValue("mainImage", "");
                    }}
                    className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
            <input
              type="hidden"
              {...register("mainImage", { required: "عکس اصلی اجباری است" })}
            />
            {errors.mainImage && (
              <p className="text-red-400 text-xs mt-1.5">
                {errors.mainImage.message}
              </p>
            )}
          </div>

          {/* آپلود عکس‌های اضافی */}
          <div>
            <label className={labelClass}>تصاویر اضافی (چندتایی)</label>
            <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-white/15 rounded-xl cursor-pointer hover:border-indigo-500/50 hover:bg-white/5 transition-all">
              <div className="flex flex-col items-center gap-2 text-slate-400">
                {uploading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
                ) : (
                  <ImageIcon className="w-5 h-5" />
                )}
                <span className="text-xs">
                  {uploading ? "در حال آپلود..." : "انتخاب چند عکس"}
                </span>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleExtraImagesUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>

            {extraImagesPreview.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4">
                {extraImagesPreview.map((url, i) => (
                  <div key={i} className="relative">
                    <img
                      src={url}
                      alt={`پیش‌نمایش ${i + 1}`}
                      className="w-20 h-20 object-cover rounded-lg border border-white/10"
                    />
                    <button
                      type="button"
                      onClick={() => removeExtraImage(i)}
                      className="absolute -top-1.5 -right-1.5 p-0.5 rounded-full bg-red-500 text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <input type="hidden" {...register("images")} />
          </div>

          {/* دکمه ثبت */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={mutation.isPending || uploading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5
                         bg-gradient-to-r from-indigo-500 to-violet-600
                         hover:from-indigo-400 hover:to-violet-500
                         disabled:opacity-60 disabled:cursor-not-allowed
                         text-white font-semibold rounded-xl
                         shadow-lg shadow-indigo-500/30
                         transition-all duration-300"
            >
              {mutation.isPending || uploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  در حال ارسال...
                </>
              ) : (
                <>
                  <PlusCircle className="w-5 h-5" />
                  افزودن محصول جدید
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}