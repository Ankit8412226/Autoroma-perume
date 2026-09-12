'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HouseAndSkyLogo } from './HouseAndSkyLogo'
import { AnnouncementTicker } from './AnnouncementTicker'
import { getApiBaseUrl } from '@/utils/api'
import { SITE } from '@/utils/siteConfig'
import { Bookmark, Menu, X, PhoneCall, ChevronDown, Mail, Facebook, MessageCircle } from 'lucide-react'

interface NavProject {
  _id: string
  name: string
}

const MAIN_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Properties', href: '/properties' },
  { label: 'Get In Touch', href: '/contact' }
]

export function Navbar() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [isMobileAboutOpen, setIsMobileAboutOpen] = React.useState(false)
  const [isMobileProjectsOpen, setIsMobileProjectsOpen] = React.useState(false)
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
    setIsMobileAboutOpen(false)
    setIsMobileProjectsOpen(false)
  }, [pathname])

  React.useEffect(() => {
    const baseUrl = getApiBaseUrl()
    fetch(`${baseUrl}/public/projects`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setProjects(Array.isArray(data) ? data.slice(0, 8) : []))
      .catch(() => setProjects([]))
  }, [])

  const whatsappHref = `https://wa.me/${SITE.whatsapp}`
  const mailHref = `https://mail.google.com/mail/?view=cm&fs=1&to=${SITE.email}`
  const telHref = `tel:${SITE.phoneTel}`

  const isActive = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(href))
  const linkClass = (href: string) =>
    `text-[11px] uppercase tracking-[0.12em] font-semibold py-1 transition-colors ${
      isActive(href) && (href !== '/' || pathname === '/')
        ? 'text-brand-green'
        : 'text-brand-charcoal/75 hover:text-brand-green'
    }`

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-brand-green/10 shadow-sm'
            : 'bg-white/90 backdrop-blur-sm border-b border-brand-green/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3">
          <div className="flex items-center justify-between gap-6">
            <Link href="/" className="focus:outline-none shrink-0">
              <HouseAndSkyLogo variant="dark" showTagline={false} size="sm" />
            </Link>

            <nav className="hidden lg:flex items-center gap-6">
              <Link href="/" className={linkClass('/')}>Home</Link>

              <div className="relative" onMouseEnter={() => setOpenMenu('about')} onMouseLeave={() => setOpenMenu(null)}>
                <Link href="/about" className={`inline-flex items-center gap-1 ${linkClass('/about')}`}>
                  About Us <ChevronDown className="w-3 h-3" />
                </Link>
                {openMenu === 'about' && (
                  <div className="absolute top-full left-0 pt-2 min-w-[190px] z-[100]">
                    <div className="bg-white border border-brand-green/15 rounded-xl shadow-xl py-1.5 overflow-hidden">
                      <Link href="/about" className="block px-4 py-2.5 text-xs font-semibold text-brand-charcoal hover:bg-brand-soft hover:text-brand-green transition-colors">Brand Story</Link>
                      <Link href="/services" className="block px-4 py-2.5 text-xs font-semibold text-brand-charcoal hover:bg-brand-soft hover:text-brand-green transition-colors">Services</Link>
                      <Link href="/gallery" className="block px-4 py-2.5 text-xs font-semibold text-brand-charcoal hover:bg-brand-soft hover:text-brand-green transition-colors">Gallery</Link>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative" onMouseEnter={() => setOpenMenu('projects')} onMouseLeave={() => setOpenMenu(null)}>
                <Link href="/projects" className={`inline-flex items-center gap-1 ${linkClass('/projects')}`}>
                  Projects <ChevronDown className="w-3 h-3" />
                </Link>
                {openMenu === 'projects' && (
                  <div className="absolute top-full left-0 pt-2 min-w-[220px] z-[100]">
                    <div className="bg-white border border-brand-green/15 rounded-xl shadow-xl py-1.5 overflow-hidden">
                      <Link href="/projects" className="block px-4 py-2.5 text-xs font-bold text-brand-green hover:bg-brand-soft transition-colors">All Projects</Link>
                      {projects.map((project) => (
                        <Link key={project._id} href={`/projects/${project._id}`} className="block px-4 py-2 text-xs font-semibold text-brand-charcoal hover:bg-brand-soft hover:text-brand-green transition-colors truncate">
                          {project.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link href="/properties" className={linkClass('/properties')}>Properties</Link>
              <Link href="/contact" className={linkClass('/contact')}>Get In Touch</Link>
            </nav>

            <div className="hidden lg:flex items-center gap-2">
              <div className="flex items-center rounded-full border border-brand-green/15 bg-brand-soft/80 px-1">
                <a href={mailHref} target="_blank" rel="noopener noreferrer" className="p-2 text-brand-green hover:text-brand-dark" title={`Email: ${SITE.email}`}>
                  <Mail className="w-3.5 h-3.5" />
                </a>
                <a href={whatsappHref} target="_blank" rel="noreferrer" className="p-2 text-brand-green hover:text-brand-dark" title="WhatsApp">
                  <MessageCircle className="w-3.5 h-3.5" />
                </a>
                <a href={SITE.facebook} target="_blank" rel="noreferrer" className="p-2 text-brand-green hover:text-brand-dark" title="Facebook">
                  <Facebook className="w-3.5 h-3.5" />
                </a>
                <Link href="/saved" className="p-2 text-brand-green hover:text-brand-dark" title="Saved">
                  <Bookmark className="w-3.5 h-3.5" />
                </Link>
              </div>
              <a
                href={telHref}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.1em] text-white bg-brand-green hover:bg-brand-dark rounded-full shadow-sm"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                {SITE.phoneDisplay}
              </a>
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

        <AnnouncementTicker />
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white p-6 overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-brand-green/15">
              <HouseAndSkyLogo variant="dark" size="sm" />
              <button type="button" onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-brand-soft rounded-md">
                <X className="w-5 h-5 text-brand-green" />
              </button>
            </div>
            <div className="pt-2 space-y-1">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block text-xs uppercase tracking-[0.14em] font-semibold text-brand-charcoal py-2.5 border-b border-brand-green/10">
                Home
              </Link>

              {/* About Us Accordion */}
              <div className="border-b border-brand-green/10 py-1">
                <button
                  type="button"
                  onClick={() => setIsMobileAboutOpen(!isMobileAboutOpen)}
                  className="w-full flex items-center justify-between py-2 text-xs uppercase tracking-[0.14em] font-semibold text-brand-charcoal cursor-pointer"
                >
                  <span>About Us</span>
                  <ChevronDown className={`w-4 h-4 text-brand-green transition-transform duration-200 ${isMobileAboutOpen ? 'rotate-180' : ''}`} />
                </button>
                {isMobileAboutOpen && (
                  <div className="pl-3 py-1 space-y-1 bg-brand-soft/50 rounded-lg my-1">
                    <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="block text-xs font-semibold text-brand-charcoal py-1.5 hover:text-brand-green">
                      Brand Story
                    </Link>
                    <Link href="/services" onClick={() => setIsMobileMenuOpen(false)} className="block text-xs font-semibold text-brand-charcoal py-1.5 hover:text-brand-green">
                      Services
                    </Link>
                    <Link href="/gallery" onClick={() => setIsMobileMenuOpen(false)} className="block text-xs font-semibold text-brand-charcoal py-1.5 hover:text-brand-green">
                      Gallery
                    </Link>
                  </div>
                )}
              </div>

              {/* Projects Accordion */}
              <div className="border-b border-brand-green/10 py-1">
                <button
                  type="button"
                  onClick={() => setIsMobileProjectsOpen(!isMobileProjectsOpen)}
                  className="w-full flex items-center justify-between py-2 text-xs uppercase tracking-[0.14em] font-semibold text-brand-charcoal cursor-pointer"
                >
                  <span>Projects</span>
                  <ChevronDown className={`w-4 h-4 text-brand-green transition-transform duration-200 ${isMobileProjectsOpen ? 'rotate-180' : ''}`} />
                </button>
                {isMobileProjectsOpen && (
                  <div className="pl-3 py-1 space-y-1 bg-brand-soft/50 rounded-lg my-1">
                    <Link href="/projects" onClick={() => setIsMobileMenuOpen(false)} className="block text-xs font-bold text-brand-green py-1.5">
                      All Projects
                    </Link>
                    {projects.map((project) => (
                      <Link
                        key={project._id}
                        href={`/projects/${project._id}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-xs font-semibold text-brand-charcoal py-1.5 hover:text-brand-green truncate"
                      >
                        {project.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link href="/properties" onClick={() => setIsMobileMenuOpen(false)} className="block text-xs uppercase tracking-[0.14em] font-semibold text-brand-charcoal py-2.5 border-b border-brand-green/10">
                Properties
              </Link>
              <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="block text-xs uppercase tracking-[0.14em] font-semibold text-brand-charcoal py-2.5 border-b border-brand-green/10">
                Get In Touch
              </Link>
              <Link href="/saved" onClick={() => setIsMobileMenuOpen(false)} className="block text-xs uppercase tracking-[0.14em] font-semibold text-brand-charcoal py-2.5">
                Saved
              </Link>
            </div>
            <div className="flex items-center gap-2 pt-5">
              <a href={mailHref} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-brand-soft text-brand-green" title={`Email: ${SITE.email}`}><Mail className="w-4 h-4" /></a>
              <a href={whatsappHref} className="p-2 rounded-full bg-brand-soft text-brand-green"><MessageCircle className="w-4 h-4" /></a>
              <a href={SITE.facebook} className="p-2 rounded-full bg-brand-soft text-brand-green"><Facebook className="w-4 h-4" /></a>
              <a href={telHref} className="ml-auto inline-flex items-center gap-1.5 px-3 py-2 text-[11px] font-bold text-white bg-brand-green rounded-full">
                <PhoneCall className="w-3.5 h-3.5" /> Call
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
