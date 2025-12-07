"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Don't show navbar on admin pages (including login and set-token)
  // Admin pages have their own AdminNavbar in AdminLayout
  const isAdminPage = pathname?.startsWith("/admin");
  
  if (isAdminPage) {
    return null;
  }
  
  return <Navbar />;
}

