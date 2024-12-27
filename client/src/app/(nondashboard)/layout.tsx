import NonDashboardNavbar from "@/components/NonDashboardNavbar";
import Footer from "@/components/Footer";
import React from "react";

export default function Layout({ children }: {children: React.ReactNode} ) {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <NonDashboardNavbar />
      <main className="flex flex-grow w-full h-full justify-center items-center">
        {children}
      </main>
      <Footer />
    </div>
  );
}
