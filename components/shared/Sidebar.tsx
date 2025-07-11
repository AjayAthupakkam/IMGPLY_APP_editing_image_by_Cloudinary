"use client"

import { navLinks } from '@/constants'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="flex size-full flex-col gap-4">
        <Link href="/" className="sidebar-logo">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-purple-gradient"></div>
            <span className="text-2xl font-bold text-purple-600">IMGPLY</span>
          </div>
        </Link>

        <nav className="sidebar-nav">
          <ul className="sidebar-nav_elements">
            {navLinks.slice(0, 6).map((link) => {
              const isActive = link.route === pathname

              if (link.route === '/credits') return null;

              return (
                <li key={link.route} className={`sidebar-nav_element group ${
                  isActive ? 'bg-purple-gradient text-white' : 'text-gray-700'
                }`}>
                  <Link className="sidebar-link" href={link.route}>
                    <Image 
                      src={link.icon}
                      alt="logo"
                      width={24}
                      height={24}
                      className={`${isActive && 'brightness-200'}`}
                    />
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>

          <ul className="sidebar-nav_elements">
            {navLinks.slice(6).map((link) => {
              const isActive = link.route === pathname

              if (link.route === '/credits') return null;

              return (
                <li key={link.route} className={`sidebar-nav_element group ${
                  isActive ? 'bg-purple-gradient text-white' : 'text-gray-700'
                }`}>
                  <Link className="sidebar-link" href={link.route}>
                    <Image 
                      src={link.icon}
                      alt="logo"
                      width={24}
                      height={24}
                      className={`${isActive && 'brightness-200'}`}
                    />
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar