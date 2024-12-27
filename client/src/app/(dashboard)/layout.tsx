"use client";

import AppSidebar from "@/components/AppSidebar";
import Loading from "@/components/Loading";
import Navbar from "@/components/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function DashboardLayout({ children }: {children: React.ReactNode} ) {

  const pathName = usePathname();
  const [courseId, setCourseId] = useState<string | null>(null);
  const { user, isLoaded } = useUser();

  // handle use effect isCoursePage

  if (!isLoaded) {
    return <Loading />
  }
  if (!user) {
    return <div>Por favor, faça login para ter acesso a esta página.</div>
  }

  return (
    <SidebarProvider>
        <div className="min-h-screen w-full bg-customgreys-primarybg flex">
            <AppSidebar />
            <div className="flex flex-1 overflow-hidden"> 
                {/* Sidebar dos capítulos */}
                <div className={cn(
                    "flex-grow min-h-screen transition-all duration-500 ease-in-out overflow-y-auto bg-customgreys-secondarybg",
                )}
                style={{ height: "100vh" }}
                >
                    <main className="px-8 py-4">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    </SidebarProvider>
  );
}
