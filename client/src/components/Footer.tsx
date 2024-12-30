import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <div className="bg-customgreys-secondarybg bottom-0 w-full py-8 mt-10 text-center text-sm">
        <p>&copy; 2024 - arthur brito. todos os direitos reservados.</p>
        <div className="mt-2">
            {["Sobre", "Privacidade", "Termos", "Contato"].map((item) => (
                <Link 
                    scroll={false}
                    key={item} 
                    href={`/${item.toLowerCase().replace(" ", "-")}`}
                    className="text-primary-300 mx-2 hover:text-primary-500 transition-all duration-150"
                >
                    {item}
                </Link>
            ))}
        </div>
    </div>
  )
}

export default Footer