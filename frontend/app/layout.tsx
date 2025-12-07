import ConditionalNavbar from "./components/ConditionalNavbar";
import Footer from "./components/Footer";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white min-h-screen flex flex-col">
        <ConditionalNavbar />
        {/* add substantial top padding so fixed navbar doesn't cover page content */}
        <main className="flex-1 pt-28">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
