import { ChevronRight } from "lucide-react";

// 1️⃣ INPUT FIELD (With Number-Only Validation Setup)
export const InputField = ({
  label,
  placeholder,
  type = "text",
  icon,
  register,
  error,
  isNumberOnly = false,
}: any) => {
  const handleNumberChange = (e: any) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
    if (register?.onChange) {
      register.onChange(e);
    }
  };

  return (
    <div className="space-y-1.5 lg:space-y-2">
      <label
        className={`text-[10px] lg:text-[11px] font-black uppercase tracking-wider ${error ? "text-red-500" : "text-neutral-400"}`}
      >
        {label}
      </label>
      <div className="relative group">
        <input
          {...register}
          onChange={isNumberOnly ? handleNumberChange : register?.onChange}
          type={type}
          placeholder={placeholder}
          className={`w-full pl-5 pr-12 py-3 lg:py-4 bg-neutral-50/50 border rounded-2xl focus:ring-2 focus:bg-white outline-none transition-all font-bold text-sm ${error ? "border-red-500 focus:ring-red-500/50" : "border-neutral-200 focus:ring-[#0B5D3B]"}`}
        />
        {icon && (
          <div
            className={`absolute right-5 top-1/2 -translate-y-1/2 transition-colors ${error ? "text-red-400" : "text-neutral-300 group-focus-within:text-[#0B5D3B]"}`}
          >
            {icon}
          </div>
        )}
      </div>
      {error && (
        <span className="text-[10px] text-red-500 font-bold block mt-1">
          {error.message}
        </span>
      )}
    </div>
  );
};

export const SelectField = ({ label, options, register, error }: any) => (
  <div className="space-y-1.5 lg:space-y-2">
    <label
      className={`text-[10px] lg:text-[11px] font-black uppercase tracking-wider ${error ? "text-red-500" : "text-neutral-400"}`}
    >
      {label}
    </label>
    <div className="relative">
      <select
        {...register}
        defaultValue=""
        className={`w-full px-5 py-3 lg:py-4 bg-neutral-50/50 border rounded-2xl focus:ring-2 focus:bg-white outline-none transition-all font-bold text-sm appearance-none cursor-pointer ${error ? "border-red-500 focus:ring-red-500/50" : "border-neutral-200 focus:ring-[#0B5D3B]"}`}
      >
        <option value="" disabled>
          {label} নির্বাচন করুন
        </option>
        {options.map((opt: string, idx: number) => (
          <option key={idx} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
        <ChevronRight size={16} className="rotate-90" />
      </div>
    </div>
    {error && (
      <span className="text-[10px] text-red-500 font-bold block mt-1">
        {error.message}
      </span>
    )}
  </div>
);
