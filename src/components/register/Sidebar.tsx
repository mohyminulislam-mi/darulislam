export const Sidebar = ({
  step,
  isTeacher,
}: {
  step: number;
  isTeacher?: boolean;
}) => {
  const stepsLabel = isTeacher
    ? [
        { id: 1, label: "ব্যক্তিগত তথ্য" },
        { id: 2, label: "পেশাগত তথ্য" },
        { id: 4, label: "যোগাযোগ" },
        { id: 5, label: "নিরাপত্তা" },
      ]
    : [
        { id: 1, label: "ব্যক্তিগত তথ্য" },
        { id: 2, label: "পিতার তথ্য" },
        { id: 3, label: "মাতার তথ্য" },
        { id: 4, label: "যোগাযোগ" },
        { id: 5, label: "নিরাপত্তা" },
      ];

  return (
    <div className="hidden lg:flex lg:w-1/3 bg-[#0B5D3B] p-10 flex-col justify-between">
      <div>
        <h2 className="text-3xl font-black text-white mb-2">রেজিস্ট্রেশন</h2>
        <p className="text-white/60 text-sm font-medium">
          দারুল ইসলাম ইনস্টিটিউটে স্বাগতম
        </p>
      </div>
      <div className="space-y-6">
        {stepsLabel.map((s) => (
          <div key={s.id} className="flex items-center gap-4">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all ${
                step >= s.id
                  ? "bg-[#C8A44D] border-[#C8A44D] text-white"
                  : "border-white/20 text-white/40"
              }`}
            >
              {s.id}
            </div>
            <span
              className={`text-sm font-bold ${
                step >= s.id ? "text-white" : "text-white/30"
              }`}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>
      <div className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
        © 2026 Darul Islam
      </div>
    </div>
  );
};
