import { Landmark, Users, NotebookText, HandHeart } from "lucide-react";

const items = [
  { icon: Landmark, title: "Islamic Environment" },
  { icon: Users, title: "Experienced Teachers" },
  { icon: NotebookText, title: "Easy Curriculum" },
  { icon: HandHeart, title: "Individual Attention" },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-brand-pale/60 py-16 md:py-20">
      <div className="container-content text-center">
        <p className="text-sm font-semibold tracking-wide text-brand">
          Why Choose Us?
        </p>
        <h2 className="mx-auto mt-2 max-w-2xl text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
          The Best Islamic &amp; Academic{" "}
          <span className="text-brand">Education For Your Child</span>
        </h2>

        <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-4">
          {items.map(({ icon: Icon, title }) => (
            <div
              key={title}
              className="flex flex-col items-center gap-3 rounded-xl bg-white px-4 py-8 shadow-sm"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-pale text-brand">
                <Icon size={22} />
              </span>
              <p className="text-sm font-semibold text-gray-800">{title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
