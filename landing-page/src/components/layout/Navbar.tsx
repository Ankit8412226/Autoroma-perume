'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HouseAndSkyLogo } from './HouseAndSkyLogo'
import { getApiBaseUrl } from '@/utils/api'
import { SITE } from '@/utils/siteConfig'
import { Bookmark, Menu, X, PhoneCall, ChevronDown, Mail, Facebook, MessageCircle } from 'lucide-react'

interface NavProject {
  _id: string
  name: string
}

export function Navbar() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [openMenu, setOpenMenu] = React.useState<string | null>(null)
  const [projects, setProjects] = React.useState<NavProject[]>([])

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 15)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  React.useEffect(() => {
    setIsMobileMenuOpen(false)
    setOpenMenu(null)
  }, [pathname])

  React.useEffect(() => {
    const baseUrl = getApiBaseUrl()
    fetch(`${baseUrl}/public/projects`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setProjects(Array.isArray(data) ? data.slice(0, 8) : []))
      .catch(() => setProjects([]))
  }, [])

  const whatsappHref = `https://wa.me/${SITE.whatsapp}`
  const mailHref = `mailto:${SITE.email}`

  const isActive = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(href))

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-brand-green/10 py-3 shadow-sm'
            : 'bg-white/90 backdrop-blur-sm py-3.5 border-b border-brand-green/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="focus:outline-none shrink-0">
              <HouseAndSkyLogo variant="dark" showTagline={true} />
            </Link>

            <nav className="hidden lg:flex items-center space-x-6">
              <Link href="/" className={`text-xs uppercase tracking-[0.14em] font-semibold py-1 ${isActive('/') && pathname === '/' ? 'text-brand-green font-bold border-b-2 border-brand-green' : 'text-brand-charcoal/80 hover:text-brand-green'}`}>
                Home
              </Link>

              <div className="relative" onMouseEnter={() => setOpenMenu('about')} onMouseLeave={() => setOpenMenu(null)}>
                <Link href="/about" className={`inline-flex items-center gap-1 text-xs uppercase tracking-[0.14em] font-semibold py-1 ${isActive('/about') ? 'text-brand-green font-bold border-b-2 border-brand-green' : 'text-brand-charcoal/80 hover:text-brand-green'}`}>
                  About Us <ChevronDown className="w-3 h-3" />
                </Link>
                {openMenu === 'about' && (
                  <div className="absolute top-full left-0 pt-2 min-w-[200px]">
                    <div className="bg-white border border-brand-green/15 rounded-xl shadow-lg py-2">
                      <Link href="/about" className="block px-4 py-2 text-xs font-semibold text-brand-charcoal hover:bg-brand-soft">Brand Story</Link>
                      <Link href="/services" className="block px-4 py-2 text-xs font-semibold text-brand-charcoal hover:bg-brand-soft">Services</Link>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative" onMouseEnter={() => setOpenMenu('projects')} onMouseLeave={() => setOpenMenu(null)}>
                <Link href="/projects" className={`inline-flex items-center gap-1 text-xs uppercase tracking-[0.14em] font-semibold py-1 ${isActive('/projects') ? 'text-brand-green font-bold border-b-2 border-brand-green' : 'text-brand-charcoal/80 hover:text-brand-green'}`}>
                  Projects <ChevronDown className="w-3 h-3" />
                </Link>
                {openMenu === 'projects' && (
                  <div className="absolute top-full left-0 pt-2 min-w-[240px]">
                    <div className="bg-white border border-brand-green/15 rounded-xl shadow-lg py-2">
                      <Link href="/projects" className="block px-4 py-2 text-xs font-bold text-brand-green hover:bg-brand-soft">All Projects</Link>
                      {projects.map((project) => (
                        <Link key={project._id} href={`/projects/${project._id}`} className="block px-4 py-2 text-xs font-semibold text-brand-charcoal hover:bg-brand-soft">
                          {project.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link href="/properties" className={`text-xs uppercase tracking-[0.14em] font-semibold py-1 ${isActive('/properties') ? 'text-brand-green font-bold border-b-2 border-brand-green' : 'text-brand-charcoal/80 hover:text-brand-green'}`}>
                Properties
              </Link>
              <Link href="/gallery" className={`text-xs uppercase tracking-[0.14em] font-semibold py-1 ${isActive('/gallery') ? 'text-brand-green font-bold border-b-2 border-brand-green' : 'text-brand-charcoal/80 hover:text-brand-green'}`}>
                Gallery
              </Link>
              <Link href="/contact" className={`text-xs uppercase tracking-[0.14em] font-semibold py-1 ${isActive('/contact') ? 'text-brand-green font-bold border-b-2 border-brand-green' : 'text-brand-charcoal/80 hover:text-brand-green'}`}>
                Contact Us
              </Link>
            </nav>

            <div className="hidden lg:flex items-center space-x-2">
              <a href={mailHref} className="p-2 rounded-full bg-brand-soft text-brand-green hover:bg-brand-green hover:text-white transition-colors" title="Email">
                <Mail className="w-4 h-4" />
              </a>
              <a href={whatsappHref} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-brand-soft text-brand-green hover:bg-brand-green hover:text-white transition-colors" title="WhatsApp">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href={SITE.facebook} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-brand-soft text-brand-green hover:bg-brand-green hover:text-white transition-colors" title="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <Link href="/saved" className="p-2 rounded-full bg-brand-soft text-brand-green hover:bg-brand-green hover:text-white transition-colors" title="Saved">
                <Bookmark className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-white bg-brand-green hover:bg-brand-dark rounded-full transition-all shadow-md"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                Contact Us
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 bg-brand-soft border border-brand-green/20 text-brand-green rounded-md lg:hidden"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white p-6 overflow-y-auto shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-brand-green/15">
              <HouseAndSkyLogo variant="dark" />
              <button type="button" onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-brand-soft rounded-md">
                <X className="w-5 h-5 text-brand-green" />
              </button>
            </div>
            {[
              { label: 'Home', href: '/' },
              { label: 'About Us', href: '/about' },
              { label: 'Projects', href: '/projects' },
              { label: 'Properties', href: '/properties' },
              { label: 'Gallery', href: '/gallery' },
              { label: 'Contact Us', href: '/contact' }
            ].map((link) => (
              <Link key={link.href} href={link.href} className="block text-xs uppercase tracking-[0.16em] font-semibold text-brand-charcoal py-2 border-b border-brand-green/10">
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-3 pt-4">
              <a href={mailHref} className="p-2 rounded-full bg-brand-soft text-brand-green"><Mail className="w-4 h-4" /></a>
              <a href={whatsappHref} className="p-2 rounded-full bg-brand-soft text-brand-green"><MessageCircle className="w-4 h-4" /></a>
              <a href={SITE.facebook} className="p-2 rounded-full bg-brand-soft text-brand-green"><Facebook className="w-4 h-4" /></a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
