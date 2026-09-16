"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import useAxiosSecure from "@/src/app/hooks/useAxiosSecure";

interface EditCourseModalProps {
  course: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const EditCourseModal = ({
  course,
  isOpen,
  onClose,
  onUpdate,
}: EditCourseModalProps) => {
  const axiosSecure = useAxiosSecure();
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const durationOptions = [
    "১ মাস",
    "২ মাস",
    "৩ মাস",
    "৪ মাস",
    "৫ মাস",
    "৬ মাস",
    "৭ মাস",
    "৮ মাস",
  ];

  useEffect(() => {
    if (course) {
      setFormData({
        ...course,
        details: course.details
          ? { ...course.details }
          : {
              fullTitle: "",
              description: "",
              admissionFee: "",
              monthlyFee: "",
              highlights: [],
            },
      });
    }
  }, [course]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleDetailsChange = (key: string, value: any) => {
    const numberFields = ["admissionFee", "monthlyFee"];

    setFormData((prev: any) => ({
      ...prev,
      details: {
        ...prev.details,
        [key]: numberFields.includes(key)
          ? value === ""
            ? ""
            : Number(value)
          : value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      price: formData.price === "" ? 0 : formData.price,
      oldPrice: formData.oldPrice === "" ? 0 : formData.oldPrice,
      details: {
        ...formData.details,
        admissionFee:
          formData.details?.admissionFee === ""
            ? 0
            : formData.details?.admissionFee,
        monthlyFee:
          formData.details?.monthlyFee === ""
            ? 0
            : formData.details?.monthlyFee,
      },
    };

    try {
      const res = await axiosSecure.put(
        `/courses/teacher/${course._id}`,
        payload,
      );

      if (res.status === 200 || res.status === 204) {
        await Swal.fire({
          title: "সফল!",
          text: "কোর্সটি সফলভাবে আপডেট করা হয়েছে।",
          icon: "success",
          confirmButtonColor: "#0B5D3B",
        });
        onUpdate();
        onClose();
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "আপডেট করা সম্ভব হয়নি বা সার্ভার এরর!";
      Swal.fire({
        title: "ব্যর্থ!",
        text: errorMessage,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-x-hidden overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="bg-white w-full max-w-2xl rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden relative z-10 flex flex-col my-auto max-h-[85vh]"
          >
            {/* Header */}
            <div className="p-5 md:p-6 border-b flex justify-between items-center bg-gray-50/80 backdrop-blur-xs sticky top-0 z-10">
              <div>
                <h2 className="text-lg md:text-xl font-bold text-gray-800">
                  কোর্স এডিট করুন
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  সবগুলো ফিল্ড প্রয়োজন অনুযায়ী এডিট করুন
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="বন্ধ করুন"
                className="p-2 hover:cursor-pointer text-gray-500 hover:bg-gray-200 hover:text-gray-800 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form Fields */}
            <form
              onSubmit={handleSubmit}
              className="p-5 md:p-6 space-y-5 overflow-y-auto flex-1 grid grid-cols-1 gap-x-4"
            >
              {/* ১. কোর্স টাইটেল */}
              <div>
                <label
                  htmlFor="course-title"
                  className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5"
                >
                  কোর্স টাইটেল
                </label>
                <input
                  id="course-title"
                  type="text"
                  value={formData.title || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm text-gray-800"
                />
              </div>

              {/* ২. বিস্তারিত টাইটেল */}
              <div>
                <label
                  htmlFor="details-fulltitle"
                  className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5"
                >
                  কোর্সের বিস্তারিত নাম (Full Title)
                </label>
                <input
                  id="details-fulltitle"
                  type="text"
                  value={formData.details?.fullTitle || ""}
                  onChange={(e) =>
                    handleDetailsChange("fullTitle", e.target.value)
                  }
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm text-gray-800"
                />
              </div>

              {/* ৩. প্রাইসিং সেকশন */}
              <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label
                    htmlFor="course-price"
                    className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1"
                  >
                    বর্তমান মূল্য (৳)
                  </label>
                  <input
                    id="course-price"
                    type="number"
                    value={formData.price ?? ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price:
                          e.target.value === "" ? "" : Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="course-oldprice"
                    className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1"
                  >
                    পূর্বের মূল্য (৳)
                  </label>
                  <input
                    id="course-oldprice"
                    type="number"
                    value={formData.oldPrice ?? ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        oldPrice:
                          e.target.value === "" ? "" : Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="details-admission"
                    className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1"
                  >
                    ভর্তি ফি (৳)
                  </label>
                  <input
                    id="details-admission"
                    type="number"
                    value={formData.details?.admissionFee ?? ""}
                    onChange={(e) =>
                      handleDetailsChange("admissionFee", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="details-monthly"
                    className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1"
                  >
                    মাসিক ফি (৳)
                  </label>
                  <input
                    id="details-monthly"
                    type="number"
                    value={formData.details?.monthlyFee ?? ""}
                    onChange={(e) =>
                      handleDetailsChange("monthlyFee", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                  />
                </div>
              </div>

              {/* ৪. সময়কাল (Select Box) ও курс টাইপ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="course-duration"
                    className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5"
                  >
                    সময়কাল
                  </label>
                  <select
                    id="course-duration"
                    value={formData.duration || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    className="w-full hover:cursor-pointer px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm text-gray-800 bg-white"
                  >
                    <option value="" disabled>
                      সময়কাল নির্বাচন করুন
                    </option>
                    {durationOptions.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="course-type"
                    className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5"
                  >
                    কোর্স টাইপ
                  </label>
                  <select
                    id="course-type"
                    value={formData.courseType || "Online"}
                    onChange={(e) =>
                      setFormData({ ...formData, courseType: e.target.value })
                    }
                    className="w-full hover:cursor-pointer px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm text-gray-800 bg-white"
                  >
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>
              </div>

              {/* ৫. কোর্সের বিবরণ */}
              <div>
                <label
                  htmlFor="details-description"
                  className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5"
                >
                  কোর্সের বিবরণ (Description)
                </label>
                <textarea
                  id="details-description"
                  rows={4}
                  value={formData.details?.description || ""}
                  onChange={(e) =>
                    handleDetailsChange("description", e.target.value)
                  }
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm text-gray-800 resize-none"
                  placeholder="কোর্সের বিস্তারিত বিবরণ লিখুন..."
                />
              </div>
            </form>

            {/* Actions Footer */}
            <div className="p-5 md:p-6 bg-gray-50 border-t flex flex-col-reverse sm:flex-row gap-3 sticky bottom-0 z-10">
              <button
                type="button"
                onClick={onClose}
                className="w-full hover:cursor-pointer sm:flex-1 py-2.5 md:py-3 font-bold text-gray-600 rounded-xl hover:bg-gray-200 transition-colors text-sm"
              >
                বাতিল
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full hover:cursor-pointer sm:flex-1 py-2.5 md:py-3 bg-[#0B5D3B] text-white font-bold rounded-xl shadow-md hover:bg-[#0c4a2d] hover:shadow-lg active:scale-[0.98] disabled:opacity-70 transition-all flex items-center justify-center gap-2 text-sm"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Save size={18} />
                )}
                আপডেট করুন
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EditCourseModal;
