"use client";

import { UserButton, useUser } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { Bell, BookOpen } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { SidebarTrigger } from './ui/sidebar';
import { cn } from '@/lib/utils';

const Navbar = ({ isCoursePage }: { isCoursePage: boolean}) => {

  const { user } = useUser();
  const userRole = user?.publicMetadata?.userType as "student" | "teacher";

  return (
    <nav className="w-full mb-6 px-4 sm:px-8 pt-7 z-10">
        <div className="flex justify-between items-center w-full my-3">
            <div className="flex justify-between items-center gap-2 sm:gap-5">
                <div className="md:hidden">
                    <SidebarTrigger className="text-customgreys-dirtyGrey hover:text-white-50 transition-colors"/>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Link 
                            scroll={false}
                            href="/search" 
                            className={cn("bg-customgreys-primarybg pl-10 sm:pl-14 pr-6 sm:pr-20 py-3 sm:py-4 rounded-xl text-customgreys-dirtyGrey hover:text-white-50 hover:bg-customgreys-darkerGrey transition-all duration-300 text-sm sm:text-base", {
                                "!bg-customgreys-secondarybg": isCoursePage,
                                }
                            )}>
                                <span className="hidden sm:inline">
                                    Procurar cursos
                                </span>
                                <span className="sm:hidden">
                                    Procurar
                                </span>
                        </Link>
                        <BookOpen 
                            className="absolute left-3 sm:left-5 top-1/2 transform -translate-y-1/2 text-customgreys-dirtyGrey transition-all duration-300" 
                            size={18} 
                        />
                    </div>
                </div>
        </div>
            <div className="flex items-center gap-3 sm:gap-6">
                <button className="rounded-full flex items-center justify-center">
                    <span className="absolute top-0 right-0 bg-blue-500 h-1.5 sm:h-2 w-1.5 sm:w-2 rounded-full"></span>
                    <Bell className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5" size={24} />
                </button>
                    <UserButton 
                        appearance={{
                            baseTheme: dark,
                            elements: {
                                userButtonOuterIdentifier: "text-customgreys-dirtyGrey",
                                userButtonBox: "scale-90 sm:scale-100"
                            }
                        }}
                        showName={true}
                        userProfileMode="navigation"
                        userProfileUrl={
                            userRole === "teacher" ? "/teacher/profile" : "/user/profile"
                        }
                    />
            </div>
        </div>
    </nav>
  )
}

export default Navbar