"use client";

import AppSidebar from "@/components/AppSidebar";
import Loading from "@/components/Loading";
import Navbar from "@/components/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ChaptersSidebar from "./user/courses/[courseId]/ChaptersSidebar";

export default function DashboardLayout({ children }: {children: React.ReactNode} ) {

  const pathName = usePathname();
  const [courseId, setCourseId] = useState<string | null>(null);
  const { user, isLoaded } = useUser();

  const isCoursePage = /^\/user\/courses\/[^\/]+(?:\/chapters\/[^\/]+)?$/.test(pathName);

  useEffect(() => {
    if (isCoursePage) {
      const match = pathName.match(/\/user\/courses\/([^\/]+)/);
      setCourseId(match? match[1] : null);
    } else {
      setCourseId(null)
    }
  }, [pathName, isCoursePage]);

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
                { courseId && <ChaptersSidebar />}
                <div className={cn(
                    "flex-grow min-h-screen transition-all duration-500 ease-in-out overflow-y-auto bg-customgreys-secondarybg",
                    isCoursePage && "bg-customgreys-primarybg"
                )}
                style={{ height: "100vh" }}
                >
                    <Navbar isCoursePage={isCoursePage}  />
                    <main className="px-8 py-4">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    </SidebarProvider>
  );
}
