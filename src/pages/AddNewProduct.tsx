import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  useAddNewProduct,
  type AddNewProductFormType,
} from "../hooks/useAddNewProduct";
import { useUploadImage, useUploadImages } from "../hooks/useUploadImage";
import {
  PlusCircle,
  Upload,
  Loader2,
  Image as ImageIcon,
  X,
} from "lucide-react";

const COLOR_OPTIONS = [
  { name: "مشکی", value: "#000000" },
  { name: "سفید", value: "#FFFFFF" },
  { name: "خاکستری", value: "#9CA3AF" },
  { name: "قرمز", value: "#EF4444" },
  { name: "آبی", value: "#3B82F6" },
  { name: "سبز", value: "#22C55E" },
  { name: "زرد", value: "#EAB308" },
  { name: "نارنجی", value: "#F97316" },
  { name: "بنفش", value: "#A855F7" },
  { name: "صورتی", value: "#EC4899" },
  { name: "قهوه‌ای", value: "#92400E" },
  { name: "بژ", value: "#D4C4A8" },
  { name: "زیتونی", value: "#8F9E7E" },
  { name: "کرم", value: "#FFFDD0" },
];

const SIZE_OPTIONS = ["M", "L", "XL", "2XL", "3XL"];

export default function AddNewProduct() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddNewProductFormType>({ mode: "onChange" });

  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [extraImagesPreview, setExtraImagesPreview] = useState<string[]>([]);

  const { onSubmit, mutation } = useAddNewProduct((values) => {
    reset(values);
    setMainImagePreview(null);
    setExtraImagesPreview([]);
  });

  const uploadImage = useUploadImage();
  const uploadImages = useUploadImages();

  const isUploading = uploadImage.isPending || uploadImages.isPending;

  const selectedColors = (watch("colors") || "")
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);

  const selectedSizes = (watch("sizes") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const handleMainImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    uploadImage.mutate(file, {
      onSuccess: (url) => {
        setValue("mainImage", url, { shouldValidate: true });
        setMainImagePreview(url);
      },
    });
  };

  const handleExtraImagesUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files?.length) return;

    uploadImages.mutate(Array.from(files), {
      onSuccess: (urls) => {
        setValue("images", urls.join(", "), { shouldValidate: true });
        setExtraImagesPreview(urls);
      },
    });
  };

  const removeExtraImage = (index: number) => {
    const next = extraImagesPreview.filter((_, i) => i !== index);
    setExtraImagesPreview(next);
    setValue("images", next.join(", "));
  };

  const toggleColor = (value: string) => {
    const next = selectedColors.includes(value)
      ? selectedColors.filter((c) => c !== value)
      : [...selectedColors, value];
    setValue("colors", next.join(", "), { shouldValidate: true });
  };

  const toggleSize = (size: string) => {
    const next = selectedSizes.includes(size)
      ? selectedSizes.filter((s) => s !== size)
      : [...selectedSizes, size];
    setValue("sizes", next.join(", "), { shouldValidate: true });
  };

  const inputClass =
    "w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-500";
  const labelClass = "block text-sm font-medium text-slate-300 mb-2";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
          <PlusCircle className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">افزودن محصول جدید</h2>
          <p className="text-sm text-slate-400">اطلاعات محصول را وارد کنید</p>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className={labelClass}>
                دسته‌بندی محصول
              </label>
              <input
                {...register("category", {
                  required: "وارد کردن دسته‌بندی اجباری است",
                })}
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

            <div>
              <label htmlFor="title" className={labelClass}>
                عنوان محصول
              </label>
              <input
                {...register("title", {
                  required: "وارد کردن عنوان محصول اجباری است",
                })}
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

            <div>
              <label htmlFor="price" className={labelClass}>
                قیمت (تومان)
              </label>
              <input
                {...register("price", {
                  required: "وارد کردن قیمت اجباری است",
                  pattern: { value: /^\d+$/, message: "فقط عدد وارد کنید" },
                })}
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

            <div>
              <label htmlFor="quantity" className={labelClass}>
                تعداد موجودی
              </label>
              <input
                {...register("quantity", {
                  required: "وارد کردن تعداد اجباری است",
                  pattern: { value: /^\d+$/, message: "فقط عدد وارد کنید" },
                })}
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

            <div>
              <label htmlFor="discount" className={labelClass}>
                درصد تخفیف
              </label>
              <input
                {...register("discount", {
                  required: "وارد کردن تخفیف اجباری است",
                  pattern: { value: /^\d+$/, message: "فقط عدد وارد کنید" },
                })}
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

            <div>
              <label htmlFor="type" className={labelClass}>
                نوع محصول (اختیاری)
              </label>
              <input
                {...register("type")}
                id="type"
                placeholder="مثلاً: bag"
                className={inputClass}
              />
            </div>
          </div>

          {/* رنگ‌ها */}
          <div>
            <label className={labelClass}>رنگ‌های محصول</label>
            <div className="flex flex-wrap gap-2.5">
              {COLOR_OPTIONS.map((color) => {
                const isSelected = selectedColors.includes(color.value);
                return (
                  <button
                    key={color.value}
                    type="button"
                    title={color.name}
                    onClick={() => toggleColor(color.value)}
                    className={`relative w-9 h-9 rounded-full border-2 transition-all ${
                      isSelected
                        ? "border-indigo-400 scale-110 shadow-lg shadow-indigo-500/30"
                        : "border-white/20 hover:border-white/40"
                    }`}
                    style={{ backgroundColor: color.value }}
                  >
                    {isSelected && (
                      <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold drop-shadow">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <input
              type="hidden"
              {...register("colors", {
                required: "انتخاب حداقل یک رنگ اجباری است",
              })}
            />
            {errors.colors && (
              <p className="text-red-400 text-xs mt-1.5">
                {errors.colors.message}
              </p>
            )}
          </div>

          {/* سایزها */}
          <div>
            <label className={labelClass}>سایزهای محصول</label>
            <div className="flex flex-wrap gap-2">
              {SIZE_OPTIONS.map((size) => {
                const isSelected = selectedSizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`min-w-[48px] px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      isSelected
                        ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                        : "bg-white/5 text-slate-400 border border-white/10 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
            <input
              type="hidden"
              {...register("sizes", {
                required: "انتخاب حداقل یک سایز اجباری است",
              })}
            />
            {errors.sizes && (
              <p className="text-red-400 text-xs mt-1.5">
                {errors.sizes.message}
              </p>
            )}
          </div>

          {/* توضیحات */}
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

          {/* عکس اصلی */}
          <div>
            <label className={labelClass}>عکس اصلی محصول</label>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <label className="flex flex-col items-center justify-center w-full sm:w-48 h-36 border-2 border-dashed border-white/15 rounded-xl cursor-pointer hover:border-indigo-500/50 hover:bg-white/5 transition-all">
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  {isUploading ? (
                    <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                  ) : (
                    <Upload className="w-6 h-6" />
                  )}
                  <span className="text-xs">
                    {isUploading ? "در حال آپلود..." : "انتخاب عکس"}
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMainImageUpload}
                  disabled={isUploading}
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

          {/* تصاویر اضافی */}
          <div>
            <label className={labelClass}>تصاویر اضافی (چندتایی)</label>
            <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-white/15 rounded-xl cursor-pointer hover:border-indigo-500/50 hover:bg-white/5 transition-all">
              <div className="flex flex-col items-center gap-2 text-slate-400">
                {isUploading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
                ) : (
                  <ImageIcon className="w-5 h-5" />
                )}
                <span className="text-xs">
                  {isUploading ? "در حال آپلود..." : "انتخاب چند عکس"}
                </span>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleExtraImagesUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>

            {extraImagesPreview.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4">
                {extraImagesPreview.map((url, i) => (
                  <div key={url} className="relative">
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

          <div className="pt-2">
            <button
              type="submit"
              disabled={mutation.isPending || isUploading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5
                         bg-gradient-to-r from-indigo-500 to-violet-600
                         hover:from-indigo-400 hover:to-violet-500
                         disabled:opacity-60 disabled:cursor-not-allowed
                         text-white font-semibold rounded-xl
                         shadow-lg shadow-indigo-500/30
                         transition-all duration-300"
            >
              {mutation.isPending || isUploading ? (
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