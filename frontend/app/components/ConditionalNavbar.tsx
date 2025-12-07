"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Don't show navbar on admin pages (except login and set-token which are public)
  const isAdminPage = pathname?.startsWith("/admin") && 
                      pathname !== "/admin/login" && 
                      pathname !== "/admin/set-token";
  
  if (isAdminPage) {
    return null;
  }
  
  return <Navbar />;
}

