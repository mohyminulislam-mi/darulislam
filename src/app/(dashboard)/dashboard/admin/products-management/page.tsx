"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Edit3,
  Trash2,
  Package,
  AlertTriangle,
  CheckCircle2,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import useAxiosSecure from "@/src/app/hooks/useAxiosSecure";
import ProductModal from "@/src/components/shared/AdminCourseModal";
import Swal from "sweetalert2";
import LoadingSpinner from "@/src/components/shared/spinner/LoadingSpinner";

export default function AdminProducts() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["adminProducts"],
    queryFn: async () => {
      const res = await axiosSecure.get("/products");
      return res.data;
    },
  });

  const createProductMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return (
        await axiosSecure.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      ).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      setIsModalOpen(false);
      Swal.fire("সফল!", "প্রোডাক্ট তৈরি হয়েছে।", "success");
    },
    onError: (err: any) => {
      Swal.fire(
        "এরর!",
        err?.response?.data?.message || "ব্যর্থ হয়েছে",
        "error",
      );
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string;
      formData: FormData;
    }) => {
      return (
        await axiosSecure.put(`/products/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      ).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      setIsModalOpen(false);
      Swal.fire("সফল!", "প্রোডাক্ট আপডেট হয়েছে।", "success");
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      return (await axiosSecure.delete(`/products/${id}`)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      if (paginatedProducts.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
      Swal.fire("ডিলিট হয়েছে!", "প্রোডাক্টটি সফলভাবে ডিলিট হয়েছে।", "success");
    },
  });

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedProducts = products.slice(indexOfFirstItem, indexOfLastItem);

  const handleModalSubmit = (formData: FormData) => {
    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct._id, formData });
    } else {
      createProductMutation.mutate(formData);
    }
  };

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "ডিলিট করার পর ডাটা রিকভার করা সম্ভব নয়!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#0B5D3B",
      confirmButtonText: "হ্যাঁ, ডিলিট করুন!",
      cancelButtonText: "বাতিল",
    }).then((result) => {
      if (result.isConfirmed) deleteProductMutation.mutate(id);
    });
  };

  return (
    <div className="min-h-screen bg-[#F4F7F5] p-4 md:p-8 pt-20 lg:pt-24">
      {/* হেডার সেকশন */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-50 text-[#0B5D3B] rounded-xl flex items-center justify-center shadow-inner">
            <Package size={24} />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-black text-neutral-800">
              অর্ডার ম্যানেজমেন্ট
            </h1>
            <p className="text-xs text-neutral-400 font-medium">
              মোট অর্ডার সংখ্যা: {products.length} টি
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
          className="w-full cursor-pointer sm:w-auto px-4 py-2.5 bg-[#0B5D3B] hover:bg-[#0c462a] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          <span>নতুন প্রোডাক্ট যোগ করুন</span>
        </button>
      </div>

      {/* প্রোডাক্ট টেবিল */}
      <div className="max-w-6xl mx-auto bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <LoadingSpinner />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 text-red-500 gap-2">
            <AlertTriangle size={32} />
            <p className="text-xs font-bold">সার্ভার এরর!</p>
          </div>
        ) : paginatedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-neutral-400 gap-2">
            <Package size={40} />
            <p className="text-xs font-bold">কোনো প্রোডাক্ট নেই।</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-100 text-[11px] font-black uppercase text-neutral-500 tracking-wider">
                    <th className="py-4 px-6">প্রোডাক্ট</th>
                    <th className="py-4 px-4">ক্যাটাগরি</th>
                    <th className="py-4 px-4">মূল্য</th>
                    <th className="py-4 px-4"> কোর্স স্ট্যাটাস</th>
                    <th className="py-4 px-4 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50 text-xs text-neutral-700 font-medium">
                  {paginatedProducts.map((product: any) => (
                    <tr
                      key={product._id}
                      className="hover:bg-neutral-50/50 transition-all"
                    >
                      <td className="py-4 px-6 flex items-center gap-3 min-w-[250px]">
                        <img
                          src={`${axiosSecure.defaults.baseURL?.replace("/api", "")}/${product.image}`}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover bg-neutral-100 border border-neutral-200/60"
                          onError={(e: any) => {
                            e.target.src =
                              "https://placehold.co/100x100?text=Book";
                          }}
                        />
                        <div className="space-y-0.5">
                          <p className="font-black text-neutral-800 leading-tight">
                            {product.name}
                          </p>
                          <p className="text-[10px] text-neutral-400">
                            {product.details?.publisher || "পাবলিশার নেই"}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded-md text-[10px] font-bold">
                          {product.category}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-bold text-neutral-800">
                        ৳{product.price}
                      </td>
                      <td className="py-4 px-4">
                        {product.inStock ? (
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[10px] font-bold inline-flex items-center gap-1">
                            <CheckCircle2 size={10} /> In Stock
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-red-50 text-red-500 rounded text-[10px] font-bold inline-flex items-center gap-1">
                            <X size={10} /> মেয়াদ শেষ
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingProduct(product);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 cursor-pointer hover:bg-blue-50 text-blue-600 rounded-lg"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="p-1.5 cursor-pointer hover:bg-red-50 text-red-500 rounded-lg"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-neutral-50/50">
                <p className="text-[11px] font-bold text-neutral-400">
                  {products.length} এর মধ্যে {indexOfFirstItem + 1}-
                  {Math.min(indexOfLastItem, products.length)} নম্বর প্রোডাক্ট
                  দেখানো হচ্ছে
                </p>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all ${
                          currentPage === page
                            ? "bg-[#0B5D3B] text-white border-[#0B5D3B]"
                            : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg border cursor-pointer border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingProduct={editingProduct}
        onSubmit={handleModalSubmit}
        isPending={
          createProductMutation.isPending || updateProductMutation.isPending
        }
      />
    </div>
  );
}
