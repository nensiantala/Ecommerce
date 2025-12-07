"use client";

import { useEffect } from "react";
import AdminNavbar from "../components/AdminNavbar";
import { initAuth } from "../lib/api";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize auth for all admin pages
    initAuth();
  }, []);

  return (
    <>
      <AdminNavbar />
      {/* add substantial top padding so fixed navbar doesn't cover page content */}
      <div className="pt-28">{children}</div>
    </>
  );
}

