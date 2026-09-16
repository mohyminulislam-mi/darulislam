import Navbar from "@/src/components/mainLayout/common/Navbar";
import Footer from "../../components/mainLayout/common/Footer";
import Header from "@/src/components/mainLayout/common/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <>
      <header>
        <Header />
        <Navbar />
      </header>
      <main className="flex-1">{children}</main>
      <footer>
        <Footer />
      </footer>
    </>
  );
}
