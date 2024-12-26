import { Bell, BookOpen } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const NonDashboardNavbar = () => {
  return (
    <nav className="w-full flex justify-center bg-customgreys-primarybg">
        <div className="flex justify-between items-center w-3/4 py-8">
            <div className="flex justify-between items-center gap-14">
                <Link href="/" className="font-bold text-lg sm:text-xl hover:text-customgreys-dirtyGrey transition-all duration-150">
                    CURSOS
                </Link>
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Link 
                            href="/search" 
                            className="bg-customgreys-secondarybg pl-10 sm:pl-14 pr-6 sm:pr-20 py-3 sm:py-4 rounded-xl text-customgreys-dirtyGrey hover:text-white-50 hover:bg-customgreys-darkerGrey transition-all duration-300 text-sm sm:text-base">
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
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
            <button className="relative w-7 h-7 sm:w-8 sm:h-8 bg-gray-800 rounded-full flex items-center justify-center">
                <span className="absolute top-0 right-0 bg-blue-500 h-1.5 sm:h-2 w-1.5 sm:w-2 rounded-full"></span>
                <Bell className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5" size={24} />
            </button>

            {/* BOTÕES PARA AUTENTICAÇÃO */}
        </div>
    </nav>
  )
}

export default NonDashboardNavbar