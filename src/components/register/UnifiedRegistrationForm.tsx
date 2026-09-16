import {
  User,
  Phone,
  Lock,
  UploadCloud,
  ShieldCheck,
  Briefcase,
  EyeOff,
  Eye,
} from "lucide-react";
import { InputField, SelectField } from "./SharedInputs";
import { useState } from "react";

export const UnifiedRegistrationForm = ({
  register,
  errors,
  watch,
  handleImageClick,
  handleImageChange,
  fileInputRef,
  selectedImage,
  departments,
  isDeptLoading, // 👈 নতুন প্রপ্স রিসিভ করা হলো ভাই
  hideRoleToggle,
  validatePhone,
}: any) => {
  const currentRole = watch("role") || "student";
  const password = watch("password");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="space-y-8 w-full">
      {/* অ্যাকাউন্ট টাইপ টগল */}
      {!hideRoleToggle && (
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider">
            অ্যাক্যাউন্টের ধরন
          </label>
          <div className="flex gap-3 max-w-md">
            <label
              className={`flex-1 flex items-center justify-center gap-2 p-3.5 border-2 rounded-2xl cursor-pointer transition-all font-bold text-sm ${
                currentRole === "student"
                  ? "border-[#0B5D3B] bg-green-50 text-[#0B5D3B]"
                  : "border-neutral-100 text-neutral-400"
              }`}
            >
              <input
                type="radio"
                value="student"
                {...register("role")}
                className="hidden"
              />{" "}
              ছাত্র (Student)
            </label>
            <label
              className={`flex-1 flex items-center justify-center gap-2 p-3.5 border-2 rounded-2xl cursor-pointer transition-all font-bold text-sm ${
                currentRole === "teacher"
                  ? "border-[#0B5D3B] bg-green-50 text-[#0B5D3B]"
                  : "border-neutral-100 text-neutral-400"
              }`}
            >
              <input
                type="radio"
                value="teacher"
                {...register("role")}
                className="hidden"
              />{" "}
              শিক্ষক (Teacher)
            </label>
          </div>
        </div>
      )}

      {/* ১. ব্যক্তিগত তথ্য সেকশন */}
      <div className="space-y-5 bg-white p-6 border border-neutral-100 rounded-3xl shadow-sm">
        <h4 className="text-lg font-black text-neutral-800 border-b pb-2">
          ব্যক্তিগত তথ্য
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InputField
            label="নাম (বাংলা) *"
            placeholder="বাংলায় নাম লিখুন"
            register={register(
              currentRole === "teacher" ? "teacherNameBn" : "studentNameBn",
              { required: "বাংলা নাম প্রদান করা আবশ্যক" },
            )}
            error={
              currentRole === "teacher"
                ? errors.teacherNameBn
                : errors.studentNameBn
            }
            icon={<User size={18} />}
          />
          <InputField
            label="নাম (ইংরেজিতে) *"
            placeholder="Name in English"
            register={register("studentNameEn", {
              required: "নাম প্রদান করা আবশ্যক",
            })}
            error={errors.studentNameEn}
            icon={<User size={18} />}
          />
          <InputField
            label="জন্ম তারিখ *"
            type="date"
            register={register("birthDate", { required: "জন্ম তারিখ আবশ্যক" })}
            error={errors.birthDate}
          />

          <div className="space-y-2">
            <label className="text-[11px] font-black text-neutral-400 uppercase">
              লিঙ্গ *
            </label>
            <div className="flex gap-3">
              {["male", "female"].map((g) => (
                <label
                  key={g}
                  className={`flex-1 flex items-center justify-center gap-2 p-3.5 border rounded-2xl cursor-pointer hover:bg-neutral-50 transition-all font-bold text-sm text-neutral-600 ${
                    errors.gender ? "border-red-500" : "border-neutral-100"
                  }`}
                >
                  <input
                    type="radio"
                    {...register("gender", { required: "লিঙ্গ নির্বাচন করুন" })}
                    value={g}
                    className="accent-[#0B5D3B]"
                  />{" "}
                  {g === "male" ? "পুরুষ" : "মহিলা"}
                </label>
              ))}
            </div>
            {errors.gender && (
              <span className="text-[10px] text-red-500 font-bold block ">
                {errors.gender.message}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ২. একাডেমি / পেশাগত তথ্য */}
      <div className="space-y-5 bg-white p-6 border border-neutral-100 rounded-3xl shadow-sm">
        {currentRole === "teacher" ? (
          <>
            <h4 className="text-lg font-black text-neutral-800 border-b pb-2">
              পেশাগত তথ্য
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                label="পদবি (Designation) *"
                placeholder="যেমন: Lecturer"
                register={register("designation", {
                  required: "পদবি প্রদান করা আবশ্যক",
                })}
                error={errors.designation}
                icon={<Briefcase size={18} />}
              />

              <div className="space-y-1.5 lg:space-y-2">
                <label
                  className={`text-[10px] lg:text-[11px] font-black uppercase tracking-wider ${errors.department ? "text-red-500" : "text-neutral-400"}`}
                >
                  বিভাগ (Department) *
                </label>
                <div className="relative">
                  <select
                    {...register("department", {
                      required: "ডিপার্টমেন্ট নির্বাচন করুন",
                    })}
                    defaultValue=""
                    className={`w-full px-5 py-3 lg:py-4 bg-neutral-50/50 border rounded-2xl focus:ring-2 focus:bg-white outline-none transition-all font-bold text-sm appearance-none cursor-pointer ${
                      errors.department
                        ? "border-red-500 focus:ring-red-500/50"
                        : "border-neutral-200 focus:ring-[#0B5D3B]"
                    }`}
                  >
                    <option value="" disabled>
                      {isDeptLoading ? "লোডিং হচ্ছে..." : "বিভাগ নির্বাচন করুন"}
                    </option>
                    {departments?.map((dept: any) => (
                      <option key={dept._id} value={dept._id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                    <svg
                      className="w-4 h-4 fill-current rotate-90"
                      viewBox="0 0 20 20"
                    >
                      <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
                    </svg>
                  </div>
                </div>
                {errors.department && (
                  <span className="text-[10px] text-red-500 font-bold block mt-1">
                    {errors.department.message}
                  </span>
                )}
              </div>

              <div className="space-y-1.5 lg:space-y-2">
                <label
                  className={`text-[10px] lg:text-[11px] font-black uppercase tracking-wider ${errors.experience ? "text-red-500" : "text-neutral-400"}`}
                >
                  অভিজ্ঞতা (Experience) *
                </label>
                <div className="relative">
                  <select
                    {...register("experience", {
                      required: "অভিজ্ঞতা নির্বাচন করা আবশ্যক",
                    })}
                    defaultValue=""
                    className={`w-full px-5 py-3 lg:py-4 bg-neutral-50/50 border rounded-2xl focus:ring-2 focus:bg-white outline-none transition-all font-bold text-sm appearance-none cursor-pointer ${
                      errors.experience
                        ? "border-red-500 focus:ring-red-500/50"
                        : "border-neutral-200 focus:ring-[#0B5D3B]"
                    }`}
                  >
                    <option value="" disabled>
                      নির্বাচন করুন
                    </option>
                    <option value="১ বছরের অভিজ্ঞতা">১ বছর</option>
                    <option value="২ বছরের অভিজ্ঞতা">২ বছর</option>
                    <option value="৩ বছরের অভিজ্ঞতা">৩ বছর</option>
                    <option value="৪ বছরের অভিজ্ঞতা">৪ বছর</option>
                    <option value="৫ বছরের অভিজ্ঞতা">৫ বছর</option>
                    <option value="৫+ বছরের অভিজ্ঞতা">৫ বছরের বেশি</option>
                    <option value="১০+ বছরের অভিজ্ঞতা">১০ বছরের বেশি</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                    <svg
                      className="w-4 h-4 fill-current rotate-90"
                      viewBox="0 0 20 20"
                    >
                      <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
                    </svg>
                  </div>
                </div>
                {errors.experience && (
                  <span className="text-[10px] text-red-500 font-bold block mt-1">
                    {errors.experience.message}
                  </span>
                )}
              </div>

              <InputField
                label="শিক্ষাগত যোগ্যতা *"
                placeholder="Qualifications"
                register={register("qualifications")}
                error={errors.qualifications}
              />
            </div>
          </>
        ) : (
          <>
            <h4 className="text-lg font-black text-neutral-800 border-b pb-2">
              একাডেমিক তথ্য
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <SelectField
                label="Class / লেভেল"
                options={[
                  "প্লে",
                  "নার্সারি",
                  "প্রথম শ্রেণি",
                  "দ্বিতীয় শ্রেণি",
                  "তৃতীয় শ্রেণি",
                  "চতুর্থ শ্রেণি",
                  "পঞ্চম শ্রেণি",
                  "ষষ্ঠ শ্রেণি",
                  "সপ্তম শ্রেণি",
                  "অষ্টম শ্রেণি",
                  "নবম শ্রেণি",
                  "দশম শ্রেণি",
                  "একাদশ শ্রেণি",
                  "দ্বাদশ শ্রেণি",
                  "হিফজুল কুরআন",
                  "ডিপ্লোমা ইন ইঞ্জিনিয়ারিং",
                ]}
                register={register("classLevel")}
              />

              <div className="space-y-1.5 lg:space-y-2">
                <label
                  className={`text-[10px] lg:text-[11px] font-black uppercase tracking-wider ${errors.department ? "text-red-500" : "text-neutral-400"}`}
                >
                  বিভাগ (Department) *
                </label>
                <div className="relative">
                  <select
                    {...register("department", {
                      required: "ডিপার্টমেন্ট নির্বাচন করুন",
                    })}
                    defaultValue=""
                    className={`w-full px-5 py-3 lg:py-4 bg-neutral-50/50 border rounded-2xl focus:ring-2 focus:bg-white outline-none transition-all font-bold text-sm appearance-none cursor-pointer ${
                      errors.department
                        ? "border-red-500 focus:ring-red-500/50"
                        : "border-neutral-200 focus:ring-[#0B5D3B]"
                    }`}
                  >
                    <option value="" disabled>
                      {isDeptLoading ? "লোডিং হচ্ছে..." : "বিভাগ নির্বাচন করুন"}
                    </option>
                    {departments?.map((dept: any) => (
                      <option key={dept._id} value={dept._id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                    <svg
                      className="w-4 h-4 fill-current rotate-90"
                      viewBox="0 0 20 20"
                    >
                      <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
                    </svg>
                  </div>
                </div>
                {errors.department && (
                  <span className="text-[10px] text-red-500 font-bold block mt-1">
                    {errors.department.message}
                  </span>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* ৩. পারিবারিক তথ্য (শুধু স্টুডেন্ট) */}
      {currentRole === "student" && (
        <div className="space-y-5 bg-white p-6 border border-neutral-100 rounded-3xl shadow-sm">
          <h4 className="text-lg font-black text-neutral-800 border-b pb-2">
            পারিবারিক তথ্য
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField
              label="পিতার নাম *"
              placeholder="পিতার নাম লিখুন"
              register={register("fatherName", {
                required: "পিতার নাম আবশ্যক",
              })}
              error={errors.fatherName}
            />
            <InputField
              label="পিতার মোবাইল নম্বর *"
              placeholder="যেমন: +88017XXXXXXXX"
              type="tel"
              register={register("fatherMobile", {
                required: "মোবাইল নম্বর আবশ্যক",
                validate: validatePhone,
              })}
              error={errors.fatherMobile}
              onKeyPress={(e: any) => {
                if (!/[0-9+]/.test(e.key)) e.preventDefault();
              }}
              icon={<Phone size={18} />}
            />
            <InputField
              label="পিতার পেশা"
              placeholder="পিতার পেশা"
              register={register("fatherJob")}
              error={errors.fatherJob}
            />
            <div className="hidden md:block"></div>

            <InputField
              label="মাতার নাম *"
              placeholder="মাতার নাম লিখুন"
              register={register("motherName", {
                required: "মাতার নাম আবশ্যক",
              })}
              error={errors.motherName}
            />
            <InputField
              label="মাতার মোবাইল নম্বর *"
              placeholder="যেমন: +8801XXXXXXXXX"
              type="tel"
              register={register("motherMobile", {
                required: "মোবাইল নম্বর আবশ্যক",
                validate: validatePhone,
              })}
              error={errors.motherMobile}
              onKeyPress={(e: any) => {
                if (!/[0-9+]/.test(e.key)) e.preventDefault();
              }}
              icon={<Phone size={18} />}
            />
            <InputField
              label="মাতার পেশা"
              placeholder="মাতার পেশা"
              register={register("motherJob")}
              error={errors.motherJob}
            />
          </div>
        </div>
      )}

      {/* ৪. ঠিকানা ও যোগাযোগ */}
      <div className="space-y-5 bg-white p-6 border border-neutral-100 rounded-3xl shadow-sm">
        <h4 className="text-lg font-black text-neutral-800 border-b pb-2">
          ঠিকানা ও যোগাযোগ
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InputField
            label="জেলা *"
            placeholder="আপনার জেলা"
            register={register("district", { required: "জেলা আবশ্যক" })}
            error={errors.district}
          />
          <InputField
            label="স্থায়ী ঠিকানা *"
            placeholder="গ্রাম, পোস্ট অফিস"
            register={register("permanentAddress", {
              required: "ঠিকানা আবশ্যক",
            })}
            error={errors.permanentAddress}
          />
          <InputField
            label={
              currentRole === "teacher"
                ? "শিক্ষকের মোবাইল নম্বর *"
                : "শিক্ষার্থীর মোবাইল নম্বর *"
            }
            placeholder="যেমন: +8801XXXXXXXXX"
            type="tel"
            register={register("studentMobile", {
              required: "মোবাইল নম্বর আবশ্যক",
              validate: validatePhone,
            })}
            error={errors.studentMobile}
            onKeyPress={(e: any) => {
              if (!/[0-9+]/.test(e.key)) e.preventDefault();
            }}
            icon={<Phone size={18} />}
          />
          <InputField
            label="ইমেল ঠিকানা *"
            placeholder="example@email.com"
            type="email"
            register={register("email", { required: "ইমেল আবশ্যক" })}
            error={errors.email}
          />
        </div>
      </div>

      {/* ৫. প্রোফাইল ছবি */}
      <div className="space-y-2 bg-white p-6 border border-neutral-100 rounded-3xl shadow-sm">
        <label className="text-[11px] font-black text-neutral-400 uppercase tracking-wider">
          প্রোফাইল ছবি
        </label>
        <div
          onClick={handleImageClick}
          className="w-full p-4 lg:p-6 bg-neutral-50 border-2 border-dashed border-neutral-200 rounded-2xl flex items-center justify-center gap-4 cursor-pointer hover:border-[#0B5D3B] transition-all group"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-neutral-400 group-hover:text-[#0B5D3B]">
            <UploadCloud size={24} />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-neutral-700">ছবি আপলোড করুন</p>
          </div>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Preview"
              className="w-12 h-12 lg:w-14 lg:h-14 rounded-lg object-cover ml-auto border border-neutral-200 shadow-md"
            />
          )}
        </div>
      </div>

      {/* ৬. নিরাপত্তা সেটআপ */}
      <div className="space-y-5 bg-white p-6 border border-neutral-100 rounded-3xl shadow-sm">
        <h3 className="text-xl font-black text-neutral-800 border-b pb-2">
          নিরাপত্তা সেটআপ
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="relative">
            <InputField
              label="পাসওয়ার্ড নির্ধারণ করুন *"
              placeholder="••••••••"
              type={showPassword ? "text" : "password"}
              register={register("password", {
                required: "পাসওয়ার্ড আবশ্যক",
                minLength: {
                  value: 6,
                  message: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে",
                },
              })}
              error={errors.password}
            />
            <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-3 text-neutral-300 pt-5">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="hover:text-[#0B5D3B] transition-colors p-1"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              <div className="w-[1px] h-4 bg-neutral-200"></div>
              <Lock size={20} />
            </div>
          </div>

          <div className="relative">
            <InputField
              label="পাসওয়ার্ডটি নিশ্চিত করুন *"
              placeholder="••••••••"
              type={showConfirmPassword ? "text" : "password"}
              register={register("confirmPassword", {
                required: "কনফার্ম পাসওয়ার্ড আবশ্যক",
                validate: (value: string) =>
                  value === password || "পাসওয়ার্ড দুটি মিলছে না",
              })}
              error={errors.confirmPassword}
            />
            <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-3 text-neutral-300 pt-5">
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="hover:text-[#0B5D3B] transition-colors p-1"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              <div className="w-[1px] h-4 bg-neutral-200"></div>
              <Lock size={20} />
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-5 rounded-2xl border border-green-100 flex gap-4 mt-6">
          <ShieldCheck className="text-[#0B5D3B] shrink-0" size={24} />
          <p className="text-[12px] font-bold text-neutral-600 leading-relaxed">
            আমি ঘোষণা করছি যে, উপরে প্রদত্ত সমস্ত তথ্য সঠিক এবং আমি প্রতিষ্ঠানের
            সকল নিয়মাবলী মেনে চলতে বাধ্য থাকব।
          </p>
        </div>
      </div>
    </div>
  );
};
