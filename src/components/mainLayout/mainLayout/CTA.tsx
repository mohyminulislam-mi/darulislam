import { GraduationCap } from "lucide-react";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="bg-gold">
      <div className="max-w-screen-xl mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 md:flex-row">
        <div className="flex items-center gap-3 text-brand-dark">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-dark text-gold">
            <GraduationCap size={20} />
          </span>
          <div>
            <p className="font-semibold">Give Your Child The Best Education</p>
            <p className="text-xs text-brand-dark/70">
              Admissions Open for New Session 2026
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            href="/auth/register"
            className="rounded-full bg-brand-dark px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand"
          >
            Register Now
          </Link>
          <Link
            href="/education"
            className="rounded-full border border-brand-dark px-6 py-2.5 text-sm font-semibold text-brand-dark transition hover:bg-brand-dark hover:text-white"
          >
            Our Courses
          </Link>
        </div>
      </div>
    </section>
  );
}
