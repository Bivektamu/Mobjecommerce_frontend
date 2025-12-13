import { useEffect, useState } from 'react'

import { getAuthStatus, useAuth } from '../../store/slices/authSlice'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Sidebar from '../../components/layout/AdminSidebar'
import BreadCrumbs from '../../components/layout/BreadCrumbs'

import { useToasts } from "../../store/slices/toastSlice"
import ToastComponent from "../../components/ui/Toast"
import { Status, Role } from '../../store/types'
import { useStoreDispatch } from '../../store'
import ProgressLoader from '../../components/ui/ProgressLoader'
import Preloader from '../../components/ui/Preloader'
import AdminLogo from '../../components/ui/AdminLogo'

const PrivateRoute = () => {
    const navigate = useNavigate()
    const allToasts = useToasts()
    const auth = useAuth()
    const { isLoggedIn, status, authUser } = auth
    const dispatch = useStoreDispatch()
    const { pathname } = useLocation()

    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        if (status === Status.IDLE)
            dispatch(getAuthStatus())
    }, [status])


    useEffect(() => {
        if ((status === Status.FULFILLED && !isLoggedIn) || status === Status.REJECTED) {
            navigate('/admin/login')
        }

    }, [isLoggedIn, status])

    useEffect(() => {

        if (authUser && authUser.role !== Role.ADMIN) {
            navigate('/admin/login')
        }
    }, [authUser])

    useEffect(() => {
        setIsOpen(false)

        if (pathname === '/admin' || pathname === '/admin/') {
            return navigate('/admin/dashboard')
        }
    }, [pathname])

    if (status === Status.FULFILLED && isLoggedIn && authUser?.role === Role.ADMIN) {

        return (
            <div className='admin-wrapper pt-12 md:pt-0'>

                {
                    allToasts?.length > 0 && <ToastComponent toasts={allToasts} />
                }
                <header className='px-4 py-2 flex items-center justify-between md:hidden fixed top-0 left-0 w-full bg-white z-10'>
                    <AdminLogo />
                    <button type="button" id='burger-menu' className={`lg:hidden ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)}>
                        <span></span>
                    </button>
                </header>

                <Sidebar isOpen={isOpen} />

                <section className="w-full pl-4  md:pl-[200px] lg:pl-[240px] xl:pl-[340px] pb-4 lg:pb-12 xl:pr-12 pr-4 pt-8">
                    <div className="h-[72px] flex items-center mb-12 justify-between">
                        <BreadCrumbs />
                    </div>

                    {
                        status !== Status.FULFILLED ? <ProgressLoader cssClass='mt-32' /> : <Outlet />
                    }


                </section>

            </div>
        )
    }
    else return <Preloader />
}

export default PrivateRoute