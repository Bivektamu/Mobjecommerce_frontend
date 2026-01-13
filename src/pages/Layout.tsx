import { lazy } from 'react'
const Header = lazy(() => import("../components/layout/Header"))

import Footer from '../components/layout/Footer'
import { Outlet, useLocation } from 'react-router-dom'
import { useToasts } from '../store/slices/toastSlice'
import ToastComponent from '../components/ui/Toast'
import { AnimatePresence } from 'framer-motion'
import NewsLetter from '../components/layout/NewsLetter'
import useResetScroll from '../hooks/useResetScroll'
import useGTMPageView from '../hooks/useGTMPageViews.ts'

const Layout = () => {

  useGTMPageView()
  useResetScroll()

  const allToasts = useToasts()
  const { pathname } = useLocation()

  return (
    <>

      {
        allToasts?.length > 0 && <ToastComponent toasts={allToasts} />
      }

      {
        pathname.includes("admin") ? <Outlet /> :
          <>
            {
              !pathname.includes("checkout") && <Header />
            }

            <AnimatePresence mode="wait">

              <main id="main" key={pathname}>

                <Outlet />
              </main>
            </AnimatePresence >


            {
              !pathname.includes("checkout") && <>
                <NewsLetter />
                <Footer />
              </>
            }

          </>

      }

    </>


  )
}

export default Layout