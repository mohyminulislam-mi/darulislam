"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  ChevronLeft,
  MapPin,
  Phone,
  User,
  ShoppingBag,
  CreditCard,
  Truck,
  Loader2,
} from "lucide-react";
import Swal from "sweetalert2";
import useAxiosSecure from "@/src/app/hooks/useAxiosSecure";

interface OrderItem {
  product: string;
  quantity: number;
  name?: string;
  price?: number;
  image?: string;
}

const CheckoutContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const axiosSecure = useAxiosSecure();

  const isFromCart = searchParams.get("from") === "cart";

  const [checkoutItems, setCheckoutItems] = useState<OrderItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(70);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isFromCart) {
      const cartData = JSON.parse(localStorage.getItem("cart") || "[]");
      if (cartData.length === 0) {
        Swal.fire("দুঃখিত!", "আপনার কার্টটি খালি!", "warning");
        router.push("/cart");
        return;
      }

      const formattedItems = cartData.map((item: any) => ({
        product: item.id,
        quantity: item.quantity,
        name: item.name,
        price: item.price,
        image: item.image,
      }));

      const cartSubtotal = cartData.reduce(
        (acc: number, item: any) => acc + item.price * item.quantity,
        0,
      );

      setCheckoutItems(formattedItems);
      setSubtotal(cartSubtotal);
      setDeliveryCharge(cartSubtotal > 1000 ? 0 : 70);
    } else {
      const productId = searchParams.get("id") || "";
      const productName = searchParams.get("name") || "পণ্য";
      const productPrice = Number(searchParams.get("price")) || 0;
      const productImage = searchParams.get("image") || "";

      if (productId) {
        setCheckoutItems([
          {
            product: productId,
            quantity: 1,
            name: productName,
            price: productPrice,
            image: productImage,
          },
        ]);
        setSubtotal(productPrice);
        setDeliveryCharge(70);
      }
    }
  }, [isFromCart, searchParams, router]);

  const totalPrice = subtotal + deliveryCharge;

  const handleOrder = async () => {
    if (!name.trim())
      return Swal.fire("দুঃখিত!", "আপনার নাম লিখুন।", "warning");
    if (!phone.trim() || phone.length < 11)
      return Swal.fire("দুঃখিত!", "সঠিক ফোন নম্বর দিন।", "warning");
    if (!address.trim())
      return Swal.fire("দুঃখিত!", "আপনার পুরো ঠিকানাটি লিখুন।", "warning");
    if (checkoutItems.length === 0)
      return Swal.fire("ত্রুটি!", "কোনো প্রোডাক্ট পাওয়া যায়নি!", "error");

    setLoading(true);

    const orderPayload = {
      customerDetails: {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        district: district.trim(),
      },
      items: checkoutItems.map((item) => ({
        product: item.product,
        quantity: item.quantity,
      })),
    };

    try {
      const response = await axiosSecure.post("/orders/checkout", orderPayload);

      if (response.status === 201 || response.data?.orderId) {
        if (isFromCart) {
          localStorage.removeItem("cart");
        }

        Swal.fire({
          title: "অর্ডার সফল হয়েছে!",
          text: response.data?.message || "আপনার অর্ডারটি আমরা পেয়েছি।",
          icon: "success",
          iconColor: "#0B5D3B",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#0B5D3B",
          background: "#fff",
          customClass: {
            popup: "rounded-[2rem]",
            confirmButton: "rounded-xl px-8 py-3 font-bold",
          },
        }).then((result) => {
          if (result.isConfirmed) {
            router.push("/islamic-shop");
          }
        });
      }
    } catch (error: any) {
      console.error("Order Checkout Error:", error);
      Swal.fire({
        title: "ব্যর্থ হয়েছে!",
        text:
          error?.response?.data?.message ||
          "সার্ভারে সমস্যা হয়েছে, আবার চেষ্টা করুন।",
        icon: "error",
        confirmButtonColor: "#0B5D3B",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FBFA] pt-20 pb-12 md:pt-28">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 text-gray-600 hover:bg-gray-50 transition-all hover:cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900">
              চেকআউট
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              নিচের তথ্যগুলো পূরণ করে অর্ডারটি সম্পন্ন করুন
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 🛍️ Right Side: Order Summary */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl shadow-green-900/5 border border-gray-50 lg:sticky lg:top-28">
              <h2 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#0B5D3B]" /> অর্ডার সামারি
              </h2>

              <div className="space-y-3 max-h-[240px] overflow-y-auto mb-6 pr-1 custom-scrollbar">
                {checkoutItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-4 p-3 bg-gray-50 rounded-2xl border border-gray-100/50 relative"
                  >
                    <div className="relative w-16 h-16 bg-white rounded-xl overflow-hidden border border-gray-100 flex-shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name || "Product"}
                          fill
                          className="object-contain p-1"
                        />
                      ) : (
                        <div className="w-full h-full bg-neutral-100 flex items-center justify-center text-[10px] font-bold text-neutral-400">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-center min-w-0 flex-1">
                      <h3 className="font-bold text-gray-800 text-xs md:text-sm truncate leading-snug">
                        {item.name}
                      </h3>
                      <p className="text-[#0B5D3B] text-xs font-black mt-1">
                        ৳ {item.price}{" "}
                        <span className="text-gray-400 font-normal">
                          × {item.quantity}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 px-2">
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>পণ্যের দাম (সাবটোটাল)</span>
                  <span className="text-gray-900 font-bold">৳ {subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>ডেলিভারি চার্জ</span>
                  <span className="text-gray-900 font-bold">
                    {deliveryCharge === 0 ? "ফ্রি" : `৳ ${deliveryCharge}`}
                  </span>
                </div>
                <div className="h-px border-t border-dashed border-gray-200 my-4"></div>
                <div className="flex justify-between items-center text-gray-900">
                  <span className="font-bold text-lg">সর্বমোট</span>
                  <span className="font-black text-3xl text-[#0B5D3B]">
                    ৳ {totalPrice}
                  </span>
                </div>
              </div>

              {/* ডেস্কটপ বাটন */}
              <button
                onClick={handleOrder}
                disabled={loading}
                className="w-full mt-8 hover:cursor-pointer py-5 bg-[#0B5D3B] hover:bg-[#0b4127] text-white font-black rounded-2xl shadow-lg shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all hidden lg:flex items-center justify-center gap-3 group"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <span>অর্ডার নিশ্চিত করুন</span>
                    <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center group-hover:translate-x-1 transition-transform">
                      <ChevronLeft className="w-4 h-4 rotate-180" />
                    </div>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 📝 Left Side: Delivery Form */}
          <div className="lg:col-span-7 space-y-6 order-2 lg:order-1">
            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-gray-50">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-[#0B5D3B]">
                  <Truck className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-black text-gray-800">
                  ডেলিভারি ঠিকানা
                </h2>
              </div>

              <div className="space-y-5">
                {/* নাম ইনপুট */}
                <div className="group">
                  <label className="text-xs font-bold text-gray-400 ml-2 mb-2 block uppercase tracking-widest">
                    আপনার নাম
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-[#0B5D3B] transition-colors" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="পুরো নাম লিখুন"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#0B5D3B] outline-none transition-all text-gray-800 font-medium"
                    />
                  </div>
                </div>

                {/* ফোন ইনপুট */}
                <div className="group">
                  <label className="text-xs font-bold text-gray-400 ml-2 mb-2 block uppercase tracking-widest">
                    ফোন নম্বর <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-[#0B5D3B] transition-colors" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        const value = e.target.value;
                        // শুধুমাত্র সংখ্যা (0-9) এলাউ করবে
                        if (/^\d*$/.test(value)) {
                          setPhone(value);
                        }
                      }}
                      placeholder="উদা: 01823456789"
                      maxLength={11}
                      required
                      pattern="01[3-9][0-9]{8}"
                      title="দয়া করে ১১ ডিজিটের সঠিক সচল মোবাইল নম্বর দিন (যেমন: 01823456789)"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#0B5D3B] outline-none transition-all text-gray-800 font-medium invalid:border-red-500"
                    />
                  </div>
                </div>

                {/* জেলা ইনপুট */}
                <div className="group">
                  <label className="text-xs font-bold text-gray-400 ml-2 mb-2 block uppercase tracking-widest">
                    জেলা (District)
                  </label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="উদা: Feni / Rangpur"
                    className="w-full px-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#0B5D3B] outline-none transition-all text-gray-800 font-medium"
                  />
                </div>

                {/* ঠিকানা ইনপুট */}
                <div className="group">
                  <label className="text-xs font-bold text-gray-400 ml-2 mb-2 block uppercase tracking-widest">
                    পুরো ঠিকানা
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-5 w-5 h-5 text-gray-300 group-focus-within:text-[#0B5D3B] transition-colors" />
                    <textarea
                      rows={3}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="গ্রাম/রাস্তা, থানা, জেলা"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#0B5D3B] outline-none transition-all text-gray-800 font-medium resize-none"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Badge */}
            <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-blue-900 text-sm">পেমেন্ট মেথড</p>
                <p className="text-xs text-blue-700">
                  ক্যাশ অন ডেলিভারি (পণ্য হাতে পেয়ে টাকা দিন)
                </p>
              </div>
            </div>

            {/* মোবাইল বাটন */}
            <div className="block lg:hidden pt-4">
              <button
                onClick={handleOrder}
                disabled={loading}
                className="w-full py-5 bg-[#0B5D3B] hover:bg-[#0b4127] text-white font-black rounded-2xl shadow-lg shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 group"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <span>অর্ডার নিশ্চিত করুন</span>
                    <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center group-hover:translate-x-1 transition-transform">
                      <ChevronLeft className="w-4 h-4 rotate-180" />
                    </div>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CheckoutPage = () => (
  <Suspense
    fallback={
      <section className="h-screen flex items-center justify-center bg-white max-w-11/12 mx-auto">
        <div className="w-10 h-10 border-4 border-[#0B5D3B] border-t-transparent rounded-full animate-spin"></div>
      </section>
    }
  >
    <CheckoutContent />
  </Suspense>
);

export default CheckoutPage;
