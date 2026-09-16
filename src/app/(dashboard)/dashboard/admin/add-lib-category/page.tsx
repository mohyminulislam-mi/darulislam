'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from "@/src/app/hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import TiptapEditor from "@/src/components/TiptapEditor/TiptapEditor";
import { X, Loader2, CheckCircle2, Plus, Trash2, Upload } from "lucide-react";

type LibraryItem = {
  _id: string;
  title: string;
  type: string;
  description: string;
  fileUrl: string;
};

type SubCategory = {
  _id: string;
  title: string;
  description: string;
  items: LibraryItem[];
};

type LibraryCategory = {
  _id: string;
  title: string;
  description: string;
  subCategories: SubCategory[];
};

export default function CategoryManager() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [editId, setEditId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Initial Form State
  const initialFormState: LibraryCategory = {
    _id: '',
    title: '',
    description: '',
    subCategories: []
  };

  const [formData, setFormData] = useState(initialFormState);

  // Reset Form Function
  const resetForm = () => {
    setFormData(initialFormState);
    setEditId(null);
    setIsModalOpen(false);
  };

  // React Query Mutation
  const saveMutation = useMutation({
    mutationFn: async (payload: LibraryCategory) => {
      if (editId) {
        return (
          await axiosSecure.put(`/library/admin/update/${editId}`, payload)
        ).data;
      }
      return (await axiosSecure.post("/library/admin/add", payload)).data;
    },
    onSuccess: () => {
      Swal.fire(
        "আলহামদুলিল্লাহ্‌!",
        editId
          ? "ক্যাটাগরির তথ্য আপডেট সম্পন্ন হয়েছে।"
          : "নতুন ক্যাটাগরি সফলভাবে যোগ করা হয়েছে।",
        "success"
      );
      queryClient.invalidateQueries({ queryKey: ["categories-data"] });
      resetForm();
    },
    onError: (err) => {
      Swal.fire(
        "ব্যর্থ!",
        err?.response?.data?.message || "রিকোয়েস্ট প্রসেস করা যায়নি।",
        "error"
      );
    },
  });

  // Category Level Handlers
  const handleCategoryChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // SubCategory Handlers
  const addSubCategory = () => {
    setFormData({
      ...formData,
      subCategories: [
        ...formData.subCategories,
        { _id: `cat_${Date.now()}`, title: '', description: '', items: [] }
      ]
    });
  };

  const handleSubCategoryChange = (index: number, e: any) => {
    const updatedSubCategories = [...formData.subCategories];
    (updatedSubCategories[index] as any)[e.target.name] = e.target.value;
    setFormData({ ...formData, subCategories: updatedSubCategories });
  };

  const removeSubCategory = (index: number) => {
    const updatedSubCategories = formData.subCategories.filter((_, i) => i !== index);
    setFormData({ ...formData, subCategories: updatedSubCategories });
  };

  // Item Level Handlers
  const addItem = (subCatIndex: number) => {
    const updatedSubCategories = [...formData.subCategories];
    updatedSubCategories[subCatIndex].items.push({
      _id: `item_${Date.now()}`,
      title: '',
      type: 'Book',
      description: '', // Tiptap content
      fileUrl: ''
    });
    setFormData({ ...formData, subCategories: updatedSubCategories });
  };

  const handleItemChange = (subCatIndex: number, itemIndex: number, field: string, value: any) => {
    const updatedSubCategories = [...formData.subCategories];
    (updatedSubCategories[subCatIndex].items[itemIndex] as any)[field] = value;
    setFormData({ ...formData, subCategories: updatedSubCategories });
  };

  const removeItem = (subCatIndex: number, itemIndex: number) => {
    const updatedSubCategories = [...formData.subCategories];
    updatedSubCategories[subCatIndex].items = updatedSubCategories[subCatIndex].items.filter(
      (_, i) => i !== itemIndex
    );
    setFormData({ ...formData, subCategories: updatedSubCategories });
  };

  // File Upload Handler (Optional: direct file upload to Cloudinary or Server)
  const handleFileUpload = async (subCatIndex: number, itemIndex: number, file: File | undefined) => {
    if (!file) return;

    const fileFormData = new FormData();
    fileFormData.append("file", file);

    try {
      // আপনার সার্ভারের ফাইল আপলোড API পয়েন্ট কল করুন
      const res = await axiosSecure.post("/upload", fileFormData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      const uploadedUrl = res.data.url; // আপনার API এর রেসপন্স অনুসারে লিঙ্ক পরিবর্তন করুন
      handleItemChange(subCatIndex, itemIndex, 'fileUrl', uploadedUrl);
      
      Swal.fire("সফল!", "ফাইল সফলভাবে আপলোড হয়েছে।", "success");
    } catch (error) {
      Swal.fire("এরর!", "ফাইল আপলোড করতে সমস্যা হয়েছে।", "error");
    }
  };

  // Form Submit Handler
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  return (
    <div className="p-6">
      {!isModalOpen && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-[#0B3D2E] text-white rounded-xl font-bold flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> নতুন ক্যাটাগরি যুক্ত করুন
        </button>
      )}

      {/* ক্রিয়েট ও এডিট ইউনিফাইড পপআপ মোডাল উইজেট */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-4xl rounded-3xl shadow-xl overflow-hidden border border-slate-100"
            >
              {/* Modal Header */}
              <div className="bg-[#0B3D2E] text-white p-5 flex items-center justify-between">
                <h3 className="text-base font-black flex items-center gap-2">
                  {editId
                    ? "ক্যাটাগরির তথ্য এডিট করুন"
                    : "নতুন ক্যাটাগরি ও আইটেমস ফর্ম"}
                </h3>
                <button
                  onClick={resetForm}
                  className="p-1.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Form */}
              <form
                onSubmit={handleSubmit}
                className="p-6 space-y-6 max-h-[80vh] overflow-y-auto"
              >
                {/* Main Category Info */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
                  <h4 className="text-xs font-black text-slate-900 uppercase">মূল ক্যাটাগরি তথ্য</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-slate-900 mb-1.5 uppercase">
                        ক্যাটাগরি ID
                      </label>
                      <input
                        type="text"
                        name="_id"
                        placeholder="উদা: cat_001"
                        value={formData._id}
                        onChange={handleCategoryChange}
                        required
                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm font-extrabold text-slate-950 focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-900 mb-1.5 uppercase">
                        ক্যাটাগরি শিরোনাম
                      </label>
                      <input
                        type="text"
                        name="title"
                        placeholder="উদা: ইলম"
                        value={formData.title}
                        onChange={handleCategoryChange}
                        required
                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm font-extrabold text-slate-950 focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-900 mb-1.5 uppercase">
                      বিবরণ
                    </label>
                    <textarea
                      name="description"
                      placeholder="ক্যাটাগরির বিবরণ লিখুন..."
                      value={formData.description}
                      onChange={handleCategoryChange}
                      rows={2}
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm font-extrabold text-slate-950 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                {/* Subcategories Section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-black text-slate-900 uppercase tracking-wider">
                      সাব-ক্যাটাগরি সমূহ
                    </label>
                    <button
                      type="button"
                      onClick={addSubCategory}
                      className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-extrabold hover:bg-emerald-200 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> সাব-ক্যাটাগরি যোগ করুন
                    </button>
                  </div>

                  {formData.subCategories.map((subCat, subIndex) => (
                    <div key={subIndex} className="p-4 border border-slate-200 rounded-2xl bg-slate-50/50 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-emerald-700 uppercase">
                          সাব-ক্যাটাগরি #{subIndex + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeSubCategory(subIndex)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          name="title"
                          placeholder="সাব-ক্যাটাগরি নাম (উদা: কুরআন)"
                          value={subCat.title}
                          onChange={(e) => handleSubCategoryChange(subIndex, e)}
                          required
                          className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-extrabold text-slate-950 focus:outline-none focus:border-emerald-600"
                        />
                        <input
                          type="text"
                          name="description"
                          placeholder="সংক্ষিপ্ত বিবরণ"
                          value={subCat.description}
                          onChange={(e) => handleSubCategoryChange(subIndex, e)}
                          className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-extrabold text-slate-950 focus:outline-none focus:border-emerald-600"
                        />
                      </div>

                      {/* Items Section inside Subcategory */}
                      <div className="pl-3 border-l-2 border-emerald-500 space-y-4 mt-3">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-black text-slate-800 uppercase">
                            আইটেমস (বই/পিডিএফ/নিবন্ধ)
                          </label>
                          <button
                            type="button"
                            onClick={() => addItem(subIndex)}
                            className="px-2.5 py-1 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" /> আইটেম যোগ করুন
                          </button>
                        </div>

                        {subCat.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="p-4 bg-white rounded-xl border border-slate-200 space-y-4 shadow-xs">
                            <div className="flex justify-between items-center border-b pb-2 border-slate-100">
                              <span className="text-xs font-black text-slate-500">আইটেম #{itemIndex + 1}</span>
                              <button
                                type="button"
                                onClick={() => removeItem(subIndex, itemIndex)}
                                className="text-red-500 hover:text-red-700 text-xs font-bold"
                              >
                                মুছুন
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[10px] font-black text-slate-700 mb-1 uppercase">আইটেমের শিরোনাম</label>
                                <input
                                  type="text"
                                  placeholder="শিরোনাম (উদা: সহীহ বুখারী)"
                                  value={item.title}
                                  onChange={(e) => handleItemChange(subIndex, itemIndex, 'title', e.target.value)}
                                  required
                                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-extrabold text-slate-950 focus:outline-none focus:border-emerald-600"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-black text-slate-700 mb-1 uppercase">টাইপ</label>
                                <select
                                  value={item.type}
                                  onChange={(e) => handleItemChange(subIndex, itemIndex, 'type', e.target.value)}
                                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-extrabold text-slate-950 focus:outline-none focus:border-emerald-600 cursor-pointer"
                                >
                                  <option value="Book">Book</option>
                                  <option value="PDF">PDF</option>
                                  <option value="Article">Article</option>
                                  <option value="Other">Other</option>
                                </select>
                              </div>
                            </div>

                            {/* File Upload Section */}
                            <div>
                              <label className="block text-[10px] font-black text-slate-700 mb-1 uppercase">ফাইল লিঙ্ক বা ফাইল আপলোড</label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="https://example.com/file.pdf"
                                  value={item.fileUrl || ''}
                                  onChange={(e) => handleItemChange(subIndex, itemIndex, 'fileUrl', e.target.value)}
                                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-extrabold text-slate-950 focus:outline-none focus:border-emerald-600"
                                />
                                <label className="px-3 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg text-xs font-bold text-slate-800 flex items-center gap-1 cursor-pointer transition-all">
                                  <Upload className="w-3.5 h-3.5" />
                                  <span>আপলোড</span>
                                  <input
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => handleFileUpload(subIndex, itemIndex, e.target.files?.[0])}
                                  />
                                </label>
                              </div>
                            </div>

                            {/* Tiptap Editor for Item Description */}
                            <div>
                              <label className="block text-[10px] font-black text-slate-700 mb-1.5 uppercase tracking-wider">
                                আইটেম এর বিস্তারিত তথ্য (Tiptap Editor)
                              </label>
                              <TiptapEditor
                                value={item.description || ''}
                                onChange={(value) =>
                                  handleItemChange(subIndex, itemIndex, 'description', value)
                                }
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Submit Action Buttons */}
                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-1/3 py-3 font-bold border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 text-xs transition-all cursor-pointer"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    disabled={saveMutation.isPending}
                    className="w-2/3 py-3 bg-[#0B3D2E] hover:bg-[#072a20] text-white font-black rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {saveMutation.isPending ? (
                      <>
                        প্রসেস হচ্ছে...{" "}
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </>
                    ) : (
                      <>
                        {editId ? "আপডেট করুন" : "সংরক্ষণ করুন"}{" "}
                        <CheckCircle2 className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
