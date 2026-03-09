import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { AnimatePresence } from 'motion/react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Menu from '@/components/Menu'
import { useLocomotiveScroll } from '@/hooks/useLocomotiveScroll'

interface LayoutProps {
  children: React.ReactNode
  pageTitle: string
}

export default function Layout({ children, pageTitle }: LayoutProps) {
  const location = useLocation()
  const isPageIlgiorno = location.pathname.includes('/ilgiorno')
  const mainBackgroundColor = isPageIlgiorno ? '#1d1d1d' : '#fff'

  const [menuIsOpen, setMenuIsOpen] = useState(false)

  useLocomotiveScroll()

  return (
    <>
      <Helmet>
        <title>{pageTitle ? `${pageTitle} | Bragazzi's` : "Bragazzi's"}</title>
      </Helmet>
      <AnimatePresence>{menuIsOpen && <Menu />}</AnimatePresence>
      <main style={{ backgroundColor: mainBackgroundColor }}>
        <Header menuIsOpen={menuIsOpen} setMenuIsOpen={setMenuIsOpen} />
        {children}
        <Footer />
      </main>
    </>
  )
}
