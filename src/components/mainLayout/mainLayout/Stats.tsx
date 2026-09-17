import { Users2, GraduationCap, BookMarked, ShieldCheck } from "lucide-react";

const stats = [
  { icon: Users2, value: "500+", label: "Students Enrolled" },
  { icon: GraduationCap, value: "20+", label: "Qualified Teachers" },
  { icon: BookMarked, value: "15+", label: "Educational Programs" },
  { icon: ShieldCheck, value: "100%", label: "Commitment to Excellence" },
];

export default function Stats() {
  return (
    <section className="bg-primary-light py-6 ">
      <div className="container-content grid grid-cols-2 gap-6 md:grid-cols-4">
        {stats.map(({ icon: Icon, value, label }) => (
          <div key={label} className="flex items-center justify-center gap-3">
            <Icon size={20} className="text-gold" />
            <div className="text-white">
              <p className="text-lg font-bold leading-none">{value}</p>
              <p className="text-xs text-white/70">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
