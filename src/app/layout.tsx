import "./globals.css";
import AuthProvider from "./providers/AuthProvider";
import QueryProvider from "./providers/QueryProvider";
import VisitorTracker from "../components/VisitorTracker/VisitorTracker";

export const metadata = {
  title: "দারুল ইসলাম ইনস্টিটিউট | Darul Islam Institute",
  description:
    "একটি আধুনিক ইসলামি শিক্ষাপ্রতিষ্ঠান। শিক্ষা, ইসলামি লাইব্রেরি, দাওয়াহ ও দান কার্যক্রম পরিচালনা করে।",
  keywords: [
    "islamic institute",
    "darul islam",
    "শিক্ষা",
    "লাইব্রেরি",
    "দাওয়াহ",
  ],

  openGraph: {
    title: "দারুল ইসলাম ইনস্টিটিউট | Darul Islam Institute",
    description:
      "একটি আধুনিক ইসলামি শিক্ষাপ্রতিষ্ঠান। শিক্ষা, ইসলামি লাইব্রেরি, দাওয়াহ ও দান কার্যক্রম পরিচালনা করে।",
    url: "https://your-domain.com",
    siteName: "Darul Islam Institute",
    images: [
      {
        url: "/darulislaminstitute.jpeg",
        width: 1200,
        height: 630,
        alt: "Darul Islam Institute",
      },
    ],
    locale: "bn_BD",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "দারুল ইসলাম ইনস্টিটিউট | Darul Islam Institute",
    description:
      "একটি আধুনিক ইসলামি শিক্ষাপ্রতিষ্ঠান। শিক্ষা, ইসলামি লাইব্রেরি, দাওয়াহ ও দান কার্যক্রম পরিচালনা করে।",
    images: ["/darulislaminstitute.jpeg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <VisitorTracker />
        <AuthProvider>
          <QueryProvider>{children}</QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
