"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import AdminNavbar from "../components/AdminNavbar";
import { initAuth } from "../lib/api";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  useEffect(() => {
    // Initialize auth for all admin pages
    initAuth();
  }, []);

  // Don't show navbar on login and set-token pages
  const isPublicPage = pathname === "/admin/login" || pathname === "/admin/set-token";

  return (
    <>
      {!isPublicPage && <AdminNavbar />}
      {/* add substantial top padding so fixed navbar doesn't cover page content */}
      <div className={isPublicPage ? "" : "pt-28"}>{children}</div>
    </>
  );
}

