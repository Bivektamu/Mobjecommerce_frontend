import { lazy } from 'react'
const Header = lazy(() => import("../components/layout/Header"))

import Footer from '../components/layout/Footer'
import { Outlet, useLocation } from 'react-router-dom'
import { useToasts } from '../store/slices/toastSlice'
import ToastComponent from '../components/ui/Toast'
import { AnimatePresence } from 'framer-motion'
import NewsLetter from '../components/layout/NewsLetter'

const Layout = () => {
  const allToasts = useToasts()

  const location = useLocation()

  return (
    <>

      {
        allToasts?.length > 0 && <ToastComponent toasts={allToasts} />
      }

      {
        location.pathname.includes("admin") ? <Outlet /> :
          <>
            {
              !location.pathname.includes("checkout") && <Header />
            }

            <AnimatePresence mode="wait">

              <main id="main" key={location.pathname}>

                <Outlet />
              </main>
            </AnimatePresence >


            {
              !location.pathname.includes("checkout") && <>
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