import { Outlet, useLocation, useNavigate } from "react-router-dom"
import BreadCrumbs from "../../components/layout/BreadCrumbs"
import PageWrapper from "../../components/ui/PageWrapper"
import AccountSubNav from "../../components/layout/AccountSubNav"
import { useEffect } from "react"
import { Role, Status } from "../../store/types"
import { useAuth } from "../../store/slices/authSlice"
import Preloader from "../../components/ui/Preloader"

const Account = () => {

  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { isLoggedIn, user, status } = useAuth()

  useEffect(() => {

    if (status === Status.REJECTED) {
      navigate('/login')
    }
    else if (!isLoggedIn && status === Status.FULFILLED) {
      navigate('/login')

    }
    else if (isLoggedIn && user && user.role !== Role.CUSTOMER) {
      navigate('/login')
    }
    else if (pathname === '/account' || pathname === '/account/') {
      return navigate('/account/orders')
    }


  }, [user, isLoggedIn, status, pathname])

  if (!isLoggedIn) {
    return <Preloader />
  }

  return (
    <PageWrapper>
   
      <section id="breadcrums" className="px-4">
        <div className="lg:py-14 py-6 container mx-auto">
          <h2 className="text-2xl font-bold mb-4">My Account</h2>
          <BreadCrumbs rootLink="Ecommerce" />
        </div>
      </section>

      <section className='w-full bg-white px-4 md:py-16 py-8'>
        <div className="container mx-auto flex md:gap-x-8 xl:gap-x-16">
          <div className='bg-white xl:w-[250px] md:w-[180px] w-1/3 xl:pt-24 pt-14'>
            <AccountSubNav />
          </div>
          <div className=" rounded-lg w-4/5 border-l xl:pl-16 md:pl-8 pl-4">
            <Outlet />
          </div>
        </div>
      </section>
    </PageWrapper >
  )
}

export default Account