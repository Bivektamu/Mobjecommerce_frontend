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
  const { isLoggedIn, authUser, status } = useAuth()

  useEffect(() => {

    if (status === Status.REJECTED) {
      navigate('/login')
    }
    else if (!isLoggedIn && status === Status.FULFILLED) {
      navigate('/login')

    }
    else if (isLoggedIn && authUser && authUser.role !== Role.CUSTOMER) {
      navigate('/login')
    }
    else if (pathname === '/account' || pathname === '/account/') {
      navigate('/account/orders')
    }


  }, [authUser, isLoggedIn, status, pathname])

  if(!isLoggedIn) {
    return <Preloader />
  }

  return (
    <PageWrapper>
      <section id="breadcrums" className="">
        <div className="py-14 container mx-auto">
          <h2 className="text-2xl font-bold mb-4">My Account</h2>
          <BreadCrumbs rootLink="Ecommerce" />
        </div>
      </section>

      <section className='w-full bg-white  py-16'>
        <div className="container mx-auto flex gap-x-16">
          <div className='bg-white px-6 w-[250px] pt-24 '>
            <AccountSubNav />
          </div>
          <div className=" px-8 rounded-lg basis-2/3 border-l pl-16">
            <Outlet />
          </div>
        </div>
      </section>
    </PageWrapper >
  )
}

export default Account