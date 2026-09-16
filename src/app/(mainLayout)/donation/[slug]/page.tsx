"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, SubmitHandler, UseFormRegister } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import {
  ArrowRight,
  User,
  Phone,
  Smartphone,
  Hash,
  MapPin,
  Copy as CopyIcon,
  Check,
  Globe,
  GitBranch,
} from "lucide-react";
import LoadingSpinner from "@/src/components/shared/spinner/LoadingSpinner";
import axios from "axios";

type Campaign = {
  _id: string;
  title: string;
  target: number;
  raised: number;
  isActive?: boolean;
};

type PaymentMethod = "bkash" | "nagad" | "rocket" | "bank";

type PaymentInfo = {
  label: string;
  number?: string;
  accholder?: string;
  ac?: string;
  branch?: string;
  route?: string;
  bg: string;
  borderColor: string;
  logo: string;
};

type PaymentInfoMap = Record<PaymentMethod, PaymentInfo>;

type DonationFormFields = {
  name: string;
  phone: string;
  address?: string;
  senderNumber?: string;
  trxId?: string;
};

const PRESETS: string[] = ["500", "1000", "2000", "5000"];

const PAYMENT_INFO: PaymentInfoMap = {
  bkash: {
    label: "বিকাশ (পার্সোনাল)",
    number: "01792297764",
    bg: "bg-pink-50",
    borderColor: "border-pink-400",
    logo: "https://freelogopng.com/images/all_img/1656234841bkash-icon-png.png",
  },
  nagad: {
    label: "নগদ (পার্সোনাল)",
    number: "01792297764",
    bg: "bg-orange-50",
    borderColor: "border-orange-400",
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/8f/Nagad-png.png",
  },
  rocket: {
    label: "রকেট (পার্সোনাল)",
    number: "01792297764",
    bg: "bg-purple-50",
    borderColor: "border-purple-400",
    logo: "https://static.vecteezy.com/system/resources/previews/068/842/062/non_2x/rocket-icon-mobile-banking-logo-emblem-transparent-background-free-png.png",
  },
  bank: {
    label: "ইসলামী ব্যাংক পিএলসি",
    accholder: "MD ARIF BILLAH",
    ac: "20507770204554147",
    branch: "AGENT BANKING, DHAKA-SOUTH",
    route: "125270607",
    bg: "bg-blue-50",
    borderColor: "border-blue-400",
    logo: "https://res.cloudinary.com/darulislam/image/upload/v1780811223/central-bank_z1rprw.png",
  },
};

async function postDonation(payload: any) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  try {
    const response = await axios.post(`${baseUrl}/donations`, payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message ?? "সার্ভার ত্রুটি হয়েছে");
  }
}

function useCopy(text: string) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      try {
        const el = document.createElement("textarea");
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {}
    }
  };
  return { copied, copy };
}

export default function DonationPage() {
  const params = useParams<{ slug?: string | string[] }>();
  const router = useRouter();

  let slug: string = "";
  if (typeof params?.slug === "string") {
    slug = params.slug;
  } else if (Array.isArray(params?.slug) && (params.slug as string[]).length > 0) {
    slug = params.slug[0];
  }

  const [dbCampaign, setDbCampaign] = useState<Campaign | null>(null);
  const [isCampaignLoading, setIsCampaignLoading] = useState<boolean>(true);
  const [amount, setAmount] = useState<string>("");
  const [method, setMethod] = useState<PaymentMethod>("bkash");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCampaign = async () => {
      if (!slug || slug === "general") {
        setDbCampaign({ _id: "general", title: "সাধারণ দান", target: 100000, raised: 0 });
        setIsCampaignLoading(false);
        return;
      }
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
        const { data } = await axios.get(`${baseUrl}/donation-campaigns/slug/${slug}`);
        setDbCampaign(data?.data || data);
      } catch (err) {
        setDbCampaign({ _id: "general", title: "সাধারণ দান", target: 100000, raised: 0 });
      } finally {
        setIsCampaignLoading(false);
      }
    };
    fetchCampaign();
  }, [slug]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DonationFormFields>({ mode: "onSubmit" });

  const onSubmit: SubmitHandler<DonationFormFields> = async (data) => {
    if (!amount || Number(amount) < 1) {
      return Swal.fire("ভুল হয়েছে", "দানের পরিমাণ লিখুন", "error");
    }

    if (method !== "bank" && (!data.senderNumber || !data.trxId)) {
      return Swal.fire(
        "তথ্য প্রয়োজন",
        "বিকাশ/নগদ/রকেটের ক্ষেত্রে প্রেরক নাম্বার ও TrxID দিন",
        "warning"
      );
    }

    const payload = {
      name: data.name,
      phone: data.phone,
      address: data.address || "",
      amount: Number(amount),
      method,
      campaignId: dbCampaign?._id || "general",
      senderNumber: method !== "bank" ? data.senderNumber : undefined,
      trxId: method !== "bank" ? data.trxId : undefined,
    };

    setLoading(true);
    try {
      await postDonation(payload);
      Swal.fire({
        title: "জাযাকাল্লাহ খাইর!",
        text: "আপনার দানের তথ্যটি সফলভাবে গৃহীত হয়েছে।",
        icon: "success",
        confirmButtonColor: "#0B3D2E",
      });
      setAmount("");
      reset();
      router.push("/donation");
    } catch (err: any) {
      Swal.fire("দুঃখিত", err?.message ?? "আবার চেষ্টা করুন", "error");
    } finally {
      setLoading(false);
    }
  };

  if (isCampaignLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F0E8]">
        <LoadingSpinner />
      </div>
    );
  }

  const campaignTitle = dbCampaign?.title || "সাধারণ দান";
  const paymentInfo: PaymentInfo = PAYMENT_INFO[method];
  const copyTarget: string | undefined = method === "bank" ? paymentInfo.ac : paymentInfo.number;

  return (
    <div className="min-h-screen bg-[#F5F0E8] py-16">
      {/* Header */}
      <div className="bg-green-800 text-white px-6 py-12 text-center">
        <h1 className="text-3xl font-black mb-2">{campaignTitle}</h1>
        <p className="text-xs">মানবতার সেবায় আপনার অংশগ্রহণ</p>
      </div>

      <div className="max-w-xl mx-auto px-4 -mt-8 space-y-6">
        <div className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-black/5">
          {/* Amount presets */}
          <label className="text-[10px] font-bold text-gray-600 uppercase mb-3 block">
            পরিমাণ নির্বাচন করুন
          </label>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setAmount(p)}
                className={`py-3 cursor-pointer rounded-xl text-sm font-bold transition-all ${
                  amount === p
                    ? "bg-[#0B3D2E] text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {p}৳
              </button>
            ))}
          </div>

          <input
            type="number"
            placeholder="টাকার পরিমাণ..."
            value={amount}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
            className="w-full p-4 bg-gray-50 rounded-2xl font-bold text-lg outline-none mb-6 border-2 border-transparent focus:border-[#0B3D2E]/10"
            min={1}
          />

          {/* Payment method selector */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            {Object.keys(PAYMENT_INFO).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMethod(m as PaymentMethod)}
                className={`p-3 cursor-pointer rounded-xl border-2 transition-all flex flex-col items-center gap-1.5 ${
                  method === m
                    ? "border-[#0B3D2E] bg-gray-50"
                    : "border-gray-100 opacity-60 hover:opacity-80"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={PAYMENT_INFO[m as PaymentMethod].logo}
                  alt={m}
                  className="w-8 h-8 object-contain"
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <span className="text-[10px] font-black uppercase">{m}</span>
              </button>
            ))}
          </div>

          {/* Dynamic Payment Info Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={method}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-5 rounded-2xl mb-6 border-l-4 ${paymentInfo.bg} ${paymentInfo.borderColor}`}
            >
              <div className="flex items-center gap-2 mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={paymentInfo.logo}
                  alt={method}
                  className="w-6 h-6 object-contain"
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <p className="text-xs font-bold opacity-70">
                  {paymentInfo.label}
                </p>
              </div>

              {/* Account or Mobile Number with Individual Copy Button */}
              <div className="flex items-center gap-3 justify-between bg-white p-3 rounded-xl border border-black/5 mb-3">
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">
                    {method === "bank" ? "Account Number" : "Mobile Number"}
                  </p>
                  <p className="font-black text-lg text-gray-800">
                    {copyTarget}
                  </p>
                </div>
                {copyTarget && <CopyButton text={copyTarget} />}
              </div>

              {/* Dynamic Bank Extra Details (Each item gets its own Copy Button) */}
              {method === "bank" && (
                <div className="space-y-2.5">
                  {/* অ্যাকাউন্টধারীর নাম */}
                  <div className="bg-white p-3 rounded-xl border border-black/5 flex items-center justify-between gap-2">
                    <div>
                      <p className="text-[10px] text-gray-500 font-bold flex items-center gap-1">
                        <User size={10} /> অ্যাকাউন্টধারীর নাম
                      </p>
                      <p className="font-bold mt-0.5 text-gray-800 text-sm">
                        {paymentInfo.accholder}
                      </p>
                    </div>
                    {paymentInfo.accholder && <CopyButton text={paymentInfo.accholder} />}
                  </div>

                  {/* ব্রাঞ্চ / শাখা */}
                  <div className="bg-white p-3 rounded-xl border border-black/5 flex items-center justify-between gap-2">
                    <div>
                      <p className="text-[10px] text-gray-500 font-bold flex items-center gap-1">
                        <GitBranch size={10} /> ব্রাঞ্চ / শাখা
                      </p>
                      <p className="font-bold mt-0.5 text-gray-800 text-sm">
                        {paymentInfo.branch}
                      </p>
                    </div>
                    {paymentInfo.branch && <CopyButton text={paymentInfo.branch} />}
                  </div>

                  {/* রাউটিং নাম্বার */}
                  <div className="bg-white p-3 rounded-xl border border-black/5 flex items-center justify-between gap-2">
                    <div>
                      <p className="text-[10px] text-gray-500 font-bold flex items-center gap-1">
                        <Globe size={10} /> রাউটিং নাম্বার
                      </p>
                      <p className="font-bold mt-0.5 text-gray-800 text-sm">
                        {paymentInfo.route}
                      </p>
                    </div>
                    {paymentInfo.route && <CopyButton text={paymentInfo.route} />}
                  </div>
                </div>
              )}

              <p className="text-xs mt-3 opacity-60 italic">
                * এই ঠিকানায় টাকা পাঠিয়ে নিচের ফর্মটি পূরণ করুন।
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Form fields */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="space-y-3 mb-6">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <RHFInput
                    icon={<User size={16} />}
                    placeholder="আপনার নাম"
                    registration={register("name", { required: "নাম দিন" })}
                  />
                  {errors.name && <FieldError msg={errors.name.message as string} />}
                </div>
                <div>
                  <RHFInput
                    icon={<Phone size={16} />}
                    placeholder="আপনার ফোন নাম্বার"
                    registration={register("phone", {
                      required: "ফোন নাম্বার দিন",
                      pattern: {
                        value: /^[0-9+]{10,15}$/,
                        message: "সঠিক নাম্বার দিন",
                      },
                    })}
                  />
                  {errors.phone && <FieldError msg={errors.phone.message as string} />}
                </div>
              </div>

              <div className="space-y-3">
                {/* ঠিকানা */}
                <div>
                  <RHFInput
                    icon={<MapPin size={16} />}
                    placeholder="আপনার ঠিকানা (ঐচ্ছিক)"
                    registration={register("address")}
                  />
                </div>

                {/* মোবাইল ব্যাংকিং পেমেন্ট হলে এক্সট্রা ফিল্ডস */}
                {method !== "bank" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-3"
                  >
                    <div>
                      <RHFInput
                        icon={<Smartphone size={16} />}
                        placeholder="যে নাম্বার থেকে পাঠিয়েছেন"
                        registration={register("senderNumber", {
                          required: "সেন্ডার নাম্বার দিন",
                          pattern: {
                            value: /^[0-9+]{10,15}$/,
                            message: "সঠিক নাম্বার দিন",
                          },
                        })}
                      />
                      {errors.senderNumber && (
                        <FieldError msg={errors.senderNumber.message as string} />
                      )}
                    </div>
                    <div>
                      <RHFInput
                        icon={<Hash size={16} />}
                        placeholder="ট্রানজেকশন আইডি (TrxID)"
                        registration={register("trxId", {
                          required: "TrxID দিন",
                        })}
                      />
                      {errors.trxId && (
                        <FieldError msg={errors.trxId.message as string} />
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="relative w-full cursor-pointer bg-green-800 text-white py-4 rounded-2xl font-black flex items-center justify-center shadow-lg active:scale-95 transition-all disabled:opacity-60 overflow-hidden"
            >
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-green-800">
                  <LoadingSpinner />
                </div>
              )}

              <span
                className={`flex items-center justify-center gap-2 transition-opacity duration-200 ${
                  loading ? "opacity-0" : "opacity-100"
                }`}
              >
                দান নিশ্চিত করুন
                <ArrowRight size={18} />
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
    COPY BUTTON COMPONENT (আলাদা আলাদা কপি বাটন)
───────────────────────────────────────── */
type CopyButtonProps = {
  text: string;
};

function CopyButton({ text }: CopyButtonProps) {
  const { copied, copy } = useCopy(text);

  return (
    <button
      type="button"
      onClick={copy}
      title="কপি করুন"
      className={`flex items-center gap-1.5 px-3 py-1.5 cursor-pointer rounded-lg text-xs font-bold transition-all border shrink-0 ${
        copied
          ? "bg-green-100 border-green-300 text-green-700"
          : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
      }`}
    >
      {copied ? (
        <>
          <Check size={13} /> কপিড
        </>
      ) : (
        <>
          <CopyIcon size={13} /> কপি
        </>
      )}
    </button>
  );
}

/* ─────────────────────────────────────────
    RHF INPUT COMPONENT
───────────────────────────────────────── */
type RHFInputProps = {
  icon: React.ReactNode;
  placeholder: string;
  registration: ReturnType<UseFormRegister<DonationFormFields>>;
};

function RHFInput({ icon, placeholder, registration }: RHFInputProps) {
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </span>
      <input
        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 rounded-2xl text-sm font-bold outline-none border border-transparent focus:border-gray-200 transition-all"
        placeholder={placeholder}
        {...registration}
      />
    </div>
  );
}

/* ─────────────────────────────────────────
    FIELD ERROR
───────────────────────────────────────── */
type FieldErrorProps = {
  msg?: string;
};

function FieldError({ msg }: FieldErrorProps) {
  if (!msg) return null;
  return (
    <p className="text-[11px] text-red-500 font-semibold mt-1 ml-2">{msg}</p>
  );
}
