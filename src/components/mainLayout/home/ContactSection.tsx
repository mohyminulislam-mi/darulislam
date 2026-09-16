import React from "react";
import { MapPin, Phone, Mail, Globe, Send } from "lucide-react";

const ContactSection = () => {
  const contactInfo = [
    {
      icon: <MapPin className="text-green-600" size={18} />,
      label: "ঠিকানা",
      value: "উত্তরা, ঢাকা-১২৩০",
    },
    {
      icon: <Phone className="text-green-600" size={18} />,
      label: "ফোন",
      value: "+৮৮০ ১২৩৪-৫৬৭৮৯০",
    },
    {
      icon: <Mail className="text-green-600" size={18} />,
      label: "ইমেইল",
      value: "info@darulislam.edu.bd",
    },
    {
      icon: <Globe className="text-green-600" size={18} />,
      label: "ওয়েবসাইট",
      value: "www.darulislam.edu.bd",
    },
  ];

  return (
    <section className="py-10 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white p-5 md:p-10 rounded-[2rem] shadow-sm border border-gray-100">
          {/* Section Title - Compact for mobile */}
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 flex items-center justify-center lg:justify-start gap-2">
              <span className="w-1.5 h-8 bg-green-600 rounded-full"></span>
              যোগাযোগ করুন
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Right Side: Map (Mobile এ প্রথমে দেখাবে) */}
            <div className="order-first lg:order-last w-full h-[250px] md:h-[400px] rounded-2xl overflow-hidden shadow-inner border border-gray-100">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3648.4382029413247!2d90.3951523758832!3d23.87407008436034!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c43d00000001%3A0x6b099d0e2e2a4a7a!2sUttara%20Sector%206!5e0!3m2!1sen!2sbd!4v1714470000000!5m2!1sen!2sbd"
                className="w-full h-full border-0"
                allowFullScreen={true}
                loading="lazy"
              ></iframe>
            </div>

            {/* Left Side: Contact Details (Mobile এ ম্যাপের নিচে যাবে) */}
            <div className="flex flex-col justify-center space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 md:gap-4">
                {contactInfo.map((info, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 md:p-4 rounded-xl border border-gray-50 bg-gray-50/50 hover:bg-green-50 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-sm text-green-600 transition-transform group-hover:scale-110">
                      {info.icon}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[10px] md:text-xs font-bold text-green-700 uppercase tracking-wide">
                        {info.label}
                      </p>
                      <p className="text-sm md:text-base text-gray-800 font-medium truncate">
                        {info.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Button - Compact for Mobile */}
              <div className="pt-2">
                <button className="w-full md:w-auto flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-900 transition-all active:scale-95 shadow-md shadow-green-100 text-sm md:text-base">
                  মেসেজ পাঠান
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
