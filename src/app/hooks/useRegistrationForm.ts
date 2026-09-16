import { useState, useRef } from "react";

export const useRegistrationForm = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // আন্তর্জাতিক বা লোকাল ফোন নম্বর ভ্যালিডেশন লজিক
  const validatePhone = (value: string) => {
    const phoneRegex = /^(?:\+8801|01)[3-9]\d{8}$/;
    if (!phoneRegex.test(value)) {
      return "সঠিক মোবাইল নম্বর প্রদান করুন (উদাঃ: +8801XXXXXXXXX বা 01XXXXXXXXX)";
    }
    return true;
  };

  return {
    selectedImage,
    fileInputRef,
    handleImageClick,
    handleImageChange,
    validatePhone,
  };
};